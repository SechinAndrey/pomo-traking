angular.module('pomoTracking',['ui.router', 'templates'])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'home/_home.html',
                controller: 'MainCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }]);


