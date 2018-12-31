<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
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
                  <!--<img text :src="imageItem(dish.photo_url)" :alt="dish.name">-->
                  <img text src="https://cdn.images.express.co.uk/img/dynamic/14/590x/McDonald-s-burger-876121.jpg" :alt="dish.name">
                  <br>
                  <md-button class="m-0 md-danger md-block mt-1" @click="deleteItem(dish.id, 'dish')"><md-icon >delete_outline</md-icon></md-button>
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
                  <!--<img text :src="imageItem(drink.photo_url)" :alt="drink.name">-->
                  <img text src="https://cdn.images.express.co.uk/img/dynamic/14/590x/McDonald-s-burger-876121.jpg" :alt="drink.name">
                  <md-button class="m-0 md-danger md-block mt-1" @click="deleteItem(drink.id, 'drink')"><md-icon >delete_outline</md-icon></md-button>
                </md-card-content>
              </md-card>
            </div>
          </div>
        </div>

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
    </div>
  </div>
</template>

<script>

import ItemsAPI from "../../packages/api/Items.js";
import { required, email } from 'vuelidate/lib/validators'
import toastr from 'toastr';
import _ from 'lodash';
import swal from "sweetalert";
import Toggles from '../../packages/toggles/toggles.js'
import URLFormatter from '../../packages/url/URLFormatter.js'

export default {
  data() {
    return {
      toggles:{
        menu: false,
        menuDishes: false,
        menuDrinks: false,
        menuAddItem: false,
      },
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
    }
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
  },
  methods: {
    toggle(section){
      Toggles.hideAllSections(false, this.toggles);

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
    groupedItems(items, columns){
      return _.chunk(items, columns);
    },
    onImageChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length){
        toastr.error('Error while uploading photo');
        return;
      }
      this.createImage(files[0]);
    },
    imageItem(itemUrl){
      return URLFormatter.imageItem(itemUrl);
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
    createImage(file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        this.items.add.photo = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    postItem(){
      // Make the validation before sending
      ItemsAPI.postItem(this.items.add).then(item => {
        if(item.status !== 200){
          toastr.error('There was an eror while processing your request');
          return;
        }

        if(item.data.type === 'drink'){
          const drinks = this.items.drinks.slice();
          drinks.push(item.data);
          _.orderBy(drinks, o => o.name);
          this.items.drinks = drinks;
        }else if(item.data.type === 'dish'){
          const dishes = this.items.dishes.slice();
          dishes.push(item.data);
          _.orderBy(dishes, ['name']);
          this.items.dishes = dishes;
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
  },
  created(){
    this.getItems();
  }
};
</script>
