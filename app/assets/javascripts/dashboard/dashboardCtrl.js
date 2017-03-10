angular.module('pomoTracking')
    .controller('DashboardCtrl', [
        '$scope',
        'projects',
        function($scope, projects) {
            $scope.projects = projects.projects;
        }
    ]);