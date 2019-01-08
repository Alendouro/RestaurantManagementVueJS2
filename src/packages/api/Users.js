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
  createUser(user){
    return axios({
      method: "POST",
      url: "/api/users",
      data: user
    })
      .then(r => {
      return r;
  })
    .catch(err => {
      let statusCode = err.response.status;
      if (statusCode === 403) {
        toastr.error(err.response.data.error.message, "ERROR");
      }
      if (statusCode === 500) {
        toastr.error("There was an internal error", "ERROR");
      }

      if(statusCode === 422){
        let data = err.response.data;
        for(let field in data.errors){
          if (data.errors.hasOwnProperty(field)) {
            data.errors[field].forEach(message => {
              toastr.error(message, field)
            })
          }
        }
      }

      return false;
    });
  },
  // --------- STATS ROUTES
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
  // Start and End Shift
  startShift(id){
    axios.put('/api/user/startShift/' + id)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      if (error){
        toastr.error("There was an internal error");
        return false;
      }
    })
  }


}