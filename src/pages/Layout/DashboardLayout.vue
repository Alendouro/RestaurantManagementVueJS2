<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <a @click.prevent="startShift" >
        <sidebar-link v-if="loggedIn &&  !user.shift_active" class="showOnLogin" to="#">
          <md-icon>work</md-icon>
          <p>Start Shift</p> 
         <!-- <p>Last Shift Ended: {{Math.floor(this.$moment.duration(this.$moment(new Date()).diff(user.last_shift_end)).asHours()) }}h</p> -->
        </sidebar-link>
      </a>
      <a @click.prevent="endShift" >
        <sidebar-link v-if="loggedIn && user.shift_active" class="showOnLogin" to="#">
          <md-icon>work</md-icon>
         <p>End Shift</p>
          <!-- <p> Working since: {{user.last_shift_start}}</p> -->
          <!-- <p>Y're working for {{Math.floor(this.$moment.duration(this.$moment(new Date()).diff(user.last_shift_start)).asHours()) }}h now - End Shift</p> -->
        </sidebar-link>
      </a> 
      <!-- All Users -->
       <sidebar-link to="/items">
        <md-icon>fastfood</md-icon>
        <p>Items</p>
      </sidebar-link>
      <sidebar-link v-if="loggedIn" class="showOnLogin" to="/user">
        <md-icon>person</md-icon>
        <p>User Profile</p>
      </sidebar-link>
      <!-- Cooker --> 
      <sidebar-link v-if="loggedIn && user.type == 'cook' " class="showOnLogin"  to="/cook">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      
      <!-- Waiter -->
      <sidebar-link v-if="loggedIn && user.type == 'waiter' " class="showOnLogin"  to="/waiter/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

       <sidebar-link v-if="loggedIn && user.type == 'waiter' " class="showOnLogin"  to="/waiter/orders">
        <md-icon>edit</md-icon>
        <p>Orders</p>
      </sidebar-link>

      <!-- Cashier -->
      <sidebar-link v-if="loggedIn && user.type == 'cashier' " class="showOnLogin"  to="/cashier/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

       <!-- Manager -->
      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/dashboard">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/meals">
        <md-icon>book</md-icon>
        <p>Meals</p>
      </sidebar-link>
      
      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/tables">
        <md-icon>table_chart</md-icon>
        <p>Tables</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/menu">
        <md-icon>create</md-icon>
        <p>Menu</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/users">
        <md-icon>people</md-icon>
        <p>Users</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/invoices">
        <md-icon>euro_symbol</md-icon>
        <p>Invoices</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn && user.type == 'manager' " class="showOnLogin"  to="/manager/stats">
        <md-icon>timeline</md-icon>
        <p>Statistics</p>
      </sidebar-link>

      <sidebar-link v-if="loggedIn" class="showOnLogin" to="/notifications">
        <md-icon>notifications</md-icon>
        <p>Notifications</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content>

      </dashboard-content>

      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "@/pages/Layout/MobileMenu.vue";
import toastr from 'toastr';  
//import UserAPI from "../../packages/api/Users.js";

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu
  },
   data() {
    return {
      user: [],
    };
  },
  methods: {
    getTo(section){
      this.$router.push(this.user.type + '/' + section);
    },
    startShift(){
      this.axios.put('/api/user/startShift/' + this.user.id)
      .then(response => {
        this.$store.commit('setUser', response.data);
        this.user = this.$store.state.user;
        if (this.user.type == "manager"){
          this.$socket.emit('user_enter', this.user);
        }
        toastr.success("You're now working!");
      })
      .catch(error => {
        if (error){
          toastr.error("There was an internal error");
          return false;
        }
      })
    },
    endShift(){
      this.axios.put('/api/user/endShift/' + this.user.id)
      .then(response => {
        this.$store.commit('setUser', response.data);
        this.user = this.$store.state.user;
        if(this.user.type == "manager"){
          this.$socket.emit('user_exit', this.user);
        }
        toastr.success("You just ended your shift");
      })
      .catch(error => {
        if (error){
          this.$socket.emit('user_exit', this.$store.state.user);
          toastr.error("There was an internal error");
          return false;
        }
      })
    },
    notifyVue(verticalAlign, horizontalAlign, message) {
      this.$notify({
        message: message,
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: "danger"
      });
    }
  },
  sockets:{
    connect(){
      console.log('socket connected (socket ID = '+this.$socket.id+')');
      },
      msg_from_server(dataFromServer){
        this.notifyVue('top','right', dataFromServer);
      },
      msg_from_user_to_managers(dataFromServer){
        this.notifyVue('top','right', dataFromServer);
      },
    },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
  },
  created(){
    this.user = this.$store.state.user;
  }
};
</script>
