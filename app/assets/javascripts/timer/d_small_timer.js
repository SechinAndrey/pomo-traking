angular.module('pomoTracking')
    .directive("smallTimer", function() {
        return {
            restrict: 'E',
            templateUrl: "timer/_small_timer.html",
            controller: 'TimerCtrl'
        };
    });