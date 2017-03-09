angular.module('pomoTracking')

    .controller('SwitchProjectCtrl', [
        '$scope',
        'pomodoro',
        function($scope, pomodoro){
            $scope.running_project = {};
            $scope.pomodoro = pomodoro;

            $scope.$on('switch-project', function(event, projectt){
                $scope.running_project = projectt;
                $scope.openModal();
            });

            $scope.switch_project = function () {
                data = {
                    action: 'switch',
                    project: $scope.running_project.id
                };
                pomodoro.Socket.send(data);
            }
        }]);