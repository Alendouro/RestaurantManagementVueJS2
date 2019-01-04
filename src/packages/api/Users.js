import axios from "axios";
import toastr from "toastr";

export default {
  getUsers(filters, trashed = false){
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

    // We can do some logic that concern only the API and then return promise
    return axios({
      method: "GET",
      url: "/api/users" + (parameters === "" ? "" : "/" + parameters) + (trashed ? (parameters === "" ? "?trashed" : "&trashed") : "")
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
  getSearchUser(name){
    // We can do some logic that concern only the API and then return promise
    return axios({
      method: "GET",
      url: "/api/users/search?name=" + name
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
  updateUser(user) {
    return axios({
      method: "PUT",
      url: "/api/users/" + user.id,
      data: user
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 422) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error");
          return false;
        }
      });
  },
  deleteUser(user, forever) {
    return axios({
      method: "DELETE",
      url: "/api/users/" + user.id + (forever ? "?forever" : "")
    })
      .then(r => {
        return r;
      })
      .catch(err => {
        let statusCode = err.response.status;
        if (statusCode === 403) {
          toastr.error(err.response.data.error.message, "ERROR");
          return false;
        }
        if (statusCode === 500) {
          toastr.error("There was an internal error", "ERROR");
        }
      });
  },
  // --------- STATS ROUTES

}