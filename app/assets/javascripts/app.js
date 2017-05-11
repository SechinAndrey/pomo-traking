angular.module('pomoTracking', [
    'ui.router',
    'ngCookies',
    'templates',
    'Devise',
    'angularFileUpload',
    'ngActionCable',
    'xeditable',
    'ng-rails-csrf',
    'ngStorage',
    'infinite-scroll'
])

.run(['editableOptions', '$localStorage', '$rootScope', '$state',
    function(editableOptions,$localStorage, $rootScope, $state) {
        editableOptions.theme = 'bs3';
        $localStorage.$default({
            sort: 'alphabet'
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
            if(fromState.name!== toState.name){
                $state.previous = fromState;
            }
        });

        $rootScope.$on('$stateChangeError', function() {
            console.error(arguments[5]);
        });
    }
])

.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'auth/_register.html',
                controller: 'AuthCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                            $state.go('home');
                        }, function(error) {
                            console.log(error)
                        });
                    }
                ]
            })

            .state('login', {
                url: '/login',
                templateUrl: 'auth/_login.html',
                controller: 'AuthCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                            $state.go('home');
                        }, function(error) {
                            console.log(error)
                        });
                    }
                ]
            })

            .state('account', {
                url: '/users/{id}/edit',
                templateUrl: 'account/_account.html',
                controller: 'AccountCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                ]
            })

            .state('home', {
                url: '/home',
                templateUrl: 'home/_home.html',
                controller: 'MainCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                ],
                resolve: {
                    projects: ['projectsManager', function (projectsManager) {
                        return projectsManager.loadAllProjects('date:desc', 10, 1).then(function (projects) {
                            return projects;
                        }, function () {
                            return {};
                        });
                    }]
                }
            })

            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/_dashboard.html',
                controller: 'DashboardCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                ],
                resolve: {
                    projects: ['projectsManager', function (projectsManager) {
                        return projectsManager.loadAllProjects('pomo_count:desc', 10, 1).then(function (projects) {
                            return projects;
                        },function () {
                            return {};
                        });
                    }]
                }
            })

            .state('projects', {
                url: '/projects',
                templateUrl: 'projects/_projects.html',
                controller: 'ProjectsCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                ],
                resolve: {
                    projects: ['projectsManager', '$localStorage', function (projectsManager, $localStorage) {
                        return projectsManager.loadAllProjects($localStorage.sort, 50, 1).then(function (projects) {
                            return projects;
                        },function () {
                            return {};
                        });
                    }]
                }
            })

            .state('project', {
                url: '/projects/{id}',
                templateUrl: 'projects/project/_project.html',
                controller: 'ProjectCtrl',
                onEnter: [
                    '$rootScope',
                    '$state',
                    'Auth',
                    function($rootScope, $state, Auth) {
                        $rootScope.$emit('menuToggle', false); // close mob_menu
                        Auth.currentUser().then(function(user) {
                        }, function(error) {
                            $state.go('login');
                        });
                    }
                ],
                resolve: {
                    project: ['$stateParams', 'projectsManager', function ($stateParams, projectsManager) {
                        return projectsManager.getProject($stateParams.id);
                    }]
                }
            });
        // $urlRouterProvider.otherwise('home');
        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');
            return $state.go('home');
        });
    }]);


