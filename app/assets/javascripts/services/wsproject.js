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
                // if (!data.current_project){return}
                // update(data);
                // switch (data.current_project.status) {
                //     case 'started':
                //         o.start();
                //         break;
                //     case 'paused':
                //         o.pause();
                //         break;
                //     case 'stopped':
                //     case 'ended':
                //         o.stop();
                //         break;
                // }
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

            var update = function(data){
            };

            return o;
        }
    ]);