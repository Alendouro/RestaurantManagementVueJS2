<template>
  <div class="content">
    <div class="md-layout">
      <md-button class="md-just-icon md-round md-success add-meal" @click='toggle("addMeal", null, null)'><md-icon >add</md-icon></md-button>
      <div class="md-layout-item">
        <div v-if="toggles.activeMeals">
          <h3>ACTIVE MEALS</h3>
          <div class="row" v-for="meals in groupedItems(myActiveMeals, 4)" :key="meals.id">
            <div class="col-md-3" v-for="meal in meals" :key="meal.id">
              <md-card>
                <md-card-header data-background-color="green">
                  <h4 class="title">Table {{ meal.table_number }}</h4>
                </md-card-header>
                <md-card-content>
                  <md-button class="md-info md-block" @click="toggle('chooseItemType', meal.id, meal.table_number)">ADD ITEM</md-button>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>

        <div v-if="toggles.addItemToMeal">
          <md-button class="md-default" @click="toggle('backToActiveMeals', null, null)"><md-icon >keyboard_arrow_left</md-icon></md-button>
          <h4>Adding dishes do table {{ this.mealSelected.table_number }}</h4>
          <div class="row">
            <div class="col-md-6">
              <md-button class="md-info md-block" @click="toggle('insertItemDishes', null, null)">DISHES</md-button>
            </div>
            <div class="col-md-6">
              <md-button class="md-info md-block" @click="toggle('insertItemDrinks', null, null)">DRINKS</md-button>
            </div>
          </div>
          <!-- ADD DISH TO MEAL SECTION -->
          <div v-if="toggles.insertItemDrinks">
            <div class="row" v-for="items in groupedItems(allItems.drinks, 3)" :key="items.id">
              <div class="col-md-4" v-for="item in items" :key="item.id">
                <div class="table text-center text-white p-4 rounded">
                  <div class="item-choose text-center rounded" @click="createOrder(item.id, item.name)">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="toggles.insertItemDishes">
            <div class="row" v-for="items in groupedItems(allItems.dishes, 3)" :key="items.id">
              <div class="col-md-4" v-for="item in items" md="4" :key="item.id">
                <div class="table text-center text-white p-4 rounded">
                  <div class="item-choose text-center rounded" @click="createOrder(item.id, item.name)">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ADD MEAL SECTION -->
        <div v-if="toggles.addMeal">
          <h3>ADD MEAL</h3>
          <div class="row">
            <div class="col-md-12">
              <label for="table_number" class="grey-text">Table</label>
              <select id="table_number" class="form-control" v-model="createMeal.table">
                <option v-for="table in freeTables" :value="table.table_number" :key="table.id">{{ table.table_number }}</option>
              </select>
              <md-button class="md-info md-block" @click="insertMeal">ADD MEAL</md-button>
            </div>
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
import toastr from 'toastr';
import _ from 'lodash';


export default {
  data() {
    return {
      user: [],
      freeTables: [],
      myActiveMeals: [],
      createMeal: { table: 0 },
      toggles:{
        addMeal: false,
        insertItemDishes: false,
        insertItemDrinks: false,
        chooseItemType: false,
        activeMeals: true,
        addItemToMeal: false
      },
      allItems: {
        drinks: [],
        dishes: []
      },
      mealSelected: {
        id: null,
        table_number: null
      },
    };
  },
  methods: {
    getFreeTables(){
      TablesAPI.getFreeTables().then(response => {
        this.freeTables = response;
      });
    },
    getMyActiveMeals(){
      MealsAPI.getMyActiveMeals().then(response => {
        this.myActiveMeals = response.data;
      });
    },
    groupedItems(items, columns){
      return _.chunk(items, columns);
    },
    insertMeal(){
      MealsAPI.postNewMeal(this.createMeal.table).then(response => {
        // We need to add the table to the array of tables
        this.myActiveMeals.push(response.data);

        // Re-order the myactive meals
        this.myActiveMeals = _.orderBy(this.myActiveMeals, ['table_number']);

        if (response.status === 201){
          // Remove from the array of free tables the one we just added
          _.remove(this.freeTables, (currentTable) => {
            return currentTable.table_number === this.createMeal.table;
          });
          swal('Meal registered with success', ' ', 'success');
          return false;
        }

        if (response.status === 403){
          swal(response.data.error.message, ' ', 'error');
          return false;
        }

        swal(response.data.error.message, ' ', 'error');
      })
    },
    toggle(section, mealID, table_number){
      if(section === "addMeal"){
        this.toggles.addMeal = true;

        // Scroll to the bottom of the page in case there are several tables
        window.scrollTo(0,document.body.scrollHeight);
        return;
      }



      if(section === "insertItemDishes" || section === "insertItemDrinks"){
        if(section === "insertItemDishes"){
          this.toggles.insertItemDishes = true;
          this.toggles.insertItemDrinks = false;
        }else{
          this.toggles.insertItemDrinks = true;
          this.toggles.insertItemDishes = false;
        }

        return;
      }

      if(section === "chooseItemType"){
        this.toggles.addItemToMeal = true;
        this.toggles.insertItemDishes = true;
        this.toggles.chooseItemType = true;
        this.toggles.activeMeals = false;
        this.mealSelected.id = mealID;
        this.mealSelected.table_number = table_number;
        this.toggles.addItemToMeal = true;
        return;
      }

      if(section === "backToActiveMeals"){
        this.toggles.addItemToMeal = false;
        this.toggles.insertItemDishes = false;
        this.toggles.chooseItemType = false;
        this.toggles.activeMeals = true;
        this.toggles.addItemToMeal = false;
      }
    },
    getItems(){
      // No need to paginate the results here
      ItemsAPI.getItems('/api/items')
        .then(items => {
          if (items){
            items.forEach((e, i) => {
              if (e.type === 'dish'){
                this.allItems.dishes.push(e);
              }
              if (e.type === 'drink'){
                this.allItems.drinks.push(e);
              }
            });
          }
        });
    },
    createOrder(itemID, itemName){
      // TODO ME NEEDS TO WAIT 5 SECONDS AND BE ABLE TO CANCEL ORDER
      OrderAPI.createOrder(this.mealSelected.id, itemID).then(response => {
        // Check if there is an error
        if (response){
          toastr.success(itemName + ' added succesfully');
        }
      });
    },
  },
  created(){
    this.getFreeTables();
    this.getMyActiveMeals();
    this.getItems();
    this.user = this.$store.state.user;
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
  .add-meal{
    position: fixed !important; bottom: 10px; right: 10px; z-index: 9999;
  }

  .item-choose{
    padding: 10px; background: linear-gradient(60deg, #66bb6a, #43a047); color: white;
    cursor: pointer;
  }
</style>
