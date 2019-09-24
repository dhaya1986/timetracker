agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module("ProfilesApp", ["ui.router", "ui.bootstrap",
	"ngRoute", "agGrid", "ui.select", "ngTextTruncate", "infinite-scroll", 'ngTextTruncate', 'ngIdle', 'ngCsv'
]).value('THROTTLE_MILLISECONDS', 1000);
//,'checklist-model','ui.bootstrap.datetimepicker'

var ProfilesApp = app;

ProfilesApp.config(['KeepaliveProvider', 'IdleProvider',
	function (KeepaliveProvider, IdleProvider) {
		IdleProvider.idle(100);
		IdleProvider.timeout(3);
		KeepaliveProvider.interval(1);
	}
]);

ProfilesApp.config(function ($stateProvider, $urlRouterProvider, $routeProvider,
	$windowProvider, $locationProvider) {

	$stateProvider.state('main', {
			url: "/main",
			location: true,
			templateUrl: 'Main/html/main.html',
			data: {
				displayName: 'Home'
			}
		})

		.state('main.tileview', {
			url: "/tileview",
			location: false,
			template: '<tile-page></tile-page>',
			data: {
				displayName: 'Tile View'
			}
		})

		.state('main.listview', {
			url: "/listview",
			location: false,
			template: '<list-page></list-page>',
			data: {
				displayName: 'List View'
			}
		})


		.state('timeTrackingMain', {
			url: "/",
			location: false,
			templateUrl: 'Main/html/timeTrackingMain.html',
			data: {
				displayName: 'Time Tracker Main'
			}
		})
		.state('timeTrackingMain.admin', {
			url: "/",
			location: false,
			templateUrl: 'TimeTracking/html/timeTrackingAdminHome.html',
			data: {
				displayName: 'Admin Time Tracking'
			}
		})
		.state('timeTrackingMain.home', {
			url: "/",
			location: false,
			templateUrl: 'TimeTracking/html/timeTrackingHomePage.html',
			data: {
				displayName: 'Track Time'
			}
		});

	$locationProvider.hashPrefix('');
});

//,'appConstants'
ProfilesApp.run(['$location', '$rootScope', '$q', '$state', '$window', 'genericSetting', 'perDimensionSetting', '$modal',
	function ($location, $rootScope, $q, $state, $window, genericSetting, perDimensionSetting, $modal) {
		//,appConstants
		// needs changes
		var roles = $window.roles;
		var validRole = true;
		/* if (roles.length > 0) {
			for (var i = 0; i < roles.length; i++) {
				if (roles[i] == "CG510_Profiles_Role") {
					validRole = true;
					break;
				}
			}
		} */

		if (validRole) {
			perDimensionSetting.setDimensionConstants();
			genericSetting.setGenericConstants();
			$rootScope.adminRole = false;

			var deferred = $q.defer();
			/* Idle.setIdle(parseInt(genericResponse.Generic.sessionTimeIdle));
			Idle.setTimeout(parseInt(genericResponse.Generic.sessionTimeOut));
			Keepalive.setInterval(parseInt(genericResponse.Generic.sessionInterval)); */
			var loginUserName = {
				"username": $window.loggedinUserId
			};
			// Users login per region
			$rootScope.loggedInUserWWID = $window.loggedinUserId;

			$state.go('main', {}, {
				location: false
			});

		} else {
			var modalInstanceSecond = $modal.open({
				templateUrl: 'mySecondModalContent.xhtml',
				// controller: 'ModalInstanceCtrl',
			});
		}
	}
]);

app.directive('ngOnFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit(attr.broadcastEventName ? attr.broadcastEventName : 'ngRepeatFinished');
				});
			}
		}
	};
});


app.config(function ($httpProvider) {
	$httpProvider.interceptors.push(myInterceptor);
});

var myInterceptor = function ($q, $rootScope) {
	return {
		request: function (config) {
			$('#processing').show();
			return config;
		},
		response: function (result) {
			$('#processing').hide();
			return result;
		},
		responseError: function (rejection) {
			$('#processing').hide();
			return $q.reject(rejection);
		}
	};
};


app.filter('removeSpaces', [function () {
	return function (string) {
		var str = string;
		var lastIndex = str.lastIndexOf(" ");
		var temp = str.substring(lastIndex);
		if (temp == " undefined") {
			str = str.substring(0, lastIndex);
		}
		return str;
	};
}]);