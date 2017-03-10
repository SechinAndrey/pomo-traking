angular.module('pomoTracking')
    .factory('wsproject', [
        'ActionCableChannel',
        'Auth',
        'projects',
        function(ActionCableChannel, Auth, projects){
            var o = {
                Socket: {}
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                if(data.created){
                    projects.projects.unshift(data.project);
                }
            };

            o.Socket.initActionCable = function(){
                o.Socket.projectChannel = new ActionCableChannel("ProjectChannel");

                o.Socket.projectChannel.subscribe(callback).then(function(){
                    o.Socket.send = function(data){
                        console.log('Send -> ', data);
                        o.Socket.projectChannel.send(data);
                    };

                    o.Socket.destroy =  function(){
                        o.Socket.projectChannel.unsubscribe().then(function(){
                            //CLEANUP
                        });
                    };
                });
            };

            return o;
        }
    ]);