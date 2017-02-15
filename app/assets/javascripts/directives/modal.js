angular.module('pomoTracking')
    .directive('modal', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                scope.closeModal = function() {
                    element.modal('hide');
                };
            }
        }
    });