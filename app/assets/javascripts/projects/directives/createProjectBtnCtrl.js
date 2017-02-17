angular.module('pomoTracking')

    .controller('CreateProjectBtnCtrl', [
        '$scope',
        'projects',
        'Auth',
        function($scope, projects, Auth){
            var user;

            function updateTime(_user) {
                $scope.pomo_time = _user.pomo_time;
                $scope.short_break_time = _user.short_break_time;
                $scope.long_break_time = _user.long_break_time;
            }

            $scope.onlyNumbers = /^\d+$/;

            Auth.currentUser().then(function (_user){
                user = _user;
                updateTime(_user);
            });

            $scope.addProject = function(valid){
                if(!valid) { return; }
                projects.create({
                    title: $scope.title,
                    pomo_time: $scope.pomo_time,
                    short_break_time: $scope.short_break_time,
                    long_break_time: $scope.long_break_time
                }).then(function (){
                    $scope.title = '';
                    updateTime(user);
                    $scope.closeModal();
                });
            };
        }]);