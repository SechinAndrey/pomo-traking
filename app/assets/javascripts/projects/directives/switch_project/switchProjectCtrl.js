angular.module('pomoTracking')

    .controller('SwitchProjectCtrl', [
        '$scope',
        'pomodoro',
        function($scope, pomodoro){
            $scope.running_project = {};
            $scope.pomodoro = pomodoro;

            $scope.$on('switch-project', function(event, project){
                $scope.running_project = project;
                $scope.openModal();
            });

            $scope.switch_project = function () {
                pomodoro.send('switch', $scope.running_project.id);
                $scope.closeModal();
            }
        }]);