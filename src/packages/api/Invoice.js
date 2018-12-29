import axios from 'axios';
import toastr from "toastr";
import URLFormatter from "../url/URLFormatter";

export default{
  getInvoices(filters, paginate, meal, waiter, page, date){
    // If it has filter we need to construct the parameters
    let states = "";
    filters.forEach((e, i) => {
      if (i === 0) {
        // If it is the first parameter then we need to insert '?'
        states += "?states[]=" + e;
      } else {
        // otherwise just insert the & symbol
        states += "&states[]=" + e;
      }
    });

    return axios({
      method: "GET",
      url: "api/invoice" + this.constructParameters(states, paginate, meal, waiter, page, date)
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  getPending(withMeal){
    return axios({
      method: "GET",
      url: "api/invoice/pending" + (withMeal ? "?meal=1" : "")
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  updateInvoice(data, invoiceID) {
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
  putDeclareInvoiceNotPaid(invoice){
    return axios({
      method: "PUT",
      url: "api/invoice/pending/" + invoice.id
    }).catch(error => {
      if (error) {
        toastr.error("There was an internal error");
        return false;
      }
    });
  },
  // ----------- AUXILIARY METHODS
  constructParameters(states, paginate, meal, waiter, page, date) {
    let parameters = [
      states,
      paginate,
      waiter,
      page,
      date
    ];



    return (states === "" ? "" : states) +
      (paginate ? URLFormatter.isFirstParameter(parameters) + "paginate=1" : "") +
      (waiter ? URLFormatter.isFirstParameter(parameters) + "waiter=1" : "") +
      (meal ? URLFormatter.isFirstParameter(parameters) + "meal=1" : "") +
      (page !== null ? URLFormatter.isFirstParameter(parameters) + "page=" + page : "") +
      (date !== null ? URLFormatter.isFirstParameter(parameters) + "date=" + date : "");
  }
}