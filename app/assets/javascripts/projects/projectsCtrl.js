angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        // 'project',
        function($scope, projects /*project*/) {
            // $scope.project = project;
            $scope.isMenuOpen = false;

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            }
        }
    ]);