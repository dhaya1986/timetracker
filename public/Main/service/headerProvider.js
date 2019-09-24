app.service("headerProvider", function ($http, $window, $rootScope, genericSetting, perDimensionSetting) {
	var tmfConstants = {
		"generic": genericSetting.getGenericConstants(),
		"dimension": perDimensionSetting.getDimensionConstants()
	};

	this.getTmfConstants = function () {
		return tmfConstants;
	};

	this.getSearchList = function () {
		this.getTmfConstants();
		return generateArray(tmfConstants.dimension.header.searchTypes);
	};

	this.getAppName = function () {
		return tmfConstants.dimension.header.appName;
	};

	this.getPreferenceActions = function () {
		return tmfConstants.dimension.header.userPreference;
	};

	this.getLogoutActions = function () {
		return tmfConstants.dimension.header.logout;
	};

	this.getHelpActions = function () {
		return tmfConstants.dimension.header.help;
	};

	function generateArray(data) {
		var dataList = data;
		var MainKey = [];
		var MainValue = "";
		var searchlist = [];
		for (var k in dataList) MainKey.push(k);
		for (var i = 0; i < MainKey.length; i++) {
			MainValue = dataList[MainKey[i]];
			var info = {};
			info.name = MainKey[i];
			info.value = MainValue;
			searchlist.push(info);
		}
		return searchlist;
	};

});