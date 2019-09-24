/*
 * ========================================================================
 * Added by Rajasekhar with ref to Modularize view of detailHeader Section  12-03-2017   
 * ========================================================================
 */
app.service("listService", function ($rootScope, listProvider) {

	this.setListObject = function (value) {
		listProvider.setOutputResponse(value);
	};

	this.getViewObject = function () {
		return listProvider.getSelectedView();
	};

	this.getTableDef = function () {
		return listProvider.getTMFTableDef();
	};

	this.getPageNumber = function () {
		return listProvider.getPageNumber();
	};

	this.setPageNumber = function (value) {
		listProvider.setPageNumber(value);
	};

	this.applyFilterForLazyLoading = function (selectedFilter, selectedView) {
		listProvider.getLazyLoadingData(selectedFilter, selectedView);
	};

	this.callMakeFavQuery = function (value) {
		listProvider.callMakeFavQuery(value);
	};

	this.callDeleteFavQuery = function (value) {
		listProvider.callDeleteFavQuery(value);
	};

	//Added by Vimlesh with ref to AAZG-430
	this.goToRequest = function (value) {
		//tileProvider.callViewRCRQuery(value);
	};

	this.delIsFav = function (value) {
		return;
	};

	this.addIsFav = function (value) {};

	// Added By Nagesh Jha
	this.openMyProfileFromList = function (value) {
		listProvider.callMyProfile(value);
	};

});