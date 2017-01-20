angular.module('pomoTracking')

.controller('TimerCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    'pomodoro',
    function($rootScope, $scope, Auth, pomodoro){
        $scope.pomodoro = pomodoro;

        Auth.currentUser().then(function (user){
            $scope.user = Auth._currentUser;

            $scope.isPomoStrted = function(){
                return $scope.user.current_project_status == 'started';
            };

            $scope.isPomoPaused = function(){
                return $scope.user.current_project_status == 'paused';
            };

            $scope.isPomoStopped = function(){
                return $scope.user.current_project_status == 'stopped';
            };
        });


        $scope.pomodoroToggle = function(){
            console.log('$scope.isPomoStrted()' + $scope.isPomoStrted());
            if($scope.isPomoStrted()){
                $scope.pomodoroPause();
                $scope.user.current_project_status = 'paused';
            }else{
                $scope.pomodoroStart();
                $scope.user.current_project_status = 'started';
            }
        };


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

        $rootScope.$on('pomoLoaded', function() {
            $scope.prjTitle = pomodoro.project.title;
        });

    }]);