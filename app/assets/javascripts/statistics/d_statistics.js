angular.module('pomoTracking')
    .directive("statistics", function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                data: '=',
                head: '='
            },
            templateUrl: "statistics/_statistics.html"
        };
    });