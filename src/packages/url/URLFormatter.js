export default{
  /**
   * If this is the first parameter we will return the `?` character
   * If it is different than the first parameter we will return `&`
   * Usefull for constructing URLs that requires several parameters
   * @param parameters
   * @returns {string}
   */
  isFirstParameter(parameters) {
    let delimiter = "?";
    parameters.forEach(function(e) {
      if (e !== "") {
        delimiter = "&";
      }
    });
    return delimiter;
  },
  /**
   * Return the URL to the image of the item
   * @param itemUrl
   * @returns {string}
   */
  imageItem(itemUrl) {
    return "http://restaurantmanagement.test/storage/items/" + itemUrl;
  },

  imageUser(photoURL) {
    return "http://restaurantmanagement.test/storage/profiles/" + photoURL;
  }
}