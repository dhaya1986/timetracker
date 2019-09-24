/*
 * ========================================================================
 * Added by Reeth with ref to Modularize view of Breadcrumb Section  28-03-2017   
 * ========================================================================
 */

app.service("breadcrumbService", function($rootScope,breadcrumbProvider) {
	
	this.getNewListFromProvider = function(){
		return breadcrumbProvider.getDropdownListForNew();
	};	
	
	this.getListsectionFromProvider = function(){
		return breadcrumbProvider.getLinksectionFromTmf();
	};
	
	this.getButtonsectionFromProvider = function(){
		return breadcrumbProvider.getButtonsectionFromTmf();
	};
	
	this.getOpenSectionFromProvider = function(){
		return breadcrumbProvider.getOpenSectionFromTmf();
	};
	
	this.addNewProfile = function(data) {
		return breadcrumbProvider.addNewProfileToDB(data);
	};
	
});