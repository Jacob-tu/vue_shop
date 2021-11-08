import myaxios from '@/utils/http.js'

const category = {
  getMenuList() {
    return myaxios.get('menus')
  },
  getCategoryList(queryInfo){
    return myaxios.get('categories',{params: queryInfo})
  },
  addCategory(queryInfo){
    return myaxios.post('categories',queryInfo)
  }
}

export default category;