sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/UIComponent",
    "sap/ui/core/Core"
], function(Controller, History, UIComponent, Core) {
    "use strict";

    return Controller.extend("com.sap.sobeys.controller.BaseController", {

        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        getModel: function(sName) {
            return this.getView().getModel(sName);
        },

        getCoreId: function(sName) {
            return Core.byId(sName);
        },

        onNavBack: function(oEvent) {
            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("appHome", {}, true /*no history*/ );
            }
        }

    });

});