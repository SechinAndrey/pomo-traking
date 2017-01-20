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
                    projectsPromise: ['projects', 'Auth', function (projects, Auth) {
                        return projects.getAll();
                    }]
                }
            })

            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/_dashboard.html',
                controller: 'MainCtrl',
                onEnter: ['$state', 'Auth', function($state, Auth) {
                    Auth.currentUser().then(function (){
                        $state.go('home');
                    })
                }],
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
                url: '/projects/{id}',
                templateUrl: 'projects/_projects.html',
                controller: 'ProjectsCtrl',
                resolve: {
                    project: ['$stateParams', 'projects', function ($stateParams, projects) {
                        return projects.get($stateParams.id);
                    }]
                }
            });

        $urlRouterProvider.otherwise('home');
    }]);


