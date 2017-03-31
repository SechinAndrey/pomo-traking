angular.module('pomoTracking')
    .factory('projects', [
        '$http',
        '$localStorage',
        function($http, $localStorage){

            var o = {
                projects: []
            };

            o.create = function(project) {
                return $http.post('/projects.json', project).success(function(data){
                });
            };

            o.getAll = function(page, per_page, sort ) {
                return $http.get('/projects.json',
                    { params: {
                            page: page,
                            per_page: per_page,
                            sort: sort
                    }
                    }).success(function(data){
                    angular.copy(data, o.projects);
                });
            };

            o.get = function(id) {
                return $http.get('/projects/' + id + '.json').then(function(res){
                    return res.data;
                });
            };

            return o;
        }
    ]);