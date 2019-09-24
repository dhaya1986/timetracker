/*
 * ========================================================================
 * tileProvider    				Added by Reeth with ref to IS Integration for RTR  10-03-1017   
 * 				                Added by Reeth with ref to IS Integration for RTR  07-03-1017   
 * ========================================================================
 */

app.service("tileProvider", function($http,$window,$state,$rootScope,$q,restProvider,filterProvider,inputRequest,logging) {
	var interfaceInput = {
	            "interface_id":"",
	            "servicename":"",
	            "event_text" : "",
	            "interface_instance_id" : "",
	            "step_instance_id" : ""
	};
	 
	this.getSelectedView = function(){
		return filterProvider.getSelectedView();
	};
	
	this.getSelectedFilter = function(){
		return filterProvider.getSelectedFilter();
	};
		
	this.getPageNumber = function() {
		return filterProvider.getPageNumber();
	};
	
	this.setPageNumber = function(value) {
		filterProvider.setPageNumber(value);
	};
	
	this.getLazyLoadingData = function(selectedFilter,selectedView){
		filterProvider.callRestQuery(selectedFilter,selectedView);
	};
	
	/* -------------- Favorite Rest Call -------------- */
	var FAVObj;
	
	/* ----- Make Favorite ----- */ 
	var markFavJSON={"favorite":{
			"WWID": " ",
	        "USER_ID": ""
		},
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
	   }};

	function makeFavorite(id,metaData){
		markFavJSON.favorite.WWID = id; //userId
		markFavJSON.favorite.USER_ID = $rootScope.loggedInUserWWID; //ntid->loggedIN user id
		interfaceInput.interface_id = "PROFILES_MARK_FAVOURITES";
    	interfaceInput.servicename = "MARK_FAVOURITES";
    	interfaceInput.event_text = "MARK_FAVOURITES initiated.";
    	markFavJSON.metadata.logging_details = metaData;
    	FAVObj = restProvider.getREST_OBJECT().MARK_FAV;
		FAVObj.data = markFavJSON ;
		return $http(FAVObj);
	};
	
	this.callMakeFavQuery = function(value){
		var deferred = $q.defer();
		logging.startInterface(interfaceInput).then(function (tmfResponse) {
		makeFavorite(value.wwid,tmfResponse.instance).success(function(response) {
			logging.interfaceReady(tmfResponse.instance);
			deferred.resolve(response);
		});
		});
		return deferred.promise;
	};
	
	/* ----- Delete Favorite ----- */ 
	var unMarkFavJSON={"favorite":{
	        "FAVORITE_ID": "",
	        "USER_ID": ""
    	},metadata : {
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
		    }};
	
	function deleteFavorite(value,metaData){
		unMarkFavJSON.favorite.FAVORITE_ID = value.favoriteID;
		unMarkFavJSON.USER_ID =$rootScope.loggedInUserWWID;
		interfaceInput.interface_id = "PROFILES_UNMARK_FAVOURITES";
    	interfaceInput.servicename = "UNMARK_FAVOURITES";
    	interfaceInput.event_text = "UNMARK_FAVOURITES initiated.";
    	unMarkFavJSON.metadata.logging_details = metaData;
    	FAVObj = restProvider.getREST_OBJECT().UNMARK_FAV;
		FAVObj.data = unMarkFavJSON;
		return $http(FAVObj);
	};
	
	this.callDeleteFavQuery = function(value){
		var deferred = $q.defer();
		logging.startInterface(interfaceInput).then(function (tmfResponse) {
		deleteFavorite(value,tmfResponse.instance).success(function(response) {
			logging.interfaceReady(tmfResponse.instance);
			deferred.resolve(response);
		});
		});
		return deferred.promise;
	};

	var allObjJSON={"ntId":""};
	
	function getAllTile(){
		allObjJSON.ntId=$rootScope.loggedInUserWWID; //ntid->loggedIN user id
		var getAllTileObj = restProvider.getREST_OBJECT().GET_ALL_PROFILES;
		getAllTileObj.data =allObjJSON;
		return $http(getAllTileObj);
	}
	
	// Added by Nagesh 9-11-17
	var myProfInfo = '' ; 
	this.callMyProfile = function(value){
		myProfInfo=value;
    	$state.go('viewRequest.detailsHeaderSection', { reload: true });
    };
    
    // Added by Nagesh 9-11-17
    this.getMyProfilesInfo = function(){
    		return myProfInfo;
    };
	
});