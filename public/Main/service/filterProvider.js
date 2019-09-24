/*
 * ========================================================================
 * filterProvider    			Added by Reeth with ref to IS Integration for RTR  07-03-1017
 * getRTR				        Added by Reeth with ref to IS Integration for RTR  07-03-1017
 * ========================================================================
 */

app.service("filterProvider", function ($http, $window, $rootScope, $q, genericSetting, perDimensionSetting, breadcrumbProvider, restProvider, $state, logging) {

	//TMF INPUT
	var interfaceInput = {
		"interface_id": "",
		"servicename": "",
		"event_text": "",
		"interface_instance_id": "",
		"step_instance_id": ""
	};

	//API input params
	var inputAPIJSON = {
		"user": {
			"ntId": ""
		},
		"searchBy": "",
		"criteriaList": "",
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

	inputAPIJSON.user.ntId = $rootScope.loggedInUserWWID; //ntid->loggedIN user id

	var pagesize = parseInt(genericSetting.getGenericConstants().pagesize);
	var pageNumber = 1;


	this.resetPageDetails = function () {
		pagesize = parseInt(genericSetting.getGenericConstants().pagesize);
		pageNumber = 1;
	};

	this.getPageNumber = function () {
		return pageNumber;
	};

	this.setPageNumber = function (value) {
		pageNumber = value;
	};

	var selectedView = "";

	this.getSelectedView = function () {
		return selectedView;
	};

	var selectedFilter = null;

	this.getSelectedFilter = function () {
		return selectedFilter;
	};

	var filteredData = "";

	$rootScope.applyFilterCapture = 0; //to check applyfilter clicked or not 

	this.setFilteredData = function (data, view) {
		$rootScope.applyFilterCapture = 1;
		if ($rootScope.globalSearchData == undefined || $rootScope.globalSearchData == null) {
			inputAPIJSON.searchBy = null;
		} else {
			inputAPIJSON.searchBy = $rootScope.globalSearchData;
		}
		if (!$rootScope.busy) {
			$rootScope.busy = true;

			fetchFilteredData(data, view).success(function (response) {

				$rootScope.busy = false;
				selectedFilter = null;
				//selectedView = "";
				filteredData = response;
				$rootScope.$broadcast('applyFilter', {
					data: response,
				});
			});

			pageNumber += 1;
		} else {
			$rootScope.busy = false;
		}

	};

	function fetchFilteredData(filterSelected, viewSelected) {

		selectedView = viewSelected;
		selectedFilter = filterSelected;
		inputAPIJSON.criteriaList = selectedFilter;
		inputAPIJSON.pageNo = pageNumber;
		var profilesObj = "";
		if (viewSelected == 'Favorites') {
			//GET_ALL_FAVORITES with Filters
			profilesObj = restProvider.getREST_OBJECT().GET_ALL_FAVORITES;
			profilesObj.data = inputAPIJSON; //inputRequest.request.criteriaList;
		} else {
			profilesObj = restProvider.getREST_OBJECT().GET_ALL_PROFILES;
			profilesObj.data = inputAPIJSON; //inputRequest.request.criteriaList;
		}
		return $http(profilesObj);
	}



	this.getFilteredData = function () {
		return filteredData;
	};

	var busy = false;

	function getProfiles(filterSelected, viewSelected, metaData) {
		selectedView = viewSelected;
		if ($rootScope.applyFilterCapture == 0 || filterSelected == undefined || filterSelected.length == 0) {
			selectedFilter = null;
		} else {
			selectedFilter = filterSelected;
		}
		inputAPIJSON.criteriaList = selectedFilter;
		if ($rootScope.globalSearchData == undefined || $rootScope.globalSearchData == null) {
			inputAPIJSON.searchBy = null;
		} else {
			inputAPIJSON.searchBy = $rootScope.globalSearchData;
		}

		var profilesObj = "";
		inputAPIJSON.metadata.logging_details = metaData;
		inputAPIJSON.pageNo = "" + pageNumber;
		if (viewSelected == genericSetting.getGenericConstants().profiles_allskillsFilter) {
			profilesObj = restProvider.getREST_OBJECT().GET_SKILLS_SEARCH_FILTER;
			if (inputAPIJSON.criteriaList) {
				if (inputAPIJSON.criteriaList.length == 0) {
					inputAPIJSON.criteriaList = null;
				}
			}
			profilesObj.data = inputAPIJSON;
		} else if (viewSelected == genericSetting.getGenericConstants().profiles_favorites) {
			profilesObj = restProvider.getREST_OBJECT().GET_ALL_FAVORITES;
			profilesObj.data = inputAPIJSON;
		} else if (viewSelected == genericSetting.getGenericConstants().profiles_allProfiles) {
			profilesObj = restProvider.getREST_OBJECT().GET_ALL_PROFILES;
			profilesObj.data = inputAPIJSON;

		}

		return $http(profilesObj);
	};

	this.callRestQuery = function (selectedFilter, selectedView) {
		if (selectedView == genericSetting.getGenericConstants().profiles_allProfiles) {
			interfaceInput.interface_id = "PROFILES_GET_ALLPROFILES";
			interfaceInput.servicename = "ALL PROFILES";
			interfaceInput.event_text = "ALL PROFILES initiated.";
		} else if (selectedView == genericSetting.getGenericConstants().profiles_allskillsFilter) {
			interfaceInput.interface_id = "PROFILES_SKILL_SEARCH";
			interfaceInput.servicename = "ALL SKILLS FILTER";
			interfaceInput.event_text = "ALL SKILLS FILTER initiated.";
		} else if (selectedView == genericSetting.getGenericConstants().profiles_favorites) {
			interfaceInput.interface_id = "PROFILES_USER_FAV";
			interfaceInput.servicename = "ALL FAVORITES";
			interfaceInput.event_text = "ALL FAVORITES initiated.";
		}
		selectedView = selectedView;
		$rootScope.$broadcast('applyFilter', {
			data: '',
		});
	};

	// Added by Nagesh 29-11-17	 
	this.redirectToSkillsSearchPage = function () {
		$state.go('viewSkill.tileviewSkills', {
			reload: true
		});
	};

	var tmfConstants = {
		"generic": genericSetting.getGenericConstants(),
		"dimension": perDimensionSetting.getDimensionConstants()
	};

	this.getTmfConstants = function () {
		return tmfConstants;
	};

});