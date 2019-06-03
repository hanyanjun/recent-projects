import api from '../../fetch/api'
import *  as types  from '../types'
const contacts = {
  state : {
    payGroup : {
      patients : []
    },
    phoneGroup : {
      patients : []
    },
    unPayGroup : {
      patients : []
    },
    unGroup : {
      patients : []
    },
    otherGroup : [{
      patients : []
    }],
    noService :{
      patients : []
    },
    buyService : [
      {
        count : 0
      }
    ],
    search : [],
    allGroup : [],
    allCopyGroup : {}
  },
  mutations : {
    [types.UPDATE_CONTACTS](state,payload){
      state.buyService = [{count : 0}],
      state.payGroup = {patients : []},
      state.phoneGroup = {patients : []},
      state.unPayGroup = {patients : []},
      state.unGroup = {patients : []},
      state.noService = {patients : []},
      state.otherGroup = [{patients : []}],
      state.search = [],
      state.allGroup = [];
      let  allCopyGroup = {}
      payload.forEach((v,i)=>{
        if(v.group_name == 'device_patients' && !v.group_id) {
          Object.assign(state.payGroup, v);
          v.toggle = true;
          allCopyGroup.device_patients = Object.assign({},v);
          payload[i] = '';
        }else if(v.group_name == 'no_group' && !v.group_id){
          state.search = [];
          v.toggle = true;
          allCopyGroup.no_group = Object.assign({},v);
          state.search = state.search.concat(v.patients);
          Object.assign(state.unGroup,v);
          payload[i] = '';
        }else if((v.group_name == "inquiry_service" || v.group_name == "family_service" || v.group_name == 'phone_service')  && !v.group_id){
          v.toggle = true;
          state.buyService[0].count +=v.patients.length;
          allCopyGroup[v.group_name] = Object.assign({},v);
          Object.assign(state.buyService,state.buyService.push(v));
          payload[i] = '';
        }else if(v.group_name == 'no_service' && !v.group_id){
          v.toggle = true;
          Object.assign(state.noService,v);
          allCopyGroup.no_service = Object.assign({},v);
          payload[i] = '';
        }else{
          v.toggle = true;
          state.search = state.search.concat(v.patients);
          allCopyGroup[v.group_id] = Object.assign({},v);
          payload[i].toggle = true;
        }
      })
      state.otherGroup  =  payload.removeByValue('');
      state.allCopyGroup = Object.assign({},allCopyGroup);
      for(let key in state.allCopyGroup){
        state.allCopyGroup[key].num = 0;
      }
      state.allGroup = [... state.otherGroup,Object.assign( {toggle : true},state.unGroup),Object.assign( {toggle : true},state.payGroup),Object.assign( {toggle : true},state.buyService[1]),Object.assign( {toggle : true},state.buyService[2]),Object.assign( {toggle : true},state.buyService[3]),Object.assign( {toggle : true},state.noService)];
    }
  },
  actions : {
    updateContacts({commit,state}){
      commit('IS_UPDATE_CONTACTS',false);
       api.gainAllPat().then((obj)=>{
         commit('UPDATE_CONTACTS',obj.all);
       })
    }
  }
}
export default contacts;

