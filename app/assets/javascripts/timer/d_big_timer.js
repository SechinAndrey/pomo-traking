angular.module('pomoTracking')
    .directive("bigTimer", ['pomodoro', function(pomodoro) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "timer/_big_timer.html",
            scope: {},
            controller: 'TimerCtrl',
            link: function($scope, $element, $attr) {

                $scope.pomodoro = pomodoro;

                var timer = document.getElementById("timer");
                var context = timer.getContext('2d');
                var context2 = document.getElementById("timer0").getContext('2d');
                var rad = 90; // Радиус круга

                context.lineWidth = 12; // Ширина обводки

                context2.lineWidth = 1;
                context2.strokeStyle = "grey";
                context2.arc(100, 100, rad, 0, 2 * Math.PI, true);
                context2.stroke();

                var renderTimer = function(){
                    var p = 2 * $scope.pomodoro.time/(1500*1000);
                    context.clearRect(0,0,timer.width,timer.height);

                    context.beginPath();
                    context.arc(100, 100, rad, 0, p * Math.PI, false);
                    context.strokeStyle = 'grey';
                    context.stroke();
                };

                $scope.$watch( 'pomodoro.sec', renderTimer);
            }
        };
    }]);