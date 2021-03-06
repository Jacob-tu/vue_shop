import Vue from "vue";
import VueRouter from "vue-router";
// import Login from "../components/Login.vue";
// import Home from "../components/Home.vue";
// import Welcome from "../components/Welcome.vue";
// import Users from "../components/user/Users.vue";
// import Rights from "../components/power/Rights.vue";
// import Roles from "../components/power/Roles.vue";
// import Category from "@/components/goods/Category.vue";
// import Params from "@/components/goods/Params.vue";
// import List from "@/components/goods/List.vue";
// import Add from "@/components/goods/Add.vue";
// import Order from "@/components/order/Order.vue";
// import Report from '@/components/report/Report.vue'

const Login = () => import(/* webpackChunkName: "login_home_welome" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welome" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welome" */ '@/components/Welcome')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/user/Users')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '@/components/power/Roles')

const Category = () => import(/* webpackChunkName: "Category_Params" */ '@/components/goods/Category')
const Params = () => import(/* webpackChunkName: "Category_Params" */ '@/components/goods/Params')

const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/List')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '@/components/goods/Add')

const Order = () => import(/* webpackChunkName: "Order_Report" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '@/components/report/Report')

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: Welcome },
      { path: "/users", component: Users },
      { path: "/rights", component: Rights },
      { path: "/roles", component: Roles },
      { path: "/categories", component: Category },
      { path: "/params", component: Params },
      { path: "/goods", component: List },
      { path: "/goods/add", component: Add },
      { path: "/orders", component: Order },
      { path: "/reports", component: Report },
    ],
  },
];

const router = new VueRouter({
  routes,
});

//????????????????????????
router.beforeEach((to, from, next) => {
  //to ?????????????????????
  //from ?????????????????????????????????
  //next ?????????????????????
  if (to.path === "/login") return next();
  //?????? token
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
