import api from '../../fetch/api'
import *  as types  from '../types'
const myTeam = {
   state : {
      joinTeam : [''],
      myTeam : ['']
   },
  mutations : {

  },
  actions : {
     teamList({state}){
         api.gainMyTeam().then(obj=>{
           state.joinTeam = Object.assign([],obj.data.joinTeam);
           state.myTeam = Object.assign([],obj.data.myTeam);
         })
     }
  }

}
export default myTeam;
