angular.module('pomoTracking')
    .factory('projects', [
        '$http',
        function($http){

            var o = {
                projects: []
            };


            o.create = function(project) {
                return $http.post('/projects.json', project).success(function(data){
                });
            };

            o.getAll = function(page, sort, per_page) {
                return $http.get('/projects.json',
                    { params: {
                            page: page,
                            sort: sort,
                            per_page: per_page
                        }
                    }).success(function(data){
                    angular.copy(data, o.projects);
                });
            };

            o.get = function(id) {
                return $http.get('/projects/' + id + '.json').then(function(res){
                    console.log(res.data);
                    return res.data;
                });
            };

            return o;
        }
    ]);