angular.module('pomoTracking')
.controller('ProjectsListCtrl', [
    '$scope',
    'pomodoro',
    '$localStorage',
    'projectsManager',
    '$state',
    function($scope, pomodoro, $localStorage, projectsManager, $state){
        $scope.pomodoro = pomodoro;
        $scope.$storage = $localStorage;
        $scope.projectsManager = projectsManager;

        $scope.getAll = function () {
            if($state.current.name === 'projects'){
                projectsManager.loadAllProjects($localStorage.sort, 50).then(function (projects) {
                    $scope.projects = $scope.projects.concat(projects);
                })
            }
        };
    }]);