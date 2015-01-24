var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/"),
	myChatsRef = myFirebaseRef.child('chats'),
	myPinsRef = myFirebaseRef.child('pins'),
	myMessageRef = myFirebaseRef.child('messages');


(function($) {


	var app = angular.module('SteakIm', ['ui.router', 'firebase', 'famous.angular', 'lumx']);

	app.factory('user', ['$timeout', function($timeout) {
		var ok = {
			main: undefined
		};
		var handleLogin = function(error, authData) {
			if (error || !authData) {
				ok.error = error;;
				ok.response = undefined;
				ok.main = undefined;
			}
			else {
				ok.error = undefined;
				ok.response = authData;


				ok.main = {
					name: authData.facebook.cachedUserProfile.first_name,
					namefull: authData.facebook.displayName,
					image: authData.facebook.cachedUserProfile.picture.data.url
				}



				//console.log("Authenticated successfully with payload:", authData);
			}
		}

		//myFirebaseRef.onAuth(handleLogin);
		ok.login = function() {
			myFirebaseRef.authWithOAuthPopup("facebook", function(err, response) {
				$timeout(function() {
					handleLogin(err, response);
				});
			});
		}

		ok.logout = function() {
			myFirebaseRef.unauth();
			ok.main = undefined;
		};


		handleLogin(undefined, myFirebaseRef.getAuth());




		return ok;


	}]);

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
				controller: ['$scope', '$firebase', 'user', function($scope, $firebase, user) {
					$scope.chats = $firebase(myChatsRef).$asArray();

					$scope.user = user.main;
					$scope.login = function() {
						user.login();
					}


				}]
			})
			.state('chat', {
				url: "/:chat",
				templateUrl: "/partials/chat.html",
				controller: ['$scope', 'live', '$firebase', 'user', '$famous', function($scope, live, $firebase, user, $famous) {

					var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;


					var EventHandler = $famous['famous/core/EventHandler'];
					$scope.eventHandler = new EventHandler();


					//var EventHandler = $famous['famous/core/EventHandler'];
					// $scope.eventHandler = new EventHandler();
					// $scope.list = [{
					//   content: "Awesome content"
					// },{
					//   content: "Scroll vertically to see more awesome content"
					// },{
					//   content: "Famo.us/angular rocks!"
					//   }
					// ];

					// $scope.options = {
					//   scrollViewOuter: {
					//     direction: 0,
					//     paginated: true
					//   },
					//   scrollViewInner :{
					//     direction: 1
					//   }
					// };


					live.chat.set({
						title: live.alias
					});

					$scope.nuevo = {};
					$scope.mensajes = $firebase(live.menssages).$asArray();
					$scope.pins = $firebase(live.pins).$asArray();

					$scope.pin = {
						nuevo: function() {
							var insert = {
								text: 'ok'
							}

							insert.user = user.main;
							$scope.pins.$add(insert);
						}
					}
					
					

    $scope.grids = [{bgColor: "orange"}, {bgColor: "red"}, {bgColor: "green"}, {bgColor: "yellow"}];




					$scope.data = {
						name: 'dsadas',
						t: 1
					};
					$scope.grids = [{
						bgColor: "orange"
					}, {
						bgColor: "red"
					}, {
						bgColor: "green"
					}, {
						bgColor: "yellow"
					}];


					$scope.enviar = function() {
						var insert = {
							text: $scope.nuevo.mensaje
						};
						insert.user = user.main;
						$scope.mensajes.$add(insert);
						$scope.nuevo = {};
					}

					$scope.remover = function(mensaje) {
						$scope.mensajes.$remove(mensaje);
					}

					$scope.list = [1, 2, 3, 4];

					$scope.alias = live.alias;

				}],
				resolve: {
					live: ['$stateParams', function($stateParams) {
						var chat = $stateParams.chat;
						console.log('Cargando firebase de ' + chat);
						return {
							chat: myChatsRef.child(chat),
							menssages: myMessageRef.child(chat),
							pins: myPinsRef.child(chat),
							alias: chat
						};
					}]
				}
			});
	}]);
})(jQuery);
