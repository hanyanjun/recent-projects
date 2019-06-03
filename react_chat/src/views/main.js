import React from "react";
import {Link} from "react-router-dom";

export  default class Mainpage extends React.Component{
    render(){
        return(
            <div>
                <Link to="/app"></Link>
                <Link to="/app/page1"></Link>
                <Link to="/app/page2"></Link>
                {this.props.children}
            </div>
        )
    }

}