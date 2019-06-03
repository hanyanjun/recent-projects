import React from 'react';
import {connect} from "react-redux";
import {loadData} from "../../store/user.redux";
import {withRouter,Redirect} from "react-router-dom";
@connect(
    state=>state.user,
    {loadData}
)
@withRouter
 class AuthRouter extends React.Component{
    // 是否登录
    // 现在的url的地址是否需要跳转
    // 用的身份类别
    // 用户是否完善信息
    componentDidMount(){
        // console.log('didMount')
        const publicList = ['/login','/register']; //如果是这些页面那就不进行接口请求 信息初始化
        const url = this.props.location.pathname;
        let is_in_list = publicList.indexOf(url) >= 0;
        // 如果是在登陆注册页面 那就将redirect 清除掉
        if(is_in_list){
            return false;
        }
        this.props.loadData();
        // api.userInfo().then(res=>{
        //     //  获取到用户信息
        //     this.props.loadData(res.data);
        //     // 如果是本地有cookie 并且有效 跟路由进入那么  进行重定向
        //     if(this.props.location.pathname == '/'){
        //         this.props.history.push(this.props.redirectTo);
        //     }
        // }).catch(res=>{
        //     // 以下情况需要重定向
        //     switch (res.code){
        //         case "1":
        //             console.log('未登录');
        //         break;
        //         case "2":
        //             console.log('未完善');
        //         break;
        //         case "3":
        //             console.log('用户名重复');
        //         break;
        //     }
        // })
    }
    // componentDidUpdate(){
    //     console.log('didUpdate')
    // }
    // componentWillMount(){
    //     console.log('willMount')
    // }
    // componentWillUnmount(){
    //     console.log('willUnmount')
    // }
    // componentWillUpdate(){
    //     console.log('willUpdate')
    // }
    // componentWillReceiveProps(){
    //     console.log('WillReceiveProps')
    // }
    // shouldComponentUpdate(){
    //     console.log('shouldUpdate');
    //     console.log(this.props.redirectTo)
    //     return true;
    // }
    render(){return(
        this.props.redirectTo ? <Redirect to={this.props.redirectTo}/> : null  
    )}
}
export default AuthRouter