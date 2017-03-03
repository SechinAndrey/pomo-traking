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
                }).then(function (){
                    $scope.title = '';
                    $scope.closeModal();
                });
            };
        }]);