angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        function($scope, projects, pomodoro) {
            $scope.projects = projects.projects;
            $scope.isMenuOpen = false;

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            };
        }
    ]);