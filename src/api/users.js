import myaxios from '@/utils/http.js'

const users = {
  setRole(id,rid){
    return myaxios.put(`users/${id}/role`,{rid:rid}) 
  }
}

export default users;