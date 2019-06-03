import api from "../../api/core.js"
import util from '../../components/treeTable/utils/index.js'
const menuList = {
    state : {
        menuData : [],
        isUpdateMenuData : true
    },
    mutations : {

    },
    actions : {
        gainMenuList({state},payload){
        // if(!state.isUpdateMenuData) return "";
          api.menuDataList(payload).then((res) => {
              if(res.data.data == null){
                res.data.data = []
              }
            // 将树结构转化为1级结构
              let data = util.MSDataTransfer.treeToArray(res.data.data, null, null, false);
              data.forEach((v,i)=>{
                  data[i]._expanded = true;
              })
              state.menuData = [...data];
              state.isUpdateMenuData = false;
          })
        }
    }
}
export default menuList;