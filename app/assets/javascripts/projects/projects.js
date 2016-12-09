angular.module('pomoTracking')
    .factory('projects', [
        '$http',
        function($http){

            var o = {
                projects: []
            };

            o.getAll = function() {
                return $http.get('/projects.json').success(function(data){
                    angular.copy(data, o.projects);
                });
            };


            return o;
        }
    ]);