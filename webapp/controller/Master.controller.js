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

        // SAPUI5 Control Events

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

            this.getOwnerComponent().getHelper().then(function(oHelper) {
                oNextUIState = oHelper.getNextUIState(1);
                this._router.navTo("detail", {
                    "layout": oNextUIState.layout,
                    "contract": contractPath
                });
            }.bind(this));
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


        onValueHelpRequested: function() {
            this._oValueHelpDialog = sap.ui.xmlfragment("com.sap.sobeys.fragments.BuyingUnitsValueHelp", this);
            this.getView().addDependent(this._oValueHelpDialog);
            this._oValueHelpDialog.setRangeKeyFields([{
                label: "Unit",
                key: "Cases",
                type: "number"

            }]);

            this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
            this._oValueHelpDialog.open();
        },

        onValueHelpOkPress: function(oEvent) {
            var aTokens = oEvent.getParameter("tokens");
            this._oMultiInput.setTokens(aTokens);
            this._oValueHelpDialog.close();
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