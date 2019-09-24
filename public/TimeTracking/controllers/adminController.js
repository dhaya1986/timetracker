app.controller("adminController", ['$scope', 'timeTrackingService',
    function ($scope, timeTrackingService) {


        $scope.allProjects = [];
        $scope.allUsersList = [];
        $scope.yearDD = [];
        $scope.projectsCount = '0';
        $scope.usersCount = '0';


        $scope.allProjectsColDef = timeTrackingService.getTTAllProjectsColDef();
        $scope.allUsersColDef = timeTrackingService.getTTAllUserColDef();

        $scope.init = function () {
            //$scope.setTab(1);
            $scope.yearDD = [];
            var currentDate = new Date();
            $scope.yearDD.push(currentDate.getFullYear().toString());
            $scope.yearSelected = $scope.yearDD[0];
            timeTrackingService.setPageNo(0);
        };
        $scope.init();

        $scope.allProjectsGridOptions = {
            columnDefs: $scope.allProjectsColDef,
            rowData: null,
            debug: false,
            enableSorting: true,
            headerHeight: 40,
            rowHeight: 40,
            enableColResize: true,
            angularCompileRows: true,
            // don't show the horizontal scrollbar on the top grid
            suppressHorizontalScroll: true,
            suppressDragLeaveHidesColumns: true,
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No data available for the selected year</span>',
            onGridReady: function (params) {
                $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                $scope.allProjectsGridOptions.api.sizeColumnsToFit();
                $scope.allTitles = $scope.allProjectsColDef;
                $scope.colList = $scope.allProjectsColDef;
                $scope.editColumnGridOptions = $scope.allProjectsGridOptions;
                $scope.allProjectsBusy = true;
                getAllProjects();
            },
            onBodyScroll: function (param) {
                var gridHeight = param.api.rowModel.rowsToDisplay[param.api.rowModel.rowsToDisplay.length - 1].rowTop;
                if (param.direction == 'vertical' && gridHeight - param.top <= 328) {
                    //lc.scrollTop += param.top;
                    //$scope.adminScroll();
                }
            }
        };

        $scope.allUsersGridOptions = {
            columnDefs: $scope.allUsersColDef,
            rowData: null,
            debug: false,
            enableSorting: true,
            headerHeight: 40,
            rowHeight: 40,
            enableColResize: true,
            angularCompileRows: true,
            // don't show the horizontal scrollbar on the top grid
            suppressHorizontalScroll: true,
            suppressDragLeaveHidesColumns: true,
            overlayNoRowsTemplate: '<span class="ag-overlay-loading-center">No data available for the selected year</span>',
            onGridReady: function (params) {
                $('.ag-fresh .ag-body .ag-body-viewport-wrapper .ag-body-viewport').addClass('ag-showOverFlow-Y');
                $scope.allUsersGridOptions.api.sizeColumnsToFit();
                $scope.allTitles = $scope.allUsersColDef;
                $scope.colList = $scope.allUsersColDef;
                $scope.editColumnGridOptions = $scope.allUsersGridOptions;
                hideColumns();
                $scope.allUsersBusy = true;
                getAllUsers();
            },
            onBodyScroll: function (param) {
                var gridHeight = param.api.rowModel.rowsToDisplay[param.api.rowModel.rowsToDisplay.length - 1].rowTop;
                if (param.direction == 'vertical' && gridHeight - param.top <= 328) {
                    //lc.scrollTop += param.top;
                    //$scope.adminScroll();
                }
            }
        };

        $scope.adminScroll = function () {
            if ($scope.view == 1 && $scope.projectsCount > 0 && $scope.projectsCount != $scope.allProjects.length) {
                getAllProjects();
            } else if ($scope.view == 2 && $scope.usersCount > 0 && $scope.usersCount != $scope.allUsersList.length) {
                getAllUsers();
            }
        }

        $scope.onYearSelect = function (year) {
            $scope.yearSelected = year;
            timeTrackingService.setPageNo(0);
            if ($scope.view == 1) {
                getAllProjects();
            } else if ($scope.view == 2) {
                getAllUsers();
            }
        }

        /* GET ALL PROJECTS FUNCTION */
        function getAllProjects() {
            if ($scope.allProjectsBusy) {
                $scope.allProjectsBusy = false;
                timeTrackingService.getAllProjects($scope.yearSelected).then(function (response) {
                    $scope.allProjectsBusy = true;
                    if (response.data.status.code == 0) {
                        //if (timeTrackingService.getPageNo() == 1) {
                        $scope.allProjects = [];
                        $scope.yearDD = [];
                        var currentDate = new Date();
                        $scope.yearDD.push(currentDate.getFullYear().toString());
                        $scope.yearSelected = $scope.yearDD[0];
                        //}
                        //$scope.projectsCount = response.data.summary.totalRecords;
                        $scope.usersCount = angular.isDefined(response.data.totalUsers) ? response.data.totalUsers : 0;
                        //$scope.yearDD = angular.isDefined(response.data.yearList)?response.data.yearList:[];
                        /* if (angular.isDefined(response.data.yearList)) {
                            response.data.yearList.forEach(function (element, index) {
                                if (!$scope.yearDD.includes(element))
                                    $scope.yearDD.push(element);
                            });
                        }

                        var index = $scope.yearDD.indexOf($scope.yearSelected);
                        $scope.yearSelected = $scope.yearDD[index]; */
                        $scope.yearDD = ["2019"]
                        $scope.yearSelected = $scope.yearDD[0];

                        if (angular.isDefined(response.data.Projects) && response.data.Projects.length > 0) {
                            Array.prototype.push.apply($scope.allProjects, response.data.Projects);
                        }
                    } else {
                        alert("Error while fetching all projects list");
                    };
                    $scope.allProjectsGridOptions.api.setRowData($scope.allProjects);
                    $scope.allProjectsGridOptions.api.sizeColumnsToFit();
                    $scope.allProjectsGridOptions.api.refreshCells();
                });
            }

        };

        /* GET ALL USERS FUNCTION */
        function getAllUsers() {
            if ($scope.allUsersBusy) {
                $scope.allUsersBusy = false;
                timeTrackingService.getAllUsers($scope.yearSelected).then(function (response) {
                    $scope.allUsersBusy = true;
                    if (response.data.status.code == 0) {
                        //if (timeTrackingService.getPageNo() == 1) {
                        $scope.allUsersList = [];
                        //}
                        $scope.yearDD = ["2019"]
                        $scope.yearSelected = $scope.yearDD[0];
                        //$scope.usersCount = response.data.summary.totalRecords;
                        /*$scope.yearDD = response.data.yearList; */
                        if (angular.isDefined(response.data.allUsers) && response.data.allUsers.length > 0) {
                            Array.prototype.push.apply($scope.allUsersList, response.data.allUsers);
                        }
                    } else {
                        alert("Error while fetching all users list");
                    };
                    $scope.allUsersGridOptions.api.setRowData($scope.allUsersList);
                    $scope.allUsersGridOptions.api.sizeColumnsToFit();
                });
            }
        };

        /* Admin Approve Projects */
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

        $scope.calladminApproveProjectRest = function (value) {
            if (value == 'Yes') {
                /* timeTrackingService.adminApproveProject($scope.selectedProject).then(function (response) {
                    if (response.data.status.code == 0) {
                        $scope.modalObject.modalHeader = "Success Message";
                        $scope.modalObject.modalMessage = $scope.selectedProject.projectName + " (" + $scope.selectedProject.projectNumber + ")" + " Saved successfully";
                        $scope.modalObject.actionBtn = "Ok";
                        $scope.modalObject.status = '1';
                        $("#confirmationModal").modal("show");
                    } else {
                        alert("Error while approving project");
                    }
                }); */
            } else if (value == 'Ok') {
                $("#confirmationModal").modal("hide");
                resetModalObject();
            }
        };
        $scope.adminApproveProject = function (request) {
            timeTrackingService.adminApproveProject(request, $scope.yearSelected).then(function (response) {
                if (response.data.status.code == 0) {
                    getAllProjects();
                    //$scope.usersCount = response.data.summary.totalRecords;
                    $scope.modalObject.modalHeader = "Success Message";
                    var tempMsg = request.adminApprove ? " is now eligible for Export." : " is now ineligible for Export.";
                    $scope.modalObject.modalMessage = request.projectName.bold() + " with number " + request.projectNumber.bold() + tempMsg;
                    $scope.modalObject.actionBtn = "Ok";
                    $scope.modalObject.status = '1';
                    $("#confirmationModal").modal("show");
                } else {
                    alert("Error while approving project");
                }
            });
        }

        $scope.onExportClick = function () {
            timeTrackingService.exportTable($scope.yearSelected);
        };

        $scope.view = 1;
        $scope.isSetTab = function (value) {
            return view;
        };
        $scope.setTab = function (value) {
            $scope.view = value;
            if ($scope.view == 1) {
                $scope.init();
            }
            timeTrackingService.setPageNo(0);
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
                if (angular.isDefined($scope.editColumnChildGridOptions) && $scope.editColumnChildGridOptions != '') {
                    $scope.editColumnChildGridOptions.columnApi.setColumnVisible(texts, true);
                }
                j++;
            }
            while (j < $scope.colList.length)
            $scope.editColumnGridOptions.api.refreshCells();
            $scope.editColumnGridOptions.api.sizeColumnsToFit();
        };


    }
]);