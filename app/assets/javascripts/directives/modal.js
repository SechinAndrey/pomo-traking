angular.module('pomoTracking')
    .directive('modal', ['$state',function($state) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var redirect = false;
                var closeModal = function(_redirect) {
                    element.modal('hide');
                    if(_redirect){
                        console.log('++++++++++++++++++++++++');
                        redirect = _redirect;
                    }
                };

                scope.openModal = function () {
                    element.modal('show');
                };

                element.on('hidden.bs.modal', function () {
                    if(redirect){
                        ($state.previous.name !== '') ? $state.go($state.previous) : $state.go('home');
                        redirect = false;
                    }
                });

                scope.$on('closeModal', function(event, _redirect) {
                    closeModal(_redirect);
                });
            }
        }
    }]);