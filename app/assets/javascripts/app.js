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
                        Auth.currentUser().then(function(user) {
                            return projects.getAll();
                        }, function(error) {
                            console.log(error);
                        });
                    }]
                },
                onEnter: ['$rootScope', function($rootScope) {
                    $rootScope.$emit('menuToggle', false);
                }]
            })

            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/_dashboard.html',
                controller: 'MainCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false);

                    Auth.currentUser().then(function(user) {
                    }, function(error) {
                        $state.go('home');
                    });
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
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false);
                    Auth.currentUser().then(function (){
                        $state.go('home');
                    })
                }]
            })

            .state('register', {
                url: '/register',
                templateUrl: 'auth/_register.html',
                controller: 'AuthCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false);
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


