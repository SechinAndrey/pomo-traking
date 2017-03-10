angular.module('pomoTracking')

    .controller('ProjectsListCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        function($scope, projects, pomodoro){

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

        }]);