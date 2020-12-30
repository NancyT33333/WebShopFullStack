sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (Controller, MessageToast ) {
	"use strict";

	return Controller.extend("ru.teamidea.odatapractice.WebShop.controller.ShoppingCart", {

		onInit: function () {

		},
		
		onNavToDetail: function() {
			var oHistory = sap.ui.core.routing.History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			}
		},
		onCreateOrderPress: function (oEvt) {
			this.getView().getModel("appView").setProperty("/bOrderDetailsExpanded", true);
		}, 
		onPressAcceptOrder: function (oEvt) {
			var sQuestionAccept = this.getI18nText("onConfirmOrderQuestion");
			
			var fnOk = function () {
				this.clearValueStates();
				var bFormValid = this.validateForm();
				if (!bFormValid) {
					return;
				}
				// получаем список товаров
				var oData = {
					Address: this.byId("idInpCity").getValue() + this.byId("idInpStreet").getValue() 
					+ this.byId("idInpCustBuilding").getValue() + this.byId("idInpCustApartment").getValue(),
					Email: this.byId("idInpCustEmail").getValue(),
					FirstName: this.byId("idInpCustFirstname").getValue(),
					Phone: this.byId("idInpCustPhone").getValue(),
					SurName: this.byId("idInpSurName").getValue(),
					Id: Math.round(Math.random() * 1000000).toString(),
					OrderItemDetails: this.getView().getModel("appView").getProperty("/tempOrder")
					
				};
				// вызов Odata post deep insert
				this._callPostOrder(oData);
			}.bind(this);
			var fnCancel = function () {
				
			}.bind(this);
			this.showMessageBox(sQuestionAccept, fnOk, fnCancel);
			this.getView().getModel("appView").setProperty("/bOrderDetailsExpanded", false);
	
		},
		
		_callPostOrder: function (oData) {
			oData.OrderItemDetails.forEach(function(orderItem){
				delete orderItem.Name; 
				orderItem.OrderId = oData.Id;
				orderItem.ProductId = orderItem.ProductId.slice(0, -1);
				orderItem.Quantity = orderItem.Quantity.toString();
				orderItem.Id = Math.round(Math.random() * 1000000).toString();
			}); 
			this.getView().getModel().create("/Orders", oData, {
				success: function (oResp ) {
					MessageToast.show(this.getI18nText("msgPostSuccess"));
					this.getView().getModel("appView").setProperty("/tempOrder", []);
					this.clearValueStates();
					this.onNavToDetail(); 
					
				}.bind(this),
				error: function (oErr) {
					MessageToast.show(this.getI18nText("msgPostErr"));
				}.bind(this)
			});
		},
		
		clearValueStates: function () {
			this.getView().getModel("appView").setProperty("/formValueState", {
				idInpSurName: "None",
				idInpCustApartment: "None",
				idInpCity: "None",
				idInpStreet: "None",
				idInpCustBuilding: "None",
				idInpCustEmail: "None",
				idInpCustPhone: "None",
				idInpCustFirstname: "None"
			});
		},
		
		validateForm: function () {
			var bValid = true;
			// телефон 10 цифр; стандартная проверка email;
			// в поле номер квартиры цифры; город,
			// улица и дом обязательны для заполнения.
			
			if (!/\S+@\S+\.\S+/.test(this.getView().byId("idInpCustEmail").getValue().toLowerCase()) ) { 
				bValid = false;
				this.getView().getModel("appView").setProperty("/formValueState/idInpCustEmail", "Error");
			}
		
			if (!/^\d+$/.test(this.getView().byId("idInpCustApartment").getValue()) ) { 
				bValid = false ;
				this.getView().getModel("appView").setProperty("/formValueState/idInpCustApartment", "Error");
			}
			
			if (this.getView().byId("idInpCustPhone").getValue().length < 10 ) { 
				bValid = false ;
				this.getView().getModel("appView").setProperty("/formValueState/idInpCustPhone", "Error");
			}
			if (this.getView().byId("idInpCity").getValue().length < 1 ) { 
				bValid = false; 
				this.getView().getModel("appView").setProperty("/formValueState/idInpCity", "Error");
			}
			if (this.getView().byId("idInpCustBuilding").getValue().length < 1 ) { 
				bValid = false ;
				this.getView().getModel("appView").setProperty("/formValueState/idInpCustBuilding", "Error");
			}
			if (this.getView().byId("idInpStreet").getValue().length < 1 ) { 
				bValid = false ;
				this.getView().getModel("appView").setProperty("/formValueState/idInpStreet", "Error");
			}
		
			return bValid;
		},
	
		onPressRejectOrder: function (oEvt) {
			var sQuestionReject = this.getI18nText("onRejectOrderQuestion");
			var fnOk = function () {
				this.clearValueStates();
				this.getView().getModel("appView").setProperty("/bOrderDetailsExpanded", false);
				// this.byId("form0").destroyFormContainers();

			}.bind(this);
			var fnCancel = function () {
				
			};
			this.showMessageBox(sQuestionReject, fnOk, fnCancel);
			this.getView().getModel("appView").setProperty("/bOrderDetailsExpanded", false);
		},
		
		getI18nText: function (sI18nKey) {
			return this.getView().getModel("i18n").getResourceBundle().getText(sI18nKey);
		},
		
		showMessageBox: function (sMessage, fnOk, fnCancel) {
			sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
					"use strict";
					var sYesAction = this.getI18nText("YesAction");
					var sNoAction = this.getI18nText("NoAction");
					MessageBox.show(sMessage, {
						icon: MessageBox.Icon.INFORMATION,
						actions: [sYesAction, sNoAction],
						emphasizedAction: sYesAction,
						onClose: function (sAction) { 
							if ( sAction === sYesAction ) {
								fnOk.apply(this);
							} else if ( sAction === sNoAction ) {
								fnCancel.apply(this);
							}
						}
							
					});
				}.bind(this));
		}
	});

});