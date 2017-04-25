angular.module('pomoTracking')

.controller('TimerCtrl', [
    '$rootScope',
    '$scope',
    'Auth',
    'pomodoro',
    '$state',
    'projectsManager',
    function($rootScope, $scope, Auth, pomodoro, $state, projectsManager){
        var narrowTimerState = [
            'dashboard',
            'projects'
        ];
        $scope.pomodoro = pomodoro;
        var updateCurrentProject = function () {
            projectsManager.getCurrentProject().then(function (current_project) {
                $scope.current_project = current_project;
            });
        };
        updateCurrentProject();

        Auth.currentUser().then(function (){
            $scope.isEmptyProject = function(){
                return Auth._currentUser.current_project_id === null;
            };

        });

        $scope.isPomoStrted = function(){
            return $scope.current_project.pomo_cycle ? $scope.current_project.pomo_cycle.status === 'started' : false;
        };

        $scope.isPomoPaused = function(){
            return $scope.current_project.pomo_cycle ? $scope.current_project.pomo_cycle.status === 'paused' : false;
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
                    pomodoro.send('start', user.current_project_id);
                });

            }
        };

        $scope.pomodoroPause = function(){
            if(!$scope.isPomoPaused()){
                Auth.currentUser().then(function (user) {
                    pomodoro.send('pause', user.current_project_id);
                });

            }
        };

        $scope.pomodoroStop = function(){
            Auth.currentUser().then(function (user) {
                pomodoro.send('stop', user.current_project_id);
            });

        };

        $scope.$on('update', updateCurrentProject);
    }]);