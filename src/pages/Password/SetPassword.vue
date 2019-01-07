<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="row">
          <div class="col-md-12">
            <h3>SET PASSWORD</h3>
            <label for="email">Email</label>
            <input type="text" v-model="user.email" id="email">
            <label for="password" class="mt-2">Password</label>
            <input type="password" v-model="user.password" id="password">
            <label for="password_confirmation" class="mt-2">Confirm Password</label>
            <input type="password" v-model="user.password_confirmation" id="password_confirmation">
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  data(){
    return{

    }
  },
  methods:{
    user:{
      email: '',
      password: '',
      password_confirmation: ''
    }
  },
  created() {
    // Parametro da rota
    // this.$route.params.code
  },
};
</script>

<style>

</style>

