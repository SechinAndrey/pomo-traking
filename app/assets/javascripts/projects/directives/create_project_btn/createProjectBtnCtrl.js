angular.module('pomoTracking')

    .controller('CreateProjectBtnCtrl', [
        '$scope',
        'projects',
        'Auth',
        function($scope, projects, Auth){
            var user;

            Auth.currentUser().then(function (_user){
                user = _user;
            });

            $scope.addProject = function(valid){
                if(!valid) { return; }
                projects.create({
                    title: $scope.title,
                }).then(function (response){
                    if(response.status == 200){
                        $scope.title = '';
                        $scope.newProject.$setPristine();
                        $scope.newProject.$setUntouched();
                        $scope.$emit('closeModal', false);
                    }
                });
            };
        }]);