/*jshint esversion: 6 */

import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: localStorage.getItem('access_token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  },
  getters:{
    loggedIn(state){
      return state.token !== null;
    },
  },
  mutations: {
    retrieveToken(state, token){
      state.token = token;
    },
    destroyTokenAndUser(state){
      state.token = null;
      state.user = null;
    },
    setUser: (state, user) => {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    loadTokenAndUserFromSession: state => {
      state.token = "";
      state.user = null;
      let token = localStorage.getItem('token');
      let user = localStorage.getItem('user');
      if (token) {
        state.token = token;
        axios.defaults.headers.common.Authorization = "Bearer " + token;
      }
      if (user){
        state.user = JSON.parse(user);
      }
    }
  },
  actions: {
    destroyTokenAndUser(contex) {
      if (contex.getters.loggedIn){
        return new Promise((resolve, reject) => {
          axios
            .post("/api/logout")
            .then(response => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              contex.commit('destroyTokenAndUser');
              resolve(response);
            })
            .catch(error => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('user');
              contex.commit('destroyTokenAndUser'); 
              reject(error);
            });
        });
      }
    },
    retrieveToken(contex, credentials) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/login", {
            username: credentials.username,
            password: credentials.password
          })
          .then(response => {
            const token = response.data.access_token;

            localStorage.setItem('access_token', token);
            contex.commit('retrieveToken', token);
            resolve(response);
          })
          .catch(error => {
            console.log(error);
            reject(error);
          });
      });
    },
  }
});
export default store;
