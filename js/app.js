var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/");
(function($) {
	
	var app = angular.module('SteakIm', ['ui.router']);
	
	
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('state1', {
      url: "/state1",
      templateUrl: "partials/state1.html"
    })
    .state('state1.list', {
      url: "/list",
      templateUrl: "partials/state1.list.html",
      controller: function($scope) {
        $scope.items = ["A", "List", "Of", "Items"];
      }
    })
    .state('state2', {
      url: "/state2",
      templateUrl: "partials/state2.html"
    })
    .state('state2.list', {
      url: "/list",
      templateUrl: "partials/state2.list.html",
      controller: function($scope) {
        $scope.things = ["A", "Set", "Of", "Things"];
      }
    });
}]);
	
	// Firebase
	
	myFirebaseRef.child("title").on("value", function(snapshot) {
		$('#live').text(snapshot.val());
	});
	//console.log("test");
})(jQuery);

function test(demo){
		myFirebaseRef.set({
		title: demo,
		author: "Firebase",
		location: {
			city: "San Francisco",
			state: "California",
			zip: 94103
		}
	});
}