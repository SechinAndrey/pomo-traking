angular.module('pomoTracking')
    .factory('wsproject', [
        'ActionCableChannel',
        'Auth',
        '$rootScope',
        '$state',
        'pomodoro',
        'projectsManager',
        function(ActionCableChannel, Auth, $rootScope, $state, pomodoro, projectsManager){
            var o = {
                Socket: {}
            };

            var callback = function(data) {
                console.log("Callback data: ", data);
                if(data.created){
                    $rootScope.$emit('projectCreated', data.project);
                }else if(data.deleted){
                    Auth.currentUser().then(function(user) {
                        if(data.project.id === user.current_project_id){
                            pomodoro.stop();
                            Auth._currentUser.current_project_id = null;
                            pomodoro.set_default();
                        }
                        if($state.current.name === 'project'){
                            $rootScope.$emit('projectDeleted');
                        }else $state.reload();
                    });
                }else if(data.updated){
                    $state.reload();
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