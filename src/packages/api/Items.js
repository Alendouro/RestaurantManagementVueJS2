import axios from 'axios';
export default{
  getItems(page) {
    return axios.get(page).then(response => {
      // We can do some logic that concern only the API and then return promise
      return response.data;
    }).catch(error => {
        if (error){
          console.log('There was an internal error');
          return false;
        }
      });
  }

};