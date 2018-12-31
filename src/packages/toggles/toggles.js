export default{
  /**
   * Receives an object which will loop through and set its properties to false
   * @param show
   * @param toggles
   */
  hideAllSections(show, toggles){
    for (let key in toggles) {
      if (toggles.hasOwnProperty(key)) {
        toggles[key] = !!show; // either show or hide the sections
      }
    }
  }
}