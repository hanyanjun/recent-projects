import React from 'react';
import {Grid,List} from 'antd-mobile';
// import PropTypes from "prop-types";

export default class headSelect extends React.Component{
    // static PropTypes ={
    //     select : PropTypes.func
    // }
    constructor(props){
        super(props);
        this.state = {
            text : '',
            icon : ''
        }
    }
    onClick(ele){
        this.setState(ele);
        this.props.select(ele);
    }
    render(){
        const imgs = 'boy,girl,man,woman,bull,chick,crab,hedgehog,hippopotamus,koala,lemur,pig,tiger,whale,zebra'
                     .split(',').map(v=>{
                         return {     
                            icon : require(`../../assets/imgs/${v}.png`),
                            text : v
                         }
                     });
        const gridSlect = this.state.text ? <div>
            <span>已选择头像</span>&nbsp;&nbsp;&nbsp;
            <img src={this.state.icon} style={{width: '20px'}} alt=""/>
        </div> : <div>请选择头像</div>;             
        return(
        <List renderHeader={()=>gridSlect}>

            <Grid  data={imgs} onClick={(v)=>this.onClick(v)}  columnNum={5}/>
        </List>
    )}
}