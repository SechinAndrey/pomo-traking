angular.module('pomoTracking')
    .factory('pomodoro', [
        '$window',
        '$rootScope',
        '$interval',
        'ActionCableChannel',
        'Auth',
        'projects',
        function($window, $rootScope, $interval, ActionCableChannel, Auth, projects){
            var o = {
                Socket: {}
            };

            var started = false;

            o.start = function(){
                if (!started){
                    o.timer = $interval(function() {
                        o.time = o.endTime - new Date().getTime(); //TODO: move to backend
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        if(o.time < 300){
                            o.stop();
                            o.Socket.pomodoroChannel.send({
                                action: 'end',
                                project: o.current_project.id });
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
                o.min = 0;
                o.sec = 0;
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                update(data);
                if (!o.pomo_cycle){return}
                switch (o.pomo_cycle.status) {
                    case 'started':
                        o.start();
                        break;
                    case 'paused':
                        o.pause();
                        break;
                    case 'stopped':
                    case 'ended':
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
                            set_default();
                        });
                    };
                });
            };

            var update = function(data){
                if(data.switched){
                    Auth._currentUser.current_project_id = data.current_project.id;
                }
                if(!data.current_project){return}
                o.current_project = {
                    id: data.current_project.id,
                    title: data.current_project.title
                };

                o.pomo_cycle = data.current_project.pomo_cycle;

                if(o.pomo_cycle){
                    var periods = o.pomo_cycle.periods;
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

            var set_default = function(){
                o.min = 0;
                o.sec = 0;
                o.time = 0;

                o.current_project = undefined;
                o.pomo_cycle = undefined;
                o.endTime = 0;
                o.period_type = '';
                o.Socket.send = undefined;
                o.Socket.pomodoroChannel = undefined;
            };

            return o;
        }
    ]);