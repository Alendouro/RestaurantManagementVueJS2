<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Login</h4>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email</label>
              <md-input v-model="username" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="login">Login</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>

export default {
  name: "Login",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data(){
    return {
      username: '',
      password: '',
    };
  },
  methods:{
    login(){
      this.$store.dispatch('retrieveToken', {
        username: this.username,
        password: this.password,
      })
        .then(response => {
          if(response == "error"){
            return false;
          }
          this.axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token;
          return this.axios.get("/api/user");
        })
        .then(response => {
          if(response == "error"){
            return false;
          }
          this.$store.commit('setUser', response.data);
          this.$router.push('/' + response.data.type + '/dashboard');
        });
    }
  }
};
</script>

<style>

</style>

