sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"com/sap/sobeys/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	'sap/ui/model/Sorter',
	'sap/m/MessageBox',
	'sap/m/MessageToast',
	'sap/f/library',
	"com/sap/sobeys/model/formatter",
	"sap/ui/core/Fragment"
], function (JSONModel, BaseController, Filter, FilterOperator, Sorter, MessageBox, MessageToast, fioriLibrary, formatter, Fragment) {
	"use strict";

	return BaseController.extend("com.sap.sobeys.controller.Master", {

		formatter: formatter,

		onInit: function () {
			this._view = this.getView();
			this._router = this.getOwnerComponent().getRouter();

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
		},

		// SAPUI5 Control Events

		// Dynamic Page Content - Table
		// User selects a row
		// Enable Copy Contract button
		onSelectionChange: function (oEvent) {
			this.byId("btnCopy").setEnabled(true);
		},

		// Dynamic Page Content - Table
		// User clicks on a row
		// Status of contract = "Returned" || "Pending" - Navigate to Create Vendor Contract app
		// Otherwise open the 2nd column for display
		onListItemPress: function (oEvent) {

			// If contract is in approved state, then simply display 
			var contractPath = oEvent.getSource().getBindingContextPath().replace("/", "");
			var oNextUIState;

			this.getOwnerComponent().getHelper().then(function (oHelper) {
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
		onApproveContractPress: function (oEvent) {
			MessageBox.information("Functionality not yet implemented...", {
				title: "Dang it !"
			});
		},

		// Dynamic Page Content - Overflow Toolbar
		// Copy an existing contract
		onApproveOrder: function (oEvent) {
			MessageBox.information("Functionality not yet implemented...", {
				title: "Dang it !"
			});
		}

	});
});