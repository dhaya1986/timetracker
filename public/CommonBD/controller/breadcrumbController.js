/*
 * ========================================================================
+ * Added by Reeth with ref to Modularize view of Breadcrumb Section  28-03-1017   
 * ========================================================================
 */
app.controller("breadcrumbController", ['$scope', '$state', '$modal', '$rootScope', 'breadcrumbService',
	function ($scope, $state, $modal, $rootScope, breadcrumbService) {

		$scope.animationsEnabled = true;
		var selectBreadcrumbDropdown = function (i) {
			$scope.model = {
				"id": $scope.openSection[i].id
			};
			return $scope.model.id;
		};

		if ($state.current.name == 'timeTrackingMain.home' || $state.current.name == 'timeTrackingMain.admin') {
			$scope.showAddProfilesSection = false;
		} else {
			$scope.showAddProfilesSection = true;
		}

		$scope.init = function () {
			$scope.NewDropdownList = breadcrumbService.getNewListFromProvider();
			$scope.linksection = breadcrumbService.getListsectionFromProvider();
			$scope.buttonsection = breadcrumbService.getButtonsectionFromProvider();
			$scope.openSection = breadcrumbService.getOpenSectionFromProvider();
		};

		$scope.open = function (id) {
			for (var i = 0; i < $scope.openSection.length; i++) {
				if (id == $scope.openSection[i].id) {
					$modal.open({
						animation: true,
						templateUrl: $scope.openSection[i].templateUrl,
						controller: $scope.openSection[i].controller,
						resolve: {
							selected: selectBreadcrumbDropdown(i)
						}
					});
				}
			}
		};

		var addNewProfileObj = {
			"email": [],
			metadata: {
				ip: "",
				userId: $rootScope.loggedInUserWWID,
				clientType: "",
				version: "",
				logging_details: {
					project: "",
					interface_id: "",
					dimension_name: "",
					dimension_value: "",
					step_id: "",
					parent_step_instance_id: "",
					step_instance_id: "",
					interface_instance_id: ""
				}
			}
		};

		$scope.addProfile = function (addProfile) {
			$scope.success = 0;
			$scope.invalid = 0;
			$scope.sucInv = 0;
			$scope.responseData = "";
			$scope.invalidEmailLen = "";
			$scope.countSize = "";
			$scope.addProfileResponseMessage = [];
			var invalidEmail = "";


			if (addProfile) {
				if (addProfile.length > 1) {
					var temp = addProfile.split(",");
					addNewProfileObj["email"] = temp;
					breadcrumbService.addNewProfile(addNewProfileObj).then(function (response) {
						if (response) {
							console.log(response);
							if (response.incorrectEmail != undefined) {
								$scope.addProfileResponseMessage.push(response.incorrectEmail.length + ' Email id(s) are incorrect.');
								$scope.addProfileResponseMessage.push(response.incorrectEmail.toString());
							}
							if (response.TerminatedEmail != undefined) {
								$scope.addProfileResponseMessage.push(response.TerminatedEmail.length + ' Email id(s) are Terminated.');
								$scope.addProfileResponseMessage.push(response.TerminatedEmail.toString());
							}
							if (response.InactiveEmail != undefined) {
								$scope.addProfileResponseMessage.push(response.InactiveEmail.length + ' Email id(s) are Inactive.');
								$scope.addProfileResponseMessage.push(response.InactiveEmail.toString());
							}
							if (response.InvalidEmail != undefined) {
								$scope.addProfileResponseMessage.push(response.InvalidEmail.length + ' Email id(s) are Invalid.');
								$scope.addProfileResponseMessage.push(response.InvalidEmail.toString());
							}
							if (response.ValidEmail != undefined) {
								$scope.addProfileResponseMessage.push(response.ValidEmail.length + ' Profile(s) added/updated Successfully.');
								$scope.addProfileResponseMessage.push(response.ValidEmail.toString());
							}

							var modalOptions = {
								closeButtonText: 'Ok',
								headerText: 'Message',
								hideAsteriskCode: 1,
								bodyText: $scope.addProfileResponseMessage
							};
						}
						addNewProfileObj.email = [];
					});
				}
			}
			$scope.addEmail = "";
		};

	}
]);



app.directive("breadcrumbSection", ["$templateCache", function ($templateCache) {
	return {
		scope: false,
		templateUrl: "/CommonBD/html/breadcrumb.xhtml"
	};
}]);

