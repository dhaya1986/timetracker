/*
 * ========================================================================
 * Added by Reeth with ref to Modularize view of Filter Section  27-02-1017
 * ========================================================================
 */
app.controller("filterController", ['$scope', '$state', '$rootScope', 'filterService',
    function ($scope, $state, $rootScope, filterService) {
        $scope.init = function () {
            $scope.filterObjects = filterService.getFilter();
            $scope.mode = filterService.getDefaultValues().defaultMode;
            $scope.view = filterService.getDefaultValues().defaultView;
            filterService.resetPageDetails();
            $scope.link = filterService.getDefaultValues().defaultLink;
            $state.go($scope.link, {}, {
                location: false
            });
        };

        $scope.$on('initiateEvent', function (event, b) {
            $rootScope.viewSelected = $scope.view;
            filterService.applyFilterAction($scope.selectedFilterList, $scope.view);
        });

        /*
         * =========================================================FILTER SECTION
         */
        $scope.selectedFilterList = [];
        $rootScope.filterSelectedList = [];

        $scope.selectedFilter = function (key, value) {
            if (key != undefined) {
                var temp = {
                    key: key,
                    value: [value]
                };
                if ($scope.selectedFilterList.length == 0) {
                    $scope.selectedFilterList.push(temp);
                    $rootScope.filterSelectedList = $scope.selectedFilterList;
                } else {
                    for (var i = 0; i < $scope.selectedFilterList.length; i++) {
                        if (key == $scope.selectedFilterList[i].key) {
                            $scope.exists = true;
                            if ($scope.selectedFilterList[i].value.indexOf(value) == -1) {
                                $scope.selectedFilterList[i].value.push(value);
                                break;
                            }
                            break;
                        } else {
                            $scope.exists = false;
                        }
                    }
                    if (!$scope.exists) {
                        $scope.selectedFilterList.push(temp);
                    }
                }

                $scope.count = 0;
                for (var j = 0; j < $scope.selectedFilterList.length; j++) {
                    for (var k = 0; k < $scope.selectedFilterList[j].value.length; k++) {
                        $scope.count += 1;
                    }
                };

            }

        };

        $scope.removeSelected = function (key, selectedValue) {
            for (var i = 0; i < $scope.selectedFilterList.length; i++) {
                if (key == $scope.selectedFilterList[i].key) {
                    var index = $scope.selectedFilterList[i].value.indexOf(selectedValue);
                    $scope.selectedFilterList[i].value.splice(index, 1);
                    if ($scope.selectedFilterList[i].value.length == 0) {
                        $scope.selectedFilterList.splice(i, 1);
                    }
                    $scope.count -= 1;
                };
                if ($scope.selectedFilterList.length == 0) {
                    $rootScope.filterSelectedDataForGlobalSearch = null;
                    $scope.selectedFilterList = [];
                    $rootScope.applyFilterCapture = 0;
                    filterService.resetPageDetails();
                    filterService.applyFilterAction($scope.selectedFilterList, $scope.view);
                }
            }
        };

        var selected_Filter_Data = {
            criteriaList: []
        };

        $scope.applyFilter = function (view) {
            filterService.resetPageDetails();
            $rootScope.cuurViewSelected = view;
            $rootScope.filterSelectedDataForGlobalSearch = $scope.selectedFilterList;
            selected_Filter_Data = $scope.selectedFilterList;
            if ($scope.selectedFilterList.length != 0) {
                $rootScope.applyFilterCapture = 1;
            } else {
                $rootScope.applyFilterCapture = 0;
            }
            filterService.applyFilterAction($scope.selectedFilterList, view);
        };

        $scope.clearFilter = function (view) {
            filterService.resetPageDetails();
            $rootScope.applyFilterCapture = 0;
            $scope.count = 0;
            $scope.selectedFilterList = [];
            $rootScope.filterSelectedList = [];
            $rootScope.filterSelectedDataForGlobalSearch = [];
            filterService.resetPageDetails();
            filterService.applyFilterAction($scope.selectedFilterList, view);
        };

        /*
         * =========================================================VIEW SECTION
         */

        $scope.selectedView = function (view) {
            $scope.view = view;
            $rootScope.viewSelected = view;
            filterService.resetPageDetails();
            if (view == "My Profile") {
                $rootScope.loggedInUserPage = true; // Flag to check MyProfile Page LoggedInUser
                $state.go('viewRequest.detailsHeaderSection', {
                    reload: true
                });
            } else {
                $rootScope.loggedInUserPage = false; // Flag to check MyProfile Page LoggedInUser
                filterService.resetPageDetails();
                filterService.applyFilterAction($scope.selectedFilterList, view);
            }
        };

        /*
         * =========================================================MODE SECTION
         */

        $scope.selectedMode = function (selectedMode) {
            filterService.resetPageDetails();
            $scope.mode = selectedMode;
        };

        $scope.dateSelected = "";
        $scope.setValue = function (value) {
            $scope.dateSelected = value;
        };

        $scope.redirectToSkillsSearchPage = function () {
            filterService.redirectToSkillsSearchPage();
        };

        /* Below addSpace function added to give space before Capital letters during word seperation.
         * By Shashank Honrao on 25-Dec-2017
         * */
        $scope.addSpace = function (value) {
            return value.replace(/([A-Z])/g, ' $1').trim();
        };
    }


]);

app.directive("filterPage", ["$templateCache", function ($templateCache) {
    return {
        scope: false,
        templateUrl: "/Filter/html/filter.xhtml"
    };
}]);