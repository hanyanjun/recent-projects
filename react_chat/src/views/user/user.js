import React from "react";
import {connect} from "react-redux";
import { Result,List,WhiteSpace,Button,Modal} from 'antd-mobile';
import {logoutSubmit} from "../../store/user.redux.js";
import browserCookie from "browser-cookies";
@connect(
    state=>state.user,
    {logoutSubmit}
)

class User extends React.Component{
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout(){
        const alert = Modal.alert;
        alert('警告', '确认退出登录?', [
            { text: '否', onPress: () => console.log('cancel') },
            { text: '是', onPress: () => {
                browserCookie.erase('userId');
                this.props.logoutSubmit();
            }},
            ])
    }
    render(){
        const info = this.props.user;
        return(
            this.props.user ?  <div>
                <Result 
                    img={<img  style={{width:"100%"}}  src={info.headImg} />}
                    title={info.user}
                    message={info.type == 1 ? info.company : null}
                /> 
                <List>
                    <List.Item multipleLine={true}>
                        {info.title}
                        {info.desc ? info.desc.split('\n').map(v=>
                                <div key={v}>
                                    <List.Item.Brief>
                                    {v}
                                </List.Item.Brief>
                                </div>
                            ) : null}
                            {info.require ? info.require.split('\n').map(v=>
                                    <div key={v}>
                                        <List.Item.Brief>
                                        {v}
                                    </List.Item.Brief>
                                    </div>
                            ) : null}
                            {info.money ? 
                                    <List.Item.Brief>
                                       薪资 {info.money}
                                    </List.Item.Brief>
                             : null}
                    </List.Item>           
                </List>
                <WhiteSpace />
                <WhiteSpace />
                <List.Item onClick={this.logout}>
                        退出登录
                </List.Item> 


            </div> : null
    )}
}
export default User