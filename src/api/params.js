import myaxios from "@/utils/http.js";

const params = {
  getParamsList(id, queryInfo) {
    return myaxios.get(`categories/${id}/attributes`, { params: queryInfo });
  },
  addParams(id, queryBody) {
    return myaxios.post(`categories/${id}/attributes`, queryBody);
  },
  getParamsById(categoryId, attrId, queryInfo) {
    return myaxios.get(`categories/${categoryId}/attributes/${attrId}`, {
      params: queryInfo,
    });
  },
  editParams(categoryId, attrId, queryBody) {
    return myaxios.put(
      `categories/${categoryId}/attributes/${attrId}`,
      queryBody
    );
  },
  deleteParams(categoryId, attrId) {
    return myaxios.delete(`categories/${categoryId}/attributes/${attrId}`);
  },
};

export default params;
