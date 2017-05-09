angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'project',
        'projectsManager',
        '$rootScope',
        'pomodoro',
        function($scope, project, projectsManager, $rootScope, pomodoro) {
            $scope.project = project;
            $scope.projectsManager = projectsManager;
            $scope.pomodoro = pomodoro;

            $scope.openDeleteModal = function () {
                $scope.openModal();
            };


            $scope.editProject = function(){
                project.update();
            };

            $scope.deleteProject = function(){
                project.delete();
            };

            $rootScope.$on('projectDeleted', function() {
                $scope.$emit('closeModal', true);
            });
        }
    ]);