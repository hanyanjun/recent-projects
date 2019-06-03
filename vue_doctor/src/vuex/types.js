/**
 * Created by Hardy on 2017/7/6.
 */
/*------------------------------全局状态------------------------------------*/
//导航状态切换
export const UPDATE_NAV = 'UPDATE_NAV';
//是否需要loading
export const UPDATE_LOADING = 'UPDATE_LOADING';
//医生登录信息
export const UPDATE_DOCLOGININFO = 'UPDATE_DOCLOGININFO';
// 医生的详细信息
export const UPDATE_DOCSELFINFO = 'UPDATE_DOCSELFINFO';
// 用户的详细信息
export const UPDATE_PATSELFINFO = 'UPDATE_PATSELFINFO';
//是否更新医生信息
export const IS_UPDATE_DOCINFO = 'IS_UPDATE_DOCINFO';
//是否更新用户信息
export const IS_UPDATE_PATINFO = 'IS_UPDATE_PATINFO';
//是否更新通讯录
export const IS_UPDATE_CONTACTS = 'IS_UPDATE_CONTACTS';
//更新医生的聊天开关
export const UPDATE_CHAT_SET = 'UPDATE_CHAT_SET';
//更新医生自动同意开关
export const UPDATE_REVIEW_SET = 'UPDATE_REVIEW_SET';
//更新scroll
export const UPDATE_SCROLL = 'UPDATE_SCROLL';
//所需要预览的图片的数组
export const SET_IMG_ARR   = 'SET_IMG_ARR';
//是否显示旋转动画
export const SET_ROTATE_ANI = 'SET_ROTATE_ANI';
//footerTab切换状态
export const SET_FOOTER_TAB = 'SET_FOOTER_TAB';
//是否更新待办事项咨询条数
export const UPDATE_UNREPLAY = 'UPDATE_UNREPLAY';
//更新mask
export const UPDATE_MASK = 'UPDATE_MASK';
//聊天中图片预览插件
// export const SET_PREVIEW_IMG = 'SET_PREVIEW_IMG';
//绑卡
export const BANK_CARDS = 'BANK_CARDS';



/*------------------------------聊天模块------------------------------------*/
//更新消息列表数据
export const UPDATE_MESSAGE_LIST = 'UPDATE_MESSAGE_LIST';
//更新聊天数据(初始化和发送数据)
export const UPDATE_CHAT_DATA = 'UPDATE_CHAT_DATA';
//更新聊天数据(聊天历史记录)
export const UPDATE_CHAT_RECORD = 'UPDATE_CHAT_RECORD';
//聊天中对方的信息
export const UPDATE_CHAT_PATINFO = 'UPDATE_CHAT_PATINFO';
//当前的连接
export const SET_CHAT_CONN = 'SET_CHAT_CONN';
//清除掉所有的信息
export const CLEAR_CHAT_STATE = 'CLEAR_CHAT_STATE';
//用户当前的服务状态
export const UPDATE_CHAT_SERVICE = 'UPDATE_CHAT_SERVICE';
//用户是否建立连接
export const IS_LOGIN_CHAT  = 'IS_LOGIN_CHAT';

/*------------------------------通讯录模块------------------------------------*/
export const SET_GROUP = 'SET_GROUP';
export const UPDATA_IN_GROUP = 'UPDATA_IN_GROUP';
export const UPDATE_ALL_PAT = 'UPDATE_ALL_PAT';
export const UPDATE_SELECT_PAT = 'UPDATE_SELECT_PAT';
export const UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME';
export const CLEAR_GROUP = 'CLEAR_GROUP';
//通讯录的存储
export const UPDATE_CONTACTS = 'UPDATE_CONTACTS';

/*------------------------------组件状态更新------------------------------------*/
export const SET_PROMPT = 'SET_PROMPT';
export const INIT_PROMPT = 'INIT_PROMPT';
export const SET_INPUT = 'SET_INPUT';
export const INIT_INPUT = 'INIT_INPUT';
export const SET_ACTION_SHEET = 'SET_ACTION_SHEET';
export const INIT_ACTION_SHEET = 'INIT_ACTION_SHEET';
export const SET_SHEET_SELECT = 'SET_SHEET_SELECT';

