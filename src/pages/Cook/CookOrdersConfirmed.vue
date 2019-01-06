<template>
<md-table md-card>
      <md-table-toolbar data-background-color="orange">
        <h1 class="md-title">Confirmed</h1>
      </md-table-toolbar>

      <md-table-row slot="md-table-row" v-for="order in orders" :key="order.id">
        <md-table-cell md-label="Name">{{ order.item.name }}</md-table-cell>
        <md-table-cell md-label="State">{{ order.state }}</md-table-cell>
        <md-button class="md-raised md-primary" data-background-color="orange" @click="updateState(order)">In Preparation</md-button>
      </md-table-row>
    </md-table>
</template>
<script>
import OrdersAPI from '../../packages/api/Orders.js';
import swal from 'sweetalert';
import { PendingOrders } from "@/pages";

export default {
  name: "cook-orders-confirmed",
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
      OrdersAPI.getItems(pageUrl || '/api/orders/' + this.user.id + '/confirmed' + '?paginate')
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
      })
    },
    getOrderChanged: function(order){
      for (let idx in this.orders) {
          if (this.orders[idx].id == order.id){
            if (this.orders[idx].id != "confirmed"){
              this.orders.splice(idx, 1);
            }
          } 
        }
        if (order.state == "confirmed"){
          return order;
        }
        return null;
	  },
  },
  sockets: {
    order_changed(orderChanged){
      console.log("recebeu nos cooks");
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
