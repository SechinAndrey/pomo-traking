angular.module('pomoTracking')
.controller('MainCtrl', [
    '$rootScope',
    '$scope',
    'pomodoro',
    'projects',
    'projectsManager',
    function($rootScope, $scope, pomodoro, projects, projectsManager){
        var defaultPeriods = [
            {periods_type: 'pomo', status: 'no'},
            {periods_type: 'short break', status: 'no'},
            {periods_type: 'pomo', status: 'no'},
            {periods_type: 'short break', status: 'no'},
            {periods_type: 'pomo', status: 'no'},
            {periods_type: 'short break', status: 'no'},
            {periods_type: 'pomo', status: 'no'},
            {periods_type: 'long break',  status: 'no'}
        ];
        $scope.periods = [];
        $scope.pomodoro = pomodoro;
        $scope.projects = projects;
        $scope.projectsManager = projectsManager;
        angular.copy(defaultPeriods, $scope.periods);

        var updatePeriods = function() {
            projectsManager.getCurrentProject().then(function (current_project) {
                if(current_project.pomo_cycle && current_project.pomo_cycle.periods){
                    current_project.pomo_cycle.periods.forEach( function(period, index){
                        angular.extend($scope.periods[index], period);
                        if(period.ended){
                            $scope.periods[index].status = 'ended';
                        }
                        else if (index === current_project.pomo_cycle.periods.length - 1){
                            $scope.periods[index].status = 'started';
                        }
                    })
                }else{
                    angular.copy(defaultPeriods, $scope.periods);
                }
            });
        };
        updatePeriods();
        
        $scope.isStarted = function(period){
           return period.status === 'started';
        };

        $scope.isPaused = function(period){
            return period.status === 'paused';
        };

        $scope.isEmpty = function(period){
            return period.status === '';
        };

        $scope.duration = function(period) {
            if(period.duration){
                return period.duration + " min"
            }else return ''
        };

        $rootScope.$on('pomo-start',updatePeriods);
        $rootScope.$on('pomo-end',updatePeriods);

    }]);