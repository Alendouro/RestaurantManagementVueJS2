<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-4">
            <stats-card data-background-color="green">
              <template slot="header">
                <md-tooltip md-direction="top">Defines the average time a costumer spent in his meal</md-tooltip>
                <md-icon>whatshot</md-icon>
              </template>

              <template slot="content">
                <p class="category">Average time on meal</p>
                <h3 class="title">{{ topCardsData.averageTimeCostumerSpentMeal }} <small class="text-small">minutes</small></h3>
              </template>
            </stats-card>
          </div>
          <div class="col-md-4">
            <stats-card data-background-color="green">
              <template slot="header">
                <md-tooltip md-direction="top">Total number of delivered orders made in this restaurant</md-tooltip>
                <md-icon>poll</md-icon>
              </template>

              <template slot="content">
                <p class="category">Delivered orders</p>
                <h3 class="title">{{ topCardsData.totalNumberOrders }} <small class="text-small">orders</small></h3>
              </template>
            </stats-card>
          </div>
          <div class="col-md-4">
            <stats-card data-background-color="green">
              <template slot="header">
                <md-tooltip md-direction="top">Total number of meals</md-tooltip>
                <md-icon>fastfood</md-icon>
              </template>

              <template slot="content">
                <p class="category">Average orders per meal</p>
                <h3 class="title">{{ topCardsData.totalNumberMeals }} <small class="text-small">meals</small></h3>
              </template>
            </stats-card>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-md-10">
            <label for="stats_user">User <small>search average performance of user</small></label>
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
            </chart-card>
          </div>
        </div>
        <div class="row" v-if="performanceOrders.data.labels.length > 0">
          <div class="col-md-12">
            <chart-card
                    :chart-data="performanceOrders.data"
                    :chart-options="performanceOrders.options"
                    chart-type="Line"
                    data-background-color="green">
              <template slot="content">
                <h4 class="title">Total number of Orders</h4>
              </template>
            </chart-card>
          </div>
        </div>
        <div class="row" v-if="performanceMeals.data.labels.length > 0">
          <div class="col-md-12">
            <chart-card
                    :chart-data="performanceMeals.data"
                    :chart-options="performanceMeals.options"
                    chart-type="Line"
                    data-background-color="green">
              <template slot="content">
                <h4 class="title">Total number of Meals</h4>
              </template>
            </chart-card>
          </div>
        </div>
        <div class="row" v-if="performanceMealsAverageTime.data.labels.length > 0">
          <div class="col-md-12">
            <chart-card
                    :chart-data="performanceMealsAverageTime.data"
                    :chart-options="performanceMealsAverageTime.options"
                    chart-type="Line"
                    data-background-color="green">
              <template slot="content">
                <h4 class="title">Average time Meal</h4>
              </template>
            </chart-card>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <md-card v-if="performanceOrdersAverageMinutesPerMoth.length > 0">
              <md-card-header data-background-color="green" id="mealDetails">
                <h6 class="title">Average time it takes to handle each order grouped by items and month</h6>
                <h6 class="title"><md-icon>warning</md-icon>Should be using pagination in here but no time</h6>
              </md-card-header>
              <md-card-content>
                <table class="table">
                  <thead>
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th>Month</th>
                    <th>Average</th>

                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in performanceOrdersAverageMinutesPerMoth" :key="item.id">
                    <td class="pt-4">{{ index + 1 }}</td>
                    <td class="pt-4">{{ item.name }}</td>
                    <td class="pt-4">{{ item.month }}</td>
                    <td class="pt-4">{{ item.average }}</td>
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

import UsersAPI from "../../packages/api/Users.js";
import StatsAPI from "../../packages/api/Stats.js";
import _ from 'lodash';
import Multiselect from 'vue-multiselect'
import StatsCard from "../../../src/components/Cards/StatsCard.vue";
import ChartCard from "../../../src/components/Cards/ChartCard.vue";

