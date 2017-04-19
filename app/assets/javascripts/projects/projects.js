angular.module('pomoTracking')
    .factory('projects', [
        '$http',
        function($http){

            var o = {
                page: 1,
                busy: false,
                ended: false,
                projects: []
            };

            o.create = function(project) {
                return $http.post('/projects.json', project).success(function(data){});
            };

            o.edit = function (project) {
                console.log('Edit:', project);
                return $http.put('/projects/' + project.id + '.json', project)
            };

            o.get = function(id) {
                return $http.get('/projects/' + id + '.json').then(function(res){
                    return res.data;
                });
            };

            o.getAll = function(sort, per_page, page) {
                if (o.busy || (o.ended && !page)) return;
                o.busy = true;
                return $http.get('/projects.json', {
                    params: {
                        page: page || o.page,
                        per_page: per_page,
                        sort: sort
                    }
                }).success(function(data){
                    // console.warn('BEFORE o.projects.length -> ' + o.projects.length);
                    if(page){
                        // console.info('---> if');
                        o.page = 1;
                        o.ended = false;
                        angular.copy(data, o.projects);
                    }else{
                        // console.info('---> else');
                        if(data.length < per_page) o.ended = true;
                        o.page++;
                        data = o.projects.concat(data);
                        angular.copy(data, o.projects);
                    }
                    o.busy = false;
                    // console.warn('AFTER o.projects.length -> ' + o.projects.length);
                    // console.log('');console.log('');
                });
            };

            o.delete = function(id) {
                return $http.delete('/projects/' + id + '.json').then(function(res){
                    return res.data;
                });
            };

            return o;
        }
    ]);