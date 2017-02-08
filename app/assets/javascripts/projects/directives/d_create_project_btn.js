angular.module('pomoTracking')
    .directive("createProjectBtn", function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "projects/directives/_create_project_btn.html",
            controller: 'CreateProjectBtnCtrl'
        };
    });