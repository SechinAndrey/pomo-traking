angular.module('pomoTracking')

.controller('InfoTabsCtrl', [
    '$scope',
    function($scope){
        $scope.tab = 1;

        $scope.isSelected = function(checkTab) {
            return this.tab === checkTab;
        };

        $scope.setTab = function(setTab) {
            this.tab = setTab;
        };
    }]);