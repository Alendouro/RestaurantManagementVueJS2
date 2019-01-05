<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-button class="md-default" v-show="!toggles.invoices" @click="toggle('invoices', null)"><md-icon >keyboard_arrow_left</md-icon></md-button>
        <!-- INVOICE LIST -->
        <div v-if="toggles.invoices">
          <h3 class="d-inline">INVOICES</h3><small>  pending</small>
          <div class="row" v-for="invoices in groupedItems(this.invoices.pending, 4)" :key="invoices.id">
            <div class="col-md-3" v-for="invoice in invoices" :key="invoice.id">
              <md-card>
                <md-card-header data-background-color="green">
                  <h4 class="title">Table {{ invoice.meal.table_number }}</h4>
                </md-card-header>
                <md-card-content>
                  <md-button class="md-info md-block" @click="toggle('invoiceDetails', invoice)">DETAILS</md-button>
                </md-card-content>
              </md-card>
            </div>
          </div>
          <h1 class="text-center" v-show="invoices.pending.length === 0">NO INVOICES</h1>

        </div>

        <!-- INVOICE DETAILS -->
        <div v-if="toggles.invoiceDetail">
          <div class="row">
            <div class="col-md-4">
              <h4><md-icon >insert_drive_file</md-icon>INVOICE DETAILS</h4>
              <h4><md-icon >fastfood</md-icon> {{ invoiceSelectedDetails.invoice.meal.table_number }}</h4>
              <h4><md-icon >person_pin</md-icon> {{ invoiceSelectedDetails.invoice.meal.waiter.name}}</h4>
              <hr>
              <h4>{{ this.invoiceSelectedDetails.paymentDetail.name}}</h4>
              <h4>{{ this.invoiceSelectedDetails.paymentDetail.nif }}</h4>
            </div>
            <div class="col-md-8">
              <md-field>
                <label>Name</label>
                <md-input v-model="invoiceSelectedDetails.paymentDetail.name"></md-input>
              </md-field>
              <md-field>
                <label>NIF</label>
                <md-input v-model="invoiceSelectedDetails.paymentDetail.nif"></md-input>
              </md-field>
              <md-button class="md-info md-block" @click="updateMakePayment()">PAY</md-button>

            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <md-card>
                <md-card-header data-background-color="green">
                  <h4 class="title">Orders</h4>
                  <p class="category">TOTAL: {{ invoiceSelectedDetails.invoice.total_price }}€</p>
                </md-card-header>
                <md-card-content>
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Unit price</th>
                      <th>Sub price</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="order in invoiceSelectedDetails.orders" :key="order.id">
                      <td class="pt-4">{{ order.item.name }}</td>
                      <td class="pt-4">{{ order.quantity }}</td>
                      <td class="pt-4">{{ order.unit_price }}€</td>
                      <td class="pt-4">{{ order.sub_total_price }}€</td>
                    </tr>
                    </tbody>
                  </table>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>
        <div class="row" v-if="invoices.paid.length !== 0">
          <div class="col-md-12">
            <md-card>
              <md-card-header data-background-color="green">
                <h4 class="title">Invoices</h4> <small>paid</small>
              </md-card-header>
              <md-card-content>
                <table class="table">
                  <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>NIF</th>
                    <th>DATE</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(invoice) in invoices.paid.data" :key="invoice.id">
                    <td class="pt-4">{{ invoice.id }}</td>
                    <td class="pt-4">{{ invoice.name }}</td>
                    <td class="pt-4">{{ invoice.nif }}</td>
                    <td class="pt-4">{{ invoice.created_at }}</td>
                    <td class="p-0">
                      <md-button class="md-block md-success" @click="downloadInvoice(invoice.id)">
                        <md-icon >cloud_download</md-icon>
                      </md-button>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <md-button :disabled="invoices.paid.prev_page_url === null" @click="invoicesPaginate('last')">LAST</md-button>
                <md-button :disabled="invoices.paid.next_page_url === null" @click="invoicesPaginate('next')">NEXT</md-button>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import TablesAPI from "../../packages/api/Tables.js";
