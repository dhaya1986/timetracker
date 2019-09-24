/*
 * ========================================================================
 * listProvider    				Added by Rajasekhar with ref to IS Integration for RTR  10-03-1017
 * ========================================================================
 */

app.service("listProvider", function ($http, $window, $state, $rootScope, restProvider,
	filterProvider, genericSetting,
	perDimensionSetting) {

	this.getSelectedView = function () {
		return filterProvider.getSelectedView();
	};

	this.getSelectedFilter = function () {
		return filterProvider.getSelectedFilter();
	};

	this.getLazyLoadingData = function (selectedFilter,
		selectedView) {
		filterProvider.callRestQuery(selectedFilter,
			selectedView);
	};

	this.getPageNumber = function () {
		return filterProvider.getPageNumber();
	};

	this.setPageNumber = function (value) {
		filterProvider.setPageNumber(value);
	};

	var tmfConstants = {
		"generic": genericSetting.getGenericConstants(),
		"dimension": perDimensionSetting
			.getDimensionConstants()
	};

	this.getTmfConstants = function () {
		return tmfConstants;
	};

	this.getTMFTableDef = function () {
		var colDef = generateArrayList(tmfConstants.dimension.columnDef);
		return colDef.sort(sort_by('order', false, parseInt));
	};

	this.getHistoryTMFTableDef = function () {
		var colDef = generateArrayList(tmfConstants.dimension.historyColumnDef);
		return colDef.sort(sort_by('order', false, parseInt));
	};

	this.getNotificationHeaderTMF = function () {
		var colDef = generateArrayList(tmfConstants.dimension.notificationHeader);
		return colDef.sort(sort_by('order', false, parseInt));
	};

	this.getNotificationListTMF = function () {
		var colDef = generateArrayList(tmfConstants.dimension.notificationList);
		return colDef.sort(sort_by('order', false, parseInt));
	};

	this.getCommentsHeader = function () {
		var colDef = generateArrayList(tmfConstants.dimension.commentHeader);
		return colDef.sort(sort_by('order', false, parseInt));
	};

	function utilityRenderFun(params) {
		var returnElement = document.createElement("div");
		returnElement.setAttribute('class', 'row');

		// Project element
		var projectElement = document.createElement("a");
		projectElement.setAttribute('ng-bind', 'data.wwid');
		projectElement.setAttribute("class",
			"col-sm-8 ml-11 cursor");
		projectElement.setAttribute('data-ng-click',
			'openMyProfileFromList(data)');

		var setOneElements = document.createElement("div");
		setOneElements.setAttribute("class",
			"col-sm-4 displayFlex");

		// favorite element
		if ($rootScope.loggedInUserWWID != undefined) {
			var starResultElement = document.createElement("a");
			var starImageElement = document.createElement("img");
			starResultElement.setAttribute("id", "fav");
			starResultElement.setAttribute("style", "cursor:pointer");

			if (params.data.isFavorite == 'true') {
				starResultElement.setAttribute("data-ng-click",
					"updateIsFav(data)");
				starImageElement.src = "../images/Favorite_On.png";
			} else {
				starResultElement.setAttribute("data-ng-click",
					"updateIsFav(data)");
				starImageElement.src = "../Core/images/Favorite.png";
			}

			starResultElement.appendChild(starImageElement);
			setOneElements.appendChild(starResultElement);
		}

		returnElement.appendChild(setOneElements);
		returnElement.appendChild(projectElement);

		return returnElement;
	};

	function addFamilyName(params) {
		var firstFamilyName = '<span style="text-align:center;" data-ng-bind="data.firstName"></span> <span style="text-align:center;" data-ng-bind="data.familyName"></span>';
		return firstFamilyName;
	}

	function generateArrayList(data) {
		var tmfColDefList = data;
		var MainKey = [];
		var MainValue = "";
		var columnDef = [];
		for (var k in tmfColDefList)
			MainKey.push(k);
		for (var i = 0; i < MainKey.length; i++) {
			MainValue = tmfColDefList[MainKey[i]];

			for (var property in MainValue) {
				if (property === 'cellRenderer') {
					if (MainValue[property] != null) {
						MainValue[property] = eval(MainValue[property]);
					}
				} else if (property == 'width') {
					MainValue[property] = JSON
						.parse(MainValue[property]);
				}
			};
			columnDef.push(MainValue);
			// console.log(columnDef)
		};
		return columnDef;
	};

	function sort_by(field, reverse, primer) {
		var key = primer ? function (x) {
			return primer(x[field]);
		} : function (x) {
			return x[field];
		};
		reverse = !reverse ? 1 : -1;
		return function (a, b) {
			return a = key(a), b = key(b), reverse *
				((a > b) - (b > a));
		};
	};

	/* -------------- Make Favorite Function -------------- */
	this.callMakeFavQuery = function (value) {};


	/* -------------- Delete Favorite Function -------------- */
	this.callDeleteFavQuery = function (value) {};

	/* -------------- View Request Function -------------- */
	this.callViewRCRQuery = function (id) {};

	// Added by Nagesh 9-11-17
	var myProfInfo = '';
	this.callMyProfile = function (value) {
		myProfInfo = value;
		$state.go('viewRequest.detailsHeaderSection', {
			reload: true
		});
	};

	// Added by Nagesh 9-11-17
	this.getMyProfilesInfo = function () {
		return myProfInfo;
		myProfInfo = '';
	};

});