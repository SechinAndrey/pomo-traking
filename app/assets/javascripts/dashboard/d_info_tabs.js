angular.module('pomoTracking')
    .directive("infoTabs", function() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "dashboard/_info_tabs.html",
            controller: 'InfoTabsCtrl'
        };
    });