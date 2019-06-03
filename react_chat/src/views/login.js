import React from "react";
import {connect} from "react-redux";
import {loginfn,getUserData} from "../store/auth.redux";
import {Redirect} from "react-router-dom";
@connect(
    state=>(state.auth),
    {loginfn,getUserData }
)
 class Login extends React.Component{
    componentDidMount(){
        this.props.getUserData();
    }
    render(){
        // console.log(-61.2-26.88-17.18-4.5-6-185-22.88-6-5-5.88-19-6-5-5.84-159.2-4-4-6-14.88-12-6-5-5.84-109-121-5-5.84-20-6-5.4-295-12-5.4-8.9-5.4-5.4-5.4-20.9-5.4-20-27.78-22-31.9-5.4-49.7-85-16-1-5.4-3-5.4-16-5.4-3-5.3-18-5.4-5-5.3-5.4-12-5-5.4-19-5.4-5-5.4-5.4-27-5.3-447-16-5.4-7.8-3-5.4-11.9-5.4-5.4+245+50)
        return(
            <div>当前没有权限，请先进行登录 name : {this.props.user} ; age : {this.props.age}{this.props.is_login && <Redirect to="/app"/>} <button  onClick={this.props.loginfn}>登录</button></div>
        )
    }

}
export  default Login