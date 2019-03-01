sap.ui.define([
	"sandboxUI5/controller/BaseController",
	"sap/ui/core/Fragment"

], function (BaseController, Fragment) {
	"use strict";

	return BaseController.extend("sandboxUI5.controller.OrdersOverview", {

		onInit: function() {			
			this.oView = this.getView();					
		},
		
		deleteOrder: function(oEvent) {
			var oModel = this.oView.getModel("mainData");
			var path = oEvent.getParameter("listItem").getBindingContext("mainData").getPath();
			oModel.remove(path);			
		},

		navToMoreInfo: function(oEvent) {
			var path = oEvent.getSource().getBindingContext("mainData").getPath();			
			this.getRouter().navTo("orderDetails", {order_num : path.substr(1)});						
		},

		onOpenDialog : function () {
			var oView = this.oView;

			if (!this.byId("createOrderDialog")) {
				Fragment.load({
					id: oView.getId(),
					name: "sandboxUI5.view.CreateOrder",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("createOrderDialog").open();
			}
		},

		onCloseDialog : function () {	
			this.oView.byId("createOrderDialog").close();
		},

		createOrderObject: function() {
			var orderModel = this.oView.getModel("Order");			
			var Order = JSON.parse(orderModel.getJSON());
			var currentDate = new Date().toISOString();
			Order.summary.createdAt	= currentDate;
			Order.shipTo.shipedAt = currentDate;
			return Order;
		},

		addOrder: function(){
			var oModel = this.oView.getModel("mainData");			
			var Order = this.createOrderObject();
			oModel.create("/Orders", Order, {
				success: function(){
					jQuery.sap.log.info("Sucsess");
				},
				error : function () {
					jQuery.sap.log.error("Error");
				}
			});
			this.onCloseDialog();
			this.oView = this.getView();
		}
	});
});