app.service('genericSetting', ['$http', '$window', '$rootScope', function ($http, $window, $rootScope) {

	var TMF_Header = {
		"Content-Type": "application/json",
		"accept": "application/json",
		"Authorization": ""
	};

	var genericConstants = {};
	this.setGenericConstants = function () {
		$http.get('../TMF/Generic.json').then(function (response) {
			console.log(response);
			genericConstants = response.data.Generic;
		});
	};

	this.getGenericConstants = function () {
		return genericConstants;
	};

	this.getGenericSettings = function (tmfUrl, tmfUserName, tmfPassword) {
		TMF_Header.Authorization = "Basic " + btoa(tmfUserName + ":" + tmfPassword);
		var httpURL = {
			url: tmfUrl + "rest/SG001_TMF_Client/pub/external/getSettings?project=CG510_PROFILES&setting_type=Generic",
			method: "GET",
			withCredentials: true,
			headers: TMF_Header
		};
		return $http(httpURL);
	};

}]);