<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-button class="md-info md-just-icon align-bottom-right"
                   v-show="(invoices.selected.invoice !== null ? invoices.selected.invoice.state === 'paid' : false)"
                   @click="downloadInvoice(invoices.selected.invoice.id)"><md-icon >print</md-icon></md-button>
        <h4><md-icon >filter_list</md-icon>Filters</h4>
        <div class="row">
          <div class="col-md-6">
            <label for="invoice_state">State</label>
            <multiselect :multiple="true"
                         v-model="invoices.filters.state.active"
                         :options="invoices.filters.state.options"
                         style="z-index: 9999;" id="invoice_state"></multiselect>
          </div>
          <div class="col-md-6">
            <label for="invoice_waiter">Waiter</label>
            <multiselect v-model="invoices.filters.waiter.active"
                         :options="invoices.filters.waiter.options"
                         @search-change="searchUsersInvoices"
                         :preserve-search="true"
                         :loading="invoices.filters.waiter.isLoading"
                         label="name"
                         track-by="name"
                         style="z-index: 9999;" id="invoice_waiter"></multiselect>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="invoice_date">Date</label>
            <datepicker class="form-control" :format="dataFilter" id="invoice_date"></datepicker>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-12">
            <md-button @click="getInvoices(invoices.filters.state.active.length === 0 ? invoices.filters.state.options : invoices.filters.state.active, true, true, true, 1, invoices.filters.date.date, invoices.filters.waiter.active.id)"
                       class="md-round md-block md-success">FILTER</md-button>
          </div>
        </div>
        <md-card v-if="this.invoices.data !== null">
          <md-card-header data-background-color="green">
            <h4 class="title">Invoices</h4>
            <h5 class="title">Total: {{ invoices.data.total }}</h5>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>State</th>
                <th>NIF</th>
                <th>Name</th>
                <th>Date</th>
                <th>Total</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="invoice in invoices.data.data" :key="invoice.id">
                <td class="pt-4">{{ invoice.state }}</td>
                <td class="pt-4">{{ invoice.nif }}</td>
                <td class="pt-4">{{ invoice.name }}</td>
                <td class="pt-4">{{ moment(invoice.date).format('DD/MM/YYYY') }}</td>
                <td class="pt-4">{{ invoice.total_price }}€</td>
                <td class="p-0">
                  <md-tooltip md-direction="top">View invoice details</md-tooltip>
                  <md-button class="md-block" @click="getInvoiceItems(invoice)"><md-icon>remove_red_eye</md-icon></md-button>
                </td>
              </tr>
              </tbody>
            </table>
            <md-button :disabled="invoices.data.prev_page_url === null" @click="invoicesPaginate('last')">LAST</md-button>
            <md-button :disabled="invoices.data.next_page_url === null" @click="invoicesPaginate('next')">NEXT</md-button>
          </md-card-content>
        </md-card>
        <md-card v-if="invoices.selected.invoice !== null" id="invoiceItems">
          <md-card-header data-background-color="green" id="mealDetails">
            <h6 class="title">Total: {{ invoices.selected.invoice.total_price }}€</h6>
            <h6 class="title">State: {{ invoices.selected.invoice.state }}</h6>
            <h6 class="title">Date: {{ moment(invoices.selected.invoice.created_at).format("DD/MM/YYYY") }}</h6>
            <h6 class="title">Waiter: {{ invoices.selected.invoice.meal.waiter.name }}</h6>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Sub total</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in invoices.selected.items" :key="item.id">
                <td class="pt-4">{{ index + 1 }}</td>
                <td class="pt-4">{{ item.item.name }}</td>
                <td class="pt-4">{{ item.item.type }}</td>
                <td class="pt-4">{{ item.quantity }}</td>
                <td class="pt-4">{{ item.unit_price }}€</td>
                <td class="pt-4">{{ item.sub_total_price }}€</td>
              </tr>
              </tbody>
            </table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>

