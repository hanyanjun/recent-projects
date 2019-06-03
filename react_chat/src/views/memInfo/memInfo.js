import React from "react";
import {NavBar,InputItem, TextareaItem , Button,WhiteSpace} from 'antd-mobile';
import HeadSelect from "../../components/headSelect/headSelect";
import {connect} from 'react-redux';
import {update,clear_to} from "../../store/user.redux";
import {Redirect} from "react-router-dom";
@connect(
    state=>state.user,
    {update,clear_to}
)


class memInfo extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            title :'',
            desc : '',
            icon : '',
            text : ''
        }
    }
    onChange(type,val){
        this.setState({
            [type]:val
        })
    }
    selectHead(item){
        this.setState(item);
    }
    componentDidMount(){
        this.props.clear_to();
    }
    render(){return(
        <div>
        {this.props.redirectTo ? <Redirect to={this.props.redirectTo} /> : null}
            <NavBar mode="dark">
                牛人信息完善
            </NavBar>
            <HeadSelect  select={(v)=>this.selectHead(v)}></HeadSelect>
            <InputItem onChange={(v)=>this.onChange('title',v)}>求职岗位</InputItem>   
            <TextareaItem rows="3" autoHeight="true" onChange={(v)=>this.onChange('desc',v)} title="个人简介"></TextareaItem >   
            <WhiteSpace />
            <WhiteSpace />
            <WhiteSpace />
            <Button type="primary" onClick={()=>this.props.update(this.state)}>保存</Button>
        </div>
    )}
}
export default memInfo