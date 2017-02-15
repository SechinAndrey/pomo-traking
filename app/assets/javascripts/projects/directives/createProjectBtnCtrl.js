angular.module('pomoTracking')

    .controller('CreateProjectBtnCtrl', [
        '$scope',
        'projects',
        function($scope, projects){
            $scope.onlyNumbers = /^\d+$/;

            $scope.addProject = function(){
                if(!$scope.title || $scope.title === '') { return; }
                projects.create({
                    title: $scope.title
                });
                $scope.title = '';
            };

            $scope.pomo_time = 25;
            $scope.long_break = 15;
            $scope.short_break = 5;
        }]);