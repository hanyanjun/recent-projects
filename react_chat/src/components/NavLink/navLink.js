import React from "react";
import {TabBar} from "antd-mobile";
import {withRouter} from "react-router-dom";
@withRouter
class NavLink extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const list = this.props.data.filter(v=> !v.hide);
        const {pathname} = this.props.location;
        return(
        <TabBar>
            {
                list.map(v=>(
                    <TabBar.Item 
                        key={v.path}
                        title={v.text}
                        icon={{
                            uri : require(`./imgs/${v.icon}.png`)
                        }}
                        selectedIcon={{
                            uri : require(`./imgs/${v.icon}-active.png`)
                        }}
                        selected={pathname == v.path}
                        onPress={()=>{
                            this.props.history.push(v.path);
                        }}
                    >

                    </TabBar.Item>
                ))
            }
        </TabBar>
    )}
}
export default  NavLink