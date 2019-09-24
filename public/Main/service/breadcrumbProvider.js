/*
 * ========================================================================
 * breadcrumbProvider    		Added by Reeth with ref to IS Integration for RTR  29-03-2017   Modified for Profiles by Shashank
 * ========================================================================
 */

app.service("breadcrumbProvider", function ($http, $window, $rootScope, genericSetting, perDimensionSetting, $q, logging) {

	var dropdownListForNew = pushBreadCrumbSection(perDimensionSetting.getDimensionConstants().breadcrumbSection);

	this.getDropdownListForNew = function () {
		return dropdownListForNew;
	};

	var interfaceInput = {
		"interface_id": "",
		"servicename": "",
		"event_text": "",
		"interface_instance_id": "",
		"step_instance_id": ""
	};

	var linksectionFromTmf = {
		"name": "Go To Reports",
		"image": ""
	};

	var insertEmailOBJ = '';

	this.getLinksectionFromTmf = function () {
		return linksectionFromTmf;
	};

	var buttonsectionFromTmf = {
		"name": "Add Profiles",
		"image": "/CommonBD/image/add.png"
	};

	this.getButtonsectionFromTmf = function () {
		return buttonsectionFromTmf;
	};

	function insertEmail(value, metaData) {
		console.log(value);
		value.metadata.logging_details = metaData;
		insertEmailOBJ = {};
		insertEmailOBJ.data = value;
		return $http(insertEmailOBJ);
	};

	this.addNewProfileToDB = function (value) {
		var deferred = $q.defer();
		interfaceInput.interface_id = "PROFILES_NEW";
		interfaceInput.servicename = "PROFILES NEW";
		interfaceInput.event_text = "PROFILES NEW initiated.";
		logging.startInterface(interfaceInput).then(function (tmfResponse) {
			insertEmail(value, tmfResponse.instance).success(function (response) {
				logging.interfaceReady(tmfResponse.instance);
				deferred.resolve(response);
			});
		});
		return deferred.promise;
	};

	var openSectionFromTmf = [{
		"id": "1",
		"templateUrl": "request.xhtml",
		"controller": "requestController"
	}];

	this.getOpenSectionFromTmf = function () {
		return openSectionFromTmf;
	};

	function pushBreadCrumbSection(modeConfig) {
		var BreadcrumbSectionDimension = modeConfig;
		var MainKey = [];
		var MainValue = "";
		var BreadcrumbSection = [];
		for (var k in BreadcrumbSectionDimension) MainKey.push(k);
		for (var i = 0; i < MainKey.length; i++) {
			MainValue = BreadcrumbSectionDimension[MainKey[i]];
			BreadcrumbSection.push(MainValue);
		};
		return BreadcrumbSection;
	};

	var Requestor = {
		"displayName": $window.fullName,
		"userId": $rootScope.loggedInUserWWID,
		"email": $window.emailId,
		"firstName": $window.firstName,
		"lastName": $window.lastName,
		"ntId": $rootScope.loggedInUserWWID,
		"region": "",
		"roles": []
	};
});