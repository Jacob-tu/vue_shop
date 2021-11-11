import myaxios from "@/utils/http.js";

const list = {
  getGoodsList(queryInfo) {
    return myaxios.get(`goods`, {
      params: queryInfo,
    });
  },
  deleteGoodsById(id) {
    return myaxios.delete(`goods/${id}`);
  },
  addGoods(queryBody){
    return myaxios.post('goods',queryBody)
  }
};

export default list;
