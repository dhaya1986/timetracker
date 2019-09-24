app.service('perDimensionSetting', ['$http', '$window', '$rootScope', function ($http, $window, $rootScope) {

	var TMF_Header = {
		"Content-Type": "application/json",
		"accept": "application/json",
		"Authorization": ""
	};
	var dimensionConstants = {};
	this.setDimensionConstants = function () {
		$http.get('../TMF/PerDimention.json').then(function (response) {
			console.log(response);
			dimensionConstants = response.data.perDimension;
		});
	};

	this.getDimensionConstants = function () {
		return dimensionConstants;
	};

	this.getDimensionSettings = function (IS_ENDPOINT_ADDRESS, USERNAME, PASSWORD) {
		var IS_ENDPOINT_ADDRESS = $window.endpointAddress;
		var USERNAME = $window.userName;
		var PASSWORD = $window.password;
		TMF_Header.Authorization = "Basic " + btoa(USERNAME + ":" + PASSWORD);
		var httpURL = {
			url: IS_ENDPOINT_ADDRESS + "rest/SG001_TMF_Client/pub/external/getSettings?project=CG510_PROFILES&setting_type=PerDimension",
			method: "GET",
			withCredentials: true,
			headers: TMF_Header
		};
		return $http(httpURL);
	};

}]);