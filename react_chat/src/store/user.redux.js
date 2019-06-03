import api from "../fetch/api";
import {getRedirectPath} from "../utils/utils";
const initState ={
    user : '',
    password : '',
    type : '',
    msg : '',
    redirectTo : ''
}
const ERROR_MSG = 'ERROR_MSG'
const CLEAR_REDIRECT = 'CLEAR_REDIRECT'
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const LOGOUT = 'LOGOUT';
export function user(state = initState,action){
     switch(action.type){
         case ERROR_MSG :
         return {...state, msg : action.payload,redirectTo : getRedirectPath(action.payload)};
         case AUTH_SUCCESS:
         return {...state,...{user :action.payload},redirectTo : getRedirectPath(action.payload)};
         case CLEAR_REDIRECT:
         return {...state, redirectTo : ''}
         case LOGOUT :
         return {...initState,redirectTo : '/login'};
         default : 
         return state;
     }
}

function errorMsg(payload){
    return {type : ERROR_MSG , payload}
}
function logout(payload){
    return {type : LOGOUT , payload}
}
function clearRedirect(payload){
    return {type : CLEAR_REDIRECT ,payload}
}
function authSuccess(obj){
    const {pass,...payload} = obj;
    return {type : AUTH_SUCCESS ,payload}
}

export function register({user,pass,confirmPass,type}){
    if(!user || !pass || !type){
        return errorMsg('用户名密码必须输入');
    }
    if(pass != confirmPass){
        return errorMsg('两次密码输入不一致');
    }
    return dispatch=>{
        api.register({user,pass,type}).then(res=>{
            console.log(res);
            dispatch(authSuccess({user,pass,type}))
        }).catch(res=>{

        })
    }
}
export function login({user,pass}){
    if(!user || !pass){
        return errorMsg('用户名密码必须输入');
    }
    return dispatch=>{
        api.login({user,pass}).then(res=>{
            console.log(res);
            dispatch(authSuccess(res.data))
        }).catch(res=>{
            
        })
    }
}
export function clear_to(){
    return clearRedirect();
}

export function loadData(payload){
    return dispatch=>{
        api.userInfo().then(res=>{
            dispatch(authSuccess(res.data))
        }).catch(res=>{
            dispatch(errorMsg(res.data));
        })

    }
}
export function update(payload){
    return dispatch => {
        let data =  {headImg : payload.icon , ...payload};
        api.userInfoUpdate(data).then(res=>{
            dispatch(authSuccess(res.data))
        }).catch(res=>{
            dispatch(errorMsg(res.data));
        })
    }
}

export function logoutSubmit(){
    return logout();
}