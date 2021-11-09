import myaxios from "@/utils/http.js";

const category = {
  getCategoryList(queryInfo) {
    return myaxios.get("categories", { params: queryInfo });
  },
  addCategory(queryInfo) {
    return myaxios.post("categories", queryInfo);
  },
  deleteCategory(id) {
    return myaxios.delete(`categories/${id}`);
  },
  getCategoryById(id) {
    return myaxios.get(`categories/${id}`);
  },
  categoryChange(id, cat_name) {
    return myaxios.put(`categories/${id}`, { cat_name: cat_name });
  },
};

export default category;
