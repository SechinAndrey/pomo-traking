angular.module('pomoTracking')

    .controller('SwitchProjectCtrl', [
        '$scope',
        'pomodoro',
        'projectsManager',
        function($scope, pomodoro, projectsManager){
            $scope.running_project = {};
            $scope.current_project = projectsManager.current_project;

            $scope.$on('switch-project', function(event, project){
                $scope.running_project = project;
                $scope.openModal();
            });

            $scope.switch_project = function () {
                pomodoro.send('switch', $scope.running_project.id);
                $scope.closeModal();
            };
        }]);