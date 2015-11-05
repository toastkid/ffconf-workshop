#Create our base HTML file
Inside the lab-javascript foldercreate a new html file and call it index.html. 
Into that file we wat to put some HTML boiler plate.

#Add our boiler plate
To add our base CSS files and HTML layout paste the code below into the newly created file. This file links to the css library bootstrap 
(a responsive framework used to layout content) and our own local css file called feedback.css 
which contains some style rules for our application.

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<base href="/">
		<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">
		<link href="../index_files/feedback.css" rel="stylesheet" />
	</head>
	<body>
		<div class="bg-wrap">
			<div class="content" role="main">
				<h1>My Feedback App</h1>
				<section>
					<div class="container">
						<div ng-app>
							The App is going to go {{'here' + '!'}}
						</div>
					</div>
				</section>
			</div>     
		</div>
	</body>
	</html> 
	
You will see that one of the div's has a attribute ng-app. This is a directive which 
tells angular where to create the application.

#The required Libraries

Add the following JavaScript libraries to the HTML page just before the closing body tag.
	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="../lib/angular/angular.js"></script> 
    <script src="../lib/angular-route/angular-route.min.js"></script>  
    <script src="../lib/angular-bootstrap/ui-bootstrap.js"></script>
    <script src="../lib/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="../lib/highcharts-release/highcharts.js"></script>
    <script src="../lib/highchart-ng/dist/highcharts-ng.min.js"></script>
    <script src="app.js"></script>
	
If you load the app you should now notice that Angular has kicked in and the {{'here' + '!'}} template 
has now been populated.

As well as linking to a number of 3rd party Libraries, this also links to a JavaScript library 
that currently dosen't exist: app.js. So let's create this in the lab-angular folder.

#Base JavaScript
To the newly created app.js add the following boiler plate code:

	(function () {
		'use strict';
		var ratingApp = angular.module('ratingApp');
	})();

Also locate the ng-app in your HTML file and change it to:

	ng-app="ratingApp"

#Dependencies
Our app has a number of 3rd party libs that it depends on: 

 - ngRoute (A routing plugin from the Angular team)
 - ui.bootstrap (We use this to create the star rating control later on)
 - highcharst-ng (This is used to create charts)
 
To let angular know that they are dependencies we can pass them as an array when we create an angular module
for our rating app. Replace the current line of code that creates the ratingApp variable with this line:

	var ratingApp = angular.module('ratingApp', ['ngRoute', 'ui.bootstrap', 'highcharts-ng']);

#Routing
Our app will use Angular routing. To set up routing we need to configure certain routes:

	function ($routeProvider, $locationProvider, $http) {
			$routeProvider.
				when('/lab-angular', {
					templateUrl: '/lab-angular/partials/login.html',
					controller: 'signinController'
				})
				
			$locationProvider.html5Mode(true)
		
		}]);
		
You might notice that templateURL, points to a file that dosen't exist. Next we will need to add a new folder called partials. Inside that folder add a file called login.html 
and add the following markup:

	<div class="row">
		<div class="col-md-12">
			<h1>Hello</h1>
			<p>Please enter an email to sign in</p>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
	
			<form>
				<div class="form-group">
					<input type="text" id="contactId" ng-model="contactId" class="form-control" />
				</div>
				<button ng-click="signin()" class="btn btn-primary">Sign In</button>
			</form>
	
		</div>
	</div>

Next we will add our signinController.

#Controllers

You we need to add a controller using the following code which you you should add to add to app.js

    ratingApp.controller('signinController', function ($scope, $http, $location, credStore) {

       if (credStore.valid()) {
           $location.path("/lab-angular/rating");
        }

        $scope.signin = function () {

            $http.post('http://api-mswebday.azurewebsites.net/api/Contacts',  {
                'Email': $scope.contactId              
            }).success(function (response) {                
                credStore.set(response.Id)
                $location.path("/lab-angular/rating");
            })            
            }            
        }
    )

On the first line of the code above you might notice that we 
rely on a dependency called credStore. credStore currently dosen't exist, 
but it's service that we use to store the users credentials
in local storage. 

Add the following code to create the credStore service.

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
		
Now when we add credStore as a depedency Angular will create a new credStore and inject it into the controller. This means that we 
can reference a variable called credStore in the signinController and it will be a version of whatever was created in the 
factory.

