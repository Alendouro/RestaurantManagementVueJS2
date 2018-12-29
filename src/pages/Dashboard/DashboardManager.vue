<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-2">
            <md-button class="md-success md-block" @click="toggle('dashboard')">DASHBOARD</md-button>
            <md-button class="md-success md-block" @click="toggle('tables')">TABLES</md-button>
            <md-button class="md-success md-block" @click="toggle('menu')">MENU</md-button>
            <md-button class="md-success md-block" @click="toggle('users')">USERS</md-button>
            <md-button class="md-success md-block" @click="toggle('meals')">MEALS</md-button>
          </div>
          <div class="col-md-10">
            <div v-show="toggles.meal">
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
                               @search-change="searchUser"
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
                                    meals.filters.date.date
                                    )"
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

            <!-- DASHBOARD MENU -->
            <div v-show="toggles.dashboard">
              <md-card>
                <md-card-header data-background-color="green">
                  <h4 class="title">Invoices/Meals</h4>
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

            <!-- TABLES  MENU -->
            <div v-show="toggles.tables">
              <md-card>
                <md-card-header data-background-color="green">
                  <h4 class="title">Tables</h4>
                </md-card-header>
                <md-card-content>
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Table number</th>
                      <th>Created at</th>
                      <th><md-icon>border_color</md-icon></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="table in tables" :key="table.id">
                      <td class="pt-4">{{ table.table_number }}</td>
                      <td class="pt-4">{{ table.created_at }}€</td>
                      <td><md-button class="m-0 md-danger" @click="deleteTable(table.table_number)"><md-icon >delete_outline</md-icon></md-button></td>
                    </tr>
                    </tbody>
                  </table>
                </md-card-content>
              </md-card>
            </div>

            <!-- MENU MENU -->
            <div v-show="toggles.menu">
              <div class="row">
                <div class="col-sm-12">
                  <md-button class="md-info md-block" @click="toggle('menuAddItem')"><md-icon >add</md-icon></md-button>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6">
                  <md-button class="md-success md-block" @click="toggle('menuDishes')">DISHES</md-button>
                </div>
                <div class="col-sm-6">
                  <md-button class="md-success md-block" @click="toggle('menuDrinks')">DRINKS</md-button>
                </div>
              </div>
              <div v-show="this.toggles.menuDishes">
                <div class="row" v-for="dishes in groupedItems(this.items.dishes, 3)" :key="dishes.id">
                  <div class="col-md-4" v-for="dish in dishes" :key="dish.id">
                    <md-card>
                      <md-card-header data-background-color="green">
                        <h4 class="title">{{dish.name}}</h4>
                        <h6>{{ dish.price }}€</h6>
                      </md-card-header>
                      <md-card-content>
                        <img text :src="imageItem(dish.photo_url)" :alt="dish.name">
                        <br>
                        <md-button class="m-0 md-danger" @click="deleteItem(dish.id, 'dish')"><md-icon >delete_outline</md-icon></md-button>
                      </md-card-content>
                    </md-card>
                  </div>
                </div>
              </div>

              <div v-show="this.toggles.menuDrinks">
                <div class="row" v-for="drinks in groupedItems(this.items.drinks, 3)" :key="drinks.id">
                  <div class="col-md-4" v-for="drink in drinks" :key="drink.id">
                    <md-card>
                      <md-card-header data-background-color="green">
                        <h4 class="title">{{drink.name}}</h4>
                        <h6>{{ drink.price }}€</h6>
                      </md-card-header>
                      <md-card-content>
                        <img text :src="imageItem(drink.photo_url)" :alt="drink.name">
                        <md-button class="m-0 md-danger md-block mt-1" @click="deleteItem(drink.id, 'drink')"><md-icon >delete_outline</md-icon></md-button>
                      </md-card-content>
                    </md-card>
                  </div>
                </div>
              </div>
            </div>

            <!-- ADD ITEM MENU -->
            <div v-show="toggles.menuAddItem">
              <hr class="my-1">
              <form class="form" @submit.prevent="postItem()">
                <div class="form-row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="name">Name</label>
                      <input type="text" id="name" class="form-control"
                             @input="$v.items.add.name.$touch()"
                             v-model.trim="items.add.name">
                      <p class="error-message" v-if="!$v.items.add.name.required">Name must not be empty</p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="type">Type</label>
                      <select class="custom-select" id="type"
                              @input="$v.items.add.type.$touch()"
                              v-model.trim="items.add.type">
                        <option value="drink">Drink</option>
                        <option value="dish">Dish</option>
                      </select>
                      <p class="error-message" v-if="!$v.items.add.type.required">Type must not be empty</p>
                    </div>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col-md-12">
                    <label for="description">Description</label>
                    <textarea id="description" rows="8" class="form-control"
                              @input="$v.items.add.description.$touch()"
                              v-model.trim="items.add.description"></textarea>
                    <p class="error-message" v-if="!$v.items.add.description.required">Description must not be empty</p>
                  </div>
                </div>
                <div class="form-row">
                  <div class="col-md-6">
                    <label for="price">Price</label>
                    <input type="number" id="price" class="form-control" v-model.trim="items.add.price"/>
                    <p class="error-message" v-if="!$v.items.add.price.required">Price must not be empty</p>

                  </div>
                  <div class="col-md-6">
                    <div class="form-group">
                      <label for="photo">Photo</label>
                      <input type="file" class="form-control" id="photo"
                             @input="$v.items.add.photo.$touch()"
                             v-on:change="onImageChange">
                      <p class="error-message" v-if="!$v.items.add.photo.required">Photo must not be empty</p>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <md-button class="md-success md-block" type="submit" :disabled="$v.items.add.$invalid">ADD ITEM</md-button>
                  </div>
                </div>
              </form>
            </div>

            <!-- USERS MENU -->
            <div v-show="toggles.users">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="user_name">Name</label>
                    <input type="text" id="user_name" class="form-control"
                           @input="$v.users.edit.name.$touch()"
                           v-model="users.edit.name">
                    <p class="error-message" v-if="!$v.users.edit.name.required">Name must not be empty</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="user_username">Username</label>
                    <input type="text" id="user_username" class="form-control"
                           @input="$v.users.edit.username.$touch()"
                           v-model="users.edit.username">
                    <p class="error-message" v-if="!$v.users.edit.username.required">Username must not be empty</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="user_email">Email</label>
                    <input type="text" id="user_email" class="form-control"
                           @input="$v.users.edit.email.$touch()"
                           v-model="users.edit.email">
                    <p class="error-message" v-if="!$v.users.edit.email.required">Email must not be empty</p>
                    <p class="error-message" v-if="!$v.users.edit.email.email">This is not a valid email format</p>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="type">Type</label>
                    <select class="custom-select" id="user_type"
                            @input="$v.users.edit.type.$touch()"
                            v-model="users.edit.type">
                      <option value="cashier">Cashier</option>
                      <option value="waiter">Waiter</option>
                      <option value="cook">Cook</option>
                      <option value="manager">Manager</option>
                    </select>
                    <p class="error-message" v-if="!$v.users.edit.type.required">Type must not be empty</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="user_blocked">Blocked</label>
                    <select class="custom-select" id="user_blocked"
                            @input="$v.users.edit.blocked.$touch()"
                            v-model="users.edit.blocked">
                      <option value="1">Blocked</option>
                      <option value="0">Not blocked</option>
                    </select>
                    <p class="error-message" v-if="!$v.users.edit.blocked.required">Blocked must not be empty</p>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <md-button class="md-info md-block mt-1" @click="saveUser()" :disabled="$v.users.edit.$invalid">SAVE USER</md-button>
                </div>
              </div>
              <div class="row" v-for="users in groupedItems(this.users.all, 3)" :key="users.id">
                <div class="col-md-4" v-for="user in users" :key="user.id">
                  <md-card>
                    <md-card-header data-background-color="green">
                      <h4 class="title">{{user.name}}</h4>
                      <h5 class="title">{{user.email}}</h5>
                      <h5 class="title">{{user.type}}</h5>
                    </md-card-header>
                    <md-card-content>
                      <!--<img  text :src="imageItem(user.photo_url)" :alt="user.name">-->
                      <img  src="https://www.bnl.gov/today/body_pics/2017/06/stephanhruszkewycz-hr.jpg" :alt="user.name">
                      <br>
                      <div class="row">
                        <div class="col-md-12">
                          <md-button class="m-0 md-info md-block mt-1" @click="editUser(user)"><md-icon>edit</md-icon></md-button>
                          <md-button class="m-0 md-danger md-block mt-1" @click="deleteUser(user)"><md-icon>delete_outline</md-icon></md-button>
                        </div>
                      </div>
                    </md-card-content>
                  </md-card>
                </div>
              </div>
            </div>
          </div>
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
      toggles:{
        tables: false,
        menu: false,
        menuDishes: false,
        menuDrinks: false,
        menuAddItem: false,
        users: false,
        dashboard: true,
        meal: false,
        mealDetails: false
      },
      tables: [],
      items: {
        dishes: [],
        drinks: [],
        add:{
          name: "",
          type: "",
          description: "",
          price: "",
          photo: ""
        }
      },
      users: {
        all: [],
        edit: {
          id: null,
          name: null,
          username: null,
          email: null,
          email_verified_at: null,
          password: null,
          type: null,
          blocked: null,
          photo_url: null,
          last_shift_start: null,
          last_shift_end: null,
          deleted_at: null,
          remember_token: null,
          created_at: null,
          updated_at: null
        }
      },
      invoices: {
        pending: []
      },
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
    };
  },
  validations:{
    items:{
      add:{
        name: {
          required
        },
        type: {
          required
        },
        description: {
          required
        },
        price: {
          required
        },
        photo: {
          required
        },
      }
    },
    users:{
      edit:{
        name: {
          required
        },
        type: {
          required
        },
        username:{
          required
        },
        email: {
          required,
          email
        },
        blocked:{
          required
        }
      }
    }
  },
  methods: {
    // ------- GET METHODS
    getAllTables(){
      TablesAPI.getTables().then((tables) => {
        this.tables = tables.data;
      });
    },
    getItems(){
      ItemsAPI.getItems('api/items').then(items => {
        items.data.forEach((e,i) => {
          if(e.type === "dish"){
            this.items.dishes.push(e);
          }else if(e.type === 'drink'){
            this.items.drinks.push(e);
          }
        });
      });
    },
    getUsers(){
      UsersAPI.getUsers([], true).then(r => {
        this.users.all = r.data;
      });
    },
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
    getMeals(filters, paginate, waiter, pageNumber, userID, date){
      MealsAPI.getMeals(filters, paginate, waiter, pageNumber, userID, date).then(meals => {
        this.meals.data = meals.data;
      });
    },

    // ------- POST METHODS
    postItem(){
      // Make the validation before sending
      ItemsAPI.postItem(this.items.add).then(item => {
        if(item.status !== 200){
          toastr.error('There was an eror while processing your request');
          return;
        }

        if(item.data.type === 'drink'){
          this.items.drinks.push(item.data);
          _.orderBy(this.items.drinks, ['name']);
        }else if(item.data.type === 'dish'){
          this.items.dishes.push(item.data);
          _.orderBy(this.items.dishes, ['name']);
        }

        toastr.success(this.items.add.name + ' adicionado com sucesso');

        // Clean item to add
        this.items.add.name = "";
        this.items.add.type = "";
        this.items.add.description = "";
        this.items.add.price = "";
        this.items.add.photo = "";

      })
    },

    // ----- DELETE METHODS
    deleteTable(tableID){
      TablesAPI.deleteTable(tableID).then((r) => {
        if(r.status !== 200){
          toastr.error('There was an error deleting the table');
          return false;
        }

        const tables = this.tables.slice();
        _.remove(tables, (currTable) => {
          return currTable.table_number === tableID;
        });
        this.tables = tables;

        toastr.success('Table deleted successfully');
      });
    },
    deleteItem(itemID, itemType){
      ItemsAPI.deleteItem(itemID).then(r => {
        if(r.status !== 200){
          swal('Error deleting item', r.data.error.message, 'error');
          return;
        }

        toastr.success('Item has been deleted successfully');
        let items;
        if(itemType === 'dish'){
          items = this.items.dishes.slice();
        }else if(itemType === 'drink'){
          items = this.items.drinks.slice();
        }
        _.remove(items, item => {
          return item.id === itemID;
        });

        if(itemType === 'dish'){
          this.items.dishes = items;
        }else if(itemType === 'drink'){
          this.items.drinks = items;
        }
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
    toggle(section){
      this.hideAllSections(false);

      if(section === "tables"){
        this.getAllTables();
        this.toggles.tables = true;
        return;
      }

      if(section === "menu"){
        this.toggles.menu = true;
        this.getItems();
        return;
      }

      if(section === "menuDishes"){
        this.toggles.menu = true;
        this.toggles.menuDishes = true;
        return;
      }

      if(section === "menuDrinks"){
        this.toggles.menu = true;
        this.toggles.menuDrinks = true;
        return;
      }

      if(section === "menuAddItem"){
        this.toggles.menu = true;
        this.toggles.menuAddItem = true;
        return;
      }

      if(section === "users"){
        this.toggles.users = true;
        this.getUsers();
        return;
      }

      if(section === "dashboard"){
        this.toggles.dashboard = true;
        this.getMealsTerminated();
        return;
      }

      if(section === "meals"){
        this.toggles.meal = true;
        this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active, true, true, null, null, this.meals.filters.date.date);
        return;
      }
    },

    hideAllSections(show){
      for (let key in this.toggles) {
        if (this.toggles.hasOwnProperty(key)) {
          this.toggles[key] = (!!show); // either show or hide the sections
        }
      }
    },

    groupedItems(items, columns){
      return _.chunk(items, columns);
    },

    imageItem(itemUrl){
      return 'http://restaurantmanagement.test/storage/items/' + itemUrl;
    },

    onImageChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length){
        toastr.error('Error while uploading photo');
        return;
      }
      this.createImage(files[0]);
    },

    createImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.items.add.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    editUser(user){
      this.users.edit = user;
      window.scrollTo(0, 0);
    },

    saveUser(){
      UsersAPI.updateUser(this.users.edit).then(r => {
        if(r.status === 200){
          toastr.success(this.users.edit.name + " foi actualizado com sucesso");
          return;
        }

        if(r.status === 422){
          toastr.error('UNIQUE EMAIL', r.data.error.message);
        }

        if(r.status === 404){
          toastr.error('User was not found');
        }
      });
    },

    deleteUser(user){
      // If the user is soft deleted we will throw an warning saying that this action will actually delete user form DB
      if(user.deleted_at !== null){
        swal('Deleting user forever', 'By doing this you will permanently delete the user', 'warning',{
          buttons:{
            cancel: "Not delete",
            catch:{
              text: "I would like to delete forever",
              value: true
            }
          }
        }).then(deleteUserForever => {
          if(deleteUserForever){
            UsersAPI.deleteUser(user, true).then(r => {
              if(r.status === 404){
                toastr.error('NOT FOUND', 'User not found');
                return;
              }

              if(r.status === 200){
                swal("SUCCESS", "User has been deleted permanently successfully", 'success');

                const users = this.users.all.slice();

                // Change the deleted_at attribute of the current user
                user.deleted_at = r.data.created_at.date;

                // Find the index where the current user is stored in all users
                let index = _.findIndex(users, {id: user.id});

                // Replace user in the array with the user updated
                user.splice(index, 1, user);

                // Change the whole collection of users so that vuejs can detect the change
                this.users.all = users;
              }
            });

          }
        });

        return;
      }

      swal('DELETE USER', 'Are you sure you would like to deleted this user?', 'warning',{
        buttons:{
          cancel: "Not delete",
          catch:{
            text: "I would like to delete",
            value: true
          }
        }
      }).then(deleteUser => {
        if(deleteUser){
          UsersAPI.deleteUser(user, false).then(r => {
            if(r.status === 404){
              toastr.error('NOT FOUND', 'User not found');
              return;
            }

            if(r.status === 200){
              swal("SUCCESS", "User has been deleted permanently successfully", 'success');
            }

          });

        }
      });

    },

    mealsPaginate(direction){
      if(direction === 'last'){
        this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active, true, true, this.meals.data.current_page - 1, this.meals.filters.waiter.active.id, this.meals.filters.date.date);
      }else{
        this.getMeals(this.meals.filters.state.active.length === 0 ? this.meals.filters.state.options : this.meals.filters.state.active, true, true, this.meals.data.current_page + 1, this.meals.filters.waiter.active.id, this.meals.filters.date.date);
      }
    },

    searchUser(searchQuery){
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

    declareNotPaid(item, type){
      if(type === 'meal'){
        this.putDeclareMealNotPaid(item);
      }

      if(type === 'invoice'){
        this.putDeclareInvoiceNotPaid(item);
      }
    },

    getMealDetails(meal){
      this.meals.selected.meal = meal;
      MealsAPI.getOrders([], meal.id).then(orders => {
        this.meals.selected.items = orders.data;

        location.hash = "#mealDetails";
      });
    }
  },

  created(){
    this.getMealsTerminated();
    this.getInvoicePending(true);
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
