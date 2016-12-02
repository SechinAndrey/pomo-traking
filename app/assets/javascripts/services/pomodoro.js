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
                        o.stop();
                        o.Socket.pomodoroChannel.send({
                            action: 'end',
                            project: 1 }); //TODO: set to project id
                    }
                }, 200);
            };

            o.pause = function(){
                console.log("222222222222222222222222222222222222222222");
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
                    case "loading":
                        o.periods = data.periods;
                        o.endTime = data.periods[data.periods.length - 1].end_time;
                        o.period_type =  data.periods[data.periods.length - 1].periods_type;
                        o.time = o.endTime - new Date().getTime();
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        break;
                    case "start":
                        o.periods = data.periods;
                        o.endTime = data.periods[data.periods.length - 1].end_time;
                        o.period_type =  data.periods[data.periods.length - 1].periods_type;
                        o.time = o.endTime - new Date().getTime();
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        o.start();
                        break;
                    case "pause":
                        console.log("1111111111111111111111");
                        o.periods = data.periods;
                        o.endTime = data.periods[data.periods.length - 1].end_time;
                        o.period_type =  data.periods[data.periods.length - 1].periods_type;
                        o.time = o.endTime - new Date().getTime();
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
                        o.pause();
                        break;
                    case "stop":
                    case "end":
                        o.periods = data.periods;
                        o.endTime = data.periods[data.periods.length - 1].end_time;
                        o.period_type =  data.periods[data.periods.length - 1].periods_type;
                        o.time = o.endTime - new Date().getTime();
                        o.min = Math.floor(o.time/60000);
                        o.sec = Math.floor(o.time/1000 % 60);
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