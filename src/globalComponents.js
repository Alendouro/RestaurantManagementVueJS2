import DropDown from "./components/Dropdown.vue";
import Modal from "@/components";
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component("drop-down", DropDown);
    Vue.component(Modal);
  }
};

export default GlobalComponents;
