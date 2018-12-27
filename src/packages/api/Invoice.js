import axios from 'axios';
import toastr from "toastr";

export default{
  getInvoices(filters, paginate, meal, waiter){
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
      url: "api/invoice" + (parameters === "" ? "" : "" + parameters) + (paginate ? "&paginate" : "") + (meal ? "&meal" : "") + (waiter ? "&waiter" : "")
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getPending(){
    return axios({
      method: "GET",
      url: "api/invoice/pending"
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  updateInvoice(data, invoiceID){
    return axios({
      method: "PUT",
      url: "api/invoice/" + invoiceID,
      data: data
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },

}