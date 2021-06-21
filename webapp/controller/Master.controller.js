sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "com/sap/sobeys/controller/BaseController",
    'sap/m/MessageBox',
    'sap/m/MessageToast',
    "com/sap/sobeys/model/formatter"
], function(JSONModel, BaseController, MessageBox, MessageToast, formatter) {
    "use strict";

    return BaseController.extend("com.sap.sobeys.controller.Master", {

        formatter: formatter,
        afinalFilter: [],

        onInit: function() {
            this._view = this.getView();
            this._router = this.getOwnerComponent().getRouter();
            this._oMultiInput = this.getView().byId("multiInput");

            let viewModel = new JSONModel({
                busy: false,
                currency: "USD"
            });

            let dateModel = new JSONModel({
                orderDate: new Date()
            });

            this._view.setModel(viewModel, "viewModel");
            this._viewModel = this._view.getModel("viewModel");

            this._view.setModel(dateModel, "dateModel");
            this._dateModel = this._view.getModel("dateModel");

            this._ordersModel = this.getOwnerComponent().getModel();

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            this.byId("ddpick").setMinDate(tomorrow);

        },

        onBeforeRebindTable: function(oEvent) {
            var mBindingParams = oEvent.getParameter("bindingParams");
            if (this.afinalFilter.length > 0) {
                mBindingParams.filters.push(this.afinalFilter);
            }
        },
        // SAPUI5 Control Events


        getTable: function() {
            return this.getView().byId("poTable").getTable();
        },
        getTableItems: function() {
            return this.getTable().getBinding("items");
        },

        onFilterChange: function(oEvent) {
            var aQuery = ["Departent", "Calculated", "Supplier", "SupplierName", "SupplyLocation", "Store", "ReceivingLocation",
                "VSRNumber", "BuyerNumber", "ArticleNumber", "RetailUnits", "Cases", "OrderDate", "ShipDate", "DeliveryDate", "TransportationPartner",
                "Exception", "ExceptionLevel", "Status", "TempZone", "VendorLeadTime", "Item", "ItemDescription", "Variant", "OrdUnitQty", "Pack",
                "OrdQty", "OrderReach", "Weight", "ListPrice", "DiscountAmt", "DiscountType", "OrderPrice", "NetAmount", "SKUID", "Currency",
                "TI", "HI", "UPC", "Recost", "PurgeQty", "Shrinkage"
            ];

            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                this.afinalFilter = [];
                var aTaskFilter = [];
                for (var i = 0; i < aQuery.length; i++) {
                    var obj = this.byId(aQuery[i]);
                    if (obj) {
                        if (obj.getSelectedKeys) { //MultiSelect
                            var sQuery = obj.getSelectedKeys();
                            if (sQuery) {

                                var orFilter = [];
                                for (var j = 0; j < sQuery.length; j++) {
                                    orFilter.push(new sap.ui.model.Filter({
                                        path: aQuery[i],
                                        operator: sap.ui.model.FilterOperator.EQ,
                                        value1: sQuery[j]
                                    }));
                                }

                                if (orFilter.length > 0) {
                                    aTaskFilter.push(new sap.ui.model.Filter(orFilter, false));
                                }
                            }


                        } else if (obj.getTokens) { //Multi Input
                            var sTokens = obj.getTokens();
                            if (sTokens) {
                                var orFilter = [];
                                for (var j = 0; j < sTokens.length; j++) {
                                    orFilter.push(new sap.ui.model.Filter({
                                        path: aQuery[i],
                                        operator: sap.ui.model.FilterOperator[sTokens[j].data("range").operation],
                                        value1: sTokens[j].data("range").value1,
                                        value2: sTokens[j].data("range").value2
                                    }));
                                }
                                if (orFilter.length > 0) {
                                    aTaskFilter.push(new sap.ui.model.Filter(orFilter, false));
                                }
                            }
                        } else if (obj.getDateValue) { //Date
                            var qdate = obj.getDateValue();
                            if (qdate) {
                                qdate.setMilliseconds(0);
                                qdate.setSeconds(0);
                                qdate.setMinutes(0);
                                qdate.setHours(0);

                                // Set second date as end of day
                                var dDateEnd = new Date(qdate);
                                dDateEnd.setMilliseconds(0);
                                dDateEnd.setSeconds(59);
                                dDateEnd.setMinutes(59);
                                dDateEnd.setHours(23);

                                var dStr = "";
                                if (aQuery[i] !== "Calculated") {
                                    if (qdate.getMonth() < 9) dStr += "0";
                                }
                                dStr += (qdate.getMonth() + 1) + "/" + qdate.getDate() + "/" + qdate.getFullYear();
                                aTaskFilter.push(new sap.ui.model.Filter({
                                    path: aQuery[i],
                                    operator: sap.ui.model.FilterOperator.EQ,
                                    value1: dStr
                                }));

                            }
                        }
                    }
                }
                this.afinalFilter.push(new sap.ui.model.Filter(aTaskFilter, true));
                // this.byId("poTable").fireBeforeRebindTable();
                //var mBindingParams = this.byId("poTable").mBindingParams;
                var test = this.getTable().getBinding("items");

                if (this.afinalFilter.length > 0) {
                    // test.aFilters = this.afinalFilter;
                    test.filter(this.afinalFilter);
                    test.applyFilter();
                    // test.aApplicationFilters = this.afinalFilter;
                    test.refresh(true);
                    //mBindingParams.filters.push(this.afinalFilter);
                }
            }


        },

        dateToYMD: function(date) {
            var strArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var d = date.getDate();
            var m = strArray[date.getMonth()];
            var y = date.getFullYear();
            return '' +
                m + ' ' + d + ', ' + y;
        },
        getSelect: function(sId) {
            return this.getView().byId(sId);
        },

        getSelectedItemText: function(oSelect) {
            return oSelect.getSelectedItem() ? oSelect.getSelectedItem().getKey() : "";

        },

        filterTable: function(aCurrentFilterValues) {
            this.getTableItems().filter(aCurrentFilterValues);
        },

        getFilters: function(aCurrentFilterValues) {
            this.aFilters = [];

            this.aFilters = this.aKeys.map(function(sCriteria, i) {
                return new Filter(sCriteria, sap.ui.model.FilterOperator.Contains, aCurrentFilterValues[i]);
            });

            return this.aFilters;
        },

        getFilterCriteria: function(aCurrentFilterValues) {
            return this.aKeys.filter(function(el, i) {
                if (aCurrentFilterValues[i] !== "") {
                    return el;
                }
            });
        },

        // Dynamic Page Content - Table
        // User selects a row
        // Enable Copy Contract button
        onSelectionChange: function(oEvent) {
            this.byId("btnCopy").setEnabled(true);
        },

        // Dynamic Page Content - Table
        // User clicks on a row
        // Status of contract = "Returned" || "Pending" - Navigate to Create Vendor Contract app
        // Otherwise open the 2nd column for display
        onListItemPress: function(oEvent) {

            // If contract is in approved state, then simply display 
            var contractPath = oEvent.getSource().getBindingContextPath().replace("/", "");
            var oNextUIState;

            //    this.getOwnerComponent().getHelper().then(function(oHelper) {
            // oNextUIState = oHelper.getNextUIState(0);
            this._router.navTo("detail", {
                "layout": 0, //oNextUIState.layout,
                "contract": contractPath
            });
            //  }.bind(this));
        },

        // Dynamic Page Content - Table
        // User clicks on Approve button
        // Approve the contract after confirmation from user...
        onApproveContractPress: function(oEvent) {
            MessageBox.information("Functionality not yet implemented...", {
                title: "Dang it !"
            });
        },

        onSubmitDialogPress: function() {
            if (!this.oSubmitDialog) {
                this.oSubmitDialog = new sap.m.Dialog({
                    id: "subdlg",
                    type: sap.m.DialogType.Message,
                    title: "Confirm",
                    content: [
                        new sap.m.Label({
                            text: "Do you want to change this order?",
                            labelFor: "submissionNote"
                        }),
                        new sap.m.TextArea("submissionNote", {
                            width: "100%",
                            placeholder: "Add reason (required)",
                            liveChange: function(oEvent) {
                                var sText = oEvent.getParameter("value");
                                this.oSubmitDialog.getBeginButton().setEnabled(sText.length > 0);
                            }.bind(this)
                        })
                    ],
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Submit",
                        enabled: false,
                        press: function() {
                            var sText = this.getCoreId("submissionNote").getValue();
                            MessageToast.show("Response is: " + sText);
                            this.oSubmitDialog.close();
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function() {
                            this.oSubmitDialog.close();
                        }.bind(this)
                    })
                });
            }

            this.oSubmitDialog.open();
        },

        onDeleteOrder: function() {
            if (!this.oDeleteDialog) {
                this.oDeleteDialog = new sap.m.Dialog({
                    id: "deldlg",
                    type: sap.m.DialogType.Message,
                    title: "Confirm",
                    content: [
                        new sap.m.Label({
                            text: "Do you want to delete these items?",
                            labelFor: "deleteNote"
                        }),
                        new sap.m.TextArea("deleteNote", {
                            width: "100%",
                            placeholder: "Add reason (required)",
                            liveChange: function(oEvent) {
                                var sText = oEvent.getParameter("value");
                                this.oDeleteDialog.getBeginButton().setEnabled(sText.length > 0);
                            }.bind(this)
                        })
                    ],
                    beginButton: new sap.m.Button({
                        type: sap.m.ButtonType.Emphasized,
                        text: "Submit",
                        enabled: false,
                        press: function() {
                            var sText = this.getCoreId("deleteNote").getValue();
                            MessageToast.show("Response is: " + sText);
                            this.oDeleteDialog.close();
                        }.bind(this)
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancel",
                        press: function() {
                            this.oDeleteDialog.close();
                        }.bind(this)
                    })
                });
            }

            this.oDeleteDialog.open();
        },


        onValueHelpRequested: function(oEvent) {
            var eventid = oEvent.getParameter("id");
            this._oMultiInput = this.byId(eventid);
            this._oValueHelpDialog = sap.ui.xmlfragment("com.sap.sobeys.fragments.BuyingUnitsValueHelp", this);
            this.getView().addDependent(this._oValueHelpDialog);
            if (eventid.includes("Cases")) {
                this._oValueHelpDialog.setTitle("Buying Units");
                this._oValueHelpDialog.setRangeKeyFields([{
                    label: "Unit",
                    key: "Cases",
                    type: "number"

                }]);
            } else if (eventid.includes("Buyer")) {
                this._oValueHelpDialog.setTitle("Buyer #");
                this._oValueHelpDialog.setRangeKeyFields([{
                    label: "Buyer #",
                    key: "BuyerNumber",
                    type: "number"

                }]);
            } else if (eventid.includes("Article")) {
                this._oValueHelpDialog.setTitle("Article #");

                this._oValueHelpDialog.setRangeKeyFields([{
                    label: "Article #",
                    key: "ArticleNumber",
                    type: "number"

                }]);
            }
            this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            this._oValueHelpDialog.open();
        },

        onValueHelpOkPress: function(oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oMultiInput.setTokens(aTokens);
            this._oValueHelpDialog.close();
            this.onFilterChange(oEvent);
        },

        onValueHelpCancelPress: function() {
            this._oValueHelpDialog.close();
        },

        onValueHelpAfterClose: function() {
            this._oValueHelpDialog.destroy();
        },

        // Dynamic Page Content - Overflow Toolbar
        // Copy an existing contract
        onApproveOrder: function(oEvent) {
            MessageBox.information("Functionality not yet implemented...", {
                title: "Dang it !"
            });
        }

    });
});