angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'projects',
        'project',
        '$rootScope',
        'pomodoro',
        function($scope, projects, project, $rootScope, pomodoro) {
            $scope.project = project;
            $scope.projects = projects;
            $scope.pomodoro = pomodoro;

            $scope.openDeleteModal = function () {
                $scope.openModal();
            };

            $scope.deleteProject = function(){
                projects.delete(project.id);
            };

            $rootScope.$on('projectDeleted', function() {
                $scope.closeModal(true);
            });
        }
    ]);