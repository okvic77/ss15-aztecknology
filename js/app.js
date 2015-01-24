var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/");
var myChatsRef = myFirebaseRef.child('chats');
var myMessageRef = myFirebaseRef.child('messages');
(function($) {
	
	var app = angular.module('SteakIm', ['ui.router', 'firebase', 'famous.angular']);
	
	
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
      controller: ['$scope', '$firebase', function($scope, $firebase){
      	$scope.chats = $firebase(myChatsRef).$asArray();
      }]
    })
    .state('chat', {
      url: "/:chat",
      templateUrl: "/partials/chat.html",
      controller: ['$scope', 'live', '$firebase', function($scope, live, $firebase) {
      	
      	live.chat.set({title:live.alias});
      	
		$scope.nuevo = {};
		$scope.mensajes = $firebase(live.menssages).$asArray();
		
		
		
		$scope.enviar = function(){
			
			$scope.mensajes.$add({text:$scope.nuevo.mensaje});
			$scope.nuevo = {};
		}

		$scope.list = [1, 2, 3, 4];
		
      	$scope.alias = live.alias;
      	
      }
      ],
      resolve: {
      	live: ['$stateParams', function($stateParams){
      		var chat = $stateParams.chat;
      		console.log('Cargando firebase de '+ chat);
      		return {
      			chat: myChatsRef.child(chat),
      			menssages: myMessageRef.child(chat),
      			alias: chat
      		};
      	}]
      }
    });
}]);
})(jQuery);
