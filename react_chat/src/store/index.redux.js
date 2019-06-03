const ADD_INFO = '加';
const REMOVE_INFO = '减去';


export function counter(state=0,action){
   switch (action.type){
       case REMOVE_INFO:
       return state -1;
       case ADD_INFO:
       return state + 1;
       default:
       return  10
   }
}

export function add(){
    return {type : ADD_INFO}
}
export function remove(){
    return {type : REMOVE_INFO}
}
export function add_async(){
    return dispatch=>{
        setTimeout(()=>{
            dispatch(add())
        },2000)
    }
}