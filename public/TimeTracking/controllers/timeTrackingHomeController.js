app.controller("timeTrackingHomePageController", ['$window', "$interval", '$scope', '$state', '$rootScope', 'timeTrackingService',
    function ($window, $interval, $scope, $state, $rootScope, timeTrackingService) {


        var month = {
            jan: "",
            feb: "",
            mar: "",
            apr: "",
            may: "",
            jun: "",
            jul: "",
            aug: "",
            sep: "",
            oct: "",
            nov: "",
            dec: ""
        };

        var monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var date = new Date();

        var currentMonth = date.getMonth();

        $scope.yearDD = [];
        $scope.editColumnGridOptions = "";
        $scope.editColumnChildGridOptions = "";
        $scope.colList = [];
        $scope.userTrackTimeData = [];
        $scope.userTrackTimeTotalData = [];
        $scope.edittedProjectList = [];
        $scope.userTrackTimeDataCopy = [];
        $scope.userTrackTimeTotalDataCopy = [];
        $scope.totalTrackTimeColDef = [];
        $scope.enableSaveBtn = false;
        $scope.removeAction = 'Remove';
        $scope.addAction = 'Add';
        $scope.disableEdit = false;

        $scope.gridWindowHeight = (window.innerHeight - 300) + 'px';
        /* ================================ AG-GRID GRID OPTIONS SECTION ================================ */
        $scope.defaultViewColDef = timeTrackingService.getTTHomePageColumnDef();
        $scope.userTrackTimeColDef = timeTrackingService.getTTUserTrackTimeColDef();
        $scope.totalTrackTimeColDef = angular.copy($scope.userTrackTimeColDef);
        $scope.allTitles = $scope.defaultViewColDef;
        $scope.colList = $scope.defaultViewColDef;

        function removeCheckboxForTotalGrid() {
            $scope.totalTrackTimeColDef.forEach(function (element, index) {
                if (element.headerName == '' || element.headerName == null || element.headerName == 'Action') {
                    delete element.cellRenderer;
                }
            });
        }
        removeCheckboxForTotalGrid();
        /* ------------ TIME TRACKING HOME PAGE TABLE COL DEFS ------------ */
        $scope.TTHomePageGridOptions = {
            columnDefs: $scope.defaultViewColDef,
            rowData: null,
            debug: false,
            enableSorting: true,
            headerHeight: 40,
            /* gridAutoHeight: true, */
            rowHeight: 40,
            enableColResize: true,
            angularCompileRows: true,
            // don't show the horizontal scrollbar on the top grid
            suppressHorizontalScroll: true,
            suppressDragLeaveHidesColumns: true,
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No Projects to Show</span>',
            onGridReady: function (params) {
                $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                $scope.TTHomePageGridOptions.api.sizeColumnsToFit();
                hideColumns();
            },
            onBodyScroll: function (param) {
                var gridHeight = param.api.rowModel.rowsToDisplay[param.api.rowModel.rowsToDisplay.length - 1].rowTop;
                if (param.direction == 'vertical' && gridHeight - param.top <= 328) {
                    //lc.scrollTop += param.top;
                    $scope.onHomeScroll();
                }
            },
        };
        $scope.editColumnGridOptions = $scope.TTHomePageGridOptions;

        /* ------------ USER TIME TRACK TABLE COL DEFS ------------ */
        $scope.TTUserViewGridOptions = {
            columnDefs: $scope.userTrackTimeColDef,
            rowData: null,
            debug: false,
            enableSorting: true,
            headerHeight: 40,
            rowHeight: 40,
            /*             gridAutoHeight: true, */
            enableColResize: true,
            angularCompileRows: true,
            // don't show the horizontal scrollbar on the top grid
            suppressHorizontalScroll: true,
            suppressDragLeaveHidesColumns: true,
            alignedGrids: [],
            defaultColDef: {
                editable: true
            },
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No data available for the selected year</span>',
            onGridReady: function (params) {
                //getUserSpecificTTProjects($scope.yearSelected);
                $scope.TTUserViewGridOptions.api.sizeColumnsToFit();
                $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                hideColumns();
            }
        };

        // this is the grid options for the bottom grid
        $scope.TTUserViewGridOptionsTotal = {
            columnDefs: $scope.totalTrackTimeColDef,
            rowData: null,
            enableColResize: true,
            debug: false,
            angularCompileRows: true,
            // hide the header on the bottom grid
            headerHeight: 0,
            rowClass: 'bold-row',
            rowHeight: 39,
            alignedGrids: [],
            suppressDragLeaveHidesColumns: true,
            onGridReady: function (params) {
                $scope.TTUserViewGridOptionsTotal.api.sizeColumnsToFit();
                $scope.TTUserViewGridOptionsTotal.api.hideOverlay();
                $('.ag-body-container .ag-row-even').addClass('background_white');
            }
        };

        $scope.TTUserViewGridOptions.alignedGrids.push($scope.TTUserViewGridOptionsTotal);
        $scope.TTUserViewGridOptionsTotal.alignedGrids.push($scope.TTUserViewGridOptions);
        /* ------------ ***** ------------ */

        /* ------------ USER EDIT TIME TRACK TABLE COL DEFS ------------ */
        var tempProjectNumbers = [];

        function sumLoggedTime(event) {
            var temp = null;

            $scope.userTrackTimeData.forEach(function (element) {
                switch (event.colDef.headerName) {
                    case "Jan": {
                        temp += nullEmptyCheck(element.months.jan) ? parseInt(element.months.jan) : 0;
                        $scope.userTrackTimeTotalData[0].months.jan = temp.toString();
                        break;
                    }
                    case "Feb": {
                        temp += nullEmptyCheck(element.months.feb) ? parseInt(element.months.feb) : 0;
                        $scope.userTrackTimeTotalData[0].months.feb = temp.toString();
                        break;
                    }
                    case "Mar": {
                        temp += nullEmptyCheck(element.months.mar) ? parseInt(element.months.mar) : 0;
                        $scope.userTrackTimeTotalData[0].months.mar = temp.toString();
                        break;
                    }
                    case "Apr": {
                        temp += nullEmptyCheck(element.months.apr) ? parseInt(element.months.apr) : 0;
                        $scope.userTrackTimeTotalData[0].months.apr = temp.toString();
                        break;
                    }
                    case "May": {
                        temp += nullEmptyCheck(element.months.may) ? parseInt(element.months.may) : 0;
                        $scope.userTrackTimeTotalData[0].months.may = temp.toString();
                        break;
                    }
                    case "Jun": {
                        temp += nullEmptyCheck(element.months.jun) ? parseInt(element.months.jun) : 0;
                        $scope.userTrackTimeTotalData[0].months.jun = temp.toString();
                        break;
                    }
                    case "Jul": {
                        temp += nullEmptyCheck(element.months.jul) ? parseInt(element.months.jul) : 0;
                        $scope.userTrackTimeTotalData[0].months.jul = temp.toString();
                        break;
                    }
                    case "Aug": {
                        temp += nullEmptyCheck(element.months.aug) ? parseInt(element.months.aug) : 0;
                        $scope.userTrackTimeTotalData[0].months.aug = temp.toString();
                        break;
                    }
                    case "Sep": {
                        temp += nullEmptyCheck(element.months.sep) ? parseInt(element.months.sep) : 0;
                        $scope.userTrackTimeTotalData[0].months.sep = temp.toString();
                        break;
                    }
                    case "Oct": {
                        temp += nullEmptyCheck(element.months.oct) ? parseInt(element.months.oct) : 0;
                        $scope.userTrackTimeTotalData[0].months.oct = temp.toString();
                        break;
                    }
                    case "Nov": {
                        temp += nullEmptyCheck(element.months.nov) ? parseInt(element.months.nov) : 0;
                        $scope.userTrackTimeTotalData[0].months.nov = temp.toString();
                        break;
                    }
                    case "Dec": {
                        temp += nullEmptyCheck(element.months.dec) ? parseInt(element.months.dec) : 0;
                        $scope.userTrackTimeTotalData[0].months.dec = temp.toString();
                        break;
                    }
                }
            });
            $scope.TTUserEditGridOptionsTotal.api.setRowData($scope.userTrackTimeTotalData);
            $scope.TTUserEditGridOptionsTotal.api.sizeColumnsToFit();
            if (angular.equals($scope.userTrackTimeData, $scope.userTrackTimeDataCopy)) {
                $scope.enableSaveBtn = false;
                $scope.edittedProjectList = [];
            } else {
                if (tempProjectNumbers.includes(event.data.projectNumber)) {
                    $scope.enableSaveBtn = true;
                    $scope.edittedProjectList.forEach(function (element, index) {
                        if (element.projectNumber == event.data.projectNumber) {
                            $scope.edittedProjectList[index] = event.data;

                        }
                    });
                } else {
                    $scope.edittedProjectList.push(event.data);
                    tempProjectNumbers.push(event.data.projectNumber);
                    $scope.enableSaveBtn = true;
                }
            }
        }
        $scope.TTUserEditGridOptions = {
            columnDefs: $scope.userTrackTimeColDef,
            rowData: null,
            debug: false,
            enableSorting: true,
            headerHeight: 40,
            rowHeight: 40,
            enableColResize: true,
            stopEditingWhenGridLosesFocus: true,
            angularCompileRows: true,
            // don't show the horizontal scrollbar on the top grid
            suppressHorizontalScroll: true,
            suppressDragLeaveHidesColumns: true,
            singleClickEdit: true,
            alignedGrids: [],
            defaultColDef: {
                editable: true
            },
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No data available for the selected year</span>',
            onGridReady: function (params) {
                $scope.TTUserEditGridOptions.api.setRowData($scope.userTrackTimeData);
                $scope.TTUserEditGridOptions.api.sizeColumnsToFit();
                $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                $('.ag-cell-with-height .ag-cell-value').addClass('editCellCss');
                hideColumns();
            },
            components: {
                numericCellEditor: NumericCellEditor
            },
            onCellEditingStarted: function (event) {
                $scope.enableSaveBtn = false;
                $scope.$apply();
            },
            onCellEditingStopped: function (event) {
                sumLoggedTime(event);
            }
        };

        // this is the grid options for the bottom grid
        $scope.TTUserEditGridOptionsTotal = {
            columnDefs: $scope.totalTrackTimeColDef,
            rowData: null,
            enableColResize: true,
            debug: false,
            angularCompileRows: true,
            // hide the header on the bottom grid
            headerHeight: 0,
            rowClass: 'bold-row',
            rowHeight: 39,
            suppressDragLeaveHidesColumns: true,
            alignedGrids: [],
            //singleClickEdit: true,
            onGridReady: function (params) {
                $scope.TTUserEditGridOptionsTotal.api.setRowData($scope.userTrackTimeTotalData);
                $scope.TTUserEditGridOptionsTotal.api.sizeColumnsToFit();
                $scope.TTUserEditGridOptionsTotal.api.hideOverlay();
                $('.ag-body-container').addClass('background_white');
            }
        };

        $scope.TTUserEditGridOptions.alignedGrids.push($scope.TTUserEditGridOptionsTotal);
        $scope.TTUserEditGridOptionsTotal.alignedGrids.push($scope.TTUserEditGridOptions);
        /* ------------ ***** ------------ */

        /* ================================ ******************* ================================ */

        var scope = this;

        $scope.init = function () {
            timeTrackingService.setPageNo(0);
            $scope.showUserPage = 'UserHomePage';
            var currentDate = new Date();
            $scope.yearSelected = currentDate.getFullYear().toString();
            $scope.busy = true;
            //getProjectsFromRnD();

            getHomePageProjectList();
        };
        $scope.init();

        /* ================================ GET HOME PAGE PROJECT LIST FROM RND LINK SECTION ================================ */
        $scope.homePageProjectList = [];
        $scope.totalCount = 0;

        $scope.onHomeScroll = function () {
            if ($scope.totalCount > 0 && $scope.totalCount > $scope.homePageProjectList.length) {
                getHomePageProjectList();
            };
        };

        function getHomePageProjectList() {
            if ($scope.busy) {
                $scope.busy = false;
                timeTrackingService.getUserProjects().then(function (response) {
                    $scope.busy = true;
                    if (response.data.status.code == 0) {
                        //if (timeTrackingService.getPageNo() == 1) {
                        $scope.homePageProjectList = [];
                        //$scope.totalCount = 0;
                        //}
                        //$scope.totalCount = response.data.summary.totalRecords;
                        Array.prototype.push.apply($scope.homePageProjectList, response.data.projects);
                    } else {
                        alert("Error while fetching Projects");
                    };
                    //$scope.homePageProjectListCopy = angular.copy($scope.homePageProjectList);
                    $scope.TTHomePageGridOptions.api.setRowData($scope.homePageProjectList);
                    $scope.TTHomePageGridOptions.api.sizeColumnsToFit();
                });
            }

        };

        //$scope.homePageProjectListCopy = [];
        function getProjectsFromRnD() {
            timeTrackingService.getUserRnDProjects().then(function (response) {
                if (response.data.status.code == 0) {
                    $scope.homePageProjectList = [];
                    //$scope.totalCount = response.data.summary.totalRecords;
                    console.log(response);

                    Array.prototype.push.apply($scope.homePageProjectList, response.data.projects);
                } else {
                    alert("Error while fetching Projects");
                };
                //$scope.homePageProjectListCopy = angular.copy($scope.homePageProjectList);
                $scope.TTHomePageGridOptions.api.setRowData($scope.homePageProjectList);
                // $scope.TTHomePageGridOptions.api.sizeColumnsToFit();
            });
        }
        $scope.refreshProjectsList = function () {
            timeTrackingService.getUserRnDProjects().then(function (response) {
                if (response.data.status.code == 0) {
                    $scope.homePageProjectList = [];
                    // $scope.totalCount = response.data.summary.totalRecords;
                    Array.prototype.push.apply($scope.homePageProjectList, response.data.projects);
                } else {
                    alert("Error while fetching Projects");
                };
                //$scope.homePageProjectListCopy = angular.copy($scope.homePageProjectList);
                $scope.TTHomePageGridOptions.api.setRowData($scope.homePageProjectList);
                $scope.TTHomePageGridOptions.api.sizeColumnsToFit();
            });
        };

        $scope.modalObject = {
            "modalHeader": "",
            "modalMessage": "",
            "actionBtn": "",
            "cancelBtn": "",
            "status": ""
        };

        function resetModalObject() {
            $scope.modalObject = {
                "modalHeader": "",
                "modalMessage": "",
                "actionBtn": "",
                "cancelBtn": "",
                "status": ""
            };
        }

        $scope.callAddRemoveProjectToTrackTimeRest = function (value) {
            if (value == 'Yes' && $scope.showUserPage == 'UserHomePage') {
                timeTrackingService.addProjectToTrackTime($scope.selectedProject).then(function (response) {
                    if (response.data.status.code == 0) {
                        /*  $scope.modalObject.modalHeader = "Success Message";
                         $scope.modalObject.modalMessage = $scope.selectedProject.projectName.bold() + " with number " + $scope.selectedProject.projectNumber.bold() + " added successfully";
                         $scope.modalObject.actionBtn = "Ok";
                         $scope.modalObject.status = '1';
                         $("#confirmationModal").modal("show"); */
                        $scope.selectedProject = [];
                    } else {
                        alert("Error while adding project to track time");
                    }
                });
            } else if (value == 'Yes' && ($scope.showUserPage == "UserViewPage" || $scope.showUserPage == "UserEditPage")) {
                var totalTimeTempObj = {
                    "projectName": "Time Spent",
                    "months": month
                };
                timeTrackingService.removeProjectToTrackTime($scope.selectedProject).then(function (response) {
                    if (response.data.status.code == 0) {
                        $scope.modalObject.modalHeader = "Success Message";
                        $scope.modalObject.modalMessage = $scope.selectedProject.projectName.bold() + " with number " + $scope.selectedProject.projectNumber.bold() + " removed successfully";
                        $scope.modalObject.actionBtn = "Ok";
                        $scope.modalObject.status = '1';
                        //$("#confirmationModal").modal("show");
                        $scope.selectedProject = [];
                        $scope.userTrackTimeTotalData = [];
                        $scope.userTrackTimeData = [];
                        getUserSpecificTTProjects($scope.yearSelected);
                        /* if ($scope.totalCount != '0' && angular.isDefined(response.data.timeTrackingResponse.timeTrack))
                            $scope.userTrackTimeData = response.data.timeTrackingResponse.timeTrack;
                        totalTimeTempObj.months = response.data.timeTrackingResponse.monthlyTotal;
                        $scope.userTrackTimeTotalData.push(totalTimeTempObj);
                        $scope.userTrackTimeDataCopy = angular.copy($scope.userTrackTimeData);
                        $scope.userTrackTimeTotalDataCopy = angular.copy($scope.userTrackTimeTotalData);
                        refreshAg_Grid($scope.userTrackTimeData, $scope.userTrackTimeTotalData); */
                    } else {
                        alert("Error while removing project from track time");
                    }
                });
            } else if (value == 'Ok') {
                $("#confirmationModal").modal("hide");
                resetModalObject();
            } else {
                $scope.selectedProject.trackTime = false;
                $("#confirmationModal").modal("hide");
                resetModalObject();
                $scope.selectedProject = [];
            }
        };

        $scope.addRemoveProjectToTrackTime = function (request, action) {
            if (action == 'Add') {
                $scope.selectedProject = request;
                $scope.modalObject.modalHeader = "Confirmation Message";
                $scope.modalObject.modalMessage = "Are you sure you want to add " + request.projectName.bold() + " with number " + request.projectNumber.bold() + " to Time Tracking?";
                $scope.modalObject.actionBtn = "Yes";
                $scope.modalObject.cancelBtn = "No";
                $scope.modalObject.status = '2';
                $("#confirmationModal").modal("show");
            } else {
                var checkProjectLog = isEmpty(request.months);
                if (checkProjectLog) {
                    $scope.modalObject.modalHeader = "Alert Message";
                    $scope.modalObject.modalMessage = "You cannot remove " + request.projectName.bold() + " with number " + request.projectNumber.bold() + " from Time Tracking. Action Disabled.";
                    $scope.modalObject.actionBtn = "Ok";
                    $scope.modalObject.status = '1';
                    $("#confirmationModal").modal("show");
                } else {
                    $scope.selectedProject = request;
                    $scope.modalObject.modalHeader = "Confirmation Message";
                    $scope.modalObject.modalMessage = "Are you sure you want to remove " + request.projectName.bold() + " with number " + request.projectNumber.bold() + " from Time Tracking?";
                    $scope.modalObject.actionBtn = "Yes";
                    $scope.modalObject.cancelBtn = "No";
                    $scope.modalObject.status = '2';
                    $("#confirmationModal").modal("show");
                }

            };
        };

        /* ================================ ******************* ================================ */

        /* ================================ GET USER SPECIFIC PROJECT LOG SECTION ================================ */
        function getUserSpecificTTProjects(year) {
            var totalTimeTempObj = {
                "projectName": "Time Spent",
                "months": month
            };
            timeTrackingService.getUserTimeTrackProjects(year).then(function (response) {
                if (response.data.status.code == 0) {
                    $scope.userTrackTimeTotalData = [];
                    $scope.userTrackTimeData = [];
                    $scope.yearDD = ["2019"]
                    $scope.yearSelected = $scope.yearDD[0];
                    /* if (angular.isDefined(response.data.timeTrackingResponse.yearList) && response.data.timeTrackingResponse.yearList.length > 0) {
                        $scope.yearDD = response.data.timeTrackingResponse.yearList.sort();
                        $scope.yearDD.reverse();
                    } else {
                        $scope.yearDD.push($scope.yearSelected);
                    };

                    if (!$scope.yearDD.includes($scope.yearSelected)) {
                        $scope.yearDD.push($scope.yearSelected);
                    }
                    var index = $scope.yearDD.indexOf($scope.yearSelected);
                    $scope.yearSelected = $scope.yearDD[index]; */
                    if (response.data.timetrack.length > '0' && angular.isDefined(response.data.timetrack))
                        $scope.userTrackTimeData = response.data.timetrack;
                    totalTimeTempObj.months = response.data.monthlyTotal.monthlyTotal;
                    $scope.userTrackTimeTotalData.push(totalTimeTempObj);
                    $scope.userTrackTimeDataCopy = angular.copy($scope.userTrackTimeData);
                    $scope.userTrackTimeTotalDataCopy = angular.copy($scope.userTrackTimeTotalData);
                } else {
                    alert("Error while fetching Projects");
                };
                refreshAg_Grid($scope.userTrackTimeData, $scope.userTrackTimeTotalData);
            });
        };

        function refreshAg_Grid(data, totalData) {
            if ($scope.showUserPage == "UserViewPage") {
                angular.element(document).ready(function () {
                    //if(angular.isDefined($scope.TTUserViewGridOptions.api)){
                    $scope.TTUserViewGridOptions.api.setRowData(data);
                    $scope.TTUserViewGridOptionsTotal.api.setRowData(totalData);
                    $scope.TTUserViewGridOptions.api.sizeColumnsToFit();
                    $scope.TTUserViewGridOptionsTotal.api.sizeColumnsToFit();
                    //}
                });
            } else if ($scope.showUserPage == "UserEditPage") {
                angular.element(document).ready(function () {
                    //if(angular.isDefined($scope.TTUserEditGridOptions.api)){
                    $scope.TTUserEditGridOptions.api.setRowData(data);
                    $scope.TTUserEditGridOptions.api.sizeColumnsToFit();
                    $scope.TTUserEditGridOptionsTotal.api.setRowData(totalData);
                    $scope.TTUserEditGridOptionsTotal.api.sizeColumnsToFit();
                    //}
                });
            }
        };

        $scope.onYearSelect = function (year) {
            // getUserSpecificTTProjects(year);
            var editableTillMonth = timeTrackingService.getTMFConstants().dimension.TTEnableEdit.TTEnableEdit.month;
            var currentYear = date.getFullYear().toString();
            $scope.yearSelected = year;
            if (currentMonth > monthsArray.indexOf[editableTillMonth] && year < currentYear) {
                $scope.disableEdit = true;
            }
            $scope.edittedProjectList = [];
            if ($scope.showUserPage == "UserViewPage") {
                getUserSpecificTTProjects($scope.yearSelected);
            } else if ($scope.showUserPage == "UserEditPage") {
                $scope.showUserPage = "UserHomePage";
                $scope.$apply();
                $scope.userTrackTimeColDef = angular.copy(setEditable($scope.userTrackTimeColDef));
                $scope.showUserPage = "UserEditPage";
                $scope.TTUserEditGridOptions = {
                    columnDefs: $scope.userTrackTimeColDef,
                    rowData: null,
                    debug: false,
                    enableSorting: true,
                    headerHeight: 40,
                    rowHeight: 40,
                    enableColResize: true,
                    stopEditingWhenGridLosesFocus: true,
                    angularCompileRows: true,
                    // don't show the horizontal scrollbar on the top grid
                    suppressHorizontalScroll: true,
                    suppressDragLeaveHidesColumns: true,
                    singleClickEdit: true,
                    alignedGrids: [],
                    defaultColDef: {
                        editable: true
                    },
                    overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No data available for the selected year</span>',
                    onGridReady: function (params) {
                        $scope.TTUserEditGridOptions.api.setRowData($scope.userTrackTimeData);
                        $scope.TTUserEditGridOptions.api.sizeColumnsToFit();
                        $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                        $('.ag-cell-with-height .ag-cell-value').addClass('editCellCss');

                    },
                    components: {
                        numericCellEditor: NumericCellEditor
                    },
                    onCellEditingStarted: function (event) {
                        $scope.enableSaveBtn = false;
                        $scope.$apply();
                    },
                    onCellEditingStopped: function (event) {
                        sumLoggedTime(event);
                    }
                };
                $scope.$apply();

                getUserSpecificTTProjects($scope.yearSelected);
            }

        };

        $scope.changeView = function (view) {
            $scope.showUserPage = view;
            $rootScope.showTTHomeIcon = true;
            $scope.allTitles = $scope.userTrackTimeColDef;
            $scope.colList = $scope.userTrackTimeColDef;
            timeTrackingService.setPageNo(0);
            getUserSpecificTTProjects($scope.yearSelected);
            if (view == "UserViewPage") {
                $scope.editColumnGridOptions = $scope.TTUserViewGridOptions;
                $scope.editColumnChildGridOptions = $scope.TTUserViewGridOptionsTotal;
            } else if (view == "UserEditPage") {
                $scope.userTrackTimeColDef = angular.copy(setEditable($scope.userTrackTimeColDef));
                $scope.enableSaveBtn = false;
                $scope.editColumnGridOptions = $scope.TTUserEditGridOptions;
                $scope.editColumnChildGridOptions = $scope.TTUserEditGridOptionsTotal;
                refreshAg_Grid($scope.userTrackTimeData, $scope.userTrackTimeTotalData);
            }
        };

        //On click on cancel button in user time edit page
        $scope.onCancel = function () {
            $scope.editColumnGridOptions = $scope.TTUserViewGridOptions;
            $scope.editColumnChildGridOptions = $scope.TTUserViewGridOptionsTotal;
            $scope.userTrackTimeData = angular.copy($scope.userTrackTimeDataCopy);
            $scope.userTrackTimeTotalData = angular.copy($scope.userTrackTimeTotalDataCopy);
            $scope.showUserPage = "UserViewPage";
            refreshAg_Grid($scope.userTrackTimeData, $scope.userTrackTimeTotalData);
        };

        //Save updated time function
        $scope.saveTime = function () {
            timeTrackingService.saveTime($scope.edittedProjectList).then(function (response) {
                if (response.data.status.code == 0) {
                    $scope.enableSaveBtn = false;
                    $scope.showUserPage = "UserViewPage";
                    $scope.edittedProjectList = [];
                    tempProjectNumbers = [];
                    $scope.editColumnGridOptions = $scope.TTUserViewGridOptions;
                    $scope.editColumnChildGridOptions = $scope.TTUserViewGridOptionsTotal;
                    refreshAg_Grid($scope.userTrackTimeData, $scope.userTrackTimeTotalData);

                    $scope.modalObject.modalHeader = "Success Message";
                    $scope.modalObject.modalMessage = "Saved successfully";
                    $scope.modalObject.actionBtn = "Ok";
                    $scope.modalObject.status = '1';
                    $("#confirmationModal").modal("show");
                } else {
                    alert("Error while saving data");
                }
            });
        };
        /* ================================ EDIT COLUMN SECTION ================================ */
        var allChecks = [];
        $scope.selectedAll = true;

        function hideColumns() {
            for (var i = 0; i < allChecks.length; i++) {
                $scope.editColumnGridOptions.columnApi.setColumnVisible(allChecks[i], false);
                //$scope.TTHomeGridOptionsTotal.columnApi.setColumnVisible(allChecks[i], false);
            }
            $scope.editColumnGridOptions.api.sizeColumnsToFit();
            //$scope.TTHomeGridOptionsTotal.api.sizeColumnsToFit();
        };

        $scope.hideColumn = function (show) {
            $scope.errorMessage = [];
            var currckVal = $(this).html($("input:checked").val());
            if (!currckVal[0].selectedAll && allChecks.length == $scope.colList.length - 1) {
                currckVal[0].selectedAll = true;
                $scope.errorMessage.push('Should have atleast one field selected.');
                var modalOptions = {
                    closeButtonText: 'Ok',
                    headerText: 'Message',
                    bodyText: $scope.errorMessage
                };
                messageService.showModal({}, modalOptions);
            } else {
                if (!currckVal[0].selectedAll && !(allChecks.length == $scope.colList.length - 1))
                    allChecks.push(currckVal[0].colHeads.field);
                else if (currckVal[0].selectedAll)
                    allChecks.splice(allChecks.indexOf(currckVal[0].colHeads.field), 1);
                $scope.editColumnGridOptions.columnApi.setColumnVisible(currckVal[0].colHeads.colId, show);
                $scope.editColumnGridOptions.api.refreshCells();
                $scope.editColumnGridOptions.api.sizeColumnsToFit();
                if (angular.isDefined($scope.editColumnChildGridOptions) && $scope.editColumnChildGridOptions != '') {
                    $scope.editColumnChildGridOptions.columnApi.setColumnVisible(currckVal[0].colHeads.colId, show);
                    $scope.editColumnChildGridOptions.api.refreshCells();
                    $scope.editColumnChildGridOptions.api.sizeColumnsToFit();
                }
            }
        };

        // Reset Filter
        $scope.resetFilter = function () {
            $("#filterText input:checkbox").prop('checked', true);
            allChecks = [];
            var j = 0;
            do {
                var texts = "";
                texts += $scope.colList[j].colId;
                $scope.editColumnGridOptions.columnApi.setColumnVisible(texts, true);
                $scope.editColumnGridOptions.api.refreshCells();
                $scope.editColumnGridOptions.api.sizeColumnsToFit();
                if (angular.isDefined($scope.editColumnChildGridOptions) && $scope.editColumnChildGridOptions != '') {
                    $scope.editColumnChildGridOptions.columnApi.setColumnVisible(texts, true);
                    $scope.editColumnChildGridOptions.api.refreshCells();
                    $scope.editColumnChildGridOptions.api.sizeColumnsToFit();
                }
                j++;
            }
            while (j < $scope.colList.length)
        };

        function nullEmptyCheck(value) {
            if (angular.isDefined(value) && value != null && value != '') {
                return true;
            } else {
                return false;
            }
        };

        /*AG-GRID SET EDITABLE TRUE or FALSE*/
        function setEditable(data) {
            var currentDate = new Date();
            var currentYear = currentDate.getFullYear().toString();
            var tmfColDefList = data;
            var MainKey = [];
            var MainValue = "";
            var columnDef = [];
            for (var k in tmfColDefList)
                MainKey.push(k);
            for (var i = 0; i < MainKey.length; i++) {
                MainValue = tmfColDefList[MainKey[i]];
                for (var property in MainValue) {
                    if ($scope.yearSelected == currentYear) {
                        if ((property == 'editable' && MainValue.headerName != 'Project Name' && MainValue.headerName != 'Action') && (monthsArray.indexOf(MainValue.headerName) <= currentMonth)) {
                            MainValue[property] = true;
                        } else if ((property == 'editable' && MainValue.headerName != 'Project Name' && MainValue.headerName != 'Action') && (monthsArray.indexOf(MainValue.headerName) > currentMonth)) {
                            MainValue[property] = false;
                        }
                    } else {
                        if ((property == 'editable' && MainValue.headerName != 'Project Name' && MainValue.headerName != 'Action') && (!$scope.disableEdit)) {
                            MainValue[property] = true;
                        }

                    };

                };
                columnDef.push(MainValue);
            };
            return columnDef;
        };

        function isEmpty(data) {
            for (var key in data) {
                if (data[key] != '')
                    return true;
            }
            return false;
        }


        /* ================================ AG-GRID Cell EDIT HELPER FUNCTION SECTION ================================ */
        /* function isCharNumeric(charStr) {
            return !!/\d/.test(charStr);
        } */
        //$scope.cellValue = '';
        var charCount = 0;

        function isCharNumeric(charStr, charCode) {
            /* if (charCode === 46 && !$scope.cellValue.includes('.')) {
            $scope.cellValue += charStr;
                return true;
            } */
            charCount += 1;
            if (charCount < 4 && !!/\d/.test(charStr)) {
                return true;
            } else {
                return false;
            }

        }

        function getCharCodeFromEvent(event) {
            event = event || window.event;
            return (typeof event.which == "undefined") ? event.keyCode : event.which;
        }

        var selectedColHeaderName = "";

        function isKeyPressedNumeric(event) {
            charCount = (angular.isDefined(event.path[0].value) && event.path[0].value != null && event.path[0].value != '') ? event.path[0].value.length : 0;
            var charCode = getCharCodeFromEvent(event);
            var charStr = String.fromCharCode(charCode);
            return isCharNumeric(charStr, charCode);
        }

        // function to act as a class
        function NumericCellEditor() {}

        // gets called once before the renderer is used
        NumericCellEditor.prototype.init = function (params) {
            // create the cell
            this.eInput = document.createElement('input');
            this.eInput.style.width = "100%";
            charCount = (angular.isDefined(params.value) && params.value != null && params.value != '') ? params.value.length : 0;
            selectedColHeaderName = params.column.colDef.headerName;
            /* $scope.cellValue = params.value;
            $scope.cellValue.toString(); //for decimal entry */
            if (isCharNumeric(params.charPress)) {
                this.eInput.value = params.charPress;
            } else {
                if (params.value !== undefined && params.value !== null) {
                    this.eInput.value = params.value;
                }
            }

            var that = this;
            this.eInput.addEventListener('keypress', function (event) {
                if (!isKeyPressedNumeric(event)) {
                    that.eInput.focus();
                    if (event.preventDefault) event.preventDefault();
                } else if (that.isKeyPressedNavigation(event)) {
                    event.stopPropagation();
                }
            });

            // only start edit if key pressed is a number, not a letter
            var charPressIsNotANumber = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
            this.cancelBeforeStart = charPressIsNotANumber;
        };

        NumericCellEditor.prototype.isKeyPressedNavigation = function (event) {
            return event.keyCode === 39 ||
                event.keyCode === 37;
        };


        // gets called once when grid ready to insert the element
        NumericCellEditor.prototype.getGui = function () {
            return this.eInput;
        };

        // focus and select can be done after the gui is attached
        NumericCellEditor.prototype.afterGuiAttached = function () {
            this.eInput.focus();
        };

        // returns the new value after editing
        NumericCellEditor.prototype.isCancelBeforeStart = function () {
            return this.cancelBeforeStart;
        };

        // returns the new value after editing
        NumericCellEditor.prototype.getValue = function () {
            return this.eInput.value;
        };
    }
]);