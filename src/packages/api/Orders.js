import axios from "axios";
import toastr from 'toastr';

export default{
  getItems(page) {
    return axios.get(page).then(response => {
      // We can do some logic that concern only the API and then return promise
      return response.data;
    }).catch(error => {
      if (error) {
        console.log("There was an internal error");
      }
    });
  },

  createOrder(mealID, itemID) {
    return axios({
      method: "POST",
      url: "/api/orders",
      data: {
        meal_id: mealID,
        item_id: itemID
      }
    }).then(response => {
      return response.data;
    })
      .catch(error => {
        if (error) {
          toastr.error("There was an internal error");
        }
      });
  },

  getMyOrders(filters) {
    // If it has filter we need to construct the parameters
    let parameters = "";
    filters.forEach((e, i) => {
      if (i === 0) {
        // If it is the first parameter then we need to insert '?'
        parameters += "?filters[]=" + e;
      } else {
        // otherwise just insert the & symbol
        parameters += "&filters[]=" + e;
      }
    });

    return axios({
      method: "GET",
      url: "/api/orders/waiter/my" + (parameters === "" ? "" : "/" + parameters),
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },

  updateOrderToDelivered(orderID){
    return axios({
      method: "PUT",
      url: "/api/orders/delivered/" + orderID
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  }
}
  },
  changeState(page){
    return axios.put(page).then(response => {
      // We can do some logic that concern only the API and then return promise
      console.log(response);
      return response;
    })
      .catch(error => {
        if (error){
          console.log('There was an internal error');
          return false;
        }
      });
  },
};