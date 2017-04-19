angular.module('pomoTracking')
.controller('ProjectsListCtrl', [
    '$scope',
    'projects',
    'pomodoro',
    '$localStorage',
    function($scope, projects, pomodoro, $localStorage){
        $scope.pomodoro = pomodoro;
        $scope.$storage = $localStorage;
    }]);