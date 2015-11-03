(function () {
    'use strict';
    var ratingApp = angular.module('ratingApp', ['ngRoute', 'ui.bootstrap', 'highcharts-ng']);

    ratingApp.resolve = {
        datasets: function ($http) {

            var tokenUrl = "https://api-mswebday.azurewebsites.net/Token";
            var creds = {};
            creds.userName = "mswebday@microsoft.com";
            creds.password = "QFU3umzF9Bhuu9!!!!";

            var authCreds = { grant_type: "password", userName: creds.userName, password: creds.password };

            return $.post(tokenUrl, authCreds, function (response) {
                var token = response.access_token;
                $http.defaults.headers.common.Authorization = 'Bearer ' + token;
            })
        }
    };
      
    ratingApp.config(['$routeProvider','$locationProvider', 
  function ($routeProvider, $locationProvider, $http) {
      $routeProvider.
        when('/feedback', {
            templateUrl: '/feedback/partials/login',
            controller: 'signinController',
            resolve: ratingApp.resolve
        }).
        when('/feedback/rating', {
            templateUrl: '/feedback/partials/rating',
            controller: 'ratingController',
            resolve: ratingApp.resolve
        }).
          when('/feedback/results', {
              templateUrl: '/feedback/partials/results',
              controller: 'resultsController',
              resolve: ratingApp.resolve
          }).
        otherwise({
            redirectTo: '/feedback'
        });
      $locationProvider.html5Mode(true)
  
  }]);

    ratingApp.controller('signinController', function ($scope, $http, $location, credStore) {

       if (credStore.valid()) {
           $location.path("/feedback/rating");
        }

        $scope.signin = function () {

            $http.post('http://api-mswebday.azurewebsites.net/api/Contacts',  {
                'Email': $scope.contactId              
            }).success(function (response) {                
                credStore.set(response.Id)
                $location.path("/feedback/rating");
            })            
            }            
        }
    )

    ratingApp.controller('ratingController', function ($scope, $http, $location, credStore) {

        $scope.contactId = credStore.get();
        
        $scope.eventId = 1;
        $scope.selectedOption = [];
        $scope.questions = [];
        $scope.submitted = false;
            $http.get('http://api-mswebday.azurewebsites.net/api/events?$filter=ConferenceId eq 2').success(function (response) {
            $scope.events = response;
        })

        $scope.getEvent = function getEvent() {
            $http.get('http://api-mswebday.azurewebsites.net/api/events/' + $scope.eventId).success(function (response) {
                $scope.eventId = response.Id;
                $scope.eventTitle = response.Title;
                $scope.eventDescription = response.Description;
            })
        }
        $http.get('http://api-mswebday.azurewebsites.net/api/currentevent').success(function (response) {
            $scope.eventId = response.Id;
            $scope.eventTitle = response.Title;
            $scope.eventDescription = response.Description;
        }).then(

        $http.get('http://api-mswebday.azurewebsites.net/api/questions').success(function (response) {
                      
            for (var i = 0; i < response.length; i++) {
                var q = {};
                q.questionId = response[i].Id;
                q.question = response[i].QuestionText;
                q.max = response[i].MaxScore;
                q.rate = response[i].MaxScore;
                q.verbatim = "";
                q.type = response[i].Type;
                if (response[i].Type == "YesNo") {
                    q.rate = 1;
                }
                $scope.questions.push(q);

                $scope.logout = function () {
                    credStore.logout();
                    $location.path("/feedback");
                }

                $scope.goToResults = function () {
                    $location.path("/feedback/results");
                }

                $scope.submitData = function () {
                    var questions = [];
                    for (var i = 0; i < $scope.questions.length; i++) {
                        var q = {
                            'ContactId': credStore.get(),
                            'EventId': $scope.eventId,
                            'QuestionId': $scope.questions[i].questionId,                            
                            'Score': $scope.questions[i].rate,
                            'Verbatim': $scope.questions[i].verbatim
                        }
                        questions.push(q);
                    }

                    var payload = {
                        'CompletedById': credStore.get(),
                        'EventId': $scope.eventId,
                        'QuestionResponses' : questions
                    }

                    $http.post('http://api-mswebday.azurewebsites.net/api/Evaluations', payload).
                          then(function (response) {
                              console.log(response)
                              $location.path("/feedback/results");
                          }, function (response) {
                              console.log("Error Posting to http://api-mswebday.azurewebsites.net/api/Evaluations")
                              console.log(payload)
                              console.log(response)
                          });                        
                   
                }
            }
        })); 

        

        $scope.eventDescription = "Session Description Placeholder";
        $scope.eventTitle = "Session Title Placeholder";
    })

    ratingApp.controller('resultsController', function ($scope, $http) {

        $scope.currentUsers = 2;
        $scope.totalVotes = 2;
        $scope.chartConfig = {
           series: [
                {
                name: "Overall how satisfied were you with this event?",
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                },
                {
                    name: "How satisfied were you with the speaker(s)?",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
                ,
                {
                    name: "How satisfied were you with the content?",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
                ,
                {
                    name: "How would to classify the technical depth of the content?",
                    data: [0, 0, 0, 0, 0, 0, 0, 0, 0]
                }

            ],
            title: {
                text: "Current Talk Ratings",

            },
            xAxis: {
                categories: ['Intro', 'Edge', 'ASP5', 'API', 'SPA', 'ES6',
                    'Real', 'Perf', 'Task']
            },
            yAxis: {
                title: {
                    text: 'Score out of 4'
                },
                plotLines: [{
                    value: 1,
                    width: 1,
                    color: '#808080'
                }]
            },           

            loading: false
        }

        $http.get('http://api-mswebday.azurewebsites.net/api/Results')
               .then(function (response) {
                   console.log(response.data)
                   $scope.totalVotes = response.data.TotalVotes
                   $scope.chartConfig.series[0].data = response.data.overall;
                   $scope.chartConfig.series[1].data = response.data.speakers;
                   $scope.chartConfig.series[2].data = response.data.content;
                   $scope.chartConfig.series[3].data = response.data.depth;
               })
        })

    ratingApp.factory('credStore', ['$window', function (win) {

                   
            function set(contactId) {
                localStorage["contactId"] = contactId;
                return true;
            }

            function logout() {
                win.localStorage["contactId"] = null;
                return true;
            }

            function valid() {
                return localStorage["contactId"] > 0
            }

            function get() {
                return localStorage["contactId"];
            };
        
            return {
                set: set,
                logout: logout,
                valid: valid,
                get: get
            };

       
        
    }]);




  

})();