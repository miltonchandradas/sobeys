sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel',
    "sap/ui/Device",
    'sap/f/FlexibleColumnLayoutSemanticHelper',
    "com/sap/sobeys/model/models",
    'sap/f/library'
], function(UIComponent, JSONModel, Device, FlexibleColumnLayoutSemanticHelper, models, fioriLibrary) {
    'use strict';

    return UIComponent.extend('com.sap.sobeys.Component', {

        metadata: {
            manifest: 'json'
        },

        init: function() {
            var oModel,
                oRouter;
            UIComponent.prototype.init.apply(this, arguments);

            oModel = new JSONModel();
            this.setModel(oModel, "layout");

            oRouter = this.getRouter();
            //oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
            oRouter.initialize();

            // set the device model	
            this.setModel(models.createDeviceModel(), "device");

        },

        getHelper: function() {
            return this._getFcl().then(function(oFCL) {
                var oSettings = {
                    defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded
                };
                return (FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings));
            });
        },

        _onBeforeRouteMatched: function(oEvent) {
            var oModel = this.getModel("layout");
            var sLayout = oEvent.getParameters().arguments.layout;
            var oNextUIState;

            // If there is no layout parameter, query for the default level 0 layout (normally OneColumn)
            if (!sLayout) {
                this.getHelper().then(function(oHelper) {
                    oNextUIState = oHelper.getNextUIState(0);
                    oModel.setProperty("/layout", oNextUIState.layout);
                });
                return;
            }

            oModel.setProperty("/layout", sLayout);
        },

        _getFcl: function() {
            return new Promise(function(resolve, reject) {
                var oFCL = this.getRootControl().byId('flexibleColumnLayout');
                if (!oFCL) {
                    this.getRootControl().attachAfterInit(function(oEvent) {
                        resolve(oEvent.getSource().byId('flexibleColumnLayout'));
                    }, this);
                    return;
                }
                resolve(oFCL);

            }.bind(this));
        }
    });
});