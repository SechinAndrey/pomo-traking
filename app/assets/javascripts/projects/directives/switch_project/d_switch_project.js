angular.module('pomoTracking')
    .directive("switchProject", function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "projects/directives/switch_project/_switch_project.html",
            controller: 'SwitchProjectCtrl'
        };
    });