angular.module('pomoTracking')
.controller('MainCtrl', [
    '$scope',
    'projects',
    function($scope, projects){
        $scope.header = 'HomePage';
        $scope.projects = projects.projects;

        $scope.addProject = function(){
            if(!$scope.title || $scope.title === '') { return; }
            projects.create({
                title: $scope.title
            });
            $scope.title = '';
        };
    }]);