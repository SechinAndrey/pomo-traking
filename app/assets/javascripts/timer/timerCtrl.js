angular.module('pomoTracking')

.controller('TimerCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    'pomodoro',
    '$state',
    function($rootScope, $scope, Auth, pomodoro, $state){
        var narrowTimerState = [
            'dashboard',
            'projects'
        ];

        $scope.pomodoro = pomodoro;

        Auth.currentUser().then(function (){
            $scope.isEmptyProject = function(){
                return Auth._currentUser.current_project_id === null;
            };

        });

        $scope.isPomoStrted = function(){
            return pomodoro.pomo_cycle ? pomodoro.pomo_cycle.status === 'started' : false;
        };

        $scope.isPomoPaused = function(){
            return pomodoro.pomo_cycle ? pomodoro.pomo_cycle.status === 'paused' : false;
        };

        $scope.isNarrow = function(){
            return narrowTimerState.includes($state.current.name);
        };

        $scope.pomodoroToggle = function(){
            if($scope.isPomoStrted()){
                $scope.pomodoroPause();
            }else{
                $scope.pomodoroStart();
            }
        };

        /* pomodoro actions */

        $scope.pomodoroStart = function(){
            if (!$scope.isPomoStrted()) {
                Auth.currentUser().then(function (user) {
                    data = {
                        action: 'start',
                        project: user.current_project_id
                    };
                    pomodoro.Socket.send(data);
                });

            }
        };

        $scope.pomodoroPause = function(){
            if(!$scope.isPomoPaused()){
                Auth.currentUser().then(function (user) {
                    data = {
                        action: 'pause',
                        project: user.current_project_id
                    };
                    pomodoro.Socket.send(data);
                });

            }
        };

        $scope.pomodoroStop = function(){
            Auth.currentUser().then(function (user) {
                data = {
                    action: 'stop',
                    project: user.current_project_id
                };
                pomodoro.Socket.send(data);
            });

        };
    }]);