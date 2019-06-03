// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
// import {createStore} from "redux";
// import {counter,add,remove} from "./index.redux";
// const store = createStore(counter);

// function render(){
//     ReactDOM.render(<App  store={store} add={add} remove={remove} />, document.getElementById('root'));
// }
// render();
// store.subscribe(render);
// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();



import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
import * as serviceWorker from './serviceWorker';
import thunk from 'redux-thunk';
import {createStore,applyMiddleware} from "redux";
import todo from "./store/index";
import Router from "./Router/router";
// 安装redux-devtools-extension的可视化工具。
const store = createStore(todo,
    // composeWithDevTools(
    //     applyMiddleware(thunk)
    // )
    // 用来做异步dispatch 
    applyMiddleware(thunk)
)
// const store = createStore(counter,
//     compose(
//         applyMiddleware(thunk),
//         window.devtoolsExtension ? window.devtoolsExtension() : f=>f
//      )
// )
function render(){
    // console.log(store.getState())
    ReactDOM.render(
        <Provider store={store}>
            {/* <App  store={store} add={add} add_async={add_async}  remove={remove} /> */}
            <Router/>
        </Provider>    
    , document.getElementById('root'));
}
render();
store.subscribe(render);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();