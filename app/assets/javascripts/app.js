angular.module('pomoTracking', ['ui.router', 'ngCookies', 'templates', 'Devise', 'angularFileUpload', 'ngActionCable'])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('home', {
                url: '/home',
                templateUrl: 'home/_home.html',
                controller: 'MainCtrl',
                resolve: {
                    projectsPromise: ['projects', function (projects) {
                        return projects.getAll();
                    }]
                }
            })

            .state('login', {
                url: '/login',
                templateUrl: 'auth/_login.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    Auth.currentUser().then(function (){
                        $state.go('home');
                    })
                }]
            })

            .state('register', {
                url: '/register',
                templateUrl: 'auth/_register.html',
                controller: 'AuthCtrl',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    Auth.currentUser().then(function (){
                        $state.go('home');
                    })
                }]
            })

            .state('projects', {
                url: '/projects',
                templateUrl: 'projects/_projects.html',
                controller: 'ProjectsCtrl',
                resolve: {
                    projectsPromise: ['projects', function (projects) {
                        return projects.getAll();
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }]);


