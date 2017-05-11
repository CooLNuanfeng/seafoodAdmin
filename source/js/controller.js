var mycontroller = angular.module('controllerModule',[]);

//首页 controller
mycontroller.controller('indexControl',['$scope','$rootScope','$uibModal','$wilddogObject','config','arrDataPagition',function($scope,$rootScope,$uibModal,$wilddogObject,config,arrDataPagition){
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


    // var onceFlag = true;
    var tableAllData = [];
    myshopData.on('value',function(snapshot){
        tableAllData.length = 0;
        angular.forEach(snapshot.val(),function(item,key){
            angular.forEach(item,function(obj,k){
                obj['keyid'] = k;
                tableAllData.push(obj);
            });
        });
        //$scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = Math.ceil(tableAllData.length/$scope.pageSize);
        $scope.totalItems = tableAllData.length;

        $scope.tableData = arrDataPagition.init(tableAllData,$scope.currentPage,$scope.pageSize);

        if($rootScope.onceFlag){
            $scope.$digest();
            $rootScope.onceFlag = false;
        }

        $scope.pageChanged = function(page) {
            //console.log('Page changed to: ' + page);
            $scope.currentPage = page;
            $scope.tableData = arrDataPagition.init(tableAllData,page,$scope.pageSize);
        };
    });


    // del
    $scope.delItem = function(key,classify){
        //console.log('del',key,classify);
        myshopData.child(classify+'/'+key).remove();
    };



    //modal  modiy or add
    $scope.open = function(key,index) {
        // console.log($scope.tableData[index],'dss',key);
        var modalInstance = null;
        modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            resolve: {
                data: function () {
                    return key ? $scope.tableData[index] : null;
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
                "likeCount" : obj.shopLikecount,
                "bannerImgsrc" : obj.shopBannerImg,
                "content" : obj.shopContent,
                "contentImgsrc" : obj.shopContentImgsrc
            };

            if(key){ //修改
                var data = {};
                data[key] = json;
                //console.log(json,'update',classify);
                myshopData.child(classify).update(data,function(err){
                    if(err){
                        console.log('update error');
                        return;
                    }
                    $scope.tableData = arrDataPagition.init(tableAllData,$scope.currentPage,$scope.pageSize);
                });
            }else{
                //console.log(json,'push',classify);
                myshopData.child(classify).push(json,function(err){
                    if(err){
                        console.log('push error');
                        return;
                    }
                });
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
//首页 modal
mycontroller.controller('ModalInstanceCtrl',['$scope','$uibModalInstance','selectOptions','data','title',function($scope,$uibModalInstance,selectOptions,data,title){
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
    $scope.shopContent = data ? data.content : '';
    $scope.shopBannerImg = data ? data.bannerImgsrc : '';
    $scope.shopContentImgsrc = data ? data.contentImgsrc : '';
    //selectOptions
    $scope.selectOptions = selectOptions.init();



    $scope.ok = function () {
        $uibModalInstance.close($scope);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);




// 详情页编辑
mycontroller.controller('detailControl',['$scope','$rootScope','$interval','$state','$stateParams','config','selectOptions',function($scope,$rootScope,$interval,$state,$stateParams,config,selectOptions){
    console.log($stateParams.keyid);
    wilddog.initializeApp(config.wilddog);
    var myshopData = wilddog.sync().ref('indexData'),
        keyid = $stateParams.keyid,
        classify = $stateParams.classify;

    $scope.isModify = keyid ? true : false;

    myshopData.on('value',function(snapshot){
        var data = keyid ? snapshot.val()[classify][keyid] : null;
        $scope.shopId = keyid ? data.id : new Date().getTime();
        $scope.shopClassify = keyid ? classify : 'fish';
        $scope.shopTitle = keyid ? data.title : '';
        $scope.shopTag = keyid ? data.tag : '';
        $scope.shopPrice = keyid ? data.price : '';
        $scope.shopDescription = keyid ? data.description : '';
        $scope.shopImgsrc = keyid ? data.imgsrc : '';
        $scope.shopLikecount = keyid ? data.likeCount : '';
        $scope.shopBuycount = keyid ? data.shopCount : '';
        $scope.shopBannerImg = keyid && data.bannerImgsrc ? data.bannerImgsrc : [];
        $scope.shopContent = keyid ? data.content : '';
        $scope.shopContentImgsrc = keyid && data.contentImgsrc ? data.contentImgsrc :[];
        // if(keyid && data.contentImgsrc){
        //     angular.forEach(data.contentImgsrc,function(item,key){
        //         console.log(item);
        //         $scope.shopContentImgsrc.push(item);
        //     });
        // }

        if($rootScope.onceFlag){
            $scope.$digest();
            $rootScope.onceFlag = false;
        }
    });
    $scope.selectOptions = selectOptions.init();


    //添加新图
    $scope.addImg = function(type){
        if(type == 'content' && $scope.addImgsrc){
            $scope.shopContentImgsrc.push($scope.addImgsrc);
            $scope.addImgsrc = '';
        }
        if(type == 'banner' && $scope.addBannerImgsrc){
            $scope.shopBannerImg.push($scope.addBannerImgsrc);
            $scope.addBannerImgsrc = '';
        }
    };
    //删除新图
    $scope.del = function(type,index){
        if(type == 'content'){
            $scope.shopContentImgsrc.splice(index,1);
        }
        if(type == 'banner'){
            $scope.shopBannerImg.splice(index,1);
        }
    }


    $scope.addNew = function(){
        $scope.disabled = true;
        var json = {
            "id" : $scope.shopId,
            "classify" : $scope.shopClassify,
            "tag" : $scope.shopTag,
            "title" : $scope.shopTitle,
            "description" : $scope.shopDescription,
            "imgsrc" : $scope.shopImgsrc,
            "price" : $scope.shopPrice,
            "shopCount" : $scope.shopBuycount,
            "likeCount" : $scope.shopLikecount,
            "bannerImgsrc" : $scope.shopBannerImg,
            "content" : $scope.shopContent,
            "contentImgsrc" : $scope.shopContentImgsrc
        };

        myshopData.child($scope.shopClassify).push(json,function(err){
            if(err){
                console.log('push error');
                $scope.showToast = false;
                $scope.toastInfo = false;
                $scope.disabled = false;
                return;
            }
            $scope.showToast = true;
            $scope.toastInfo = true;
            $scope.timeToast = 3;
            $scope.disabled = false;
            var timer =  $interval(function(){
                $scope.timeToast--;
                if($scope.timeToast<1){
                    $interval.cancel(timer);
                    $state.go('index');
                }
            },1000);
        });
    };


    $scope.modify = function(){
        $scope.disabled = true;
        var json = {
            "id" : $scope.shopId,
            "classify" : $scope.shopClassify,
            "tag" : $scope.shopTag,
            "title" : $scope.shopTitle,
            "description" : $scope.shopDescription,
            "imgsrc" : $scope.shopImgsrc,
            "price" : $scope.shopPrice,
            "shopCount" : $scope.shopBuycount,
            "likeCount" : $scope.shopLikecount,
            "bannerImgsrc" : $scope.shopBannerImg,
            "content" : $scope.shopContent,
            "contentImgsrc" : $scope.shopContentImgsrc
        };
        var data = {};
        data[keyid] = json;
        //console.log(json,'update',classify);
        myshopData.child(classify).update(data,function(err){
            if(err){
                console.log('update error');
                $scope.showToast = false;
                $scope.toastInfo = false;
                $scope.disabled = false;
                return;
            }
            $scope.showToast = true;
            $scope.toastInfo = true;
            $scope.timeToast = 3;
            $scope.disabled = false;
            var timer =  $interval(function(){
                $scope.timeToast--;
                if($scope.timeToast<1){
                    $interval.cancel(timer);
                    $state.go('index');
                }
            },1000);
        });
    }

}]);
