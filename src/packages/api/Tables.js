import axios from "axios";
import toastr from "toastr";

export default{
  getTables(){
    // We can do some logic that concern only the API and then return promise
    return axios({
      method: "GET",
      url: "/api/tables",
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
  },
  getFreeTables(){
    return axios({
      method: "GET",
      url: "/api/tables/free",
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
  },
  deleteTable(tableID){
    return axios({
      method: "DELETE",
      url: "api/tables/" + tableID
    }).then(r => {
      return r;
    }).catch(err =>  {
      if(err){
        toastr.error("There was an error deleting table");
        return false;
      }
    });
  }
}