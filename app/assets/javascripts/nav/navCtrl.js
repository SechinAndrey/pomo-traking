angular.module('pomoTracking')

.controller('NavCtrl', [
    '$scope',
    'Auth',
    'ActionCableChannel',
    function($scope, Auth, ActionCableChannel){

        $scope.signedIn = Auth.isAuthenticated;
        $scope.logout = Auth.logout;

        var consumer;

        Auth.currentUser().then(function (user){
            $scope.user = user;
            if(!consumer) {
                console.log('curr_user');
                initActionCable();
            }
        });

        $scope.$on('devise:new-registration', function (e, user){
            $scope.user = user;
            if(!consumer) {
                initActionCable();
            }
        });

        $scope.$on('devise:login', function (e, user){
            $scope.user = user;
            if(!consumer) {
                console.log('login');
                initActionCable();
            }
        });

        $scope.$on('devise:logout', function (e, user){
            $scope.user = {};
            consumer.unsubscribe().then(function(){ $scope.sendToMyChannel = undefined; });
            consumer = undefined;
        });

        var callback = function(message) {
            $scope.user.username = message;
        };

        var initActionCable = function(){
            consumer = new ActionCableChannel("PomodoroChannel", {user: $scope.user.email});

            consumer.subscribe(callback).then(function(){
                $scope.sendToMyChannel = function(message){
                    console.log('Send -> ', message);
                    consumer.send(message);
                };
                $scope.$on("$destroy", function(){
                    consumer.unsubscribe().then(function(){ $scope.sendToMyChannel = undefined; });
                });
            });
        }
    }
]);