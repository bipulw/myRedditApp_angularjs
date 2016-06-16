/**
 * Created by bipulwagle on 6/15/16.
 */
var index_app = angular.module('redditApp', ['ngAnimate']);
// b688268498564fb30ca10d1f6506c590
// api.openweathermap.org/data/2.5/forecast?zip=94040,us&APPID=b688268498564fb30ca10d1f6506c590

function mainController($scope, $http){
    console.log("inside the mainController");
    $scope.aggieFeedJson = [];
    $scope.isLoading = true;
    $http({
        method:'GET',
        url:'https://www.reddit.com/new/.json?limit=10'
    }).then( function successCallback(response) {
        console.log("inside the response callback");
        $scope.isLoading = false;
        $scope.posts = response.data.data.children;
        $scope.timeafter = response.data.data.after;
        console.log(response);

    },function errorCallback(response) {
        $scope.isLoading = false;
        console.log(response);
    });
    
    $scope.add = function () {
        console.log($scope.timeafter);
        $scope.isLoading = true;
        $http({
            method:'GET',
            url:'https://www.reddit.com/new/.json?limit=10'+'&after='+$scope.timeafter
        }).then( function successCallback(response) {
            console.log("inside the response callback");
            $scope.isLoading = false;
            for(i = 0; i < response.data.data.children.length; i++){
                $scope.posts.unshift(response.data.data.children[i]);
            }
            $scope.timeafter = response.data.data.after;
            console.log(response);
        },function errorCallback(response) {
            $scope.isLoading = false;
            console.log(response);
        });
    }
    

};



controllers = [mainController];

index_app.controller("mainController", mainController);
