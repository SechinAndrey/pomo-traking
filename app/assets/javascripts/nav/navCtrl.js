angular.module('pomoTracking')

.controller('NavCtrl', [
    '$scope',
    'Auth',
    'pomodoro',
    function($scope, Auth, pomodoro){

        $scope.signedIn = Auth.isAuthenticated;
        $scope.logout = Auth.logout;

        console.log("1");
        console.log(pomodoro);

        /* authentication functions */

        Auth.currentUser().then(function (user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable();
            }
        });

        $scope.$on('devise:new-registration', function (e, user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable();
            }
        });

        $scope.$on('devise:login', function (e, user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable($scope.user);
            }
        });

        $scope.$on('devise:logout', function (e, user){
            $scope.user = {};
            pomodoro.Socket.destroy();
        });

        /* ************** */

        $scope.$on("$destroy", function(){
            pomodoro.Socket.destroy();
        });

    }
]);