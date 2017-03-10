angular.module('pomoTracking')
    .factory('wsproject', [
        'ActionCableChannel',
        'Auth',
        function(ActionCableChannel, Auth){
            var o = {
                Socket: {}
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
            };

            o.Socket.initActionCable = function(){
                o.Socket.pomodoroChannel = new ActionCableChannel("ProjectChannel");

                o.Socket.pomodoroChannel.subscribe(callback).then(function(){
                    o.Socket.send = function(data){
                        console.log('Send -> ', data);
                        o.Socket.pomodoroChannel.send(data);
                    };

                    o.Socket.destroy =  function(){
                        o.Socket.pomodoroChannel.unsubscribe().then(function(){
                            //CLEANUP
                        });
                    };
                });
            };

            return o;
        }
    ]);