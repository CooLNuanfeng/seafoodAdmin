var myApp = angular.module('myApp',['ui.router','ui.bootstrap','wilddog','commonModule','controllerModule']);

myApp.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise('/index');
    $stateProvider.state('index',{
        url : '/index',
        templateUrl : './templete/main.html'
    })
    .state('detail',{
        url : '/detail',
        templateUrl : './templete/detail.html'
    })
    .state('order',{
        url : '/order',
        templateUrl : './templete/order.html'
    })
}]);
