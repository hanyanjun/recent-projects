import React from "react";
import {NavBar,InputItem, TextareaItem , Button,WhiteSpace} from 'antd-mobile';
import HeadSelect from "../../components/headSelect/headSelect";
import {connect} from 'react-redux';
import {update,clear_to} from "../../store/user.redux";
@connect(
    state=>state.user,
    {update,clear_to}
)


class bossInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
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
        console.log(111);
        this.props.clear_to();
    }
    componentWillReceiveProps(){
        console.log(this.props);
    }
    render(){return(
        <div>
            <NavBar mode="dark">
                boss信息完善
            </NavBar>
            <HeadSelect  select={(v)=>this.selectHead(v)}></HeadSelect>
            <InputItem onChange={(v)=>this.onChange('title',v)}>招聘职位</InputItem>   
            <InputItem onChange={(v)=>this.onChange('company',v)}>公司名称</InputItem>   
            <InputItem onChange={(v)=>this.onChange('money',v)}>职位薪资</InputItem>   
            <TextareaItem rows="3" autoHeight="true" onChange={(v)=>this.onChange('require',v)} title="职位要求"></TextareaItem >   
            <WhiteSpace />
            <WhiteSpace />
            <WhiteSpace />
            <Button type="primary" onClick={()=>this.props.update(this.state)}>保存</Button>
        </div>
    )}
}
export default bossInfo