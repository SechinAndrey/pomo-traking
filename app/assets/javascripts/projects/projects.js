angular.module('pomoTracking')
    .factory('projects', [
        '$http',
        function($http){

            var o = {
                projects: []
            };


            o.create = function(project) {
                return $http.post('/projects.json', project).success(function(data){
                    o.projects.push(data);
                });
            };

            o.getAll = function() {
                return $http.get('/projects.json').success(function(data){
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