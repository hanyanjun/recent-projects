// 新建store
import {createStore} from 'redux';



function counter(state=0,action){
   switch (action.type){
       case "-1":
       return state += -1;
       break;
       case "1":
       return state += 1;
       break;
       default:
       return 10
   }
}


const store = createStore(counter);
function listener(){
    console.log('当前的值为'+store.getState());
}
store.subscribe(listener);
// 派发事件 传递action
store.dispatch({type : '-1'});
store.dispatch({type : '-1'});
store.dispatch({type : '-1'});
store.dispatch({type : '-1'});