<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-2">
            <md-button class="md-success md-block" @click="toggle('tables')">TABLES</md-button>
            <md-button class="md-success md-block" @click="toggle('menu')">MENU</md-button>
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
                <div class="col-sm-6">
                  <md-button class="md-info md-block" @click="toggle('menuDishes')">DISHES</md-button>
                </div>
                <div class="col-sm-6">
                  <md-button class="md-success md-block" @click="toggle('menuDrinks')">DRINKS</md-button>
                </div>
              </div>
              <div v-show="this.toggles.menuDishes">
                <div class="row" v-for="dishes in groupedItems(this.items.dishes, 3)" :key="dishes.id">
                  <div class="col-md-4" v-for="dish in dishes" :key="dish.id">
                    <md-card>
                      <md-card-header data-background-color="blue">
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
      },
      tables: [],
      items: {
        dishes: [],
        drinks: []
      }
    };
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
        console.log(items);
        items.data.forEach((e,i) => {
          if(e.type === "dish"){
            this.items.dishes.push(e);
          }else if(e.type === 'drink'){
            this.items.drinks.push(e);
          }
        });

        console.log(this.items);
      });
    },
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
        console.log(items);
        _.remove(items, item => {
          return item.id === itemID;
        });
        console.log(items);

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
    }
  },

  created(){
    // console.log(this.toggles);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
