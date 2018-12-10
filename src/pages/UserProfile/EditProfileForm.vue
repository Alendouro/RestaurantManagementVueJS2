<template>
  <form>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">Edit Profile</h4>
        <p class="category">Complete your profile</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Username</label>
              <md-input v-model="user.username" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Name</label>
              <md-input v-model="user.name" type="text"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <label>Email</label>
              <md-input v-model="user.email" type="email" disabled></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-33">
            <md-field>
              <input type="file" id="file" ref="file" accept="image/*" v-on:change="handleFileUpload()">
            </md-field>
          </div>
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="update">Update Profile</md-button>
          </div>
        </div>

      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: "edit-profile-form",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      user: [],
      file: '',
    };
  },
  methods: {
    update (){
       this.axios.defaults.headers.common.Authorization = "Bearer " + this.$store.state.token;
       this.axios.put("/api/users/"+this.user.id, this.user)
        .then(response =>{
          console.log(response);
          this.$store.commit('setUser', this.user);
        })
        .catch(error => {
          console.log(error);
        });

        let formData = new FormData();

        formData.append('file', this.file);

        this.axios.post("/api/user/image/"+this.user.id,
          formData,
          {
            hearders: {
              'Content-Type' : 'multipart/form-data'
            }
          }
        ).then(response =>{
          console.log('SUCCESS!!');
          console.log(response.data);
          this.user.photo_url = response.data.photo;
          this.$store.commit('setUser', this.user);
        })
        .catch(function(){
          console.log('FAILURE!!');
        });
    },
    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    }
  },
  created() {
    this.user = this.$store.state.user;
  },
};
</script>
<style>
</style>
