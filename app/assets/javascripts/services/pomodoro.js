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
                                project: 1 }); //TODO: set to project id
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
                console.log('PomodoroChannel callback data: ', data);
                switch (data.action) {
                    case "loading":
                        update(data);
                        console.log('o.endTime: ', o.endTime);
                        console.log('min: ', o.min);
                        console.log('sec', o.sec);
                        break;
                    case "start":
                        update(data);
                        o.start();
                        break;
                    case "pause":
                        console.log('pause case');
                        update(data);
                        o.pause();
                        break;
                    case "stop":
                    case "end":
                        update(data);
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

            var update = function(data){
                o.periods = data.periods;
                if(data.periods.length > 0){
                    o.endTime = data.periods[data.periods.length - 1].end_time;
                    o.period_type =  data.periods[data.periods.length - 1].periods_type;
                }else{
                    o.endTime = 0;
                    o.period_type = '';
                }
                o.time = o.endTime - new Date().getTime();
                o.min = Math.floor(o.time/60000);
                o.sec = Math.floor(o.time/1000 % 60);
            };

            return o;
        }
    ]);