<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row mb-2">
          <div class="col-md-10">
            <label for="stats_user">User</label>
            <multiselect v-model="users.filters.user.active"
                         :options="users.filters.user.options"
                         @search-change="searchUsers"
                         :preserve-search="true"
                         :loading="users.filters.user.isLoading"
                         label="name"
                         track-by="name"
                         style="z-index: 9999;" id="stats_user"></multiselect>
          </div>
          <div class="col-md-1">
            <md-button class="md-success md-block bottom-column m-0 p-0"
                       @click="getStatsUser"
                       :disabled="users.filters.user.active.id === null"><md-icon >show_chart</md-icon></md-button>
          </div>
        </div>
        <div class="row" v-if="performanceUser.data.labels.length > 0">
          <div class="col-md-12">
            <chart-card
                    :chart-data="performanceUser.data"
                    :chart-options="performanceUser.options"
                    chart-type="Line"
                    data-background-color="green">
              <template slot="content">
                <h4 class="title">{{ users.filters.user.active.type === "cook" ? "Number of meals prepared" : "Number of orders served"}}</h4>
                <p class="category">
                  Average of {{ performanceUser.data.average }} {{ users.filters.user.active.type === "cook" ? "meals prepared" : "orders served" }}
                </p>
              </template>

              <template slot="footer">
                <div class="stats">
                  <md-icon>access_time</md-icon>
                  updated 4 minutes ago
                </div>
              </template>
            </chart-card>
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
import StatsCard from "../../../src/components/Cards/StatsCard.vue";
import ChartCard from "../../../src/components/Cards/ChartCard.vue";

export default {
  components: { Multiselect, Datepicker, ChartCard, StatsCard },
  data() {
    return {
      users: {
        filters: {
          user:{
            active: {
              id: null,
              name: null,
              type: null
            },
            options: [],
            isLoading: false
          }
        }
      },
      performanceUser: {
        data: {
          labels: [],
          series: [],
          average: 0
        },
        options: {
          low: 0,
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }
        }
      }
    }
  },

  methods: {
    searchUsers(searchQuery){
      if(searchQuery.length < 3){
        return;
      }

      var options = [];
      this.users.filters.user.isLoading = true;

      UsersAPI.getSearchUser(searchQuery).then(r => {
        this.users.filters.user.isLoading = false;
        r.data.forEach(e => {
          if(e.type === "waiter" || e.type === "cook"){
            options.push({
              id: e.id,
              name: e.name + " - " + e.type,
              type: e.type
            });
          }
        });
      });

      this.users.filters.user.options = options;
    },
    getStatsUser(){
      UsersAPI.getUserPerformance(this.users.filters.user.active).then(r => {
        if(r.status === 200){
          this.performanceUser.data.labels = r.data.labels;
          // Chartist's series needs to be an array inside of an array
          this.performanceUser.data.series = [r.data.series];
        }

        let average = (_.sum(r.data.series)/r.data.series.length);
        this.performanceUser.data.average = average.toFixed(2);
      });
    },
  },
  created(){

  }
};
</script>

<style scoped>
  .bottom-column{
    position: absolute;
    bottom: 0px;
  }
</style>
