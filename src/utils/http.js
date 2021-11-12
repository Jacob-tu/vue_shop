import axios from "axios";
import { Loading, Message } from "element-ui"; // 这里我是使用elementUI的组件来给提示
import router from "@/router";

let loadingInstance = null; // 加载全局的loading

const instance = axios.create({
  //创建axios实例，在这里可以设置请求的默认配置
  timeout: 10000, // 设置超时时间10s
  baseURL:
    process.env.NODE_ENV === "production"
      ? "http://120.25.207.68:8889/api/private/v1/"
      : "http://127.0.0.1:8888/api/private/v1/", //根据自己配置的反向代理去设置不同环境的baeUrl
});

let httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: "请求参数错误",
  401: "权限不足, 请重新登录",
  403: "服务器拒绝本次访问",
  404: "请求资源未找到",
  500: "内部服务器错误",
  501: "服务器不支持该请求中使用的方法",
  502: "网关错误",
  504: "网关超时",
};

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  (config) => {
    config.headers.Authorization = window.sessionStorage.getItem("token") || "";
    loadingInstance = Loading.service({
      // 发起请求时加载全局loading，请求失败或有响应时会关闭
      spinner: "fa fa-spinner fa-spin fa-3x fa-fw",
      text: "拼命加载中...",
    });
    if (config.method === "get") {
      // 添加时间戳参数，防止浏览器（IE）对get请求的缓存
      config.params = {
        ...config.params,
        t: new Date().getTime(),
      };
    }
    return config;
  },
  (error) => {
    console.log("请求出错了");
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/** 添加响应拦截器  **/
// axios默认http状态码为2xx为成功，其他为失败，而该项目中http响应码均为200,
// 因此不会执行失败的回调函数
instance.interceptors.response.use(
  (response) => {
    loadingInstance.close();
    if (
      response.data.meta.status === 200 ||
      response.data.meta.status === 201
    ) {
      // 响应结果里的status: ok是我与后台的约定，大家可以根据实际情况去做对应的判断
      return Promise.resolve(response.data);
    } else {
      Message({
        message: response.data.meta.msg,
        type: "error",
      });
      return Promise.reject(response.data.meta.msg);
    }
  },
  (error) => {
    loadingInstance.close();
    // console.log(error);
    if (error.response) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips =
        error.response.status in httpCode
          ? httpCode[error.response.status]
          : error.response.data.message;
      Message({
        message: tips,
        type: "error",
      });
      if (error.response.status === 401) {
        // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
        router.push({
          path: `/login`,
        });
      }
      return Promise.reject(error);
    } else {
      Message({
        message: "请求超时, 请刷新重试",
        type: "error",
      });
      return Promise.reject(new Error("请求超时, 请刷新重试"));
    }
  }
);

export default instance;
