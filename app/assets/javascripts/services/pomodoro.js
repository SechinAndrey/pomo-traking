angular.module('pomoTracking')
    .factory('pomodoro', [
        '$window',
        '$rootScope',
        '$interval',
        'ActionCableChannel',
        'Auth',
        'projectsManager',
        function($window, $rootScope, $interval, ActionCableChannel, Auth, projectsManager){
            var o = {
                Socket: {}
            };
            var started = false;

            // projectsManager.getCurrentProject().then(function (project) {
            //
            // }, function () {
            //
            // });

            o.start = function(){
                if (!started){
                    o.timer = $interval(function() {
                        o.time = o.endTime - new Date().getTime(); //TODO: move getTime() to backend, send time to frontend
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        if(o.time < 300){
                            projectsManager.getCurrentProject().then(function (project) {
                                o.Socket.pomodoroChannel.send({
                                    action: 'end',
                                    project: project.id
                                });
                            });
                            o.stop();
                        }
                    }, 200);
                    started = true;
                }
            };

            o.pause = function(){
                started = false;
                $interval.cancel(o.timer);
            };

            o.stop = function(){
                started = false;
                $interval.cancel(o.timer);
                set_default();
            };

            o.send = function(action, projectId){
                o.Socket.send({
                    action: action,
                    project: projectId
                });
            };

            o.toggleProject = function (starting_project) {
                projectsManager.getCurrentProject().then(function (current_project) {
                    console.log('-------------------> resolve');
                    console.log(current_project.title, current_project.pomo_cycle.status);
                    if(current_project.pomo_cycle.status === 'started'){
                        if(current_project.id !== starting_project.id){
                            console.log('-------------------> switch-project');
                            $rootScope.$broadcast('switch-project', starting_project);
                        }else{
                            console.log('-------------------> pause');
                            o.send('pause', current_project.id);
                        }
                    }else{
                        console.log('-------------------> start');
                        o.send('start', starting_project.id);
                    }
                }, function () {
                    console.log('-------------------> reject');
                    o.send('start', starting_project.id);
                });
            };

            o.actionTitle = function(project){ //TODO: move to project
                if(o.current_project && o.current_project.id === project.id && o.pomo_cycle){  //TODO: !?? replace to projectsManager 2 var
                    o.pomo_cycle.status === 'started' ? title = 'Pause' : title = 'Start' //TODO: !?? replace to projectsManager
                }else{
                    title = 'Start'
                }
                return title;
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                update(data);
                if (!o.pomo_cycle){return} //TODO: replace to projectsManager
                switch (o.pomo_cycle.status) { //TODO: replace to projectsManager
                    case 'started':
                        o.start();
                        break;
                    case 'paused':
                        o.pause();
                        break;
                    case 'stopped':
                        o.stop();
                        break;
                    case 'ended':
                        Auth.currentUser().then(function () {
                            Auth._currentUser.current_project_id = null;
                        });
                        o.stop();
                        break;
                }
            };

            o.Socket.initActionCable = function(){
                o.Socket.pomodoroChannel = new ActionCableChannel("PomodoroChannel");

                o.Socket.pomodoroChannel.subscribe(callback).then(function(){
                    o.Socket.send = function(data){
                        console.log('Send -> ', data);
                        o.Socket.pomodoroChannel.send(data);
                    };

                    o.Socket.destroy =  function(){
                        o.Socket.pomodoroChannel.unsubscribe().then(function(){
                            set_default(true);
                        });
                    };
                });
            };

            var update = function(data){
                if(!data.current_project){return}

                o.current_project = {  //TODO: replace to projectsManager
                    id: data.current_project.id,
                    title: data.current_project.title
                };

                o.pomo_cycle = data.current_project.pomo_cycle;  //TODO: replace to projectsManager
                Auth.currentUser().then(function () {
                    Auth._currentUser.current_project_id = data.current_project.id;
                });
                projectsManager.setProject(data.current_project);

                if(o.pomo_cycle){ //TODO: replace to projectsManager
                    var periods = o.pomo_cycle.periods; //TODO: replace to projectsManager
                    if(periods.length > 0){
                        o.endTime = periods[periods.length - 1].end_time;
                        o.period_type = periods[periods.length - 1].periods_type;
                    }else{
                        o.endTime = 0;
                        o.period_type = '';
                    }

                    o.time = o.endTime - new Date().getTime();
                    o.min = Math.floor(o.time/60000);
                    o.sec = Math.floor(o.time/1000 % 60);
                }
            };

            var set_default = function(clean_socket){
                o.min = 0;
                o.sec = 0;
                o.time = 0;
                o.current_project = undefined;  //TODO: del (current_project in projectsManager)
                o.pomo_cycle = undefined; //TODO: del (pomo_cycle in projectsManager)
                o.endTime = 0;
                o.period_type = '';
                if(clean_socket){
                    o.Socket.send = undefined;
                    o.Socket.pomodoroChannel = undefined;
                }
            };

            return o;
        }
    ]);