import InvoiceAPI from "../../packages/api/Invoice.js";
import InvoiceItemsAPI from "../../packages/api/InvoiceItems.js";
import UsersAPI from "../../packages/api/Users.js";
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
  components: { Multiselect, Datepicker },
  data() {
    return {
      invoices: {
        pending: [],
        data: null,
        filters:{
          state:{
            active: ['pending'],
            options: ['paid', 'not paid', 'pending']
          },
          waiter:{
            active: {
              id: null,
              name: null
            },
            options: [],
            isLoading: false
          },
          date:{
            date: null
          }
        },
        selected: {
          invoice: null,
          items: null
        }
      },
    }
  },

  methods: {
    getInvoices(filters, paginate, meal, waiter, page, date, waiterID){
      InvoiceAPI.getInvoices(filters, paginate, meal, waiter, page, date, waiterID).then(r => {
        this.invoices.data = r.data;
      });
    },
    getInvoiceItems(invoice){
      this.invoices.selected.invoice = invoice;

      // Scroll to the bottom of the page
      window.scrollTo(0,document.body.scrollHeight);

      InvoiceItemsAPI.getInvoiceItems(invoice.id).then(items => {
        this.invoices.selected.items = items.data;
      });
    },
    searchUsersInvoices(searchQuery){
      if(searchQuery.length < 3){
        return;
      }

      var options = [];
      this.invoices.filters.waiter.isLoading = true;

      UsersAPI.getSearchUser(searchQuery).then(r => {
        this.invoices.filters.waiter.isLoading = false;
        r.data.forEach(e => {
          options.push({
            id: e.id,
            name: e.name
          });
        });
      });

      this.invoices.filters.waiter.options = options;
    },
    dataFilter(date){
      let dateF = moment(date).format('YYYY-MM-DD');
      this.meals.filters.date.date = dateF;
      this.invoices.filters.date.date = dateF;
      return dateF;
    },
    downloadInvoice(invoiceID){
      InvoiceAPI.getDownloadPDF(invoiceID).then(r => {
        if(r.status === 200){
          let blob = new Blob([r.data], {type: 'application/pdf'});
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'invoice_'+ invoiceID +'.pdf';
          link.click();
          return;
        }

        toastr.error("There was an error while downloading your file", "ERROR");
      });
    },
    invoicesPaginate(direction){
      if(direction === 'last'){
        this.getInvoices(this.invoices.filters.state.active.length === 0 ? this.invoices.filters.state.options : this.invoices.filters.state.active,
          true, true, true, this.invoices.data.current_page - 1, this.invoices.filters.date.date, this.invoices.filters.waiter.active.id);
      }else{
        this.getInvoices(this.invoices.filters.state.active.length === 0 ? this.invoices.filters.state.options : this.invoices.filters.state.active,
          true, true, true, this.invoices.data.current_page + 1, this.invoices.filters.date.date, this.invoices.filters.waiter.active.id);
      }
    },
    getInvoiceChanged: function(invoiceChanged){
      //with filters
      if (this.invoices.data != null){
        for (let idx in this.invoices.data.data) {
          if (this.invoices.data.data[idx].id == invoiceChanged.id){
            if (this.invoices.data.data[idx].id != "not paid" || this.invoices.data.data[idx].id != "paid" || this.invoices.data.data[idx].id != "pending"){
              this.invoices.data.data.splice(idx, 1);
            }
          } 
        }
      }
      //faz push do elemento

      console.log(this.invoices);
      if (invoiceChanged.state == "pending"){
        this.invoices.data.data.push(invoiceChanged);
      }

      if (invoiceChanged.state == "paid"){
        this.invoices.data.data.push(invoiceChanged);
      }

       if (invoiceChanged.state == "not paid"){
        this.invoices.data.data.push(invoiceChanged);
      }

        return null;
	  },
  },
  sockets: {
    invoice_changed(invoiceChanged){
      this.getInvoiceChanged(invoiceChanged);
    },
  },        
  created(){
    this.getInvoices(this.invoices.filters.state.active.length === 0 ? this.invoices.filters.state.options : this.invoices.filters.state.active,
      true,
      true,
      true,
      1,
      null,
      null
    );
  }
};
</script>

<style scoped>
  .align-bottom-right{
    bottom: 20px;
    right: 20px;
    position: fixed !important;
    z-index: 999;
  }
</style>
