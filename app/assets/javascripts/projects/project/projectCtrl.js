angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'projects',
        'project',
        '$rootScope',
        function($scope, projects, project, $rootScope) {
            $scope.project = project;
            $scope.user = {
                pomo_time: 25,
                short_break_time: 5,
                long_break_time: 15
            };

            $scope.openDeleteModal = function () {
                $scope.openModal();
            };

            $scope.deleteProject = function(){
                projects.delete(project.id);
            };

            $rootScope.$on('projectDeleted', function() {
                $scope.closeModal();
            });
        }
    ]);