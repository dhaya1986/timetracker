/*
 * ========================================================================
 * Added by Rajasekhar with ref to Modularize view of ListView Section  07-03-2017
 * ========================================================================
 */

agGrid.initialiseAgGridWithAngular1(angular);
app.controller('listViewController', ['$scope', "$rootScope", "$q",
    "$location", "$window", "$state", "$timeout", "listService",
    function ($scope, $rootScope, $q, $location, $window, $state, $timeout, listService) {
        $rootScope.listObjects = [];
        $rootScope.profilesAllData = [];
        $rootScope.switchViewGlobalData = $rootScope.globalSearchData;

        $scope.scroll = function () {
            $timeout(function () {
                $rootScope.$broadcast('initiateEvent', null);
            }, 500);
        };

        var allChecks = [];
        $scope.selectedAll = true;

        var colDef = [];

        $scope.allTitles = colDef;
        $scope.gridOptions = {
            columnDefs: colDef,
            rowData: [],
            enableSorting: true,
            enableColResize: true,
            debug: false,
            rowHeight: 40,
            headerHeight: 40,
            gridAutoHeight: true,
            angularCompileRows: true,
            enableFilter: true,
            suppressDragLeaveHidesColumns: true,
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No Profile to Show</span>'
        };
        $scope.init = function () {
            colDef = listService.getTableDef();
            $scope.allTitles = colDef;
            angular.element(document).ready(function () {
                $scope.gridOptions.api.setColumnDefs(colDef);
                $scope.refreshListView($rootScope.listObjects);
            });
            $scope.viewSelected = $rootScope.viewSelected
            sizeToFit();
        };

        $scope.$on('applyFilter', function (event, response) {
            /* $scope.totalCount = response.data.size;
            if (listService.getPageNumber() == 2) { //change to 1 once
                $rootScope.tileObjects = [];
                $rootScope.profilesAllData = [];
            }
            if (response.data.Profiles) {
                $scope.noRecordsFound = false;
                for (var i = 0; i < response.data.Profiles.length; i++) {
                    if (response.data.Profiles[i].departmentDescription != undefined && response.data.Profiles[i].departmentDescription != '' && response.data.Profiles[i].departmentDescription != null) {
                        response.data.Profiles[i].departmentDescription = response.data.Profiles[i].departmentDescription.trim();
                    }
                    $rootScope.profilesAllData.push(response.data.Profiles[i]);
                }
                $rootScope.listObjects = $rootScope.profilesAllData;
            } else {
                $scope.noRecordsFound = true;
                $rootScope.listObjects = [];
            } */

            $scope.init();
        });

        /* ----------------- Favorite Function ----------------- */
        $scope.updateIsFav = function (value) {
            if (value.isFavorite == 'true') {
                listService.delIsFav(value).then(function (response) {
                    if (response.status.code == "0") {
                        value.isFavorite = "false";
                        $scope.refreshListView($rootScope.listObjects);
                    }
                });
            } else if (value.isFavorite == 'false' || value.isFavorite == null) {
                listService.addIsFav(value).then(function (response) {
                    if (response.status.code == "0") {
                        value.isFavorite = "true";
                        value.favoriteID = response.favorite.FAVORITE_ID;
                        $scope.refreshListView($rootScope.listObjects);
                    }
                });
            }
        };

        $scope.refreshListView = function (data) {
            angular.element(document).ready(function () {
                $scope.gridOptions.api.setRowData(data);
                $scope.gridOptions.api.sizeColumnsToFit();
                hideColumns();
            });
        };

        function hideColumns() {
            for (var i = 0; i < allChecks.length; i++) {
                $scope.gridOptions.columnApi.setColumnVisible(allChecks[i], false);
            }
            $scope.gridOptions.api.sizeColumnsToFit();
        };

        function sizeToFit() {
            $scope.gridOptions.api.sizeColumnsToFit();
        };

        $scope.hideColumn = function (show) {
            $scope.errorMessage = [];
            var currckVal = $(this).xhtml($("input:checked").val());
            if (!currckVal[0].selectedAll && allChecks.length == colDef.length - 1) {
                currckVal[0].selectedAll = true;
                $scope.errorMessage.push('Should have atleast one field selected.');
                var modalOptions = {
                    closeButtonText: 'Ok',
                    headerText: 'Message',
                    bodyText: $scope.errorMessage
                };
                //messageService.showModal({}, modalOptions);
            } else {
                if (!currckVal[0].selectedAll && !(allChecks.length == colDef.length - 1))
                    allChecks.push(currckVal[0].colHeads.field);
                else if (currckVal[0].selectedAll)
                    allChecks.splice(allChecks.indexOf(currckVal[0].colHeads.field), 1);
                $scope.gridOptions.columnApi.setColumnVisible(currckVal[0].colHeads.field, show);
                $scope.gridOptions.api.refreshCells();
                sizeToFit();
            }
        };

        // Reset Filter
        $scope.resetFilter = function () {
            $("#filterText input:checkbox").prop('checked', true);
            allChecks = [];
            var j = 0;
            do {
                var texts = "";
                texts += colDef[j].field;
                $scope.gridOptions.columnApi.setColumnVisible(texts, true);
                sizeToFit();
                j++;
            }
            while (j < colDef.length)
        };

        $scope.goToRequest = function (value) {
            listService.goToRequest(value);
        };

        // Added By Nagesh Jha 8-11-2017
        $scope.openMyProfileFromList = function (value) {
            listService.openMyProfileFromList(value);
        };

        $scope.myPagingFunction = function () {
            $timeout(function () {
                if ($scope.totalCount > $rootScope.listObjects.length) {
                    $rootScope.$broadcast('initiateEvent', null);
                }
            }, 500);
        };
    }

]);

app.directive("listPage", ["$templateCache", function ($templateCache) {
    return {
        scope: false,
        templateUrl: "/List/html/listView.html"
    };
}]);