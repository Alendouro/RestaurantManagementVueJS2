// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";
import axios from "axios";
import VueAxios from "vue-axios";
import store from './stores/store.js';
import Toasted from 'vue-toasted';


// router setup
import routes from "./routes/routes";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";
import Vuelidate from 'vuelidate';
import moment from 'moment';


// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active",
  mode: "history"
});

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
Vue.use(VueAxios, axios);
Vue.use(Toasted);
Vue.use(Vuelidate);

Vue.prototype.moment = moment;

/*
* Fazer o axios assumir uma URL por padrão
* */
axios.defaults.baseURL = "http://restaurantmanagement.test";
axios.defaults.headers.common.Authorization = "Bearer " + store.state.token;

Vue.prototype.$Chartist = Chartist;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store,
  data: {
    Chartist: Chartist
  }
});

