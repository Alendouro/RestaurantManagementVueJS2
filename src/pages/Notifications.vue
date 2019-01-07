<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Send Notification to Managers</h4>
          </md-card-header>
          <md-card-content>
            <div class="md-layout">
              <div class="md-layout-item md-medium-size-100">
               <md-field>
                 <label>Message</label>
                <md-input v-model="messageToSendToManagers" type="text"></md-input>
              </md-field>
              <div class="md-layout-item md-size-100 text-right">
                <md-button class="md-raised md-success" @click="msgToManagers">Send</md-button>
              </div>
              </div>
            </div>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageToSendToManagers: "",
      //type: ["", "info", "success", "warning", "danger"],
      notifications: {
        topCenter: false
      }
    };
  },
  methods: {
   msgToManagers: function(){
    if (this.$store.state.user === null) {
      this.$toasted.error('User is not logged in. Department is unknown!');
    } else {
      this.$socket.emit('msg_from_user_to_managers',
      this.messageToSendToManagers, this.$store.state.user);
    }
      this.messageToSendToManagers = "";
    }
  }
};
</script>
