import axios from "axios";
import toastr from "toastr";

export default{
  getItems(page) {
    return axios.get(page).then(response => {
        // We can do some logic that concern only the API and then return promise
        return response;
    }).catch(error => {
        if (error){
          console.log("There was an internal error");
          return false;
        }
      });
  },
  deleteItem(itemID){
    return axios({
      method: "DELETE",
      url: "/api/items/" + itemID
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  postItem(item){
    return axios({
      method: "POST",
      url: "api/items/",
      data: item
    }).catch(err => {
      if (err) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  }
};