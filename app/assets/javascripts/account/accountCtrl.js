angular.module('pomoTracking')
.controller('AccountCtrl', [
    '$scope',
    'Auth',
    function($scope, Auth){
        var config = {
            headers: {
                'X-HTTP-Method-Override': 'PUT'
            }
        };

        Auth.currentUser().then(function (current_user) {
            $scope.user = current_user;
        });

        $scope.update = function () {
            Auth.register($scope.user, config).then(function(registeredUser) {
            }, function(error) {
            });
        };
    }]);