export default {
  components: { Multiselect, ChartCard, StatsCard },
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
          high: 1,
          chartPadding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }
        },
      },
      performanceOrders:{
        data: {
          labels: [],
          series: [],
        },
        options: {
          low: 0,
          high: 1,
          chartPadding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 25
          }
        },
      },
      performanceMeals:{
        data: {
          labels: [],
          series: [],
        },
        options: {
          low: 0,
          high: 1,
          chartPadding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 25
          }
        },
      },
      performanceMealsAverageTime:{
        data: {
          labels: [],
          series: [],
        },
        options: {
          low: 0,
          high: 1,
          chartPadding: {
            top: 20,
            right: 20,
            bottom: 20,
            left: 25
          }
        },
      },
      performanceOrdersAverageMinutesPerMoth: [],
      topCardsData:{
        averageTimeCostumerSpentMeal: '...',
        totalNumberOrders: '...',
        totalNumberMeals: '...',
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
      StatsAPI.getUserPerformance(this.users.filters.user.active).then(r => {
        // Calculate the average asked in the US 39
        let average = (_.sum(r.data.series)/r.data.series.length);
        this.performanceUser.data.average = average.toFixed(2);

        // Need to set padding of the graph since it doesn't do it automatically
        // which is a shame.
        this.setLowHighOptionsGraph(this.performanceUser.options, r.data.series);

        this.performanceUser.data.labels = r.data.labels;
        // Chartist's series needs to be an array inside of an array
        this.performanceUser.data.series = [r.data.series];
      });
    },
    getMealsHandled(){
      StatsAPI.getMealsHandled().then(r => {
        // Need to set padding of the graph since it doesn't do it automatically
        // which is a shame.
        this.setLowHighOptionsGraph(this.performanceMeals.options, r.data.series);

        this.performanceMeals.data.labels = r.data.labels;
        this.performanceMeals.data.series = [r.data.series];

        // Calculate the total number of meals handled
        this.topCardsData.totalNumberMeals = _.sum(r.data.series);
      });
    },
    getOrdersHandled(){
      StatsAPI.getOrdersHandled().then(r => {
        // Need to set padding of the graph since it doesn't do it automatically
        // which is a shame.
        this.setLowHighOptionsGraph(this.performanceOrders.options, r.data.series);

        this.performanceOrders.data.labels = r.data.labels;
        this.performanceOrders.data.series = [r.data.series];

        // Calculate total number of orders handled in this restaurant
        this.topCardsData.totalNumberOrders = _.sum(r.data.series);
      });
    },
    getAverageTimeMeal(){
      StatsAPI.getAverageTimeSpentOnMeal().then(r => {
        // Need to set padding of the graph since it doesn't do it automatically
        // which is a shame.
        this.setLowHighOptionsGraph(this.performanceMealsAverageTime.options, r.data.series);

        this.performanceMealsAverageTime.data.labels = r.data.labels;
        this.performanceMealsAverageTime.data.series = [r.data.series];

        // Calculate the average on all months that a customer has spent in the restaurant
        let average = (_.sum(r.data.series)/r.data.series.length);
        this.topCardsData.averageTimeCostumerSpentMeal = average.toFixed(2);
      });
    },
    getAverageMinutesOrdersPerMonth(){
      StatsAPI.getAverageMinutesOrdersPerMonth().then(r => {
        console.log(this.performanceOrdersAverageMinutesPerMoth.length);
        this.performanceOrdersAverageMinutesPerMoth = r.data;
        console.log(this.performanceOrdersAverageMinutesPerMoth);
      });
    },
    // ---- AUX METHODS
    setLowHighOptionsGraph(options, series){
      options.low = 0;
      options.high = _.max(series) + 80;
    }
  },
  created(){
    this.getOrdersHandled();
    this.getMealsHandled();
    this.getAverageTimeMeal();
    this.getAverageMinutesOrdersPerMonth();
  }
};
</script>

<style scoped>
  .bottom-column{
    position: absolute;
    bottom: 0px;
  }

  .text-small{
    font-size: 10px !important;
  }
</style>
