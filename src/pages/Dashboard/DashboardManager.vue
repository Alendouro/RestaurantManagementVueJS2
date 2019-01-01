<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-12">
            <!-- DASHBOARD MENU -->
            <md-card>
              <md-card-header data-background-color="green">
                <h4 class="title">Invoices <small>pending</small> & Meals <small>terminated</small></h4>
              </md-card-header>
              <md-card-content>
                <table class="table">
                  <thead>
                  <tr>
                    <th>Table number</th>
                    <th>Start</th>
                    <th>Total price</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(meal) in meals.terminated" :key="meal.id">
                    <td class="pt-4">{{ meal.table_number }}</td>
                    <td class="pt-4">{{ moment(meal.start).format('DD/MM/YYYY H:m') }}</td>
                    <td class="pt-4">{{ meal.total_price_preview }}€</td>
                    <td>
                      <md-tooltip md-direction="top">Declare this meal as not paid</md-tooltip>
                      <md-button class="m-0 md-danger md-block" @click="declareNotPaid(meal, 'meal')"><md-icon >money_off</md-icon></md-button>
                    </td>
                  </tr>
                  <tr v-for="(invoice) in invoices.pending" :key="invoice.id">
                    <td class="pt-4">{{ invoice.meal.table_number }}</td>
                    <td class="pt-4">{{ moment(invoice.start).format('DD-MM-YYYY H:m') }}</td>
                    <td class="pt-4">{{ invoice.total_price }}€</td>
                    <td>
                      <md-tooltip md-direction="top">Declare this invoice as not paid</md-tooltip>
                      <md-button class="m-0 md-danger md-block" @click="declareNotPaid(invoice, 'invoice')"><md-icon >money_off</md-icon></md-button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </md-card-content>
            </md-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import MealsAPI from "../../packages/api/Meals.js";
import InvoiceAPI from "../../packages/api/Invoice.js";
import toastr from 'toastr';
import _ from 'lodash';
import URLFormatter from '../../packages/url/URLFormatter.js'


export default {
  data() {
    return {
      invoices: {
        pending: [],
      },
      meals: {
        terminated: [],
      },
    };
  },
  methods: {
    // ------- GET METHODS
    getMealsTerminated(){
      MealsAPI.getTerminated().then(r => {
        this.meals.terminated = r.data;
      });
    },
    getInvoicePending(withMeal){
      InvoiceAPI.getPending(withMeal).then(r => {
        this.invoices.pending = r.data;
      });
    },

    // ------ PUT METHODS
    putDeclareMealNotPaid(meal){
      MealsAPI.putMealNotPaid(meal).then(r => {
        if(r.status !== 200){
          toastr.error('There was an error updating the meal', 'ERROR');
          return;
        }

        const mealsTerminated = this.meals.terminated.slice();

        _.remove(mealsTerminated, (currentMeal) => {
          return currentMeal.id === meal.id;
        });

        this.meals.terminated = mealsTerminated;

        toastr.success('Meal was updated successfully', 'SUCCESS');
      });
    },
    putDeclareInvoiceNotPaid(invoice){
      InvoiceAPI.putDeclareInvoiceNotPaid(invoice).then(r => {
        if(r.status !== 200){
          toastr.error('There was an error updating the invoice', 'ERROR');
          return;
        }

        const invoicesPending = this.invoices.pending.slice();

        _.remove(invoicesPending, (currentInvoice) => {
          return currentInvoice.id === invoice.id;
        });

        this.invoices.pending = invoicesPending;

        toastr.success('Invoice was updated successfully', 'SUCCESS');
      });
    },

    // ------- AUXILIARY METHODS
    groupedItems(items, columns){
      return _.chunk(items, columns);
    },

    imageItem(itemUrl){
      return URLFormatter.imageItem(itemUrl);
    },

    declareNotPaid(item, type){
      if(type === 'meal'){
        this.putDeclareMealNotPaid(item);
      }

      if(type === 'invoice'){
        this.putDeclareInvoiceNotPaid(item);
      }
    },
  },

  created(){
    this.getMealsTerminated();
    this.getInvoicePending(true);
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  .title > small {
    font-size: 12px;
  }
</style>
