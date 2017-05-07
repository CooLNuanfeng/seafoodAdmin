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

commonModule.filter('classify',['config',function(config){
    return function(str){
        return config.classify[str];
    }
}])
