import myaxios from '@/utils/http.js'

const roles = {
  editRole(id,data) {
    return myaxios.put("roles/"+id,data)
  },
  getRolesList() {
    return myaxios.get('roles')
  },
  deleteRole(id) {
    return myaxios.delete("roles/"+id)
  },
  deleteRight(roleId,rightId) {
    return myaxios.delete(`roles/${roleId}/rights/${rightId}`)
  },
  getRightsList() {
    return myaxios.get('rights/tree')
  },
  allotRight(roleId,rids){
    return myaxios.post(`roles/${roleId}/rights`,{rids:rids})
  }
}

export default roles;