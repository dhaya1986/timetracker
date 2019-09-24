/*
 * ========================================================================
 * Added by Reeth with ref to Modularize view of Filter Section  27-02-1017
 * ========================================================================
 */

app.service("filterService", function ($rootScope, filterProvider) {
    var filterConstants = {
        "mode": filterProvider.getTmfConstants().generic.mode,
        "modeSection": pushModeSection(filterProvider.getTmfConstants().dimension.modeSection),
        "view": filterProvider.getTmfConstants().generic.view,
        "viewSection": convertToArray(filterProvider.getTmfConstants().generic.view_multiline),
        "filter": filterProvider.getTmfConstants().generic.filter,
        "filterSection": pushFilterSection(filterProvider.getTmfConstants().dimension.filterSection)
    };

    this.getFilter = function () {
        return filterConstants;
    };

    var defaultValues = {
        "defaultView": filterProvider.getTmfConstants().generic.default_view,
        "defaultMode": filterProvider.getTmfConstants().generic.default_mode,
        "defaultLink": filterProvider.getTmfConstants().generic.default_link,
    };

    /*
     * Get_Filtered_Data Code included by Shashank Honrao on 20-Nov-2017
     * */

    this.getFilteredData = function (data, view) {
        filterProvider.setFilteredData(data, view);
    };

    this.getDefaultValues = function () {
        return defaultValues;
    };

    var selectedFilter = "";

    this.getSelectedFilter = function () {
        return selectedFilter;
    };

    var selectedView = "";

    this.getSelectedView = function () {
        return selectedView;
    };

    this.applyFilterAction = function (val1, val2) {
        selectedFilter = val1;
        selectedView = val2;
        filterProvider.callRestQuery(selectedFilter, selectedView);
    };

    function pushFilterSection(filterConfig) {
        var filterSectionDimension = filterConfig;
        var MainKey = [];
        var MainValue = "";
        var FilterSection = [];
        for (var k in filterSectionDimension) MainKey.push(k);
        for (var i = 0; i < MainKey.length; i++) {
            MainValue = filterSectionDimension[MainKey[i]];
            var dropdownList = [];
            for (var property in MainValue) {
                if (property.includes('_multiline')) {
                    var listArray = getList(MainValue[property]);
                    for (var m = 0; m < listArray.length; m++) {
                        dropdownList.push(listArray[m]);
                    }
                    MainValue.list = dropdownList;
                };
            };
            FilterSection.push(MainValue);
        };
        return FilterSection;
    };

    function pushModeSection(modeConfig) {
        var modeSectionDimension = modeConfig;
        var MainKey = [];
        var MainValue = "";
        var ModeSection = [];
        for (var k in modeSectionDimension) MainKey.push(k);
        for (var i = 0; i < MainKey.length; i++) {
            MainValue = modeSectionDimension[MainKey[i]];
            ModeSection.push(MainValue);
        };
        return ModeSection;
    }

    function getList(multiline) {
        var tempFirstList = convertToArray(multiline);
        var listArray = [];
        var pushValue = "";
        for (var i = 0; i < tempFirstList.length; i++) {
            var list = tempFirstList[i].split("|");
            if (list.length > 1) {
                pushValue = {
                    "firstLevel": list[0],
                    "secondLevel": list[1].split("~")
                };
            } else {
                pushValue = {
                    "firstLevel": list[0],
                    "secondLevel": []
                };
            }
            listArray.push(pushValue);
        };
        return listArray;
    };

    function convertToArray(string) {
        string = string.replace(/\r/g, "");
        string = string.replace(/\n/g, ",");
        var array = string.split(",");
        return array;
    };

    // Added By Nagesh Jha
    this.redirectToSkillsSearchPage = function () {
        filterProvider.redirectToSkillsSearchPage();
    };

    this.resetPageDetails = function (value) {
        filterProvider.resetPageDetails();
    };
});