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
                $scope.sec = pomodoro.sec;

                $scope.$watch(function($scope) { return $scope.sec }, function(){
                    alert('123');
                    var p = 2 * pomodoro.time/(1500*1000); // var p = 2 * time/(arr[i]*60000); // для минут
                    $scope.ctx.clearRect(0,0,$scope.tmr.width,$scope.tmr.height); // очищает поле
                    $scope.ctx.beginPath(); // очищает поле
                    $scope.ctx.arc($scope.tmr.width/2, $scope.tmr.height/2, rad, 0, p * Math.PI, false); // Рисует невидимый круг
                    $scope.ctx.strokeStyle = 'grey'; // Цвет обводки; зависит от вида деятельности
                    $scope.ctx.stroke(); // Рисовка обводки
                });

                console.log(pomodoro);

                $scope.tmr = document.getElementById("timer");
                $scope.ctx = $scope.tmr.getContext('2d');
                var rad = 80; // Радиус круга
                $scope.ctx.lineWidth = 12; // Ширина обводки


                $scope.ctx2 = document.getElementById("timer0").getContext('2d');
                $scope.ctx2.lineWidth = 1;
                $scope.ctx2.strokeStyle = "grey";
                $scope.ctx2.arc($scope.tmr.width/2, $scope.tmr.height/2, rad, 0, 2 * Math.PI, true);
                $scope.ctx2.stroke();


            }
        };
    }]);