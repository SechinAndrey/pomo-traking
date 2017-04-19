angular.module('pomoTracking')
.controller('MainCtrl', [
    '$scope',
    'pomodoro',
    'projects',
    function($scope, pomodoro, projects){
        $scope.pomodoro = pomodoro;
        $scope.projects = projects;
        $scope.periods = [
            {type: 'pomo', status: 'ended'},
            {type: 'short_break', status: 'ended'},
            {type: 'pomo', status: 'started'},
            {type: 'short_break', status: 'no'},
            {type: 'pomo', status: 'no'},
            {type: 'short_break', status: 'no'},
            {type: 'pomo', status: 'no'},
            {type: 'long_break',  status: 'no'}
        ];

        $scope.isStarted = function(period){
           return period.status == 'started';
        };

        $scope.isPaused = function(period){
            return period.status == 'paused';
        };

        $scope.isEmpty = function(period){
            return period.status == '';
        };
    }]);