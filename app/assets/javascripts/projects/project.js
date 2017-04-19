angular.module('pomoTracking')
.factory('project', ['$http', 'Auth', function($http, Auth) {
    function Project(projectData) {
        if (projectData) {
            this.setData(projectData);
        }
    }
    Project.prototype = {
        setData: function(projectData) {
            angular.extend(this, projectData);
        },
        delete: function() {
            $http.delete('/projects/' + this.id + '.json');
        },
        update: function() {
            $http.put('/projects/' + this.id + '.json', this);
        },
        isCurrent: function () {
            return Auth.currentUser().then(function (user) {
                return this.id === user.current_project_id;
            });
        }
    };
    return Project;
}]);