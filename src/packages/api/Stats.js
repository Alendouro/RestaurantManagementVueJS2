import axios from 'axios';
import toastr from "toastr";

export default{
  getUserPerformance(user){
    return axios({
      method: "GET",
      url: "/api/statistics/users/" + user.id + "/performance"
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 404) {
          toastr.error("User was not found", "ERROR");
          return false;
        }
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  },
  getMealsHandled(){
    return axios({
      method: "GET",
      url: "/api/statistics/performance/meals"
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 404) {
          toastr.error("There is no data", "ERROR");
          return false;
        }
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  },
  getOrdersHandled(){
    return axios({
      method: "GET",
      url: "/api/statistics/performance/orders"
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 404) {
          toastr.error("There is no data", "ERROR");
          return false;
        }
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  },
  getAverageTimeSpentOnMeal(){
    return axios({
      method: "GET",
      url: "/api/statistics/performance/meals/average"
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 404) {
          toastr.error("There is no data", "ERROR");
          return false;
        }
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  },
  getAverageMinutesOrdersPerMonth(){
    return axios({
      method: "GET",
      url: "/api/statistics/performance/orders/average"
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 404) {
          toastr.error("There is no data", "ERROR");
          return false;
        }
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  }
}