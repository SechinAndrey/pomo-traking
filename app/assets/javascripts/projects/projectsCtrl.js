angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        '$localStorage',
        function($scope, projects, pomodoro, $localStorage) {
            $scope.isMenuOpen = false;
            $scope.$projects = projects;
            $scope.projects = projects.projects;
            // console.log('ssssssssssssssssssssssssssss');
            console.log($scope.projects);
            $scope.$storage = $localStorage;
            $scope.desc = $localStorage.sort.includes('desc');
            $scope.page = 1;

            $scope.sort_type = ['alphabet','date','pomo_count'];

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            };

            $scope.currentSort = function(sort){
                return !!$localStorage.sort.includes(sort)
            };

            $scope.showArrowASC = function(sort){
                return $scope.currentSort(sort) && !$scope.desc
            };

            $scope.showArrowDesc = function(sort){
                return $scope.currentSort(sort) && $scope.desc
            };

            $scope.sortProject = function(sort){
                if($localStorage.sort === sort || $scope.desc){$scope.desc = !$scope.desc;}
                if($scope.desc){sort += ':desc'}
                $localStorage.sort = sort;
                projects.getAll(sort, 50, 1);
            }
        }
    ]);