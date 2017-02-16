angular.module('pomoTracking')

    .controller('CreateProjectBtnCtrl', [
        '$scope',
        'projects',
        'Auth',
        function($scope, projects, Auth){
            $scope.onlyNumbers = /^\d+$/;

            Auth.currentUser().then(function (user){
                $scope.pomo_time = user.pomo_time;
                $scope.short_break_time = user.short_break_time;
                $scope.long_break_time = user.long_break_time;
            });

            $scope.addProject = function(){
                if(!$scope.title || $scope.title === '') { return; }
                projects.create({
                    title: $scope.title,
                    pomo_time: $scope.pomo_time,
                    short_break_time: $scope.short_break_time,
                    long_break_time: $scope.long_break_time
                }).then(function (resp){

                    console.log(resp);

                    $scope.title = '';
                    $scope.closeModal();
                });
            };
        }]);