import React from "react";
import api from "../../fetch/api";
import { Card, WingBlank, WhiteSpace} from 'antd-mobile';
import {getUserList,getBossList} from "../../store/chat.redux.js";
import {connect} from "react-redux";
@connect(
    state=>({
        user : state.user,
        chat : state.chat
    }),
    {getUserList,getBossList}
)
 class Boss extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list : []
        }
    }
    componentDidMount(){
        // this.init()
        
        this.props.getBossList();
    }
    init(){
        if(this.props.user.type == '1'){
            this.props.getUserList();
        }
        if(this.props.user.type == '2'){
            this.props.getBossList();
        }

    }
    render(){return(
        <WingBlank>
            {
                this.props.chat.userList.map(v=>(
                    v.headImg ?  (
                        <div  key={v._id}>
                            <WhiteSpace size="md" />
                            <Card  >
                                 <Card.Header
                                    title={v.user}
                                    thumb={v.headImg}
                                    extra={<span>{v.title}</span>}
    
                                /> 
                                <Card.Body>
                                    <div>公司: {v.company}</div>
                                    <div>薪资: {v.money}</div>
                                    <div>技能: {v.require?   v.require.split('\n').map(v=>
                                            <span key={v}>{v}</span>
                                        ) : '无'}</div>
                                </Card.Body>
                            </Card> <WhiteSpace size="md" />
                        </div>): ''
                ))
            }
        </WingBlank>
    )}
}
export default Boss;