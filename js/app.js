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
      controller: ['$scope', '$stateParams', 'chat', '$firebase', function($scope, $stateParams, chat, $firebase) {
		
		$scope.mensajes = $firebase(chat.child('messages')).$asArray();
		
		$scope.enviar = function(){
			
			
			
			liveChat.$add('ok', true);
			
			console.log('Envio');
		}

		$scope.list = [1, 2, 3, 4];
		
      	$scope.alias = $stateParams.chat;
      	
      }
      ],
      resolve: {
      	chat: ['$stateParams', function($stateParams){
      		var chat = $stateParams.chat;
      		console.log('Cargando firebase de '+ chat);
      		return myChatsRef.child(chat);
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