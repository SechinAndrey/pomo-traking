angular.module('pomoTracking')
.controller('AuthCtrl', [
    '$scope',
    '$state',
    'Auth',
    'FileUploader',
    '$cookies',
    function($scope, $state, Auth, FileUploader, $cookies){
        $scope.uploader = new FileUploader();

        $scope.login = function(){
            Auth.login($scope.user).then(function(){
                $state.go('home');
            });
        };

        $scope.register = function(){
            Auth.register($scope.user).then(function(data){
                var avatar = $scope.uploader.queue[0];
                avatar.headers = {'X-CSRF-Token': $cookies.get('XSRF-TOKEN')};
                avatar.url = "/avatars?id=" + data.id;
                avatar.onSuccess = function(){
                    $state.go('home');
                };
                avatar.onError = function(response, status, headers){
                    console.log('!!! load avatar error: ', response);
                };
                avatar.upload();
            })
        };
    }
]);