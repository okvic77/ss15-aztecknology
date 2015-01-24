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
		$scope.nuevo = {};
		var live = $firebase(chat.child('messages'))
		$scope.mensajes = live.$asArray();
		
		$scope.enviar = function(){
			
			$scope.mensajes.$add({text:$scope.nuevo.mensaje, other:true});
			

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
})(jQuery);
