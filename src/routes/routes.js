import DashboardLayout from "@/pages/Layout/DashboardLayout.vue";

import Dashboard from "@/pages/Dashboard.vue";
import UserProfile from "@/pages/UserProfile.vue";
import TableList from "@/pages/TableList.vue";
import Typography from "@/pages/Typography.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Notifications from "@/pages/Notifications.vue";
import Items from "@/pages/Items.vue";
import Login from "@/pages/Auth/Login.vue";
import Logout from "@/pages/Auth/Logout.vue";
import DashboardCook from "@/pages/Cook/DashboardCook.vue";
import DashboardCook from "@/pages/Dashboard/DashboardCook.vue";
import DashboardWaiter from "@/pages/Dashboard/DashboardWaiter.vue";
import DashboardCashier from "@/pages/Dashboard/DashboardCashier.vue";
import DashboardManager from "@/pages/Dashboard/DashboardManager.vue";
import OrdersWaiter from "@/pages/Waiter/OrdersWaiter.vue";

const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/items",
    children: [
      // --------- COOKER -----------
      {
        path: "cook",
        name: "Cook",
        component: DashboardCook
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      // -------- UNSIGED USER --------
      {
        path: "items",
        name: "Items",
        component: Items
      },
      {
        path: "login",
        name: "Login",
        component: Login
      },
      // ------- GENERAL USER ----------
      {
        path: "logout",
        name: "Logout",
        component: Logout
      },
      {
        path: "user",
        name: "User Profile",
        component: UserProfile
      },
      {
        path: "table",
        name: "Table List",
        component: TableList
      },
      {
        path: "typography",
        name: "Typography",
        component: Typography
      },
      {
        path: "icons",
        name: "Icons",
        component: Icons
      },
      {
        path: "maps",
        name: "Maps",
        meta: {
          hideFooter: true
        },
        component: Maps
      },
      {
        path: "notifications",
        name: "Notifications",
        component: Notifications
      },
      // ---------- WAITER ------------
      {
        path: "waiter/dashboard",
        name: "Waiter Dashboard",
        component: DashboardWaiter
      },
      {
        path: "waiter/orders",
        name: "Waiter Orders",
        component: OrdersWaiter
      },
      // ---------- CASHIER ------------
      {
        path: "cashier/dashboard",
        name: "Cashier Dashboard",
        component: DashboardCashier
      },
      // ---------- MANAGER -------------
      {
        path: "manager/dashboard",
        name: "Manager Dashboard",
        component: DashboardManager
      }
    ]
  }
];

export default routes;
