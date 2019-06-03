import React from "react";
import Logo from "../../components/logo/logo";
import {List, InputItem , WingBlank , WhiteSpace, Button} from "antd-mobile";
import {clear_to,login} from "../../store/user.redux";
import {connect} from "react-redux";

@connect(
    state=>state.user,
    {clear_to,login}
)


  class Login  extends  React.Component{
    constructor(props){
        super(props);
        this.state = {
            user : '',
            pass : ''
        }
        this.register = this.register.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    register(){
        // 点击注册先清除掉重定向的参数值
        // this.props.clear_to();
        this.props.history.push('/register')
    }
    handleInput(key,value){
        this.setState({
            [key] : value
        })
    }
    handleLogin(){
        this.props.login(this.state);
    }
    render(){
        return(  
            <div>
                <Logo />
                <WingBlank>
                    <List>
                        <InputItem placeholder="请输入用户名" onChange={v=>this.handleInput('user',v)}>用户</InputItem>
                             <WhiteSpace/>
                        <InputItem placeholder="请输入密码" onChange={v=>this.handleInput('pass',v)}>密码</InputItem>
                    </List>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Button  type="primary" onClick={this.handleLogin}>登录</Button>
                    <WhiteSpace/>
                    <WhiteSpace/>
                    <Button  type="primary" onClick={this.register}>注册</Button>
                </WingBlank>   
            </div>
        )
    }
}

export default Login