import api from '../../fetch/api'
import *  as types  from '../types'
const editGroup = {
  state : {
    group : '',
    in_group : [],
    all_pat : []
  },
  mutations : {
    [types.SET_GROUP](state,payload){
        state.group = payload;
    },
    [types.UPDATA_IN_GROUP](state,payload){
        if(payload.type == 'push'){
           state.in_group.push(payload.info);
        }
        else if(payload.type == 'shift'){
           state.in_group.forEach((v,i)=>{
             if(v.account == payload.info.account){
               state.in_group[i] = '';
               state.in_group = state.in_group.removeByValue('');
             }
           })
        }
        else{
          state.in_group = payload.info;
        }
    },
    [types.UPDATE_ALL_PAT](state,payload){
        state.all_pat = payload;
    },
    [types.UPDATE_SELECT_PAT](state,payload){
      let index = '';
       state.all_pat.forEach((v,i)=>{
          if(v.account == payload.account){
            state.all_pat[i] = '';
            state.all_pat = state.all_pat.removeByValue('');
            index = i;
          }
       })
      state.all_pat.splice(index,0,payload);
    },
    [types.UPDATE_GROUP_NAME](state,payload){
       state.group.group_name = payload;
    },
    [types.CLEAR_GROUP](state,payload){
        state.group = '',
        state.in_group = [],
        state.all_pat = []
    }
  },
  actions : {
    editGroupInitial({commit},payload){
         api.editGroup(payload).then(obj=>{
            commit('SET_GROUP',obj.data);
            commit('UPDATA_IN_GROUP',{type : 'change' , info : obj.data.in_group});
            if(payload){
              obj.data.not_in_group.forEach((v,i)=>{
                obj.data.in_group.forEach((vv,ii)=>{
                  if(vv.account == v.account){
                    v.selected = true;
                  }
                })
              })
            }
           commit('UPDATE_ALL_PAT',obj.data.not_in_group);
         })
    }




  }

}



export default editGroup;

