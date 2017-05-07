var mycontroller = angular.module('controllerModule',[]);

//首页 controller
mycontroller.controller('indexControl',['$scope','$uibModal','$wilddogObject','config',function($scope,$uibModal,$wilddogObject,config){
    //console.log(config,'config');
    wilddog.initializeApp(config.wilddog);
    var myshopData = wilddog.sync().ref('indexData');

    // //way one code
    // var syncObject = $wilddogObject(myshopData);
    // syncObject.$loaded().then(function() {
    //     // 使用 angular 的 forEach() 方法来对获取到的数据进行遍历
    //     var tableData = [];
    //     angular.forEach(syncObject, function(value, key) {
    //         angular.forEach(value,function(obj,id){
    //             tableData.push(obj);
    //         });
    //     });
    //     $scope.tableData = tableData;
    //     $scope.currentPage = 1;
    //     $scope.maxSize = 5;
    //     $scope.totalItems = 100;
    // });
    // // 将数据注册到 $scope 对象中，这样我们就能在 DOM 中利用此数据了
    // $scope.indexData = syncObject;
    // syncObject.$bindTo($scope,"indexData");



    var onceFlag = true;
    myshopData.on('value',function(snapshot){
        var tableData = {};
        angular.forEach(snapshot.val(),function(item,key){
            angular.forEach(item,function(obj,k){
                console.log(k);
                tableData[k] = obj;
            });
        });
        $scope.tableData = tableData;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.totalItems = 100;
        if(onceFlag){
            $scope.$digest();
            onceFlag = false;
        }
    });

    $scope.pageChanged = function(page) {
        console.log('Page changed to: ' + page);
    };


    //modal
    $scope.open = function(size,key) {
        console.log($scope.tableData,'dss',key);
        var modalInstance = null;
        modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                data: function () {
                    return key ? $scope.tableData[key] : null;
                },
                title : function(){
                    return key ? '修改商品信息' : '添加商品信息';
                }
            }
        });
        modalInstance.result.then(function(obj) {
            var id = obj.shopId;
            var classify = obj.shopClassify;
            var json = {
                "id" : id,
                "classify" : classify,
                "tag" : obj.shopTag,
                "title" : obj.shopTitle,
                "description" : obj.shopDescription,
                "imgsrc" : obj.shopImgsrc,
                "price" : obj.shopPrice,
                "shopCount" : obj.shopBuycount,
                "likeCount" : obj.shopLikecount
            };

            if(key){
                var data = {};
                data[key] = json;
                myshopData.child(classify).update(data);
            }else{
                myshopData.child(classify).push(json);
            }
            
            // //way one code
            // syncObject.$save().then(function(ref) {
            //     console.log('success',ref);
            // },function(error) {
            //     console.log("Error:", error);
            // });
        }, function () {
            console.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

mycontroller.controller('ModalInstanceCtrl',['$scope','$uibModalInstance','data','title',function($scope,$uibModalInstance,data,title){
    $scope.modalTitle = title;

    $scope.shopId = data ? data.id : new Date().getTime();
    $scope.shopClassify = data ? data.classify : 'fish';
    $scope.shopTitle = data ? data.title : '';
    $scope.shopTag = data ? data.tag : '';
    $scope.shopPrice = data ? data.price : '';
    $scope.shopDescription = data ? data.description : '';
    $scope.shopImgsrc = data ? data.imgsrc : '';
    $scope.shopLikecount = data ? data.likeCount : '';
    $scope.shopBuycount = data ? data.shopCount : '';


    $scope.ok = function () {
        $uibModalInstance.close($scope);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}])
