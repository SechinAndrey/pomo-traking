angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        // 'project',
        function($scope, projects, pomodoro /*project*/) {
            $scope.projects = projects.data;
            $scope.isMenuOpen = false;

            $scope.startProject = function (project) {
                if(pomodoro.current_project && pomodoro.current_project.id != project.id){
                    $scope.$emit('start-project', project);
                }else{
                    data = {
                        action: 'start',
                        project: project.id
                    };
                    pomodoro.Socket.send(data);
                }
            };

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            }
        }
    ]);