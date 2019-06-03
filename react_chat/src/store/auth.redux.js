import api from "../fetch/api";
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const USER_DATA = "USER_DATA";
export  function auth(state= {is_login : false, user : 'hyj'},action){
    switch(action.type){
        case LOGIN:
        return {...state , is_login : true};
        case LOGOUT:
        return {...state, is_login : false};
        case USER_DATA:
        return {...state, ...action.payload, is_login : false};
        default:
        return {...state}
    }
}

export function loginfn(){
    return {type : LOGIN};
}
export function logoutfn(){
    return {type : LOGOUT}
}
export function userData(payload){
    return {type : USER_DATA ,payload}
}
export function getUserData(){
    return dispatch=>{
        api.getUserInfo().then(obj=>{
            dispatch(userData(obj));
        })
    }
}