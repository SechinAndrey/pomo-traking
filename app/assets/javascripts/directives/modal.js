angular.module('pomoTracking')
    .directive('modal', ['$state',function($state) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                scope.closeModal = function() {
                    element.modal('hide');
                };

                scope.openModal = function () {
                    element.modal('show');
                };

                element.on('hidden.bs.modal', function () {
                    console.log('MODAL hidden.bs.modal');
                    if(element[0].id === 'deleteProject' && $state.previous !== $state.current){
                        $state.go($state.previous);
                    }else{
                        $state.go('home');
                    }
                })
            }
        }
    }]);