var mycontroller = angular.module('controllerModule',[]);

//首页 controller
mycontroller.controller('indexControl',['$scope','$uibModal','config',function($scope,$uibModal,config){
    //console.log(config,'config');
    wilddog.initializeApp(config);
    var ref = wilddog.sync().ref('indexData');
    var tableData = null;
    ref.on("value", function(snapshot) {
        tableData = snapshot.val();
        $scope.tableData = tableData;
        $scope.totalItems = tableData.length;
        $scope.currentPage = 1;
        $scope.$digest();
    });

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };


    //modal
    $scope.items = ['item1','item2','item3'];
    $scope.open = function(size,id) {
        var modalInstance = null;
        if(id !== undefined){

        }else{
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        }
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
            console.log(selectedItem,'selectedItem');
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

mycontroller.controller('ModalInstanceCtrl',['$scope','$uibModalInstance','items',function($scope,$uibModalInstance,items){
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
