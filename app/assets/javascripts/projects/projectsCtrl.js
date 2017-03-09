angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        // 'project',
        function($scope, projects, pomodoro /*project*/) {
            $scope.projects = projects.data;
            $scope.isMenuOpen = false;

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            }
        }
    ]);