<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Orders (Prepared)</h4>
            <p class="category">Here you can see your prepared orders</p>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>Table</th>
                <th>Item</th>
                <th>Price</th>
                <th>Time</th>
                <th><md-icon>border_color</md-icon></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="orderPrepared in orders.prepared" :key="orderPrepared.id" class="bg-warning text-white">
                <td class="pt-4">{{ orderPrepared.meal.table_number }}</td>
                <td class="pt-4">{{ orderPrepared.item.name }}</td>
                <td class="pt-4">{{ orderPrepared.item.price }}</td>
                <td class="pt-4">{{ orderPrepared.item.created_at }}</td>
                <td><md-button class="m-0" @click="markOrderAsDelivered(orderPrepared.id)">DELIVERED</md-button></td>
              </tr>
              </tbody>
            </table>
          </md-card-content>
        </md-card>
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Orders (Pending - Confirmed)</h4>
            <p class="category">Here you can see your pending and confirmed orders</p>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>Table</th>
                <th>State</th>
                <th>Item</th>
                <th>Price</th>
                <th>Time</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="orderConfirmed in orders.confirmed" :key="orderConfirmed.id" class="bg-success text-white">
                <td>{{ orderConfirmed.meal.table_number }}</td>
                <td>{{ orderConfirmed.state }}</td>
                <td>{{ orderConfirmed.item.name }}</td>
                <td>{{ orderConfirmed.item.price }}</td>
                <td>{{ orderConfirmed.item.created_at }}</td>
                <md-tooltip md-direction="top">Confirmed</md-tooltip>
              </tr>
              <tr v-for="orderPending in orders.pending" :key="orderPending.id" class="bg-info text-white">
                <td>{{ orderPending.meal.table_number }}</td>
                <td>{{ orderPending.state }}</td>
                <td>{{ orderPending.item.name }}</td>
                <td>{{ orderPending.item.price }}</td>
                <td>{{ orderPending.item.created_at }}</td>
                <md-tooltip md-direction="top">Pending</md-tooltip>
              </tr>
              </tbody>
            </table>
          </md-card-content>
        </md-card>
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
      orders: {
        confirmed: [],
        pending: [],
        prepared: []
      }
    };
  },
  methods: {
    getMyOrders(filters){
      OrderAPI.getMyOrders(filters).then(orders => {
        if(orders){
          orders.data.forEach((e,i) =>  {
            if(e.state === "confirmed"){
              this.orders.confirmed.push(e);
            }

            if(e.state === "pending"){
              this.orders.pending.push(e);
            }

            if(e.state === "prepared"){
              this.orders.prepared.push(e);
            }
          });
        }
      });
    },
    markOrderAsDelivered(orderID){
      OrderAPI.updateOrderToDelivered(orderID).then(() => {
        toastr.success('Order has been marked as delivered', 'Order delivered');

        const prepared = this.orders.prepared.slice(); // cria copia do array sem mutar o original

        _.remove(prepared, (currentOrder) => {
          return currentOrder.id === orderID;
        });

        this.orders.prepared = prepared;
      }).catch(error => {
        if(error.response === 404){
          toastr.error('Record doesn\'t doesnt exist', 'error');
        }
      });
    },
    getOrderChanged: function(order){
      for (let idx in this.orders.confirmed) {
          if (this.orders.confirmed[idx].id == order.id){
            if (this.orders.confirmed[idx].id != "confirmed"){
              this.orders.confirmed.splice(idx, 1);
            }
          } 
        }
      for (let idx in this.orders.pending) {
          if (this.orders.pending[idx].id == order.id){
            if (this.orders.pending[idx].id != "prepared"){
              this.orders.pending.splice(idx, 1);
            }
          } 
        }
      for (let idx in this.orders.prepared) {
        if (this.orders.prepared[idx].id == order.id){
          if (this.orders.prepared[idx].id != "prepared"){
            this.orders.prepared.splice(idx, 1);
          }
        } 
      }
      if (order.state == "confirmed"){
        this.orders.confirmed.push(order);
      }
      if (order.state == "pending"){
        this.orders.pending.push(order);
      }
      if (order.state == "prepared"){
        this.orders.prepared.push(order);
      }
	  },
  },
  sockets: {
    order_changed(orderChanged){
      this.getOrderChanged(orderChanged);
    },
  },   
  created(){
    this.getMyOrders(['pending', 'confirmed', 'prepared']);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
</style>
