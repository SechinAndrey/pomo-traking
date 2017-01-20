angular.module('pomoTracking')

.controller('NavCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    'pomodoro',
    function($rootScope, $scope, Auth, pomodoro){

        $scope.signedIn = Auth.isAuthenticated;
        $scope.logout = Auth.logout;

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

        $scope.openMobMenu = function(){
            $rootScope.$emit('menuToggle', true);
        };

        $scope.$on("$destroy", function(){
            pomodoro.Socket.destroy();
        });
    }
]);