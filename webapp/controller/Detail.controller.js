sap.ui.define(
    [
        "sap/ui/model/json/JSONModel",
        "com/sap/sobeys/controller/BaseController",
        "com/sap/sobeys/model/formatter",
        'sap/m/MessageBox'
    ],
    function(JSONModel, BaseController, formatter, MessageBox) {
        "use strict";

        return BaseController.extend(
            "com.sap.sobeys.controller.Detail", {
                formatter: formatter,

                onInit: function() {
                    this._ownerComponent = this.getOwnerComponent();
                    this._model = this._ownerComponent.getModel("layout");
                    this._itemModel = this._ownerComponent.getModel("itemModel");
                    this._router = this._ownerComponent.getRouter();

                    this.getView().setModel(new JSONModel(), "view");

                    let viewModel = new JSONModel({
                        busy: false,
                        canEdit: false,
                        currency: "USD"
                    });

                    let dateModel = new JSONModel({
                        orderDate: new Date()
                    });

                    this.getView().setModel(viewModel, "viewModel");
                    this._viewModel = this.getView().getModel("viewModel");

                    this.getView().setModel(dateModel, "dateModel");
                    this._dateModel = this.getView().getModel("dateModel");

                    this._router
                        .getRoute("master")
                        .attachPatternMatched(this._onContractMatched, this);
                    this._router
                        .getRoute("detail")
                        .attachPatternMatched(this._onContractMatched, this);
                },

                // Private functions

                // When the route is matched
                // Get the appropriate contract to display
                _onContractMatched: function(oEvent) {
                    var oArgs;
                    oArgs = oEvent.getParameter("arguments");

                    this._contract = oArgs.contract || this._contract || "0";
                    this._layout = oArgs.layout;

                    this.getView().bindElement({
                        path: "/" + this._contract,
                        model: "contractModel",
                    });
                },

                // SAPUI5 Control events
                onSave: function() {
                    this._viewModel.setProperty("/canEdit", false);
                },

                onQuantityChange: function(oEvent) {
                    let src = oEvent.getSource();

                    let sPath = src.getParent().getBindingContextPath();
                    this._itemModel.setProperty(sPath + "/highlight", "Warning");

                },

                onApprove: function() {
                    MessageBox.information("Functionality not yet implemented...", {
                        title: "Dang it !"
                    });
                },

                onCancel: function() {
                    MessageBox.information("Functionality not yet implemented...", {
                        title: "Dang it !"
                    });
                },

                // Detail page - make it full screen
                onHandleFullScreen: function() {
                    var sNextLayout = this._model.getProperty(
                        "/actionButtonsInfo/midColumn/fullScreen"
                    );
                    this._router.navTo("detail", {
                        layout: sNextLayout,
                        contract: this._contract,
                    });
                },

                // Detail page - exit full screen mode
                onHandleExitFullScreen: function() {
                    var sNextLayout = this._model.getProperty(
                        "/actionButtonsInfo/midColumn/exitFullScreen"
                    );
                    this._router.navTo("detail", {
                        layout: sNextLayout,
                        contract: this._contract,
                    });
                },

                // Detail page - Close the whole thing
                // Just show Master page in full screen
                onHandleClose: function() {
                    var sNextLayout = this._model.getProperty(
                        "/actionButtonsInfo/midColumn/closeColumn"
                    );
                    this._router.navTo("master", {
                        layout: sNextLayout,
                    });
                },

                // SAPUI5 Lifecycle controller methods
                onExit: function() {
                    this._router
                        .getRoute("master")
                        .detachPatternMatched(this._onContractMatched, this);
                    this._router
                        .getRoute("detail")
                        .detachPatternMatched(this._onContractMatched, this);
                },
            }
        );
    }
);