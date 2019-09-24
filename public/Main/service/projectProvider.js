/*
 * ========================================================================
 * projectProvider    				Added by Reeth with ref to IS Integration for RCR  08-09-2017   
 * EXT_REST_OBJECT.GET_PROJECT  Added by Reeth with ref to IS Integration for RCR  08-09-2017   
 * ========================================================================
 */
ProfilesApp.service("projectProvider",function($window,perDimensionSetting){
	var EXT_ENDPOINT_ADDRESS =  perDimensionSetting.getDimensionConstants().externalSystem.projectSection.endPointAddress;
	var USERNAME = perDimensionSetting.getDimensionConstants().externalSystem.projectSection.username;
	var PASSWORD = perDimensionSetting.getDimensionConstants().externalSystem.projectSection.password;
	
	var commonHeader = {
			'Content-Type': 'application/json', 
			'Accept' : 'application/json',
			'Authorization' : "Basic " + btoa(USERNAME+":"+PASSWORD)
	};
	
	var EXT_REST_OBJECT = {
		GET_PROJECT :{
			url: EXT_ENDPOINT_ADDRESS + '/rest/CG510_RnDLink_UIGateway_v1/restServices/getAllProjectName',
			method: 'POST',
			withCredentials : true,
			headers : commonHeader
		}
	};
		
	this.getEXT_REST_OBJECT = function() {
		return EXT_REST_OBJECT;
	};

	this.setEXT_REST_OBJECT = function(value) {
		this.EXT_REST_OBJECT = value;
	};

});