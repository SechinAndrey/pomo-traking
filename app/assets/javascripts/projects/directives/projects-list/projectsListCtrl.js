angular.module('pomoTracking')
.controller('ProjectsListCtrl', [
    '$scope',
    '$rootScope',
    'pomodoro',
    '$localStorage',
    'projectsManager',
    '$state',
    function($scope, $rootScope, pomodoro, $localStorage, projectsManager, $state){
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

        $rootScope.$on('projectCreated', function (event, project) {
            $scope.projects.unshift(project);
        });
    }]);