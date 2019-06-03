import React, { Component } from 'react';
// import {Button} from "antd-mobile";
import 'antd-mobile/dist/antd-mobile.css';
import {add,remove,add_async} from "./store/index.redux";
import {logoutfn} from "./store/auth.redux";
import {connect} from "react-redux";
@connect(
  state=>({num:state.counter , auth : state.auth}),   
  {add,remove,add_async,logoutfn}
)
class App extends Component {
  constructor(props){
    super(props);
    this.state={
      arr : [1,2,3,4,5,6]
    }
  }
  render() {
    const app = <h2>
    {
      this.state.arr.map(v=>{
        return <span key={v}>{v*2}</span>
      })
    }
    <br/>
    {
      this.state.arr.map(v=>{
        return <span  key={v}>{v}</span>
      })
    }
    {/* <button  onClick={()=>store.dispatch(add())}>+</button>
    <button  onClick={()=>store.dispatch(remove())}>-</button>
    <button  onClick={()=>store.dispatch(add_async())}>+async</button> */}
    <button  onClick={this.props.add}>+</button>
    <button  onClick={this.props.remove}>-</button>
    <button  onClick={this.props.add_async}>+async</button>
    <button onClick={this.props.logoutfn}>注销</button>
    <p>数字:{this.props.num}</p>
  </h2>;
    return   app 
  }
}
// 
// const mapStateProps = function (state) {
//   return {num : state}
// };
// const action = {add,remove,add_async} ;
// App = connect(mapStateProps,action)(App)
export default App;
