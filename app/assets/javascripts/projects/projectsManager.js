angular.module('pomoTracking')
.factory('projectsManager', ['$http', '$q', 'project',  'Auth', '$rootScope', function($http, $q, Project, Auth, $rootScope) {
        var projectsManager = {
        _pool: {},
        _page: 1,
        _busy: false,
        _ended: false,
        current_project: {},
        _retrieveInstance: function(projectId, projectData) {
            var instance = this._pool[projectId];
            if (instance) {
                instance.setData(projectData);
            } else {
                instance = new Project(projectData);
                this._pool[projectId] = instance;
            }
            return instance;
        },
        _search: function(projectId) {
            return this._pool[projectId];
        },
        _load: function(projectId, deferred) {
            if(projectId === null){ return deferred.reject();}
            var scope = this;
            $http.get('/projects/' + projectId + '.json')
                .success(function(projectData) {
                    var project = scope._retrieveInstance(projectData.id, projectData);
                    deferred.resolve(project);
                })
                .error(function() {
                    deferred.reject();
                });
        },

        createProject: function (projectData) {
            $http.post('/projects.json', projectData);
        },

        addProject: function (projectData) {
            return this._retrieveInstance(projectData.id, projectData);
        },

        getProject: function(projectId) {
            var deferred = $q.defer();
            var project = this._search(projectId);
            if (project) {
                deferred.resolve(project);
            } else {
                this._load(projectId, deferred);
            }  return deferred.promise;
        },

        getCurrentProjectTitle: function() {
            return this.current_project.title || 'The project is not started';
        },

        getCurrentProject: function() {
            var scope = this;
            return Auth.currentUser().then(function (user) {
                return scope.getProject(user.current_project_id);
            });
        },

        loadAllProjects: function(sort, perPage, page) {
            var scope = this;
            var deferred = $q.defer();
            if(scope._busy ||(scope._ended && !page)){
                deferred.reject();
                return deferred.promise;
            }
            scope._busy = true;
            $http.get('/projects.json', {
                params: {
                    sort: sort,
                    per_page: perPage,
                    page: page || scope._page
                }
            })
            .success(function(projectsArray) {
                var projects = [];
                if(page){
                    scope._page = 2;
                    scope._ended = false;
                } else {
                    if(projectsArray.length < perPage) scope._ended = true;
                    scope._page ++;
                }
                projectsArray.forEach(function(projectData) {
                    var project = scope._retrieveInstance(projectData.id, projectData);
                    projects.push(project);
                });
                deferred.resolve(projects);
            })
            .error(function() {
                deferred.reject();
            })
            .finally(function () {
                scope._busy = false;
            });
            return deferred.promise;
        },

        setProject: function(projectData) {
            var scope = this;
            var project = this._search(projectData.id);
            if (project) {
                project.setData(projectData);
            } else {
                project = scope._retrieveInstance(projectData);
            }  return project;
        },

        actionTitle: function(project){
            var scope = this;
            if(scope.current_project && scope.current_project.id === project.id && project.pomo_cycle){
                project.pomo_cycle.status === 'started' ? title = 'Pause' : title = 'Start'
            }else{
                title = 'Start'
            }
            return title;
        }
    };
    return projectsManager;
}]);