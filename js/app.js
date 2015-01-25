var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/"),
	myChatsRef = myFirebaseRef.child('chats'),
	myPinsRef = myFirebaseRef.child('pins'),
	myMessageRef = myFirebaseRef.child('messages');


(function($) {

	//
	// var Transitionable = $famous['famous/transitions/Transitionable'];
	// var Easing = $famous['famous/transitions/Easing'];

	// $scope.boxTransitionable = new Transitionable([0, 0, 0]);

	// $scope.animate = function() {
	// 	$scope.boxTransitionable.set([200, 300, 0], {
	// 		duration: 2000,
	// 		curve: Easing.inOutBack
	// 	});
	// };
	//






	var app = angular.module('SteakIm', ['ui.router', 'firebase', 'famous.angular', 'lumx', 'angularMoment']);


	app.constant('angularMomentConfig', {
		//preprocess: 'unix', // optional
		timezone: 'Europe/London' // optional
	});

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

	// app.directive('masonry', function() {
	// 	console.log('LOAD');
	// 	// 	var container = document.querySelector('#miboardspace');
	// 	// var msnry = new Masonry( container, {
	// 	//   // options...
	// 	//   itemSelector: '.item',
	// 	//   columnWidth: 200
	// 	// });
	// 	var link = function(scope, element, attrs) {

	// 		// 		scope.$watch(attrs.items, function(value) {
	// 		//      console.log('okas');
	// 		//     }, true);


	// 		// 		var newElement = document.createElement('div');
	// 		// 		element.replaceWith(newElement);

	// 		// var msnry = new Masonry( newElement, {
	// 		//   // options...
	// 		//   itemSelector: '.item',
	// 		//   columnWidth: 200
	// 		// });

	// 		// //msnry.appended( elems );
	// 		// angular.forEach(scope.items, function(value, key) {
	// 		//   var item = {
	// 		//   	dom: document.createElement('div')
	// 		//   };

	// 		//   console.log(value, key)

	// 		// });


	// 		// 		console.log('LINK', newElement, scope);
	// 	}

	// 	return {
	// 		restrict: 'E',
	// 		transclude: true,
	// 		template: '<div class="boxfixed" ng-transclude></div>',
	// 		//link: link,
	// 		scope: {
	// 			items: '=imPins'
	// 		},
	// 		controller: ['$scope', '$element', '$attrs', '$transclude', '$timeout', function($scope, $element, $attrs, $transclude, $timeout) {
	// 			//console.log('CONTROLLER', $scope);






	// 			//var newElement = document.createElement('div');
	// 			// 				var newElement = $('<div class="boxfixed" style="width:100%;" ng-transclude></div>');
	// 			// 				$element.replaceWith(newElement);


	// 			// var container = jQuery($element.context);
	// 			// var prueba = container.masonry({
	// 			// 	itemSelector: '.item',
	// 			// 	containerStyle: null,
	// 			// 	columnWidth: 60,
	// 			// 	"gutter": 10
	// 			// });
	// 			// console.log($element);

	// 			// $scope.items.$watch(function(item) {
	// 			// 	if (item.event == 'child_added') {

	// 			// 		var insert = $('<div class="item" style="width:50px;height: 100px;">Esto es una prueba</div>');

	// 			// 		container.append(insert);
	// 			// 		//container.masonry();
	// 			// 		prueba.masonry('appended', insert);
	// 			// 	}
	// 			// });


	// 			// $timeout(function(){
	// 			// 	$(window).trigger('resize')
	// 			// }, 1000);


	// 			// var msnry = new Masonry(newElement, {
	// 			// 	itemSelector: '.item',
	// 			// 	columnWidth: 200
	// 			// });


	// 			//var container = newElement.querySelector('.masonry');

	// 			// $scope.items.$watch(function(item) {

	// 			// 	if (item.event == 'child_added') {



	// 			// 		var newPin = document.createElement('div');
	// 			// 		newPin.className = '.item';
	// 			// 		msnry.addItems([newPin]);
	// 			// 		console.log('Inserted', item);
	// 			// 	}


	// 			// });


	// 			//console.log(newElement, $scope.items, $scope, 'CONTROLLER');

	// 			// Controller code goes here.
	// 		}]

	// 		//template: 'Name: {{customer.name}} Address: {{customer.address}}'
	// 	};
	// })

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
					console.log($scope.chats);
					$scope.user = user.main;
					$scope.login = function() {
						user.login();
					}


				}]
			})
			.state('chat', {
				url: "/:chat",
				templateUrl: "/partials/chat.html",
				controller: ['$scope', 'live', '$firebase', 'user', '$famous', '$interval', function($scope, live, $firebase, user, $famous, $interval) {





					//var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;

					$scope.tmp = {};
					$scope.guardarPin = function(pin) {
						console.log('Pruebas guardar');
						//pin.tipo = $scope.tmp.tipo;
						$scope.pins.$save(pin);
					}

					// var EventHandler = $famous['famous/core/EventHandler'];
					// $scope.eventHandler = new EventHandler();
					//$scope.eventHandler2 = new EventHandler();


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





					var usersss = live.chat.child('online');
					var me = usersss.child(user.response.uid);


					live.chat.child('title').set(live.alias);

					//var cleanOld = function(){
					//var timestamp = new Date();
					//timestamp.setDate(timestamp.getDate()-2);
					// timestamp -= 1000*15;
					// usersss.endAt(timestamp).on("child_added", function(snap) {
					//   //snap.ref().remove();
					// }); 


					//}				


					var reporter = function reporter() {
						me.set({
							online: true,
							time: Date.now(),
							usuario: user.main
						});



					};





					var myReporter = $interval(reporter, 10000);
					reporter();




					$scope.usuariosOnline = $firebase(usersss).$asArray();

					$scope.nuevo = {};
					$scope.mensajes = $firebase(live.menssages).$asArray();
					//$scope.usuarioActivo = $firebase(live.usuarioActivo).$asArray();
					$scope.pins = $firebase(live.pins).$asArray();
					$scope.pin = {
						nuevo: function() {
							var insert = {
								text: 'ok',
								tipo: 'prueba'
							}

							insert.user = user.main;
							$scope.pins.$add(insert);
						}
					}


					$scope.log = function() {
						console.log('ksdasdsa');
					}


					$scope.enviar = function() {
						var insert = {
							text: $scope.nuevo.mensaje,
							//date: moment().format('x')
							date: Date.now()
						};
						insert.user = user.main;
						$scope.mensajes.$add(insert);
						$scope.nuevo = {};
					}

					$scope.remover = function(mensaje) {
						$scope.mensajes.$remove(mensaje);
					}


					$scope.quitarPin = function(pin) {
						console.log('ELIMINADO');
						$scope.pins.$remove(pin);
					}

					$scope.salirSala = function(sala) {
						$scope.chats.$remove(sala);
					}

					$scope.cambiarPin = function(pin) {
						console.log('Prienas');
					}

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



	app.controller('PinView', ['$scope', function($scope) {
		var pin;
		$scope.tipos = {
			'votaciones': {
				'title': 'Votación'
			},
			'mensaje': {
				'title': 'Mensaje'
			},
			'tarea': {
				'title': 'Tarea'
			},
			'cuentas': {
				'title': 'Cuentas'
			}
		};

		$scope.tipo = 'votaciones';
		$scope.data = {
			tipo: ''
		}

		$scope.updateTipo = function(tipo) {
			$scope.tipo = angular.copy(tipo);
			console.log('SET TYPE');
		}

		$scope.init = function(pin, pins) {
			$scope.pins = pins;
			$scope.data = pin;
			$scope.tipo = pin.tipo;
		}

		$scope.guardarPin = function() {
			console.log('DEMO');
			$scope.pins.$save($scope.data);
			
		}

	}])


})();
