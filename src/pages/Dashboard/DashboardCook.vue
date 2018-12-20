<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33" v-for="order in orders" :key="order.id">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">{{order.state}}</h4>
          </md-card-header>
          <md-card-content>
            <h6 class="category text-gray">{{order.meal_id}}</h6>
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div>
      <div md="8">
        <div class="pagination">
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="fetchItems(pagination.prev_page_url + '&paginate')"
                  :disabled="!pagination.prev_page_url">Previous</md-button>
            <md-button class="md-raised md-success" @click="fetchItems(pagination.next_page_url + '&paginate')"
                  :disabled="!pagination.next_page_url">Next</md-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import OrdersAPI from '../../packages/api/Orders.js';
import swal from 'sweetalert';

export default {
  data() {
    return {
      orders: [],
      pagination: {},
      user: [],
    };
  },

  methods: {
    makePagination(data){
      this.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url
      };
    },

    fetchItems(pageUrl) {
      this.axios.defaults.headers.common.Authorization = "Bearer " + this.$store.state.token;
      OrdersAPI.getItems(pageUrl || '/api/orders/' + this.user.id + '?paginate')
        .then(orders => {
          // Fill the items with the data received from API
          this.orders = orders.data;
          // Fill the pages with the pages and urls necessary
          this.makePagination(orders);
        })
        .catch(error => {
          if (error){
            swal(' ', 'There was an error while processing the request');
          }
        });
    },
  },
  created(){
    this.user = this.$store.state.user;
    this.fetchItems();   
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
