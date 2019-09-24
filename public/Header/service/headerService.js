	/*
 * ========================================================================
 * Added by Rajasekhar with ref to Modularize view of List Section  12-03-2017   
 * ========================================================================
 */
app.service("headerService", function($rootScope,headerProvider) {

	this.getTmfConstants = function(){
		return headerProvider.getTmfConstants();	
	};
	
	this.getSearchList = function(){
		return headerProvider.getSearchList();
	};
	
	this.getAppName = function(){
		return headerProvider.getAppName();
	};
	
	this.getPreferenceActions = function(){
		return headerProvider.getPreferenceActions();
	};
	
	this.getLogoutActions = function(){
		return headerProvider.getLogoutActions();
	};
	
	this.getHelpActions = function(){
		return headerProvider.getHelpActions();
	};
		
});	