If you look at the code inside 
signinController you will notice it checks credStore and if it contains a valid user 
then it will forward
the user onto another route /lab-angular/rating.

We now need to configure the other routes and the other controllers.

However, before we do that we need to fix a security issue.

#Resolve
Before you can call the API you must get a security token. Rather than setting a token everytime we call $http.post we can do it globally 
with the code  $http.defaults.headers.common.Authorization = 'Bearer ' + token;

To ensure that this code is run before we call an API we will do something a little hacky and make sure that the ratingApp.resolve function below
is called everytime a user goes to a specific route.

Firstly add the following function:

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
	
Next we will add in the other routes that the app requires and we will set a property called resolve to poit to ratingApp.resolve. 
This will ensure that the resolve function is always called before the route is navigated to.


	ratingApp.config(['$routeProvider','$locationProvider', 
	function ($routeProvider, $locationProvider, $http) {
 	$routeProvider.
        when('/lab-angular', {
            templateUrl: '/lab-angular/partials/login.html',
            controller: 'signinController',
            resolve: ratingApp.resolve
        }).
        when('/lab-angular/rating', {
            templateUrl: '/lab-angular/partials/rating.html',
            controller: 'ratingController',
            resolve: ratingApp.resolve
        }).
        when('/lab-angular/results', {
            templateUrl: '/lab-angular/partials/results.html',
            controller: 'resultsController',
            resolve: ratingApp.resolve
        }).
        otherwise({
            redirectTo: '/lab-angular'
        });
    $locationProvider.html5Mode(true)
	}]);

#Partial
Lets add the final 2 views that we will require. First create a file called rating.html 
and add the following code to it:

	<div>
		<div class="row">
	
			<div class="col-md-9">
				<h1>{{eventTitle}}</h1>      
			</div>
			<div class="col-md-3">
				<label for="repeatSelect">Change Session:</label>
				<select name="repeatSelect" id="repeatSelect" ng-model="eventId" ng-change="getEvent()">
					</>
					<option ng-repeat="option in events" value="{{option.Id}}">{{option.Title}}</option>
				</select>
			</div>
			<div class="col-md-12">
				<h3>{{eventDescription}}</h3>
			</div>
		</div>
		<hr />
		<form class="form-horizontal" ng-hide="submitted" >
			<div ng-repeat="q in questions">
	
				<div class="form-group">
					<label for="inputEmail3" class="col-sm-3 control-label">{{q.question}}</label>
					<div class="col-sm-9">
						<div ng-show="q.type == 'Rating'">
							<rating ng-model="q.rate" max="q.max" readonly="isReadonly"></rating>
							<b>(<i>Rate:</i> {{q.rate}})</b>
						</div>
						<div ng-show="q.type == 'YesNo'">
							Yes
							<input type="radio" ng-model="q.rate" value="2">
							No
							<input type="radio" ng-model="q.rate" value="1">
						</div>
						Comments: <textarea class="form-control" ng-model="q.verbatim" rows="3"></textarea>
	
					</div>
				</div>
				<hr />
			</div>
			<div class="form-group">
				<div class="col-sm-offset-3 col-sm-9">
					<button ng-hide="submitted" class="btn btn-primary" ng-click="submitData()">Submit Rating</button>
					<button ng-click="logout()" class="btn btn-secondary">Log Out</button>
					<div ng-show="submitted">
						Thanks for submitting feedback. Click here here to see results<br />
						<button ng-click="goToResults()">See Results</button>
					</div>
				</div>
			</div>
		</form>
	</div>

Then add a file called results.html and add the following code to it:

	<div class="row">
		<div class="col-md-12">
			<h1>Microsoft Web Platform by the Numbers</h1>
		</div>
	</div>
	
	<div class="row">
		<div class="col-md-10">
			<highchart id="chart1" config="chartConfig"></highchart>
			</div>
			<div class="col-md-2">
				<div class="scorebox">
					<div class="title">Total Votes</div>
					<div class="score">{{totalVotes}}</div>
				</div>
			</div>
	</div>
	
#Controllers
If you run the app, you will now be able to login but the rating page will be a mess. This is because we have't added the controllers.

Here is the code for the rating 
and results controller 
add this to app.js 
underneath the signinController

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
		

#Next

The code is very hacky and contains a number of bugs
Why not work through it and see if 
you can improve the way the app is 
put together.