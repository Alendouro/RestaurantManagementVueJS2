<template>
  <form>
    <div v-if="showPassword" class="md-layout-item md-size-100 text-left">
            <md-button class="md-raised md-success" @click="showPasswordField">Change Password</md-button>
    </div>
    <md-card v-if="!showPassword">
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Change Password</h4>
      </md-card-header>
      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>New Password</label>
              <md-input v-model="newPassword" type="password"></md-input>
            </md-field>
             <md-field>
              <label>Confirm new password</label>
              <md-input v-model="confirmPassword" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="changePassword">Update Password</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>

<script>

export default {
  name: "change-password",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data(){
    return{
      password: '',
      newPassword: '',
      confirmPassword: '',  
      showPassword: true,
      user: [],
    }
  },
  methods:{
    changePassword(){
        if (this.newPassword == this.confirmPassword){
            this.axios.put("/api/user/password/"+ this.user.id, this.newPassword)
            .then(response =>{
              this.$toasted.success("Password Changed!");
            })
            .catch(error =>{
                this.$toasted.error("Error changing password");
            })
        }
        else {
          this.$toasted.error("Passwords don't match");
        }
    },
    showPasswordField(){
      if(this.showPassword){
         this.showPassword = false;
      }else{
        this.showPassword = true;
      }
    }
  },
  created() {
    this.user = this.$store.state.user;
  },
};
</script>

<style>

</style>

