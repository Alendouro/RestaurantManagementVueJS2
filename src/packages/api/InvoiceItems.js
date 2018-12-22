import axios from 'axios';
import toastr from "toastr";

export default{
  getInvoiceItems(invoiceID){
    return axios({
      method: "GET",
      url: "api/invoice/items/" + invoiceID
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  }
}