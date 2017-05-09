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

            o.start = function(){
                if (!started){
                    o.timer = $interval(function() {
                        o.time = o.endTime - new Date().getTime(); //TODO: move getTime() to backend, send time to frontend
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        if(o.time < 300){
                            projectsManager.getCurrentProject().then(function (current_project) {
                                o.Socket.pomodoroChannel.send({
                                    action: 'end',
                                    project: current_project.id
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

            o.stop = function(to_default){
                started = false;
                $interval.cancel(o.timer);
                if(to_default){
                    o.set_default();
                }

            };

            o.send = function(action, projectId){
                o.Socket.send({
                    action: action,
                    project: projectId
                });
            };

            o.toggleProject = function (starting_project) {
                projectsManager.getCurrentProject().then(function (current_project) {
                    if(current_project.pomo_cycle && current_project.pomo_cycle.status === 'started'){
                        if(current_project.id !== starting_project.id){
                            $rootScope.$broadcast('switch-project', starting_project);
                        }else{
                            o.send('pause', current_project.id);
                        }
                    }else{
                        o.send('start', starting_project.id);
                    }
                }, function () {
                    o.send('start', starting_project.id);
                });
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                update(data);

                if(!data.current_project){
                    if(data.user_updated){
                        Auth.currentUser().then(function () {
                            angular.extend(Auth._currentUser, data.current_user);
                        });
                    }
                    return;
                }

                projectsManager.getProject(data.current_project.id).then(function (project) {
                    if (!project.pomo_cycle){
                        if(data.ended){
                            $rootScope.$emit('pomo-end');
                            Auth.currentUser().then(function () {
                                Auth._currentUser.current_project_id = null;
                            });
                            o.stop(true);
                        }
                        return
                    }
                    switch (project.pomo_cycle.status) {
                        case 'started':
                            o.start();
                           o.set_default(); $rootScope.$emit('pomo-start');
                            break;
                        case 'paused':
                            o.pause();
                            break;
                        case 'stopped':
                            o.stop(true);
                            break;
                        case 'ended':
                            $rootScope.$emit('pomo-end');
                            Auth.currentUser().then(function () {
                                Auth._currentUser.current_project_id = null;
                            });
                            o.stop(true);
                            break;
                    }
                });
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
                            o.set_default(true);
                        });
                    };
                });
            };

            var update = function(data){
                if(!data.current_project){return}
                Auth.currentUser().then(function () {
                    Auth._currentUser.current_project_id = data.current_project.id;
                });
                projectsManager.setProject(data.current_project);
                projectsManager.getCurrentProject().then(function (_current_project) {
                    if(projectsManager.current_project.id === _current_project.id){
                        angular.extend(projectsManager.current_project, _current_project);
                    }else{
                        projectsManager.current_project = _current_project;
                    }

                    if(_current_project.pomo_cycle){
                        var periods = _current_project.pomo_cycle.periods;
                        if(periods && periods.length > 0){
                            var lastPeriod = periods[periods.length - 1];
                            o.periodDuration = lastPeriod.duration;
                            o.endTime = lastPeriod.end_time;
                            o.period_type = lastPeriod.periods_type;
                        }else{
                            o.periodDuration = 0;
                            o.endTime = 0;
                            o.period_type = '';
                        }

                        o.time = o.endTime - new Date().getTime(); //TODO: move getTime() to backend, send time to frontend
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                    }
                });


            };

            o.set_default = function(clean_socket){
                o.min = 0;
                o.sec = 0;
                o.time = 0;
                o.endTime = 0;
                o.period_type = '';
                projectsManager.current_project = {};
                if(clean_socket){
                    o.Socket.send = undefined;
                    o.Socket.pomodoroChannel = undefined;
                }
            };
            return o;
        }
    ]);