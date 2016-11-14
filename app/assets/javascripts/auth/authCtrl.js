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
                console.log('home state: Auth.currentUser() -> ', Auth.currentUser() );
                $state.go('home');
            });
        };

        $scope.register = function(){
            Auth.register($scope.user).then(function(data){

                av = $scope.uploader.queue[0];
                av.headers = {'X-CSRF-Token': $cookies.get('XSRF-TOKEN')};
                av.url = "/avatars?id=" + data.id;
                av.upload();
                $state.go('home');
            })
        };
    }
]);