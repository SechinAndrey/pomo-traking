angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        function($scope, projects) {
            $scope.projects = projects.projects;
        }
    ]);