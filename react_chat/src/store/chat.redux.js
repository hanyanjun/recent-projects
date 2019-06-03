import api from "../fetch/api";
import {getRedirectPath} from "../utils/utils";
const USER_LIST = 'USER_LIST';
const ERROR_MSG = 'ERROR_MSG';
const initState ={
    userList : [],
}
function userList(payload){
    return {type : USER_LIST , payload}
}

function errorMsg(payload){
    return {type : ERROR_MSG , payload}
}

export function chat(state = initState,action){
    switch(action.type){
        case USER_LIST:
        return {...state, userList : action.payload};
        case ERROR_MSG :
        return {...state, msg : action.payload,redirectTo : getRedirectPath(action.payload)};
        default :
        return state;
    }
}

export function getUserList(type){
    return dispatch=>{
        api.getMemList().then(res=>{
            dispatch(userList(res.data))
        }).catch(res=>{
            dispatch(errorMsg(res.data));
        })
    }
}
export function getBossList(type){
    return dispatch=>{
        api.getBossList().then(res=>{
            dispatch(userList(res.data))
        }).catch(res=>{
            dispatch(errorMsg(res.data));
        })
    }
}