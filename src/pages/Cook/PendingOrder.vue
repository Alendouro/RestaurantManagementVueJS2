<template>    
  <div>
    <md-table md-card>
      <md-table-toolbar>
        <h1 class="md-title">Pending Orders</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" v-for="order in pendingOrders" :key="order.id">
        <md-table-cell md-label="Name">{{ order.item.name }}</md-table-cell>
        <md-button class="md-raised md-primary" data-background-color="red" @click="changeState(order)">Confirm</md-button>
      </md-table-row>
    </md-table>
  </div>
</template>
<script>
import OrdersAPI from '../../packages/api/Orders.js';
import swal from 'sweetalert';

export default {
  name: "pending-order",
  data() {
    return {
      pendingOrders: [],
      user: [],
      backGroundColor: "green",
    };
  },

  methods: {
    fetchItems(pageUrl) {
      this.axios.defaults.headers.common.Authorization = "Bearer " + this.$store.state.token;
      OrdersAPI.getItems(pageUrl || '/api/orders/pending?paginate')
        .then(pendingOrders => {
          // Fill the items with the data received from API
          this.pendingOrders = pendingOrders.data;
          console.log(this.pendingOrders);
        })
        .catch(error => {
          if (error){
            swal(' ', 'There was an error while processing the request');
          }
        });
    },
    changeState(order) {
      this.axios.defaults.headers.common.Authorization = "Bearer " + this.$store.state.token;
      OrdersAPI.changeState('/api/orders/changeState/' + order.id)
        .then(response => {
          // Fill the items with the data received from API
          console.log(response);
        })
        .catch(error => {
          if (error){
            swal(' ', 'There was an error while processing the request');
          }
        });
    },
    imageItem(itemUrl){
      return 'http://restaurantmanagement.test/storage/items/' + itemUrl;
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