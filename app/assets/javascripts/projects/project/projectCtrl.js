angular.module('pomoTracking')
    .controller('ProjectCtrl', [
        '$scope',
        'projects',
        'project',
        '$rootScope',
        'pomodoro',
        function($scope, projects, project, $rootScope, pomodoro) {
            $scope.project = project;
            $scope.pomodoro = pomodoro;
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
                $scope.closeModal(true);
            });
        }
    ]);