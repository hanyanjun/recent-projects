import React from "react";
import img  from "../../assets/imgs/timg.jpg";
import "./index.css";
export default  class Logo  extends  React.Component{
    render(){
        return (
            <img className="logo"  src={img} alt=""/>
        )
    }
}