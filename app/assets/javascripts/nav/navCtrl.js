angular.module('pomoTracking')

.controller('NavCtrl', [
    '$scope',
    'Auth',
    'pomodoro',
    'pomodoroSocket',
    function($scope, Auth, pomodoro, pomodoroSocket){

        $scope.signedIn = Auth.isAuthenticated;
        $scope.logout = Auth.logout;
        $scope.pomodoro = pomodoro;

        /* authentication functions */

        Auth.currentUser().then(function (user){
            $scope.user = user;
            if(!pomodoroSocket.pomodoroChannel) {
                pomodoroSocket.initActionCable($scope.user); //TODO: remove email
            }
        });

        $scope.$on('devise:new-registration', function (e, user){
            $scope.user = user;
            if(!pomodoroSocket.pomodoroChannel) {
                pomodoroSocket.initActionCable($scope.user); //TODO: remove email
            }
        });

        $scope.$on('devise:login', function (e, user){
            $scope.user = user;
            if(!pomodoroSocket.pomodoroChannel) {
                pomodoroSocket.initActionCable($scope.user); //TODO: remove email
            }
        });

        $scope.$on('devise:logout', function (e, user){
            $scope.user = {};
            pomodoroSocket.destroy();
        });

        /* ************** */

        $scope.$on("$destroy", function(){
            pomodoroSocket.destroy();
        });

        /* pomodoro actions */

        $scope.pomodoroStart = function(){
            data = {
                action: 'start',
                project: 1
            };
            pomodoroSocket.send(data);
        };

        $scope.pomodoroPause = function(){
            data = {
                action: 'pause',
                project: 1,
                pause_time:  new Date().getTime()
            };
            pomodoroSocket.send(data);
        };

        $scope.pomodoroStop = function(){
            data = {
                action: 'stop',
                project: 1
            };
            pomodoroSocket.send(data);
        };

        /* ************** */
    }
]);