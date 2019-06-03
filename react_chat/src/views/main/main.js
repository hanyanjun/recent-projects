import React from "react";
import {NavBar} from "antd-mobile";
import boss from "../bossList/bossList";
import mem from "../memberList/memberList";
import msg from "../message/message";
import self from "../user/user";
import {connect} from 'react-redux';
import NavLink from "../../components/NavLink/navLink";
import {Route,Switch} from "react-router-dom";
@connect(
    state=>state.user,
    null
)
// 1 是boss  2是牛人

class Main extends React.Component{
    render(){
        const user = this.props.user;
        const list = [
            {
                path : '/boss',
                text : '雇主',
                icon : 'boss',
                title : '雇主列表',
                components : boss,
                hide : user.type == '1'
            },
            {
                path : '/mem',
                text : '牛人',
                icon : 'job',
                title : '用户列表',
                components : mem,
                hide : user.type == '2'
            },
            {
                path : '/msg',
                text : '消息',
                icon : 'msg',
                title : '消息列表',
                components : msg
            },
            {
                path : '/self',
                text : '我',
                icon : 'user',
                title : '个人中心',
                components : self
            }
        ];
        return(
        <div>
            <NavBar mode="drak">{list.find(v=> v.path == this.props.location.pathname) ? list.find(v=> v.path == this.props.location.pathname).title : ''}</NavBar>
            <div className="content" style={{height: "calc(100vh - 95px)" , overflow : 'scroll'}}>
                <Switch>
                    {
                        list.map((v)=>(
                            <Route path={v.path} component={v.components} exact key={v.path} ></Route>
                        ))
                    }
                </Switch>
            </div>
            <NavLink data={list}> </NavLink>
        </div>
    )}
}
export default Main