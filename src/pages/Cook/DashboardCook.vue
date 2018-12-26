<template>
  <div class="content">
    <cook-orders-in-preparation>
    </cook-orders-in-preparation>
    <cook-orders-confirmed>
    </cook-orders-confirmed>
  </div>
</template>
<script>
import OrdersAPI from '../../packages/api/Orders.js';
import swal from 'sweetalert';
import { PendingOrders, CookOrdersInPreparation, CookOrdersConfirmed } from "@/pages";

export default {
  components: {
    PendingOrders,
    CookOrdersInPreparation,
    CookOrdersConfirmed,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
