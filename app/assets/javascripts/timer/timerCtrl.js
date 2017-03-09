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
                return Auth._currentUser.current_project_id == null;
            };

        });

        $scope.isPomoStrted = function(){
            return pomodoro.current_project ? pomodoro.current_project.status == 'started' : false;
        };

        $scope.isPomoPaused = function(){
            return pomodoro.current_project ? pomodoro.current_project.status == 'paused' : false;
        };

        $scope.isNarrow = function(){
            return narrowTimerState.includes($state.current.name);
        };

        $scope.pomodoroToggle = function(){
            console.log('$scope.isPomoStrted()' + $scope.isPomoStrted());
            if($scope.isPomoStrted()){
                $scope.pomodoroPause();
            }else{
                $scope.pomodoroStart();
            }
        };

        /* pomodoro actions */

        $scope.pomodoroStart = function(){
            if(!$scope.isPomoStrted()){
                data = {
                    action: 'start',
                    project: Auth._currentUser.current_project_id
                };
                pomodoro.Socket.send(data);
            }
        };

        $scope.pomodoroPause = function(){
            if(!$scope.isPomoPaused()){
                data = {
                    action: 'pause',
                    project: Auth._currentUser.current_project_id
                };
                pomodoro.Socket.send(data);
            }
        };

        $scope.pomodoroStop = function(){
            data = {
                action: 'stop',
                project: Auth._currentUser.current_project_id
            };
            pomodoro.Socket.send(data);
        };
    }]);