angular.module('pomoTracking')

.controller('TimerCtrl', [
    '$scope',
    'pomodoro',
    function($scope, pomodoro){
        $scope.pomodoro = pomodoro;
        console.log("2");
        console.log(pomodoro);

        /* pomodoro actions */

        $scope.pomodoroStart = function(){
            data = {
                action: 'start',
                project: 1 //TODO: set to project id
            };
            pomodoro.Socket.send(data);
        };

        $scope.pomodoroPause = function(){
            data = {
                action: 'pause',
                project: 1 //TODO: set to project id
            };
            pomodoro.Socket.send(data);
        };

        $scope.pomodoroStop = function(){
            data = {
                action: 'stop',
                project: 1 //TODO: set to project id
            };
            pomodoro.Socket.send(data);
        };

        /* ************** */
    }]);