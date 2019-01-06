<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
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
            <md-button class="m-0 md-info md-block mt-1" @click="sendEmail()">Send Email</md-button>
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
    }
  },
  validations: {
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
    sendEmail(){
      // using SendGrid's v3 Node.js Library
      // https://github.com/sendgrid/sendgrid-nodejs
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: 'miguelalendouro@gmail.com',
        from: 'm1@mail.pt',
        subject: 'Sending with SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail.send(msg);
    },
    editUser(user){
      this.users.edit = user;
      window.scrollTo(0, 0);
    },
    deleteUser(user){
      // If the user is soft deleted we will throw an warning saying that this action will actually delete user form DB
      if(user.deleted_at !== null){
        swal('Deleting user forever', 'By doing this you willtest permanently delete the user', 'warning',{
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
    groupedItems(items, columns){
      return _.chunk(items, columns);
    },
    getUsers(){
      UsersAPI.getUsers([], true).then(r => {
        this.users.all = r.data;
      });
    },
  },
  created(){
    this.getUsers();
  }
};
</script>
