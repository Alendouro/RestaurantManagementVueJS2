<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-6">
            <img src="https://www.qualiscare.com/wp-content/uploads/2017/08/default-user.png"

                 alt="default profile picture"
                 class="mx-auto d-block img-user">
            <div class="text-center">
              <h3>{{ user.name }}</h3>
              <h5>{{ user.username }}</h5>
              <h5>{{ user.type }}</h5>
              <h5>{{ user.email }}</h5>

            </div>
          </div>
          <div class="col-md-6">
            <label for="name">Name</label>
            <input type="text"
                   class="form-control"
                   @input="$v.user.name.$touch()"
                   v-model="user.name"
                   id="name">
            <p class="error-message" v-if="!$v.user.name.required">Name must not be empty</p>
            <label for="username">username</label>
            <input type="text"
                   class="form-control"
                   @input="$v.user.username.$touch()"
                   v-model="user.username"
                   id="username">
            <p class="error-message" v-if="!$v.user.username.required">Username must not be empty</p>
            <label for="type">Type</label>
            <select id="type"
                    v-model="user.type"
                    @input="$v.user.type.$touch()"
                    class="form-control">
              <option></option>
              <option value="manager">Manager</option>
              <option value="cook">Cook</option>
              <option value="cashier">Cashier</option>
              <option value="waiter">Waiter</option>
            </select>
            <p class="error-message" v-if="!$v.user.type.required">Type must not be empty</p>
            <label for="email">Email</label>
            <input type="text" class="form-control" v-model="user.email" id="email">
            <p class="error-message" v-if="!$v.user.email.required">Email must not be empty</p>
            <p class="error-message" v-if="!$v.user.email.email">This is not a valid email format</p>
            <md-button class="md-success md-block"
                       :disabled="$v.user.$invalid"
                       @click="addUser()">ADD USER</md-button>
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
      user:{
        name: '',
        username: '',
        type: '',
        email: ''
      }
    }
  },
  validations: {
    user:{
      name:{
        required
      },
      username: {
        required
      },
      type:{
        required
      },
      email:{
        required,
        email
      }
    }
  },
  methods: {
    addUser(){
      UsersAPI.createUser(this.user).then(r => {
        // This means that there were some error that ocurred
        if(!r){
          return;
        }

        toastr.success("User has been created an email sent to his email", "SUCCESS");
      });
    }
  },
  created(){

  }
};
</script>

<style>
  .img-user{
    width: 150px !important;
    height: 150px !important;
  }
</style>