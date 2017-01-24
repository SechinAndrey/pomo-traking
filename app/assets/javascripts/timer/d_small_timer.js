angular.module('pomoTracking')
    .directive("smallTimer", function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "timer/_small_timer.html",
            controller: 'TimerCtrl'
        };
    });