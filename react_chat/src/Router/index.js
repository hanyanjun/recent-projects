
// import Page1 from "../views/page1";
// import Page2 from "../views/page2";
// import Login from "../views/login";
// import App from "../App";
// export default [
//     {
//         path : '/login', name : 'login' , component :Login,
//     },
//     {
//         path : '/page2', name : 'page2' , component :Page2 , auth : true
//     },
//     {
//         path : '/page1', name : 'page1' , component :Page1, auth : true
//     },
//     {
//         path : '/app', name : 'App' , component :App, auth : true
//     },
//     {
//         path : '/', name : 'App' , component :App, auth : true
//     },
// ]



import Login from "../views/login/login";
import register from "../views/register/register";
import editInfo from "../views/editInfo/editInfo";
import bossInfo from "../views/bossInfo/bossInfo";
import memInfo from "../views/memInfo/memInfo";
import home from "../views/main/main";
export default [
    {
        path : '/login', name : 'login' , component :Login
    },
    {
        path : '/register', name : 'register' , component :register 
    },
    {
        path : '/bossInfo', name : 'bossInfo' , component :bossInfo 
    },
    {
        path : '/editInfo', name : 'editInfo' , component :editInfo 
    },
    {
        path : '/memInfo', name : 'memInfo' , component :memInfo 
    },
    {
        path : '', name : 'home' , component :home 
    },
]