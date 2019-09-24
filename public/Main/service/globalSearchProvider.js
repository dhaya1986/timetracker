 /*
 * ========================================================================
 * Added by Reeth with ref to Modularize view of Global Search Section  05-06-2017   
 * ========================================================================
 */
app.service("globalSearchProvider", function($rootScope,$window,$http,restProvider,genericSetting,filterProvider,$state,logging,filterService) {
	
	//TMF INPUT
    var interfaceInput = {
            "interface_id":"",
            "servicename":"",
            "event_text" : "",
            "interface_instance_id" : "",
            "step_instance_id" : ""
     };
    
	var searchObject = {
			"user":{
				"ntId":""
				},
				"pageNo":"",
				"searchBy" : {
					"key" : "",
					"value" :""
				},"criteriaList":[],
				metadata : {
				     ip : "",
				     userId : $rootScope.loggedInUserWWID,
				     clientType : "",
				     version : "",
					     logging_details :{
					      project : "",
					      interface_id : "",
					      dimension_name : "",
					      dimension_value : "",
					      step_id : "",
					      parent_step_instance_id : "",
					      step_instance_id : "",
					      interface_instance_id : ""
					     }
				    }
	};
	
	var searchDropDown = [ 
	 {
		label : "WWID",
		value : "wwid"
	},
	{
		label : "First Name",
		value : "firstName"
	},{
		label : "Last Name",
		value : "familyName"
	},
	{
		label : "Email ID",
		value : "emailAddress"
	},
	{
		label : "Company Name",
		value : "companyName"
	},
	{
		label : "Department",
		value : "departmentDescription"
	},
	{
		label : "Region",
		value : "region"
	}];
	
	 var busy = false;
	 var pagesize = parseInt(genericSetting.getGenericConstants().pagesize);
	 var pageNumber = 1;
	 
	 this.resetSearchPageDetails = function() {
	      pagesize = parseInt(genericSetting.getGenericConstants().pagesize);
	      pageNumber = 1;
	 };
	 
	 this.getPageNumber = function() {
	        return pageNumber;
	 };

	 this.setPageNumber = function(value) {
	        pageNumber = value;
	 };
	    
	this.getSearchDropDown = function(){
		return searchDropDown;
	};

	var ProfilesObj = "";
	
	function searchText(key, value, currView,metaData){
		pageNumber=1;
		searchObject.user.ntId=$rootScope.loggedInUserWWID; //ntid->loggedIN user id
		searchObject.searchBy.key = key;
		searchObject.searchBy.value = value;
		searchObject.pageNo = ""+pageNumber;
		searchObject.metadata.logging_details = metaData;
		if($rootScope.filterSelectedDataForGlobalSearch==undefined){
			searchObject.criteriaList = null;
		}else{
			searchObject.criteriaList = $rootScope.filterSelectedDataForGlobalSearch;
		}
		if($rootScope.selected_Filter_Data!=undefined && $rootScope.selected_Filter_Data.criteriaList!=null){
			searchObject.criteriaList = $rootScope.selected_Filter_Data.criteriaList;
			$rootScope.filterSelectedDataForGlobalSearch = $rootScope.selected_Filter_Data.criteriaList;
		}
		if(searchObject.criteriaList){
			if(searchObject.criteriaList.length==0){
				searchObject.criteriaList=null;
			}
		}
		$rootScope.globalSearchData = searchObject.searchBy;
		if(currView=="All Profiles"){
			interfaceInput.interface_id = "PROFILES_GET_ALLPROFILES";
        	interfaceInput.servicename = "ALL PROFILES";
        	interfaceInput.event_text = "ALL PROFILES initiated.";
			ProfilesObj = restProvider.getREST_OBJECT().GET_ALL_PROFILES;
		}else if(currView=="Favorites"){
			interfaceInput.interface_id = "PROFILES_USER_FAV";
        	interfaceInput.servicename = "ALL FAVORITES";
        	interfaceInput.event_text = "ALL FAVORITES initiated.";
			ProfilesObj = restProvider.getREST_OBJECT().GET_ALL_FAVORITES;
		}else if(currView=="Skills Search Page"){
			interfaceInput.interface_id = "PROFILES_SKILL_SEARCH";
        	interfaceInput.servicename = "ALL SKILLS FILTER";
        	interfaceInput.event_text = "ALL SKILLS FILTER initiated.";
			ProfilesObj = restProvider.getREST_OBJECT().GET_SKILLS_SEARCH_FILTER;
		}
		ProfilesObj.data = searchObject;
		return $http(ProfilesObj);
	};
	
	this.globalSearchQuery = function(key, value,currView){
		$rootScope.globalSearchData = searchObject.searchBy;
		$rootScope.listViewName = $state.current.name;
        if (!busy) {
            busy = true;
            searchObject.searchBy.value =null;
            logging.startInterface(interfaceInput).then(function (tmfResponse) {
            searchText(key, value, currView).success(function(response) {
            	logging.interfaceReady(tmfResponse.instance);
            	busy = false;
            	if(currView=="Skills Search Page"){
            		$rootScope.selected_Filter_Data.pageNo="1";
            		$rootScope.$broadcast('skillsApplyFilter', {
        				data : response
        			});
            	}else{
            		$rootScope.$broadcast('applyFilter', {
        				data : response
        			});
            	}
    			
    		});
            });
            pageNumber += 1;
            filterProvider.setPageNumber(pageNumber);
        }
	};
	
	this.clearSearch = function(currView){
		var selectedView= "";
		filterService.resetPageDetails();
		$rootScope.globalSearchData=null;
		if(currView=="All Profiles"){
			selectedView = genericSetting.getGenericConstants().profiles_allProfiles;
		}else if(currView=="Favorites"){
			selectedView = genericSetting.getGenericConstants().profiles_favorites;
		}else if(currView=="Skills Search Page"){
				$rootScope.selected_Filter_Data.pageNo="1";
			selectedView = genericSetting.getGenericConstants().profiles_allskillsFilter;
		}
		filterProvider.callRestQuery($rootScope.filterSelectedDataForGlobalSearch, selectedView);
	};
});	