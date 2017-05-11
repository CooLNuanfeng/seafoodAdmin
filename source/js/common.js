// 图床  https://postimage.io/
var commonModule = angular.module('commonModule',[]);

commonModule.value('config',{
    'classify' : {
        'fish' : '鱼类',
        'shrimpcrabs' : '虾蟹',
        'shellfish' : '参贝',
        'dry' : '干货',
        'other' : '其他'
    },
    'wilddog' : {
        syncURL: "https://wxappnf.wilddogio.com" //输入节点 URL
    }
})

commonModule.directive('navHeader',function(){
    return{
        restrict : 'AE',
        scope : {
            selected : '@'
        },
        templateUrl : './templete/nav.html',
        link : function(scope,elem,attr){
        }
    }
});


// commonModule.factory('wilddogHttp',['config',function(config){
//     wilddog.initializeApp(config.wilddog);
//     return {
//         get : function(database){
//             var myshopData = wilddog.sync().ref(database);
//             myshopData.on('value',function(snapshot){
//                 return snapshot.val();
//             });
//         }
//     }
// }]);


commonModule.service('arrDataPagition',function(){

    this.init = function(arr,cur,size){
        var newArr = [];
        angular.forEach(arr,function(item,index){
            newArr.push(item);
        });
        return newArr.splice((cur-1)*size,size);
    }
});


commonModule.service('selectOptions',['config',function(config){
    this.init = function(){
        var arr = [];
        angular.forEach(config.classify,function(item,key){
            var json = {
                'key' : key,
                'value' : item
            };
            arr.push(json);
        });
        return arr;
    }
}]);

commonModule.filter('classify',['config',function(config){
    return function(str){
        return config.classify[str];
    }
}])
