angular.module('pomoTracking')
    .factory('pomodoroSocket', [
        'ActionCableChannel',
        'pomodoro',
        function(ActionCableChannel, pomodoro){
            var o = {
                period_type: undefined,
                pomodoroChannel: undefined
            };

            var callback = function(data) {
                console.log('PomodoroChannel callback data: ', data);
                switch (data.action) {
                    case "start":
                        pomodoro.endTime = data.end_time;
                        pomodoro.period_type = data.period_type;
                        pomodoro.start();
                        break;
                    case "pause":
                        pomodoro.pause();
                        break;
                    case "stop":
                        pomodoro.stop();
                        break;
                }
            };

            o.initActionCable = function(user){
                o.pomodoroChannel = new ActionCableChannel("PomodoroChannel");

                o.pomodoroChannel.subscribe(callback).then(function(){
                    o.send = function(data){
                        console.log('Send -> ', data);
                        o.pomodoroChannel.send(data);
                    };

                    o.destroy =  function(){
                        o.pomodoroChannel.unsubscribe().then(function(){
                            o.send = undefined;
                            o.pomodoroChannel = undefined;
                        });
                    };
                });
            };

            return o;

        }
    ]);