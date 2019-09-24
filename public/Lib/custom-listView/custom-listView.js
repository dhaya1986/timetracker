(() => {


        agGrid.initialiseAgGridWithAngular1(angular);

        angular.module('customAgGrid', ['agGrid']);


        // =================================== FACTORY ===========================================


        angular.module('customAgGrid').factory('customAgGridHandler', customAgGridHandler);

        function customAgGridHandler() {
            let gridControl, serverCallMethod = {};
            let gridCustomizations, customHeaders, customCells, sortModel = [];

            return {
                setGridControl: setGridControl,
                getGridControl: getGridControl,
                setServerCallMethod: setServerCallMethod,
                getServerCallMethod: getServerCallMethod,
                refreshGrid: refreshGrid,

                setCustomCells: setCustomCells,
                getCustomCells: getCustomCells,
                setSortModel: setSortModel,
                getSortModel: getSortModel
            };

            function setGridControl(gridControl) {
                this.gridControl = gridControl;
            }

            function getGridControl() {
                return this.gridControl;
            }

            function setGridStyle(gridStyle) {
                this.gridStyle = gridStyle;
            }

            function getGridStyle() {
                return this.gridStyle;
            }

            function setServerCallMethod(func) {
                this.serverCallMethod = func;
            }

            function getServerCallMethod() {
                return this.serverCallMethod;
            }

            function refreshGrid(data) {
                this.gridControl.api.setRowData(data);
                this.gridControl.api.sizeColumnsToFit();
            }


            function setCustomCells(customCells) {
                this.customCells = customCells;
            }

            function getCustomCells() {
                return this.customCells;
            }

            function setSortModel(sortModel) {
                this.sortModel = sortModel;
            }

            function getSortModel() {
                return this.sortModel;
            }
        }


        // ================================ DIRECTIVE ==========================================


        angular.module('customAgGrid').directive('customListView', customAgGridDirective);

        function customAgGridDirective() {
            return {
                restrict: 'EA',
                controller: ['$scope', '$timeout', 'customAgGridHandler', function($scope, $timeout, customAgGridHandler) {

                    $scope.columnCheckList = [];

                    $scope.gridOptions = customAgGridHandler.getGridControl();


                    // ============================================= CUSTOM FILTER ============================================================= //


                    // custom filter template, must implement Init, setupGui, getGui, doesFilterPass, isFilterActive, getModel, setModel methods
                    // for custom filter
                    function CustomFilter() {}

                    CustomFilter.prototype.init = function(params) {
                        this.valueGetter = params.valueGetter;
                        this.filterText = null;
                        this.setupGui(params);
                    }

                    // html template for the custom fitler is defined
                    CustomFilter.prototype.setupGui = function(params) {
                        this.gui = document.createElement('div');
                        this.gui.innerHTML =
                            `<div class="custom-filter-container">
                            <div class="custom-filter-label">Custom Filter</div>
                            <div>
                                <input class="custom-filter-searchBox" type="text" id="customFilterText" placeholder="Full name search..." />
                            </div>
                            <div class="custom-filter-searchBtn">
                                <button id="searchInDB">Search</button>
                            </div>
                        </div>`;
                        this.gui.querySelector('#searchInDB').onclick = $scope.searchAction;
                        this.eFilterText = this.gui.querySelector('#customFilterText');
                        this.eFilterText.addEventListener("changed", listener);
                        this.eFilterText.addEventListener("paste", listener);
                        this.eFilterText.addEventListener("input", listener);

                        // IE doesn't fire changed for special keys (eg delete, backspace), so need to
                        // listen for this further ones
                        this.eFilterText.addEventListener("keydown", listener);
                        this.eFilterText.addEventListener("keyup", listener);

                        var that = this;

                        function listener(event) {
                            that.filterText = event.target.value;
                            params.filterChangedCallback();
                        }
                    }
                    CustomFilter.prototype.getGui = function() {
                        return this.gui;
                    }
                    CustomFilter.prototype.doesFilterPass = function(params) {
                        // make sure each word passes separately, ie search for firstname, lastname
                        var passed = true;
                        var valueGetter = this.valueGetter;
                        this.filterText.toLowerCase().split(" ").forEach(function(filterWord) {
                            var value = valueGetter(params);
                            if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
                                passed = false;
                            }
                        });

                        return passed;
                    }
                    CustomFilter.prototype.isFilterActive = function() {
                        return this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
                    }
                    CustomFilter.prototype.getModel = function() {
                        var model = { value: this.filterText.value };
                    }
                    CustomFilter.prototype.setModel = function(model) {
                        this.eFilterText.value = model.value;
                    }




                    // =================================================== CUSTOM FILTER ====================================================== //


                    // Event handler for Search action inside custom filter template
                    $scope.searchAction = function() {
                        let activeFilters = [];
                        $scope.gridOptions.columnDefs.forEach(function(ele) {
                            if ($scope.gridOptions.api.getFilterInstance(ele.field).isFilterActive())
                                activeFilters.push({ field: ele.field, value: $scope.gridOptions.api.getFilterInstance(ele.field).filterText });
                        });

                        const serverSearchMethod = customAgGridHandler.getServerCallMethod();
                        serverSearchMethod(activeFilters).then(function(data) {
                            $scope.gridOptions.api.addItems(data, false);
                        });
                    };


                    // if custom filter to be shown, then
                    if (typeof customAgGridHandler.getServerCallMethod() === "function") {
                        $scope.gridOptions.columnDefs.forEach(function(ele) {
                            ele.filter = CustomFilter;
                            ele.visible = true;
                            ele.sortByAsc = false;
                            ele.sortByDesc = false;
                        });

                    } else {

                        // if custom filter is not required
                        $scope.gridOptions.columnDefs.forEach(function(ele) {
                            ele.visible = true;
                            ele.sortByAsc = false;
                            ele.sortByDesc = false;
                        });
                    }


                    // ==================================================================================================== //


                    // edit columns in grid related methods
                    $scope.hideColumn = function() {
                        let checkStatus = $('#' + this.coldef.field)[0].checked;
                        this.coldef.visible = checkStatus;
                        $scope.gridOptions.columnApi.setColumnVisible(this.coldef.field, this.coldef.visible);
                    };

                    $scope.resetColumnSelection = function() {
                        $scope.gridOptions.columnDefs.forEach(function(col) {
                            $('#' + col.field)[0].checked = true;
                            col.visible = true;
                            $scope.gridOptions.columnApi.setColumnVisible(col.field, col.visible);
                        });
                    };



                    $scope.sortByColumn = function() {
                        // let checkStatus = $('.' + this.coldef.field)[0].checked;
                        let selectedField = this.coldef.field;
                        $scope.gridOptions.columnDefs.forEach(function(col) {
                            if (col.field === selectedField) {
                                if ($('.' + selectedField)[0].checked) {
                                    col.sortByAsc = true;
                                    col.sortByDesc = false;
                                    $('.' + selectedField)[1].checked = false;
                                    customAgGridHandler.setSortModel({
                                        field: selectedField,
                                        sortType: 'asc'
                                    });
                                } else if ($('.' + selectedField)[1].checked) {
                                    col.sortByAsc = false;
                                    col.sortByDesc = true;
                                    $('.' + selectedField)[0].checked = false;
                                    customAgGridHandler.setSortModel({
                                        field: selectedField,
                                        sortType: 'desc'
                                    });
                                } else {
                                    col.sortByAsc = false;
                                    col.sortByDesc = false;
                                    $('.' + selectedField)[0].checked = false;
                                    $('.' + selectedField)[1].checked = false;
                                    customAgGridHandler.setSortModel({});
                                }
                            } else {
                                col.sortByAsc = false;
                                col.sortByDesc = false;
                                $('.' + selectedField)[0].checked = false;
                                $('.' + selectedField)[1].checked = false;
                                customAgGridHandler.setSortModel({});
                            }
                        });
                    }


                    /* callback passed to timeout to be called at end of event loop when $scope.gridOptions will be ready,
                     else .api and other props not available till rendering is done
                    */
                    $timeout(function() {
                        if ($scope.gridOptions.rowData === null || $scope.gridOptions.rowData.length == 0) {
                            $scope.gridOptions.api.setRowData(null);
                        }

                        $scope.gridOptions.api.sizeColumnsToFit();
                    }, 0);

                    // window.testing = $scope.gridOptions; // uncomment, if troubleshooting

                }],
            //     template: `
            //     <div class="custom-listView-container">
            //     <div class="container">
            //         <div class="row edit-column-row">
            //             <div class="pull-right col-xs-2">
            //                 <div class="dropdown pull-right custom-listView-dropdown">
            //                     <button class="custom-listView-dropdown-button" data-toggle="dropdown">
            //                         Edit column
            //                         <span class="custom-listView-dropdown-menu-hidden"></span>
            //                     </button>
            //                     <span class="dropdown-menu dropdown-menu-transition custom-listView-span-hidden" ng-click="$event.stopPropagation()">
            //                         <span class="custom-listView-dropdown-menu-label">Select columns to display</span>
            //                     <ul id="customDDList">
            //                         <li ng-repeat="coldef in gridOptions.columnDefs">
            //                             <label class="custom-listView-dropdown-menu-checkbox-label" ng-click="hideColumn()">
            //                                         <input id="{{coldef.field}}" type="checkbox" checked/>
            //                                         &nbsp;{{coldef.headerName}}
            //                                     </label>
            //                         </li>
            //                     </ul>
            //                     <div class="custom-listView-dropdown-menu-resetBtn"><button class="btn" ng-click="resetColumnSelection()">Reset</button></div>
            //                     </span>
            //                 </div>
            //             </div>

            //             <div class="pull-right col-xs-2">

            //             </div>
            //         </div>
            //     </div>
            //     <div class="custom-grid-container">
            //         <div ag-grid="gridOptions" class="custom-grid"></div>
            //     </div>
            // </div>`,
                template: ` <div ag-grid="gridOptions" class="custom-grid"></div>`
            };
        }

    })();