angular.module('pomoTracking')

    .controller('SwitchProjectCtrl', [
        '$scope',
        'pomodoro',
        function($scope, pomodoro){
            $scope.running_project = '';
            $scope.pomodoro = pomodoro;

            $scope.$on('start-project', function(data){
                console.log(data);
                $scope.openModal();
            });
        }]);