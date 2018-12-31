<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <h4><md-icon >filter_list</md-icon>Filters</h4>
        <div class="row">
          <div class="col-md-6">
            <label for="user_state">State</label>
            <multiselect :multiple="true"
                         v-model="meals.filters.state.active"
                         :options="meals.filters.state.options"
                         style="z-index: 9999;" id="user_state"></multiselect>
          </div>
          <div class="col-md-6">
            <label for="filter_waiter">User</label>
            <multiselect v-model="meals.filters.waiter.active"
                         :options="meals.filters.waiter.options"
                         @search-change="searchUsersMeals"
                         :preserve-search="true"
                         :loading="meals.filters.waiter.isLoading"
                         label="name"
                         track-by="name"
                         style="z-index: 9999;" id="filter_waiter"></multiselect>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <label for="filter_date">Date</label>
            <datepicker class="form-control" :format="dataFilter" id="filter_date"></datepicker>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-12">
            <md-button @click="getMeals(meals.filters.state.active.length === 0 ? meals.filters.state.options : meals.filters.state.active,
                                    true,
                                    true,
                                    null,
                                    meals.filters.waiter.active.id,
                                    meals.filters.date.date)"
                       class="md-round md-block md-success">FILTER</md-button>
          </div>
        </div>
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Meals</h4>
            <h5 class="title">Total: {{ meals.data.total }}</h5>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>Table number</th>
                <th>Waiter</th>
                <th>Total price</th>
                <th>State</th>
                <th>Created at</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="meal in meals.data.data" :key="meal.id">
                <td class="pt-4">{{ meal.table_number }}</td>
                <div v-if="meal.waiter.deleted_at !== null" class="bg-danger text-white rounded">
                  <td class="pt-4">{{ meal.waiter.name }}</td>
                  <md-tooltip md-direction="top">This user is soft deleted</md-tooltip>
                </div>
                <div v-else>
                  <td class="pt-4">{{ meal.waiter.name }}</td>
                </div>
                <td class="pt-4">{{ meal.total_price_preview }}€</td>
                <td class="pt-4">{{ meal.state }}</td>
                <td class="pt-4">{{ moment(meal.created_at).format("DD/MM/YYYY") }}</td>
                <td class="p-0">
                  <md-tooltip md-direction="top">View meal details</md-tooltip>
                  <md-button @click="getMealDetails(meal)"><md-icon>remove_red_eye</md-icon></md-button>
                </td>
              </tr>
              </tbody>
            </table>
            <md-button :disabled="meals.data.prev_page_url === null" @click="mealsPaginate('last')">LAST</md-button>
            <md-button :disabled="meals.data.next_page_url === null" @click="mealsPaginate('next')">NEXT</md-button>
          </md-card-content>
        </md-card>

        <!-- MEAL DETAILS -->
        <div v-if="meals.selected.meal !== null">
          <md-card>
            <md-card-header data-background-color="green" id="mealDetails">
              <h4 class="title">Meal</h4>
              <h6 class="title">Total: {{ meals.selected.meal.total_price_preview }}€</h6>
              <h6 class="title">State: {{ meals.selected.meal.state }}</h6>
              <h6 class="title">Date: {{ moment(meals.selected.meal.created_at).format("DD/MM/YYYY") }}</h6>
              <h6 class="title">Waiter: {{ meals.selected.meal.waiter.name }}</h6>
            </md-card-header>
            <md-card-content>
              <table class="table">
                <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>State</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in meals.selected.items" :key="item.id">
                  <td class="pt-4">{{ item.item.name }}</td>
                  <td class="pt-4">{{ item.item.type }}</td>
                  <td class="pt-4">{{ item.item.price }}€</td>
                  <td class="pt-4">{{ item.state }}</td>
                </tr>
                </tbody>
              </table>
            </md-card-content>
          </md-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import MealsAPI from "../../packages/api/Meals.js";
import ItemsAPI from "../../packages/api/Items.js";
import OrderAPI from "../../packages/api/Orders.js";
import InvoiceAPI from "../../packages/api/Invoice.js";
import InvoiceItemsAPI from "../../packages/api/InvoiceItems.js";
import TablesAPI from "../../packages/api/Tables.js";
import UsersAPI from "../../packages/api/Users.js";
import { required, email } from 'vuelidate/lib/validators'
import toastr from 'toastr';
import _ from 'lodash';
import swal from "sweetalert";
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
  components: { Multiselect, Datepicker },
  data() {
    return {
      meals: {
        data: [],
        filters: {
          state: {
            // If there are no active option then it will assume all the options
            active: ['active', 'terminated'],
            options: ['active', 'terminated', 'paid', 'not paid'],
          },
          waiter: {
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
        terminated: [],
        selected: {
          meal: null,
          items: []
        }
      },
    }
  },
  methods: {
    getMeals(filters, paginate, waiter, pageNumber, userID, date){
      MealsAPI.getMeals(filters, paginate, waiter, pageNumber, userID, date).then(meals => {
        this.meals.data = meals.data;
      });
    },
    searchUsersMeals(searchQuery){
      if(searchQuery.length < 3){
        return;
      }

      var options = [];
      this.meals.filters.waiter.isLoading = true;

      UsersAPI.getSearchUser(searchQuery).then(r => {
        this.meals.filters.waiter.isLoading = false;
        r.data.forEach(e => {
          options.push({
            id: e.id,
            name: e.name
          });
        });
      });

      this.meals.filters.waiter.options = options;
    },
    dataFilter(date){
      let dateF = moment(date).format('YYYY-MM-DD');
      this.meals.filters.date.date = dateF;
      return dateF;
    },
    getMealDetails(meal){
      this.meals.selected.meal = meal;
      MealsAPI.getOrders([], meal.id).then(orders => {
        this.meals.selected.items = orders.data;

        location.hash = "#mealDetails";
      });
    },
    mealsPaginate(direction){
      if(direction === 'last'){
        this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active, true, true, this.meals.data.current_page - 1, this.meals.filters.waiter.active.id, this.meals.filters.date.date);
      }else{
        this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active, true, true, this.meals.data.current_page + 1, this.meals.filters.waiter.active.id, this.meals.filters.date.date);
      }
    },
  },
  created(){
    this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active,
      true, true, null, null, this.meals.filters.date.date);
  }
};
</script>
