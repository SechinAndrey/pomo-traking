angular.module('pomoTracking')
    .directive("mobMenu", ['$rootScope', 'Auth', function($rootScope, Auth) {
        return {
            restrict: 'E',
            templateUrl: "nav/_mob_menu.html",
            link: function(scope, element, attrs) {
                scope.signedIn = Auth.isAuthenticated;

                scope.closeMobMenu = function(){
                    $rootScope.$emit('menuToggle', false);
                };

                $rootScope.$on('menuToggle', function(event, data) {
                    element.children().toggleClass('mob-menu-open', !!data);
                });
            }
        };
    }]);