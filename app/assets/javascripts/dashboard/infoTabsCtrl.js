angular.module('pomoTracking')

.controller('InfoTabsCtrl', [
    '$scope',
    'statistics',
    function($scope, statistics){
        $scope.tab = 1;
        $scope.statistics = statistics;

        $scope.isSelected = function(checkTab) {
            return this.tab === checkTab;
        };

        $scope.setTab = function(setTab) {
            this.tab = setTab;
        };
    }]);