angular.module('pomoTracking')
    .directive("projectsList", function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "projects/directives/projects-list/_projects_list.html",
            controller: 'ProjectsListCtrl'
        };
    });
