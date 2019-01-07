<template>
  <md-toolbar md-elevation="0" class="md-transparent">
    <div class="md-toolbar-row">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">{{$route.name}}</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button class="md-just-icon md-simple md-toolbar-toggle" :class="{toggled: $sidebar.showSidebar}" @click="toggleSidebar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <md-list>
            <md-list-item to="/notifications" class="dropdown">
              <drop-down>
                <a slot="title" class="dropdown-toggle" data-toggle="dropdown">
                  <i class="material-icons">notifications</i>
                  <span class="notification">{{this.notifications.length}}</span>
                  <p class="hidden-lg hidden-md">Notifications</p>
                </a>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li v-for="notification in notifications" :key="notification.message">
                    <a> 
                      <b>{{notification.user}}: </b>
                      {{notification.message}}
                      <a v-if="notification.button">
                        <md-button>{{notification.button}}</md-button>
                      </a>
                    </a>
                  </li>
                  <li class="text-right">
                    <md-button @click.prevent="clearNotifications" class="md-success md-size-100">Clear</md-button>
                  </li>
                </ul>
              </drop-down>
            </md-list-item>
            <md-list-item v-if="loggedIn" class="showOnLogin" to="/user">
              <i class="material-icons">person</i>
              <p class="hidden-lg hidden-md">Profile</p>
            </md-list-item>
            <md-list-item v-if="!loggedIn" class="hideOnLogin" to="/login">
              <i class="material-icons">exit_to_app</i>
              <p class="hidden-lg hidden-md">Login</p>
            </md-list-item>
            <md-list-item v-if="loggedIn" class="showOnLogin" to="/logout">
              <i class="material-icons">exit_to_app</i>
              <p class="hidden-lg hidden-md">Logout</p>
            </md-list-item>
          </md-list>
        </div>
      </div>
    </div>

  </md-toolbar>
</template>

<script>
export default {
  data() {
    return {
      selectedEmployee: null,
      employees: [
        "Jim Halpert",
        "Dwight Schrute",
        "Michael Scott",
        "Pam Beesly",
        "Angela Martin",
        "Kelly Kapoor",
        "Ryan Howard",
        "Kevin Malone"
      ], 
      notifications: [],
    };
  },
  methods: {
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    notifyVue(verticalAlign, horizontalAlign, message) {
      this.$notify({
        message: message,
        icon: "add_alert",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: "success"
      });
    },
    clearNotifications(){
      this.notifications = [];
    },
  },
  sockets:{
    connect(){
      console.log('socket connected (socket ID = '+this.$socket.id+')');
      },
      msg_from_server(dataFromServer){
        this.notifyVue('top','right', dataFromServer);
        this.notifications.push(
          {message: dataFromServer}
        )
      },
      msg_from_user_to_managers(dataFromServer){
        this.notifyVue('top','right', dataFromServer[1].name + ": " + dataFromServer[0]);
        this.notifications.push(
          {
            message: dataFromServer[0],
            user: dataFromServer[1].name,
          },
        )
        console.log(this.notifications);
      },
      meal_terminated(dataFromServer){
        this.notifyVue('top', 'right', dataFromServer[0].name +': has terminated meal from table ' + dataFromServer[1].table_number);
        this.notifications.push(
          {
            message: 'has terminated meal from table ' + dataFromServer[1].table_number,
            user: dataFromServer[0].name,
            button: "meals",
          },
        )
      },
      invoice_paid(dataFromServer){
        this.notifyVue('top', 'right', dataFromServer);
        this.notifications.push(
          {
            message: dataFromServer,
            button: "Invoices"
          })
      },
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>

<style lang="css">
</style>
