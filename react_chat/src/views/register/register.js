import React from "react";
import Logo from "../../components/logo/logo";
import {Toast,WingBlank , WhiteSpace, Button , InputItem,Radio,List} from "antd-mobile";
import {register} from "../../store/user.redux";
import {connect} from "react-redux";
const RadioItem = Radio.RadioItem;
@connect(
    state=>state.user,   
    {register}
)
 class Register  extends  React.Component{
    constructor(props){
        super(props);
        this.submit = this.submit.bind(this);
        this.state = {
            type : '1',
            user : '',
            pass : '',
            confirmPass : ''
        }
    }
    // componentDidUpdate(){
    //     if(this.props.msg){
    //         Toast.fail(this.props.msg);
    //     }
    // }
    handleInput(key,value){
        this.setState({
            [key] : value
        })
    }
    submit(){
        this.props.register({...this.state});
    }
    render(){
        return (
            <div>
                <Logo />
                <WingBlank> 
                   <List>
                        <InputItem placeholder="请输入用户名" onChange={v=>this.handleInput('user',v)} >用户</InputItem>
                             <WhiteSpace/>
                        <InputItem type="password" placeholder="请输入密码"  onChange={v=>this.handleInput('pass',v)}>密码</InputItem>
                             <WhiteSpace/>
                        <InputItem   type="password" placeholder="请确认密码"  onChange={v=>this.handleInput('confirmPass',v)}>确认密码</InputItem>
                             <WhiteSpace/>
                        <RadioItem checked={this.state.type == '1' } onChange={v=>this.handleInput('type','1')}>雇主</RadioItem>
                             <WhiteSpace/>
                        <RadioItem checked={this.state.type == '2'} onChange={v=>this.handleInput('type','2')}>被雇佣者</RadioItem>
                    </List>
                             <WhiteSpace/>
                             <WhiteSpace/>
                             <WhiteSpace/>
                    <Button type="primary" onClick={this.submit}>注册</Button>
                </WingBlank> 
            </div>
        )
    }
}
export default  Register;