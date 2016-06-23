var index_app = angular.module('redditApp', ['ngAnimate']);

index_app.directive("redditcontentstream", function() {
    return {
        template: '<article class="genericArticle" ng-repeat="x in aggieFeedJson track by $index"> <header> <h2> <a href={{x.activity.object.ucdEdusModel.url}} target="_blank">{{x.activity.title}}</a> </h2> </header> <footer class="post-info"> by {{x.activity.actor.author.displayName}}</footer> <content ng-switch ="isImageExist(x.activity.object.ucdSrcId)"> <div ng-switch-when = true ng-switch = "doesContentExist(x.activity.object.content)"> <div ng-switch-when = true> <a href={{x.activity.object.ucdEdusModel.url}} target="_blank"> <img class= "contentImageHalf" src={{imageDict[x.activity.object.ucdSrcId]}}> </a> <div class="textArea"> <p class="text">{{x.activity.object.content}}</p> <p><a href={{x.activity.object.ucdEdusModel.url}} target="_blank" class="articleLink">{{x.activity.object.ucdEdusModel.url}}</a></p> </div> <div style="clear: both"></div> </div> <div ng-switch-when = false> <a href={{x.activity.object.ucdEdusModel.url}} target="_blank"> <img class= "contentImageFull" src={{imageDict[x.activity.object.ucdSrcId]}}> </a> </div> </div> <div ng-switch-when = false> <p class="text">{{x.activity.object.content}}</p> <p><a href={{x.activity.object.ucdEdusModel.url}} target="_blank" class="articleLink">{{x.activity.object.ucdEdusModel.url}}</a></p> </div> </content> </article>'
    };
});

index_app.service('redditLoadService', function(){


    this.getInitialActivityFeed = function($http, callbackfunction){
        tempArray = []
        $http({
            method:'GET',
            url:'https://www.reddit.com/new/.json?limit=10'
        }).then( function successCallback(response) {
            console.log("inside the response callback from service");
            console.log(response);
            for(i = 0; i < response.data.data.children.length; i++) {
                tempArray.push(convertToAggieFeedActivityJSON(response.data.data.children[i]));
            }
            callbackfunction(tempArray, response.data.data.after, response.data.data.children);


        },function errorCallback(response) {
            callbackfunction(tempArray, "",[]);
            console.log(response);
        });


    }

    this.getFeedAfterIdentifier = function($http, afterIdentifier, callbackfunction){
        tempArray = []
        $http({
            method:'GET',
            url:'https://www.reddit.com/new/.json?limit=10'+'&after='+afterIdentifier
        }).then( function successCallback(response) {
            console.log("inside the add response callback from service");
            for(i = 0; i < response.data.data.children.length; i++) {
                tempArray.push(convertToAggieFeedActivityJSON(response.data.data.children[i]));
            }
            callbackfunction(tempArray, response.data.data.after, response.data.data.children);
            console.log(response);

        },function errorCallback(response) {
            callbackfunction(tempArray, afterIdentifier, response.data.data.children);
            console.log(response);
        });


    }

    function convertToAggieFeedActivityJSON(redditItem){
        tempActivity = {
            "activity" : {
                "icon": " icon-book",
                "actor": {
                    "id" : "department identifier",
                    "objectType": "person",
                    "displayName": "Reddit Feed",
                    "author" : {
                        "id" : "kName",
                        "displayName" : redditItem.data.author
                    },
                    "image" : {
                        "color" : "#fabc00"
                    }
                },
                "verb": "post",
                "title": redditItem.data.title,
                "object": {
                    "ucdSrcId" : redditItem.data.id,
                    "objectType": "notification",
                    "content": redditItem.data.selftext,
                    "ucdEdusModel" : {
                        "url": redditItem.data.url,
                        "urlDisplayName": "Source",
                    }
                },
                "to" : [
                    {
                        "id": "public",
                        "g": true,
                        "i": false
                    }
                ],
                "ucdEdusMeta" : {
                    "labels" : ["~student-life"]
                }
            }
        }
        return tempActivity;
    }


});

function mainController($scope, $http, redditLoadService){
    console.log("inside the mainController");
    $scope.aggieFeedJson = [];
    $scope.thumbNailDict = {};
    $scope.imageDict = {};
    $scope.isLoading = true;
    
    
    $scope.afterIdentifer = "";

    redditLoadService.getInitialActivityFeed($http,function(aggiefeed,afterIdentifer, redditJSONArray){
        for(i = 0; i < aggiefeed.length; i++){
            addImageUrls(redditJSONArray[i]);
            $scope.aggieFeedJson.push(aggiefeed[i]);
        }
        console.log($scope.thumbNailDict);
        console.log($scope.imageDict);
        $scope.afterIdentifer = afterIdentifer;
        $scope.isLoading = false;
        setInterval(function(){ $scope.add() }, 60000);
    });

    $scope.add = function(){
        $scope.isLoading = true;
        redditLoadService.getFeedAfterIdentifier($http,$scope.afterIdentifer, function (aggiefeed ,afterIdentifer, redditJSONArray){
            for(i = 0; i < aggiefeed.length; i++){
                addImageUrls(redditJSONArray[i]);
                $scope.aggieFeedJson.unshift(aggiefeed[i]);
            }
            $scope.afterIdentifer = afterIdentifer;
            $scope.isLoading = false;
        });
    }

    $scope.isImageExist = function (imageId) {
        console.log($scope.imageDict[imageId]);
        if($scope.imageDict[imageId] != undefined) {
            console.log("image true");
            return true;
        }else{
            console.log("image false");
            return false;
        }

    }

    $scope.doesContentExist = function (content){
        if(content.length > 0){
            console.log("content true");
            return true
        }else{
            console.log("content false");
            return false
        }
    }

    function addImageUrls(redditJson){
        console.log(redditJson);
        thumbnailUrl = redditJson.data.thumbnail;
        id = redditJson.data.id;
        if(thumbnailUrl != undefined && IsURL(thumbnailUrl)){
            $scope.thumbNailDict[id] = thumbnailUrl;
        }
        previewObj =  redditJson.data.preview;
        if (previewObj != undefined && IsURL(previewObj.images[0].source.url)){
            $scope.imageDict[id] = previewObj.images[0].source.url;
        }
    }

    function IsURL(s) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return regexp.test(s);
    }



}



controllers = [mainController];

index_app.controller("mainController", mainController);
