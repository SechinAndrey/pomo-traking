angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'projects',
        'project',
        function($scope, projects, project) {
            $scope.project = project;
        }
    ]);