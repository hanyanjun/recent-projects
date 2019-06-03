/**
 * Created by Hardy on 2017/7/8.
 */
//全局getters
export default {
  docAcc : state =>{
    return state.docInfo.account;
  },
  docHead : (state,getters) =>{
    if(state.docInfo.face){
      return `${state.docInfo.face}?${Date.parse(new Date())}`;
    }else{
      return '';
    }
    // return `${DOCLINKAPI}/doctor/face/${getters.docAcc}`;
  },
  docStaticHead : (state,getters) =>{
    if(state.docInfo.face){
      return `${state.docInfo.face}`;
    }else{
      return '';
    }
  }
}
