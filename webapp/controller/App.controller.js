sap.ui.define([
	"ru/teamidea/odatapractice/WebShop/controller/BaseController",
	"sap/ui/model/json/JSONModel"

], function (BaseController, JSONModel ) {
	"use strict";

	return BaseController.extend("ru.teamidea.odatapractice.WebShop.controller.App", {

		onInit: function () {
			var oViewModel,
				fnSetAppNotBusy,
				oListSelector = this.getOwnerComponent().oListSelector,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();

			oViewModel = new JSONModel({
				busy: true,
				delay: 0,
				itemToSelect: null,
				addEnabled: false,
				tempOrder: [],
				bOrderDetailsExpanded: false,
				formValueState: {
					idInpSurName: "None",
					idInpCustApartment: "None",
					idInpCity: "None",
					idInpStreet: "None",
					idInpCustBuilding: "None",
					idInpCustEmail: "None",
					idInpCustPhone: "None",
					idInpCustFirstname: "None"
				}
			
			});
			oViewModel.setDefaultBindingMode("OneWay");
			this.setModel(oViewModel, "appView");

			fnSetAppNotBusy = function () {
				oViewModel.setProperty("/busy", false);
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			};

			this.getOwnerComponent().getModel().metadataLoaded()
				.then(fnSetAppNotBusy);

			// Makes sure that master view is hidden in split app
			// after a new list entry has been selected.
			oListSelector.attachListSelectionChange(function () {
				this.byId("idAppControl").hideMaster();
			}, this);

			// apply content density mode to root view
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});

});