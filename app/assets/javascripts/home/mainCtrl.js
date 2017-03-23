angular.module('pomoTracking')
.controller('MainCtrl', [
    '$scope',
    'projects',
    'pomodoro',
    function($scope, projects, pomodoro){

        $scope.pomodoro = pomodoro;

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

        $scope.projects = projects.projects;


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