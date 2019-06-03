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
 class Mem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list : []
        }
    }
    componentDidMount(){
        // this.init()
        
        this.props.getUserList();
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
                    <div  key={v._id}>
                        <WhiteSpace size="md" />
                        <Card  >
                            {
                                v.headImg ? <Card.Header
                                title={v.user}
                                thumb={v.headImg}
                                extra={<span>{v.title}</span>}

                            /> : ''
                            }
                            <Card.Body>
                                { v.desc ? v.desc.split('\n').map(v=>(
                                    <div key={v}>{v}</div>
                                )) : ''}
                            </Card.Body>
                        </Card>
                    </div>
                ))
            }
        </WingBlank>
    )}
}
export default Mem;