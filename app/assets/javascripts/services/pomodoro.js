angular.module('pomoTracking')
    .factory('pomodoro', [
        '$interval',
        'ActionCableChannel',
        function($interval, ActionCableChannel){
            var o = {
                min: 0,
                sec: 0,
                Socket: {}
            };

            var timer;

            o.start = function(){
                var time;
                timer = $interval(function() {
                    o.time = o.endTime - new Date().getTime();
                    o.min = Math.floor(o.time/60000);
                    o.sec = Math.floor(o.time/1000 % 60);
                    if(o.time < 300){
                        o.Socket.pomodoroChannel.send({
                            action: 'end',
                            project: 1 }); //TODO: set to project id
                        o.stop();
                    }
                }, 200);
            };

            o.pause = function(){
                $interval.cancel(timer);
            };

            o.stop = function(){
                $interval.cancel(timer);
                o.min = 0;
                o.sec = 0;
            };

            var callback = function(data) {
                console.log('PomodoroChannel callback data: ', data);
                switch (data.action) {
                    case "start":
                        o.endTime = data.end_time;
                        o.period_type = data.period_type;
                        o.periods = data.periods;
                        o.start();
                        break;
                    case "pause":
                        o.pause();
                        break;
                    case "stop":
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
                            o.Socket.send = undefined;
                            o.Socket.pomodoroChannel = undefined;
                        });
                    };
                });
            };

            return o;
        }
    ]);