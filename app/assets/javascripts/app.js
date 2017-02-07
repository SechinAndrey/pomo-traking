angular.module('pomoTracking', ['ui.router', 'ngCookies', 'templates', 'Devise', 'angularFileUpload', 'ngActionCable', 'xeditable'])

.run(['editableOptions', function(editableOptions) {
    editableOptions.theme = 'bs3';
}])

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
                    projectsPromise: ['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {
                        Auth.currentUser().then(function(user) {
                            // return projects.getAll();
                        }, function(error) {
                            $state.go('login');
                            console.log(error);
                        });
                    }]
                },
                onEnter: ['$rootScope', function($rootScope) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu
                }]
            })


            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/_dashboard.html',
                controller: 'DashboardCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu

                    Auth.currentUser().then(function(user) {
                    }, function(error) {
                        $state.go('login');
                    });
                }],
                resolve: {
                    projectsPromise: ['projects', function (projects) {
                        return projects.getAll();
                    }]
                }
            })

            .state('account', {
                url: '/users/{id}/edit',
                templateUrl: 'account/_account.html',
                controller: 'AccountCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu

                    Auth.currentUser().then(function(user) {
                    }, function(error) {
                        $state.go('login');
                    });
                }]
            })

            .state('login', {
                url: '/login',
                templateUrl: 'auth/_login.html',
                controller: 'AuthCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu

                    Auth.currentUser().then(function(user) {
                        $state.go('home');
                    }, function(error) {
                        console.log(error)
                    });
                }]
            })

            .state('register', {
                url: '/register',
                templateUrl: 'auth/_register.html',
                controller: 'AuthCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu

                    Auth.currentUser().then(function(user) {
                        $state.go('home');
                    }, function(error) {
                        console.log(error)
                    });
                }]
            })

            .state('projects', {
                url: '/projects',
                templateUrl: 'projects/_projects.html',
                controller: 'ProjectsCtrl',
                onEnter: ['$rootScope', '$state', 'Auth', function($rootScope, $state, Auth) {
                    $rootScope.$emit('menuToggle', false); // close mob_menu

                    Auth.currentUser().then(function(user) {
                    }, function(error) {
                        $state.go('login');
                    });
                }]
                //resolve: {
                //    project: ['$stateParams', 'projects', function ($stateParams, projects) {
                //        return projects.get($stateParams.id);
                //    }]
                //}
            });

        $urlRouterProvider.otherwise('home');
    }]);


