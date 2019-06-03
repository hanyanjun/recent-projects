import {combineReducers} from "redux";
import {counter} from "./index.redux";
import {auth} from "./auth.redux";
import {user} from "./user.redux";
import {chat} from "./chat.redux";
// 安装redux-devtools-extension的可视化工具。
const todo = combineReducers({
    counter,
    auth,
    user,
    chat
})
export default todo;