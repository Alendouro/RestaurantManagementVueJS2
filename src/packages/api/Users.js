import axios from "axios";
import toastr from "toastr";

export default{
  getUsers(filters){
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
      url: "/api/users" + (parameters === "" ? "" : "/" + parameters)
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        if (error){
          toastr.error("There was an internal error");
          return false;
        }
      });
  }
}