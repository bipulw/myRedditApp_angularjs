var index_app = angular.module('redditApp', ['ngAnimate']);

index_app.directive("redditcontentstream", function() {
    return {
        template: ' <article class="genericArticle" ng-repeat="x in aggieFeedJson track by $index">' +
        '<header><h2><a href={{x.activity.object.ucdEdusModel.url}} target="_blank">{{x.activity.title}}</a></h2></header>' +
        '<footer class="post-info"> by {{x.activity.actor.author.displayName}}</footer>' +
        '<content><div><p>{{x.activity.object.content}}</p><p><a href={{x.activity.object.ucdEdusModel.url}} target="_blank" class="articleLink">{{x.activity.object.ucdEdusModel.url}}</a></p></div></content></article>'
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
            callbackfunction(tempArray, response.data.data.after);


        },function errorCallback(response) {
            callbackfunction(tempArray, "");
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
            callbackfunction(tempArray, response.data.data.after);
            console.log(response);

        },function errorCallback(response) {
            callbackfunction(tempArray, afterIdentifier);
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
    $scope.isLoading = true;
    $scope.afterIdentifer = "";

    redditLoadService.getInitialActivityFeed($http,function(aggiefeed,afterIdentifer){
        for(i = 0; i < aggiefeed.length; i++){
            $scope.aggieFeedJson.push(aggiefeed[i]);
        }
        $scope.afterIdentifer = afterIdentifer;
        $scope.isLoading = false;
    });

    $scope.add = function(){
        $scope.isLoading = true;
        redditLoadService.getFeedAfterIdentifier($http,$scope.afterIdentifer, function (aggiefeed ,afterIdentifer){
            for(i = 0; i < aggiefeed.length; i++){
                $scope.aggieFeedJson.unshift(aggiefeed[i]);
            }
            $scope.afterIdentifer = afterIdentifer;
            $scope.isLoading = false;
        });
    }

}



controllers = [mainController];

index_app.controller("mainController", mainController);
