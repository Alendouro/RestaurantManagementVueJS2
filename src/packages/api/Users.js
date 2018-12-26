import axios from "axios";
import toastr from "toastr";

export default{
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
  updateUser(user){
    return axios({
      method: "PUT",
      url: "/api/users/" + user.id,
      data: user
    })
      .then(r => {
        return r;
    })
      .catch(err => {
        if(err){
          toastr.error("There was an internal error");
          return false;
        }
    });
  }
}