import MealsAPI from "../../packages/api/Meals.js";
import ItemsAPI from "../../packages/api/Items.js";
import OrderAPI from "../../packages/api/Orders.js";
import InvoiceAPI from "../../packages/api/Invoice.js";
import InvoiceItemsAPI from "../../packages/api/InvoiceItems.js";
import toastr from 'toastr';
import _ from 'lodash';
import swal from "sweetalert";

export default {
  data() {
    return {
      toggles: {
        invoices: true,
        invoiceDetail: false
      },
      invoices: {
        pending: [],
        paid: [],
        notPaid: []
      },
      invoiceSelectedDetails: {
        invoice: null,
        orders: [],
        paymentDetail: {
          name: "",
          nif: ""
        }
      }
    };
  },
  methods: {
    getInvoice(){
      InvoiceAPI.getInvoices(['pending'], false, true, true, null, null, null).then(invoices => {
        this.invoices.pending = invoices.data;
      });
    },
    groupedItems(items, columns){
      return _.chunk(items, columns);
    },
    getInvoiceItems(invoiceID){
      InvoiceItemsAPI.getInvoiceItems(invoiceID).then(items => {
        this.invoiceSelectedDetails.orders = items.data;
      });
    },
    getInvoicePaid(){
      InvoiceAPI.getPaid(true, null).then(r => {
        this.invoices.paid = r.data;
      });
    },
    toggle(section, invoice){
      this.hideAllSections(false);

      if(section === "invoiceDetails"){
        this.toggles.invoiceDetail = true;
        this.invoiceSelectedDetails.invoice = invoice;
        this.getInvoiceItems(invoice.id);
        return;
      }

      if(section === 'invoices'){
        this.toggles.invoices = true;
      }
    },
    updateMakePayment(){
      let pattern = /^\d{9}$/;
      if(!this.invoiceSelectedDetails.paymentDetail.nif.match(pattern)){
          toastr.error('NIF is invalid', 'Error');
          return false;
      }

      if(this.invoiceSelectedDetails.paymentDetail.name === ""){
        toastr.error('Name is mandatory', 'Error');
        return false;
      }

      InvoiceAPI.updateInvoice({
        name: this.invoiceSelectedDetails.paymentDetail.name,
        nif: this.invoiceSelectedDetails.paymentDetail.nif
      }, this.invoiceSelectedDetails.invoice.id).then(response => {
        if(response.status === 400){
          swal(response.error.message, ' ', 'error', {
            buttons: false,
          });
          return;
        }

        if(response.status === 200){
          swal('Payment made successffully', ' ', 'success', {
            buttons: false,
          });
        }

        // Remove this invoice from the array
        const invPending = this.invoices.pending;

        _.remove(invPending, (inv) => {
            return inv.id === this.invoiceSelectedDetails.invoice.id;
        });

        this.invoices.pending = invPending;

        // Show all the invoices
        this.hideAllSections(false);
        this.toggles.invoices = true;

        // Reset name and nif fields
        this.invoiceSelectedDetails.paymentDetail.name = "";
        this.invoiceSelectedDetails.paymentDetail.nif = "";
      });
    },

    // -----------------   Auxiliary methods
    hideAllSections(show){
      for (let key in this.toggles) {
        if (this.toggles.hasOwnProperty(key)) {
          this.toggles[key] = (!!show); // either show or hide the sections
        }
      }
    },
    invoicesPaginate(direction){
      if(direction === 'last'){
        InvoiceAPI.getPaid(true, this.invoices.paid.current_page - 1).then(r => {
          this.invoices.paid = r.data;
        });
      }else{
        InvoiceAPI.getPaid(true, this.invoices.paid.current_page + 1).then(r => {
          this.invoices.paid = r.data;
        });
      }
    },
    downloadInvoice(invoiceID){
      InvoiceAPI.getDownloadPDF(invoiceID).then(r => {
        let blob = new Blob([r.data], {type: 'application/pdf'});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'invoice_'+ invoiceID +'.pdf';
        link.click();
      });
    }
  },
  created(){
    this.getInvoice();
    this.getInvoicePaid();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
