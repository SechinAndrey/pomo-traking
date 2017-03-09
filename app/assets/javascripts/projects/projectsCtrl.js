angular.module('pomoTracking')
    .controller('ProjectsCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        // 'project',
        function($scope, projects, pomodoro /*project*/) {
            $scope.projects = projects.data;
            $scope.isMenuOpen = false;

            $scope.toggleProject = function (project) {
                if(pomodoro.current_project){
                   if(pomodoro.current_project.status == 'started'){
                       if(pomodoro.current_project.id != project.id){
                           $scope.$emit('switch-project', project);
                       }else{
                           data = {
                               action: 'pause',
                               project: project.id
                           };
                           pomodoro.Socket.send(data);
                       }
                   }else{
                       data = {
                           action: 'start',
                           project: project.id
                       };
                       pomodoro.Socket.send(data);
                   }
                }else{
                    data = {
                        action: 'start',
                        project: project.id
                    };
                    pomodoro.Socket.send(data);
                }
            };

            $scope.actionTitle = function(project){
                if(pomodoro.current_project && pomodoro.current_project.id == project.id){
                    pomodoro.current_project.status == 'started' ? title = 'Pause' : title = 'Start'
                }else{
                    title = 'Start'
                }
                return title;
            };

            $scope.toggleSortMenu = function (){
                $scope.isMenuOpen = !$scope.isMenuOpen;
            }
        }
    ]);