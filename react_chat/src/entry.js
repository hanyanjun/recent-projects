import React from "react";

class Entry extends React.Component{
    render(){
        return(
            <div style={{border: '1px solid transparent'}}>
                {this.props.children}
            </div>
        )
    }
}

export default Entry