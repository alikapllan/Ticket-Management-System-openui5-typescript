sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"./pages/MainView"
], function(Opa5, opaTest) {
	"use strict";

	Opa5.extendConfig({
		viewNamespace: "tmui5.view",
		autoWait: true
	});

	QUnit.module("MainView");

	opaTest("Should have correct title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "tmui5",
				async: true
			},
			hash: ""
		});

		// Assertions
		Then.onTheMainViewPage.theTitleShouldBeCorrect();

		// Cleanup
		Then.iTeardownMyApp();
	});

});
