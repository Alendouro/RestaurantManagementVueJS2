import axios from 'axios';
import toastr from 'toastr';
import URLFormatter from '../url/URLFormatter.js';

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
  getMeals(filters, paginate, waiter, pageNumber, waiterID, date) {
    // If it has filter we need to construct the parameters
    let states = "";
    filters.forEach((e, i) => {
      if (i === 0) {
        // If it is the first parameter then we need to insert '?'
        states += "?state[]=" + e;
      } else {
        // otherwise just insert the & symbol
        states += "&state[]=" + e;
      }
    });
    return axios({
      method: "GET",
      url: "/api/meals/" + this.constructParameters(states, paginate, waiter, pageNumber, waiterID, date)
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
  putMealNotPaid(meal){
    return axios({
      method: "PUT",
      url: "/api/meals/terminated/" + meal.id
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        if (error) {
          toastr.error("There was an internal error");
          return false;
        }
      });
  },
  // ----------- AUXILIARY METHODS
  constructParameters(states, paginate, waiter, pageNumber, waiterID, date) {
    let parameters = [
      states,
      paginate,
      waiter,
      pageNumber,
      waiterID,
      date
    ];



    return (states === "" ? "" : states) +
      (paginate ? URLFormatter.isFirstParameter(parameters) + "paginate=1" : "") +
      (waiter ? URLFormatter.isFirstParameter(parameters) + "waiter=1" : "") +
      (pageNumber === null ? "" : (URLFormatter.isFirstParameter(parameters) + "page=" + pageNumber)) +
      (waiterID === null ? "" : URLFormatter.isFirstParameter(parameters) + "waiterID=" + waiterID) +
      (date === null ? "" : URLFormatter.isFirstParameter(parameters) + "date=" + date);
  }
}