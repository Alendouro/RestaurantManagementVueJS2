<template>
  <md-card class="md-card-profile">
    <div class="md-card-avatar">
       <img class="img" :src="imageItem(user.photo_url)">
    </div>

    <md-card-content>
      <h6 class="category text-gray">{{user.type}}</h6>
      <h4 class="card-title">{{user.name}}</h4>
      <p class="card-description">
          Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
      </p>
      <md-button class="md-round md-success">Follow</md-button>
    </md-card-content>
  </md-card>
</template>
<script>
export default {
  name: "user-card",
  props: {
    cardUserImage: {
      type: String,
      default: require("@/assets/img/faces/marc.jpg")
    }
  },
  data() {
    return {
      user: []
    };
  },
  methods: {
    imageItem(itemUrl){
      return 'http://restaurantmanagement.test/storage/profiles/' + itemUrl;
    },
  }, 
  created() {
    this.user = this.$store.state.user;
  },
};
</script>
<style>
</style>
