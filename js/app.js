var myFirebaseRef = new Firebase("https://steakim.firebaseio.com/"),
	myChatsRef = myFirebaseRef.child('chats'),
	myPinsRef = myFirebaseRef.child('pins'),
	myMessageRef = myFirebaseRef.child('messages');


(function($) {
	$.embedly.defaults.key = '1ecc9b4c141b42e989a0a107f4744296';
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
		var motor_ = undefined;
		var handleLogin = function(error, authData) {
			if (error || !authData) {
				ok.error = error;
				ok.response = undefined;
				ok.main = undefined;
			}
			else {
				ok.error = undefined;
				ok.response = authData;


				var perfil = authData.provider ? authData[authData.provider] : authData.cachedUserProfile;

				ok.main = {
					name: perfil.displayName,
					image: perfil.cachedUserProfile.image || perfil.cachedUserProfile.picture || perfil.cachedUserProfile.profile_image_url,
					id: authData.uid || motor_ + ':' + perfil.id
				}

				if (angular.isObject(ok.main.image)) ok.main.image = ok.main.image.data.url;



				//console.log("Authenticated successfully with payload:", authData);
			}
		}

		//myFirebaseRef.onAuth(handleLogin);
		ok.login = function(engine) {
			motor_ = engine;
			switch (engine) {
				case 'facebook':
					myFirebaseRef.authWithOAuthPopup("facebook", handleLogin);
					break;
				case 'twitter':
					myFirebaseRef.authWithOAuthPopup("twitter", handleLogin);
					break;
				case 'google':
					myFirebaseRef.authWithOAuthPopup("google", handleLogin);
					break;
				default:
					// code
					break;
			}


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

	app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
		//
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/inicio");
		
		if (window.__env && window.__env.HTML5) {
			console.log('We are in divshot');
			$locationProvider.html5Mode(true);
		}
		//
		// Now set up the states


		$stateProvider
			.state('inicio', {
				url: "/inicio",
				templateUrl: "/partials/home.html",
				controller: ['$scope', '$firebase', 'user', '$famous', '$timeout', function($scope, $firebase, user, $famous, $timeout) {

					//
					var View = $famous['famous/core/View'];
					var Engine = $famous['famous/core/Engine'];
					var Surface = $famous['famous/core/Surface'];
					var Transform = $famous['famous/core/Transform'];
					var StateModifier = $famous['famous/modifiers/StateModifier'];
					var Transitionable = $famous['famous/transitions/Transitionable'];
					var Easing = $famous['famous/transitions/Easing'];

					$scope.box = {
						translate: new Transitionable([0, 500, 0]),
						opacity: new Transitionable(.3)
					};
					$scope.animateBox = function() {
						$scope.box.translate.set([0, 0, 0], {
							duration: 800,
							curve: 'easeInOut'
						});
						$scope.box.opacity.set(1, {
							duration: 800,
							curve: 'easeInOut'
						});
					};

					$timeout(function() {
						$scope.animateBox();
					});

					$scope.masterView = new View();

					var surface = new Surface({
						size: [100, 100],
						origin: [0, 0],
						properties: {
							color: 'white',
							textAlign: 'center',
							backgroundColor: '#FA5C4F'
						}
					});

					var stateModifier = new StateModifier();

					$scope.masterView.add(stateModifier).add(surface);

					/*
					stateModifier.setTransform(
						Transform.translate(0, 0, 0), {
							duration: 0,
							curve: 'easeInOut'
						}
					);
					*/

					stateModifier.setTransform(
						Transform.translate(screen.width / 2, screen.height / 2, 0), {
							duration: 1500,
							curve: 'easeInOut'
						}
					);
					//



					$scope.chats = $firebase(myChatsRef).$asArray();
					console.log($scope.chats);
					$scope.user = user.main;
					$scope.login = function(motor) {
						user.login(motor);
					}


				}]
			})
			.state('chat', {
				url: "/chat/:chat",
				templateUrl: "/partials/chat.html",
				controller: ['$scope', 'live', '$firebase', 'user', '$famous', '$interval', '$anchorScroll', '$location', '$timeout', function($scope, live, $firebase, user, $famous, $interval, $anchorScroll, $location, $timeout) {


					//console.log($element);


					//var _docHeight = (document.height !== undefined) ? document.height : document.body.offsetHeight;

					$scope.tmp = {};
					// $scope.guardarPin = function(pin) {
					// 	console.log('Pruebas guardar');
					// 	//pin.tipo = $scope.tmp.tipo;
					// 	$scope.pins.$save(pin);
					// }

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



					live.chat.child('title').set(live.alias);

					//var cleanOld = function(){
					//var timestamp = new Date();
					//timestamp.setDate(timestamp.getDate()-2);
					// timestamp -= 1000*15;
					// usersss.endAt(timestamp).on("child_added", function(snap) {
					//   //snap.ref().remove();
					// }); 


					//}				





					$scope.usuariosOnline = $firebase(usersss).$asArray();

					$scope.nuevo = {};
					
					live.menssages.on('child_added', function(snap, prevChild){
						
						$location.hash(snap.key());
						$anchorScroll();

					});
					//$firebase(live.menssages).$bindTo($scope.mensajes, "data");
					
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
							date: Firebase.ServerValue.TIMESTAMP
						};
						insert.user = user.main;
						$scope.mensajes.$add(insert).then(function(snap){
							
								$location.hash(snap.key());
						$timeout(function(){
							$anchorScroll();
						});
						});
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
					live: ['$stateParams', 'user', function($stateParams, user) {
						var chat = $stateParams.chat;


						var chatRef = myChatsRef.child(chat);

						var me = chatRef.child('online').child(user.response.uid);

						me.set({
							online: true,
							time: Date.now(),
							usuario: user.main
						});






						me.onDisconnect().remove();

						console.log('Cargando firebase de ' + chat);
						return {
							chat: chatRef,
							menssages: myMessageRef.child(chat),
							pins: myPinsRef.child(chat),
							alias: chat
						};
					}]
				},
				onExit: ['live', function(live) {
					console.log('EXIT');
				}],
				onEnter: ['live', function(live){
					
					
					
					

				}]
			});
	}]);



	app.controller('PinView', ['$scope', function($scope) {
		

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
		

		
		if (!$scope.pink.opciones) $scope.pink.opciones = [];
		if (!$scope.pink.concepto) $scope.pink.concepto = [];

		$scope.guardarPin = function(pin) {
			$scope.pins.$save(pin);

		}

	}]);

	

	app.controller('MessageView', ['$scope', '$timeout', '$sce', function($scope, $timeout, $sce) {


			var media = new Array;
			$scope.embed = [];
			var regexp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

			while (matches = regexp.exec($scope.mensaje.text)) media.push({
				render: false,
				url: matches[0]
			});

			$scope.media = media;

		


		$scope.showMedia = function(item) {
			item.loading = true;
			$.embedly.extract(item.url).progress(function(data) {
			
				$timeout(function() {

					switch (data.media.type) {
						case 'photo':
							item.html = $sce.trustAsHtml('<img src="' + data.media.url + '">');
							break;
						case 'video':
						case 'rich':
							item.html = $sce.trustAsHtml(data.media.html);
							break;

						default:
							console.log(data);
							item.error = true;
							break;
					}
					item.loading = false;
					item.media = data.media;
				})






			});
			item.render = true;
		}

	}]);

	app.directive('messageView', function() {
  return {
  	restric: 'A',
    controller: 'MessageView'
  };
});



app.directive('pinView', function() {
  return {
  	restric: 'A',
    controller: 'PinView'
  };
});


app.directive('chatViewScroll', function() {
	

  return {
  	restric: 'A',
  	controller: ['$scope', '$element', function($scope, $element){
  		
  		
  		
  		
  		console.log($element);
  	}]
}
	
});






})(jQuery);
