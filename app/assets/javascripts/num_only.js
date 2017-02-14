angular.module('pomoTracking')
    .directive('restrictInput', [function(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var regex = /^\d+$/;
                var exclude = /Backspace|Enter|Tab|Delete|Del|ArrowUp|Up|ArrowDown|Down|ArrowLeft|Left|ArrowRight|Right/;

                element[0].addEventListener('keydown',function(e){
                    if (!exclude.test(e.key) &&!regex.test(e.key)) {
                        e.preventDefault();
                    }
                });
            }
        };
    }]);