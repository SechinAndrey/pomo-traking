angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        '$localStorage',
        function($scope, projects, pomodoro,$localStorage) {
            $scope.projects = projects.projects;
            $scope.isMenuOpen = false;
            
            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            };
        }
    ]);