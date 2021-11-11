import myaxios from "@/utils/http.js";

const order = {
  getOrderList(queryInfo) {
    return myaxios.get("orders", {
      params: queryInfo,
    });
  },
  getProgress(){
    return myaxios.get(`/kuaidi/1106975712662`)
  }
};

export default order;
