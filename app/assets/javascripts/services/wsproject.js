angular.module('pomoTracking')
    .factory('wsproject', [
        'ActionCableChannel',
        'Auth',
        'projects',
        '$rootScope',
        '$state',
        'pomodoro',
        function(ActionCableChannel, Auth, projects, $rootScope, $state, pomodoro){
            var o = {
                Socket: {}
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                if(data.created){
                    projects.projects.unshift(data.project);
                }else if(data.deleted){
                    pomodoro.stop();
                    if($state.current.name === 'project'){
                        $rootScope.$emit('projectDeleted');
                    }else $state.reload();
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