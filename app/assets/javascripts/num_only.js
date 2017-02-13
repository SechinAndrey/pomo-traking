angular.module('pomoTracking')
    .directive('restrictInput', [function(){

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var ele = element[0];
                var regex = /^\d+$/;
                var value = ele.value;

                ele.addEventListener('keydown',function(e){

                    if (!regex.test(e.key)) {
                        console.log(e);
                        e.preventDefault();
                    }
                    // if (regex.test(ele.value)){
                    //     console.log('11111111111111111111111111111111111');
                    //     value = ele.value;
                    // }else{
                    //     console.log('2222222222222222222222222222222');
                    //     ele.value = value;
                    // }
                });
            }
        };
    }]);