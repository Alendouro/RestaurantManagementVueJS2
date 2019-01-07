<template>
<md-table md-card>
      <md-table-toolbar data-background-color="green">
        <h1 class="md-title">In Preparation Orders</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" v-for="order in orders" :key="order.id">
        <md-table-cell md-label="Name">{{ order.item.name }}</md-table-cell>
        <md-button class="md-raised md-primary" data-background-color="green" @click="updateState(order)">Prepared</md-button>
      </md-table-row>
    </md-table>
</template>
<script>
import OrdersAPI from '../../packages/api/Orders.js';
import swal from 'sweetalert';
import { PendingOrders } from "@/pages";

export default {
  name: "cook-orders-in-preparation",
  data() {
    return {
      orders: [],
      pagination: {},
      user: [],
      backGroundColor: "green",
    };
  },

  methods: {
    fetchItems(pageUrl) {
      this.axios.defaults.headers.common.Authorization = "Bearer " + this.$store.state.token;
      //Get orders of cook
      OrdersAPI.getItems(pageUrl || '/api/orders/' + this.user.id + '/inPreparation' + '?paginate')
        .then(orders => {
          // Fill the items with the data received from API
          this.orders = orders.data;
        })
        .catch(error => {
          if (error){
            swal(' ', 'There was an error while processing the request');
          }
        });
    },
    updateState(order){
      OrdersAPI.changeState('/api/orders/changeState/' + order.id).then(response =>{
        this.$socket.emit('order_changed', response.data.order);
      });
    },
    getOrderChanged: function(order){
      for (let idx in this.orders) {
          if (this.orders[idx].id == order.id){
            if (this.orders[idx].state != "in preparation"){
              this.orders.splice(idx, 1);
            }
            else {
              return null;
            }
          } 
        }
        if (order.state == "in preparation"){
          return order;
        }
        return null;
	  },
  },
  sockets: {
    order_changed(orderChanged){
      let refToChangedOrder = this.getOrderChanged(orderChanged);
      if (refToChangedOrder !== null) {
          this.orders.push(orderChanged);
      }
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
