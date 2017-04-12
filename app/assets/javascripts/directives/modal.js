angular.module('pomoTracking')
    .directive('modal', ['$state',function($state) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var redirect = false;

                scope.closeModal = function(_redirect) {
                    element.modal('hide');
                    if(_redirect) redirect = _redirect;
                };

                scope.openModal = function () {
                    element.modal('show');
                };

                element.on('hidden.bs.modal', function () {
                    if(redirect){
                        ($state.previous !== $state.current) ? $state.go($state.previous) : $state.go('home');
                        redirect = false;
                    }
                })
            }
        }
    }]);