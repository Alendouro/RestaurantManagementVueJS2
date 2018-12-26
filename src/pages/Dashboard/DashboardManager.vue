<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-2">
            <md-button class="md-success md-block" @click="toggle('tables')">TABLES</md-button>
            <md-button class="md-success md-block" @click="toggle('menu')">MENU</md-button>
            <md-button class="md-success md-block" @click="toggle('users')">USERS</md-button>
          </div>
          <div class="col-md-10">
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
                          <md-button class="m-0 md-info md-block mt-1" @click="editUser(user)" :disabled="user.deleted_at === null"><md-icon>edit</md-icon></md-button>
                          <md-button class="m-0 md-danger md-block mt-1"><md-icon>delete_outline</md-icon></md-button>
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



export default {
  data() {
    return {
      toggles:{
        tables: false,
        menu: false,
        menuDishes: false,
        menuDrinks: false,
        menuAddItem: false,
        users: false
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
      }
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
        }
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
        // TODO REMOVE THIS
        // this.getItems();
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
      console.log(this.users.edit);
      UsersAPI.updateUser(this.users.edit).then(r => {
        if(r.status === 200){
          toastr.success(this.users.edit.name + " foi actualizado com sucesso");
          return;
        }

        if(r.status === 404){
          toastr.error('User was not found');
        }
      });
    }
  },

  created(){

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>