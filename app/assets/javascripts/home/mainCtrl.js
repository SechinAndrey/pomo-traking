angular.module('pomoTracking')
.controller('MainCtrl', [
    '$scope',
    'projects',
    'pomodoro',
    function($scope, projects, pomodoro){

        $scope.pomodoro = pomodoro;

        $scope.periods = [
            {type: 'Pomo', status: 'ended'},
            {type: 'Short break', status: 'ended'},
            {type: 'Pomo', status: 'started'},
            {type: 'Short break', status: 'no'},
            {type: 'Pomo', status: 'no'},
            {type: 'Short break', status: 'no'},
            {type: 'Pomo', status: 'no'},
            {type: 'Long break',  status: 'no'}
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


        $scope.addProject = function(){
            if(!$scope.title || $scope.title === '') { return; }
            projects.create({
                title: $scope.title
            });
            $scope.title = '';
        };
    }]);