angular.module('pomoTracking')
    .factory('activities', [
        '$http',
        function($http){

            var o = {
                activities: []
            };

            o.get = function(params) {
                return $http.get(
                    '/activities.json',
                    {
                        params: {
                            'activities[]': params
                        }
                    }
                ).then(function(res){
                    return res.data;
                });
            };

            return o;
        }
    ]);