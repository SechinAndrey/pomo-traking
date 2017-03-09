angular.module('pomoTracking')
    .factory('pomodoro', [
        '$window',
        '$rootScope',
        '$interval',
        'ActionCableChannel',
        'Auth',
        function($window, $rootScope, $interval, ActionCableChannel, Auth){
            var o = {
                Socket: {}
            };

            var started = false;

            o.start = function(){
                if (!started){
                    o.timer = $interval(function() {
                        o.time = o.endTime - new Date().getTime();
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
                if (!data.current_project){return}
                update(data);
                switch (data.current_project.status) {
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

                o.current_project = {
                    id: data.current_project.id,
                    title: data.current_project.title,
                    status: data.current_project.status,
                };

                if(data.current_project.pomo_cycle && data.current_project.pomo_cycle.periods){
                    o.periods = data.current_project.pomo_cycle.periods;

                    if(o.periods.length > 0){
                        o.endTime = o.periods[o.periods.length - 1].end_time;
                        o.period_type = o.periods[o.periods.length - 1].periods_type;
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
                o.periods = undefined;
                o.endTime = 0;
                o.period_type = '';
                o.Socket.send = undefined;
                o.Socket.pomodoroChannel = undefined;
            };

            return o;
        }
    ]);