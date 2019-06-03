import {HashRouter ,Route,Switch} from "react-router-dom";
import React from "react";
import Entry from "../entry";
import config from "./index";
import AuthRouter from "../components/AuthRouter/AuthRouter";
// import Main from '../views/main/main';
// 路由拦截的两种方式
// 通过配置
// 通过在最前面加入其他组件的方式
class Router  extends React.Component{
    render(){
        return(
            <HashRouter>
                <Entry>
                <AuthRouter >
                </AuthRouter>
                        <Switch>
                        {
                            config.map((item,index)=>{
                                return <Route key={index} path={item.path} exact render={props=>
                                    // (!item.auth ? <item.component {...props}/>  : (token ? <item.component {...props} /> : <Redirect  to="/login"/>))
                                    (<item.component {...props}/>)
                                }></Route> 
                            })
                        }
                            {/* <Route component={Main}> </Route> */}
                        </Switch>
                </Entry>
            </HashRouter>  
        )
    }
}
export default  Router
