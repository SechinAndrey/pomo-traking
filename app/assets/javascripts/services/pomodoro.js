angular.module('pomoTracking')
    .factory('pomodoro', [
        '$interval',
        function($interval){
            var o = {
                min: 0,
                sec: 0,
                endTime: undefined
            };

            var timer;

            o.start = function(){
                timer = $interval(function() {
                    var time = o.endTime - new Date().getTime();
                    o.min = Math.ceil(time/60000);
                    o.sec = Math.ceil(time/1000 % 60);
                }, 200);
            };

            o.pause = function(){
                $interval.cancel(timer);
            };

            o.stop = function(){
                $interval.cancel(timer);
                o.min = 0;
                o.sec = 0;
            };

            return o;
        }
    ]);