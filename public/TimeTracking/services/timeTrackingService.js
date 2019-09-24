app.service('timeTrackingService', ['genericSetting', 'perDimensionSetting', 'restProvider', '$window', '$q', '$http', 'logging',
    function (genericSetting, perDimensionSetting, restProvider, $window, $q, $http, logging) {

        this.ipAddress = '';


        var tts = this;

        var loggedinUserId = $window.loggedinUserId;

        var metaData = {
            "userId": loggedinUserId,
            "clientType": "Web Application",
            "version": "0.0",
            "ip": this.ipAddress,
            "timeOffset": new Date().getTimezoneOffset(),
            "logging_details": {
                "project": "CG510_PROFILES",
                "interface_id": "",
                "dimension_name": "",
                "dimension_value": "",
                "step_id": "",
                "parent_step_instance_id": "",
                "step_instance_id": "",
                "interface_instance_id": ""
            }
        };

        var tmfConstants = {
            "generic": genericSetting.getGenericConstants(),
            "dimension": perDimensionSetting
                .getDimensionConstants()
        };

        this.getTMFConstants = function () {
            return tmfConstants;
        }
        var pageNo = 0;
        var pageSize = parseInt(tmfConstants.generic.pagesize);

        /* GET/SET PAGE NUMBER */
        this.getPageNo = function () {
            return pageNo;
        };

        tts.setPageNo = function (value) {
            pageNo = value;
        };

        /* GET/SET View Page */
        var currentView = "UserViewPage";
        this.getTrackTimeView = function () {
            return currentView;
        };

        tts.setTrackTimeView = function (view) {
            currentView = view;
        };

        this.getTTHomePageColumnDef = function () {
            var colDef = generateArrayList(tmfConstants.dimension.TTHomePageColDef);
            return colDef.sort(sort_by('colId', false, parseInt));
        };

        this.getTTUserTrackTimeColDef = function () {
            var colDef = generateArrayList(tmfConstants.dimension.TTUserTrackTimeColDef);
            return colDef.sort(sort_by('colId', false, parseInt));
        };

        this.getTTAllUserColDef = function () {
            var colDef = generateArrayList(tmfConstants.dimension.TTAdminAllUserColDef);
            return colDef.sort(sort_by('colId', false, parseInt));
        };

        this.getTTAllProjectsColDef = function () {
            var colDef = generateArrayList(tmfConstants.dimension.adminAllProjectsColDef);
            return colDef.sort(sort_by('colId', false, parseInt));
        };

        function trackTimeCheckBox(params) {
            var actions = '<div><input type="checkbox" data-ng-disabled="data.trackTime" title="Add Project" data-ng-model="data.trackTime" ng-click="addRemoveProjectToTrackTime(data,addAction)"/></div>';
            return actions;
        }

        function removeProjectFromTrackTime(params) {
            var actions = '<div style="text-align: center;cursor: pointer;"><img src="TimeTracking/images/remove.png" style="width:15px;" title="Remove Project" ng-click="addRemoveProjectToTrackTime(data,removeAction)"></img></div>';
            return actions;
        }

        function changeCellColor(params) {
            if (parseInt(params.value) > 100 && params.data.projectName == 'Time Spent') {
                return {
                    'background': '#FFAD8F',
                    'padding-left': '8px !important',
                    'padding-top': '10px !important',
                    'margin': '0px !important'
                };
            } else {
                return params.value;
            }
        }

        function adminApprove(params) {
            var actions = '<div><input type="checkbox" data-ng-model="data.adminApprove" ng-click="adminApproveProject(data)"/></div>';
            return actions;
        }

        function descriptionRender(params) {
            return "<span title='" + params.value +
                "'>" + params.value +
                "</span>";
        }

        var rndLinkPagination = {
            "paginationEntityType": (tmfConstants.dimension.RnDLinkPagination.rndLinkPagination.paginationEntityType != null) ? tmfConstants.dimension.RnDLinkPagination.rndLinkPagination.paginationEntityType : "",
            "pagination": tmfConstants.dimension.RnDLinkPagination.rndLinkPagination.pagination,
            "startIndex": tmfConstants.dimension.RnDLinkPagination.rndLinkPagination.startIndex,
            "endIndex": tmfConstants.dimension.RnDLinkPagination.rndLinkPagination.endIndex
        }

        function getUserRnDProjectsRest() {
            /*  var inputObj = {
                 "UIRequest": {
                     "UIRequest": {
                         "headerInfo": {
                             "userID": loggedinUserId,
                             "UISessionID": "",
                             "source": "Time Tracking",
                             "destination": ""
                         },
                         "userSelectedGlobalFilter": {
                             "projectLeader": [],
                             "teamContact": [loggedinUserId]
                         },
                         "pagination": rndLinkPagination,
                         "projectType": ["product", "nonProductLaunch", "program", "partner"]
                     }
                 },

                 "metadata": metaData,
                 "paginationInfo": {
                     "pagesize": pageSize,
                     "pageNumber": pageNo
                 }
             }; */
            var inputObj = {
                "metadata": {
                    "userId": "admin1"
                }
            }
            var inputObject = restProvider.getREST_OBJECT().GET_USER_HOME_PROJECTS_FROM_RND;
            inputObject.data = inputObj;
            return $http(inputObject);

        };

        this.getUserRnDProjects = function (year) {
            var deferred = $q.defer();
            tts.setPageNo(0);
            getUserRnDProjectsRest().then(function (response, status, headers) {
                if (response.data.status.code == 0) {
                    tts.setPageNo(parseInt(pageNo) + 1);
                };
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function getUserProjectsRest() {
            var inputObj = {
                "metadata": {
                    "userId": "admin1"
                }
            };
            inputObj.metadata.ip = this.ipAddress;
            var inputObject = restProvider.getREST_OBJECT().GET_USER_HOME_PROJECTS;
            inputObject.data = inputObj;
            return $http(inputObject);

        };

        this.getUserProjects = function (year) {
            var deferred = $q.defer();
            getUserProjectsRest().then(function (response, status, headers) {
                if (response.data.status.code == 0) {
                    tts.setPageNo(parseInt(pageNo) + 1);
                };
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function addProjectToTrackTimeRest(request) {
            var inputObj = {
                "projectNumbers": [],
                "metadata": {
                    "userId": "admin1"
                }
            };
            inputObj.projectNumbers.push(request.projectNumber);
            var inputObject = restProvider.getREST_OBJECT().ADD_PROJECT_TO_TRACKTIME;
            inputObject.data = inputObj;
            return $http(inputObject);

        };

        this.addProjectToTrackTime = function (request) {
            var deferred = $q.defer();
            addProjectToTrackTimeRest(request).then(function (response, status, headers) {
                if (response.data.status.code == 0) {};
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function getUserTimeTrackProjectsRest(year) {
            var inputObj = {
                "year": year,
                "metadata": {
                    "userId": "admin1"
                }
            };
            var inputObject = restProvider.getREST_OBJECT().GET_USER_TRACKTIME;
            inputObject.data = inputObj;
            return $http(inputObject);

        }

        this.getUserTimeTrackProjects = function (year) {
            var deferred = $q.defer();
            getUserTimeTrackProjectsRest(year).then(function (response, status, headers) {
                if (response.data.status.code == 0) {}
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function saveTimeRest(requests) {
            var inputObj = {
                "timeTracking": requests,
                "metadata": {
                    "userId": "admin1"
                }
            };
            var inputObject = restProvider.getREST_OBJECT().SAVE_TIME_LOGGED;
            inputObject.data = inputObj;
            return $http(inputObject);

        }

        this.saveTime = function (requests) {
            var deferred = $q.defer();
            saveTimeRest(requests).then(function (response, status, headers) {
                if (response.data.status.code == 0) {}
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function removeProjectToTrackTimeRest(request) {
            var inputObj = {
                "metadata": {
                    "userId": "admin1"
                },
                "timeTracking": request
            };
            var inputObject = restProvider.getREST_OBJECT().REMOVE_PROJECT_TO_TRACKTIME;
            inputObject.data = inputObj;
            return $http(inputObject);

        };

        this.removeProjectToTrackTime = function (request) {
            var deferred = $q.defer();
            removeProjectToTrackTimeRest(request).then(function (response, status, headers) {
                if (response.data.status.code == 0) {};
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        /* ADMIN SECTION */
        function getAllProjectsRest(year) {
            var inputObj = {
                "year": year,
                "metadata": {
                    "userId": "admin1"
                }
            };
            var inputObject = restProvider.getREST_OBJECT().GET_ALL_ADMIN_PROJECTS;
            inputObject.data = inputObj;
            return $http(inputObject);
        };

        this.getAllProjects = function (year) {
            var deferred = $q.defer();
            getAllProjectsRest(year).then(function (response, status, headers) {
                if (response.data.status.code == 0) {
                    tts.setPageNo(parseInt(pageNo) + 1);
                };
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function getAllUsersRest(year) {
            var inputObj = {
                "year": year,
                "metadata": {
                    "userId": "admin1"
                }
            };
            var inputObject = restProvider.getREST_OBJECT().GET_ALL_USERS_LIST_ADMIN;
            inputObject.data = inputObj;
            return $http(inputObject);
        };

        this.getAllUsers = function (year) {
            var deferred = $q.defer();
            getAllUsersRest(year).then(function (response, status, headers) {
                if (response.data.status.code == 0) {
                    tts.setPageNo(parseInt(pageNo) + 1);
                };
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        //Approve Project In ALL PROJECTS tab
        function adminApproveProjectRest(request, year) {
            var inputObj = {
                "metadata": {
                    "userId": "admin1"
                },
                "project": [],
                "year": year
            };
            inputObj.project.push(request);
            var inputObject = restProvider.getREST_OBJECT().GET_ADMIN_APPROVE_PROJECT;
            inputObject.data = inputObj;
            return $http(inputObject);

        };

        this.adminApproveProject = function (request, year) {
            var deferred = $q.defer();
            adminApproveProjectRest(request, year).then(function (response, status, headers) {
                if (response.data.status.code == 0) {};
                deferred.resolve(response);
            });
            return deferred.promise;
        };

        function exportTableRest(year) {
            var inputObj = {
                "metadata": {
                    "userId": "admin1"
                },
                "year": year
            };
            var inputObject = restProvider.getREST_OBJECT().EXPORT_ALL_USERS_LIST;
            inputObject.data = inputObj;
            return $http(inputObject);
        }

        this.exportTable = function (year) {
            exportTableRest(year).then(function (response, status, headers) {
                var today = new Date();
                var dateformate = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
                var blob = new Blob([response.data], {
                    type: 'application/octet-stream'
                });
                saveAs(blob, "Track Time(" + dateformate + ").xlsx");
            });
        }

        /* Function to handle Column def from TMF */
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
                        };
                    } else if (property === 'cellStyle') {
                        if (MainValue[property] != null) {
                            MainValue[property] = eval(MainValue[property]);
                        };
                    } else if (property == 'width') {
                        MainValue[property] = JSON
                            .parse(MainValue[property]);
                    } else if (property == 'minWidth') {
                        MainValue[property] = JSON
                            .parse(MainValue[property]);
                    } else if (property == 'suppressSizeToFit') {
                        MainValue[property] = (MainValue[property] == "true") ? true :
                            false;
                    } else if (property == 'cellClass') {
                        MainValue[property] = MainValue[property];
                    } else if (property == 'editable') {
                        MainValue[property] = (MainValue[property] == "true") ? true :
                            false;
                    };
                };
                columnDef.push(MainValue);
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

    }
]);