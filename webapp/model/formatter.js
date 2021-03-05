sap.ui.define([], function () {
	"use strict";
	return {
		// Master Page - show the status of the contract in semantic fashion
		statusText: function (sStatus) {
			switch (sStatus) {
			case "Created Automatically":
				return "None";
			case "Pending Review":
				return "Warning";
			default:
				return "Warning";
			}
		},

		// Master page - Depending on status, show the Approved button
		// Approved button needs to be enabled only for Pending and Returned
		actionEnabled: function (sStatus) {
			switch (sStatus) {
			case "Created Automatically":
				return false;
			case "Pending Review":
				return true;
			default:
				return false;
			}
		},

		// Detail Page
		// Avatar - The path of the images should be relative to the global namespace
		resolvePath: function (sPath) {
			if (!sPath) return null;

			var namespace = "com.sap.sobeys";
			var sRootPath = jQuery.sap.getModulePath(namespace);

			if (sRootPath) {
				return sRootPath + sPath.replace(".", "");
			}

			return sPath;
		},
	};
});