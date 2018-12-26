<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33" v-for="item in items" :key="item.id">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">{{item.name}}</h4>
            <p class="category">Are you looking for more components? Please check our Premium Version of Vue Material Dashboard.</p>
          </md-card-header>
          <md-card-content>
             <img text :src="imageItem(item.photo_url)" :alt="item.name">
          </md-card-content>
        </md-card>
      </div>
    </div>
    <div>
      <div md="8">
        <div class="pagination">
          <div class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="fetchItems(pagination.prev_page_url + '&paginate')"
                  :disabled="!pagination.prev_page_url">Previous</md-button>
            <md-button class="md-raised md-success" @click="fetchItems(pagination.next_page_url + '&paginate')"
                  :disabled="!pagination.next_page_url">Next</md-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ItemsAPI from '../packages/api/Items.js';
import swal from 'sweetalert';

export default {
  data() {
    return {
      items: [],
      pagination: {}
    };
  },

  methods: {
    makePagination(data){
      this.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url
      };
    },

    fetchItems(pageUrl) {
      ItemsAPI.getItems(pageUrl || '/api/items?paginate')
        .then(items => {
          // Fill the items with the data received from API
          this.items = items.data.data;
          // Fill the pages with the pages and urls necessary
          this.makePagination(items);
        })
        .catch(error => {
          if (error){
            swal(' ', 'There was an error while processing the request');
          }
        });
    },
    imageItem(itemUrl){
      return 'http://restaurantmanagement.test/storage/items/' + itemUrl;
    }
  },

  created(){
    this.fetchItems();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 

</style>
