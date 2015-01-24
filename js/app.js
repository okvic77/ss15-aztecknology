var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/");
(function($) {
	
	var app = angular.module('SteakIm', ['ui.router', 'firebase']);
	
	
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");
  //
  // Now set up the states
  $stateProvider
    .state('inicio', {
      url: "/",
      templateUrl: "/partials/home.html",
      controller: ['$scope', function($scope){
      	
      }]
    })
    .state('chat', {
      url: "/:chat",
      templateUrl: "/partials/chat.html",
      controller: ['$scope', '$stateParams', function($scope, $stateParams) {
		
		
		$scope.enviar = function(){
			console.log('Envio');
		}
		
		$scope.list = [1, 2, 3, 4];
		
      	$scope.alias = $stateParams.chat;
      	
      }
      ],
      resolve: {
      	chatFirebase: ['$firebase', '$stateParams', function($firebase, $stateParams){
      		var chat = $stateParams.chat;
      		console.log(chat);
      		//var ref = myFirebaseRef.child();
      		return 'ok';
      		//console.log($stateParams);
      	}]
      }
    });
}]);
	
	
	// Firebase
	
	/*myFirebaseRef.child("title").on("value", function(snapshot) {
		$('#live').text(snapshot.val());
	});*/
	myFirebaseRef.child("location/state").on("value", function(snapshot) {
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