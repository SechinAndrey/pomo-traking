angular.module('pomoTracking')

.controller('NavCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    'pomodoro',
    'wsproject',
    '$state',
    function($rootScope, $scope, Auth, pomodoro, wsproject, $state){

        $scope.signedIn = Auth.isAuthenticated;
        $scope.logout = function () {
            Auth.logout().then(function(){
                $state.go('login');
            });
        };

        /* authentication functions */

        Auth.currentUser().then(function (user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable();
            }
            if(!wsproject.Socket.projectChannel){
                wsproject.Socket.initActionCable();
            }
        });

        $scope.$on('devise:new-registration', function (e, user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable();
            }
            if(!wsproject.Socket.projectChannel){
                wsproject.Socket.initActionCable();
            }
        });

        $scope.$on('devise:login', function (e, user){
            $scope.user = user;
            if(!pomodoro.Socket.pomodoroChannel) {
                pomodoro.Socket.initActionCable();
            }
            if(!wsproject.Socket.projectChannel){
                wsproject.Socket.initActionCable();
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