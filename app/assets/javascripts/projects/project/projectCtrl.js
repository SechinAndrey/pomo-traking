angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'projects',
        'project',
        function($scope, projects, project) {
            $scope.project = project;
            $scope.user = {
                pomo_time: 25,
                short_break_time: 5,
                long_break_time: 15
            };
        }
    ]);