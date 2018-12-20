import axios from "axios";
import toastr from "toastr";

export default{
  getTables(){
    // We can do some logic that concern only the API and then return promise
    return axios({
      method: "GET",
      url: "/api/tables",
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (error){
          toastr.error("There was an internal error");
          return false;
        }
      });
  },
  getFreeTables(){
    return axios({
      method: "GET",
      url: "/api/tables/free",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        if (error){
          toastr.error("There was an internal error");
          return false;
        }
      });
  }
}