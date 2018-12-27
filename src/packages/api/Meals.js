import axios from 'axios';
import toastr from 'toastr';
export default{
  getActiveMeals() {
    return axios({
      method: "GET",
      url: "/api/meals/active"
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getMyActiveMeals() {
    return axios({
      method: "GET",
      url: "/api/meals/active/my"
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getOrders(filters, mealID) {
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
      url: "/api/meals/orders/" + mealID + (parameters === '' ? '' : '/' + parameters),
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getTerminated(){
    return axios({
      method: "GET",
      url: "api/meals/terminated"
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getMeals(filters, paginate){
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
      url: "/api/meals/" + (parameters === "" ? "" : parameters) + (paginate ? (parameters === "" ? '?paginate' : '&paginate') : "")
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  postCloseMeal(filters, mealID){
    // If it has filter we need to construct the parameters
    let parameters = "";
    filters.forEach((e, i) => {
      if (i === 0) {
        // If it is the first parameter then we need to insert '?'
        parameters += "?" + e;
      } else {
        // otherwise just insert the & symbol
        parameters += "&" + e;
      }
    });

    return axios({
      method: "POST",
      url: "api/meals/close" + (parameters === "" ? "" : "" + parameters),
      data: {
        meal_id: mealID
      }
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  postNewMeal(tableID){
    return axios({
      method: "POST",
      url: "/api/meals",
      data: {
        table_number: tableID
      }
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },

}