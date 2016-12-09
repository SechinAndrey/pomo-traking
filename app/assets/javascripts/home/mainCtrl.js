angular.module('pomoTracking')
.controller('MainCtrl', [
    '$scope',
    'projects',
    function($scope, projects){
        $scope.test = 'HomePage';
        $scope.projects = projects.projects;
    }]);