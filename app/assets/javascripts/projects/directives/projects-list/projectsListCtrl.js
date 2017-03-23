angular.module('pomoTracking')

    .controller('ProjectsListCtrl', [
        '$scope',
        'projects',
        'pomodoro',
        function($scope, projects, pomodoro){

            $scope.toggleProject = function (project) {
                if(pomodoro.pomo_cycle){
                    if(pomodoro.pomo_cycle.status == 'started'){
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
                if(pomodoro.current_project.id == project.id && pomodoro.pomo_cycle){
                    pomodoro.pomo_cycle.status == 'started' ? title = 'Pause' : title = 'Start'
                }else{
                    title = 'Start'
                }
                return title;
            };

        }]);