app.directive('uiBreadcrumbs', ['$interpolate', '$state', '$rootScope', '$window', function ($interpolate, $state, $rootScope, $window) {
	return {
		restrict: 'E',
		templateUrl: '/CommonBD/html/navigation.xhtml',
		scope: {
			displaynameProperty: '@',
			abstractProxyProperty: '@?'
		},
		link: function (scope) {
			scope.$root.showTTHomeIcon = false;
			scope.breadcrumbs = [];
			scope.showTimeTrackingTab = false;
			scope.showAdminTab = false;
			if ($window.roles.includes('CG510_Profiles_TimeTracking_User')) {
				scope.showTimeTrackingTab = true;
			}
			if ($window.roles.includes('CG510_Profiles_TimeTracking_Admin')) {
				scope.showAdminTab = true;
				scope.showTimeTrackingTab = true;
			}
			if ($state.$current.name !== '') {
				updateBreadcrumbsArray();
			}
			scope.$on('$stateChangeSuccess', function () {
				updateBreadcrumbsArray();
			});

			scope.btn1 = "Profiles";
			scope.btn2 = "Time Tracker";
			scope.btn3 = "Admin View";

			if ($state.current.name == 'timeTrackingMain.home') {
				scope.modeSelected = scope.btn2;
			} else if ($state.current.name == 'timeTrackingMain.admin') {
				scope.modeSelected = scope.btn3;
			} else {
				scope.modeSelected = scope.btn1;
			}

			scope.changeMode = function (value) {
				scope.modeSelected = value;
				if (value == scope.btn1) {

				} else if (value == scope.btn3) {
					$state.go('timeTrackingMain.admin', {}, {
						location: false,
						reload: true
					});
					scope.$root.showTTHomeIcon = false;
				} else {
					$state.go('timeTrackingMain.home', {}, {
						location: false,
						reload: true
					});
					scope.$root.showTTHomeIcon = false;
				}
				scope.modeSelected = value;
			};

			function updateBreadcrumbsArray() {
				var workingState;
				var displayName;
				var breadcrumbs = [];

				var currentState = $state.$current;
				while (currentState && currentState.name !== '') {
					workingState = getWorkingState(currentState);
					if (workingState) {
						displayName = getDisplayName(workingState);

						if (displayName !== false && !stateAlreadyInBreadcrumbs(workingState, breadcrumbs) && displayName !== 'Home') {
							breadcrumbs.push({
								displayName: displayName,
								route: workingState.name
							});
						}
					}
					currentState = currentState.parent;
				}
				breadcrumbs.push({
					displayName: "Home",
					route: "main"
				});
				breadcrumbs.reverse();
				scope.breadcrumbs = breadcrumbs;
			}

			function getWorkingState(currentState) {
				var proxyStateName;
				var workingState = currentState;
				if (currentState.abstract === true) {
					if (typeof scope.abstractProxyProperty !== 'undefined') {
						proxyStateName = getObjectValue(scope.abstractProxyProperty, currentState);
						if (proxyStateName) {
							workingState = $state.get(proxyStateName);
						} else {
							workingState = false;
						}
					} else {
						workingState = false;
					}
				}
				return workingState;
			}

			function getDisplayName(currentState) {
				var interpolationContext;
				var propertyReference;
				var displayName;

				if (!scope.displaynameProperty) {
					return currentState.name;
				}
				propertyReference = getObjectValue(scope.displaynameProperty, currentState);

				if (propertyReference === false) {
					return false;
				} else if (typeof propertyReference === 'undefined') {
					return currentState.name;
				} else {
					interpolationContext = (typeof currentState.locals !== 'undefined') ? currentState.locals.globals : currentState;
					displayName = $interpolate(propertyReference)(interpolationContext);
					return displayName;
				}
			}

			function getObjectValue(objectPath, context) {
				var i;
				var propertyArray = objectPath.split('.');
				var propertyReference = context;

				for (i = 0; i < propertyArray.length; i++) {
					if (angular.isDefined(propertyReference[propertyArray[i]])) {
						propertyReference = propertyReference[propertyArray[i]];
					} else {
						return undefined;
					}
				}
				return propertyReference;
			}

			function stateAlreadyInBreadcrumbs(state, breadcrumbs) {
				var i;
				var alreadyUsed = false;
				for (i = 0; i < breadcrumbs.length; i++) {
					if (breadcrumbs[i].route === state.name) {
						alreadyUsed = true;
					}
				}
				return alreadyUsed;
			}
		}
	};
}]);