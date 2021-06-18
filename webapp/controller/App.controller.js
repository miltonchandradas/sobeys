sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "com/sap/sobeys/controller/BaseController"
], function(JSONModel, BaseController) {
    "use strict";

    return BaseController.extend("com.sap.sobeys.controller.App", {
        onInit: function() {
            this._ownerComponent = this.getOwnerComponent();
            this._router = this._ownerComponent.getRouter();

            this._router.attachRouteMatched(this.onRouteMatched, this);
        },

        // What are we doing here ?
        onRouteMatched: function(oEvent) {
            var sRouteName = oEvent.getParameter("name");
            var oArguments = oEvent.getParameter("arguments");

            this._updateUIElements();

            // Save the current route name
            this._currentRouteName = sRouteName;
            this._currentContract = oArguments.contract;
        },

        onStateChanged: function(oEvent) {
            var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow");
            var sLayout = oEvent.getParameter("layout");

            this._updateUIElements();

            // Replace the URL with the new layout if a navigation arrow was used
            if (bIsNavigationArrow) {
                this._router.navTo(this._currentRouteName, {
                    layout: sLayout,
                    contract: this._currentContract
                }, true);
            }
        },

        // Update the close/fullscreen buttons visibility
        _updateUIElements: function() {
            var oModel = this._ownerComponent.getModel("layout");
            var oUIState;
            this._ownerComponent.getHelper().then(function(oHelper) {
                oUIState = oHelper.getCurrentUIState();
                oModel.setData(oUIState);
            });
        },

        onExit: function() {
            this._router.detachRouteMatched(this.onRouteMatched, this);
            this._router.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
        }
    });
});