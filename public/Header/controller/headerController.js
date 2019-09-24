/*
 * ========================================================================
 * Added by Rajasekhar with ref to Modularize view of Header Section  27-02-1017   
 * ========================================================================
 */

app.controller('headerController', ['$scope', "$window", "headerService", "$state",
	function ($scope, $window, headerService, $state) {

		/* ----------- Header Object ----------- */
		var headerObj = {
			"searchString": "",
			"searchList": "",
			"searchType": "",
			"appName": "",
			"notificationCount": "",
			"userName": "",
			"preferenceAction": "",
			"logoutAction": "",
			"helpAction": "",
		};

		/* ----------- Init Function ----------- */
		this.init = function () {
			$scope.myState = $state.$current.name;
			initiateObjectsData();
			this.headerViewObj = headerObj;
		};

		/* ----------- Object Initialization Function ----------- */
		function initiateObjectsData() {
			headerObj.searchString = "";
			headerObj.searchList = headerService.getSearchList();
			headerObj.searchType = headerObj.searchList[0];
			headerObj.appName = headerService.getAppName();
			headerObj.userName = $window.fullName; // "profileUser1";//$window.userName; Edited: Nagesh
			headerObj.preferenceAction = headerService.getPreferenceActions();
			headerObj.logoutAction = headerService.getLogoutActions();
			headerObj.helpAction = headerService.getHelpActions();
		};

	}
]);

/* ----------- Header Directive ----------- */
app.directive("headerPage", ["$templateCache", function ($templateCache) {
	return {
		scope: false,
		templateUrl: "/Header/html/header.xhtml"
	};
}]);