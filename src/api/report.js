import myaxios from "@/utils/http.js";

const report = {
  getReport() {
    return myaxios.get(`reports/type/1`);
  },
};

export default report;
