var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/");
var myChatsRef = myFirebaseRef.child('chats');
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
      controller: ['$scope', '$stateParams', 'liveChat', function($scope, $stateParams, liveChat) {
		
		
		$scope.enviar = function(){
			
			liveChat.set('ok', true);
			
			console.log('Envio');
		}

		$scope.list = [1, 2, 3, 4];
		
      	$scope.alias = $stateParams.chat;
      	
      }
      ],
      resolve: {
      	liveChat: ['$firebase', '$stateParams', function($firebase, $stateParams){
      		var chat = $stateParams.chat;
      		console.log('Cargando firebase de '+ chat);
      		var ref = myChatsRef.child(chat);
      		return $firebase(ref);
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