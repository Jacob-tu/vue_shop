import myaxios from '@/utils/http.js'

const menu = {
  getMenuList() {
    return myaxios.get('menus')
  },
}

export default menu;