import api from "../../api/core.js"
import util from '../../components/treeTable/utils/index'
import { rejects } from "assert";
// 各种下拉框数据
// sex 性别
// education 学历
// constellation 星座
// bloodtype 血型
// marriage 婚姻
// children 是否有孩子
// hireform 聘用形式
// hirechannel 招聘渠道
// quittype 离职类型
// contractter 合同期限
// entrymaterials 入职材料
// contractmaterials 合同材料
// areacode  区号
// depttype 部门类别
// zodiac 属相
// contractterm 合同期限
const selectData = {
   state : {
      contractTreeData : {list :[], obj : {} , objAll : {}},
      orderStaticData : {list : [], obj: {'1' : '一', '2' : '二', '3' : '三'  , '4' : '四' , '5' : '五' , '6' : '六' , '7' : '七', '8' : '八' , '9' : '九' , '10' : '十'}},
      trueFlase : {list : [{code : 'Y',name :'是'} , {code : 'N' , name : '否'} ] , obj : {Y : '是' , N : '否'}},
      contractmaterials : {
        list : [{code : 'license' , name :'身份证'} , {code : 'bank_card' , name :'银行卡'} , {code :'coo_agre' , name :'学历证明'},{code : 'carte' , name : '离职证明'}],
        obj : { license : '身份证' , bank_card : '银行卡' , coo_agre : '学历证明', carte : '离职证明'}
        },
      sysTypes : {
        list : [{code : 'OA' , name : 'OA'},{code : 'CRS' , name : 'CRS'},{code : 'oldCRM' , name : '老CRM'},{code : 'littleServer' , name : '微服务'}],
        obj :{OA : 'OA' , CRS : 'CRS' ,  oldCRM : '老CRM', littleServer : '微服务'}
      }, 
      days :{
        list : [{code : '2' , name :'星期一'},{code : '3' , name :'星期二'},{code : '4' , name :'星期三'},{code : '5' , name :'星期四'},{code : '6' , name :'星期五'},{code : '7' , name :'星期六'},{code : '1' , name :'星期日'}],
        obj : {1 : '星期日' , 2 : '星期一' ,  3 : '星期二', 4 : '星期三', 5 : '星期四', 6 : '星期五' ,7 : '星期六'} 
      } , 
      processClassType  : {list :[], obj : {} },
      examTestType : {list : [{code : '0' , name : '随机组卷'}]  , obj : { '0' : '随机组卷'}  }, 
      truefalseques : {list : [] , obj : {}}, //判断题
      orgPersonTree : {list : [] , obj : {} , origin : []},
      attendPersonTree : {list : [] , obj : {} , origin : []}, //打卡记录的部门树
      topicType : {list : [] , obj : {}}, 
      quesDiffLevel : {list : [] , obj : {}},  //试卷规则
      sex : {list : [] , obj : {}}, 
      examStatus : {list : [] , obj : {}}, 
      education : {list : [] , obj : {}},
      constellation : {list : [] , obj : {}},
      city : {list : [] , obj : {}},
      bloodtype : {list : [] , obj : {}},
      marriage : {list : [] , obj : {}},
      children : {list : [] , obj : {}},
      hireform : {list : [] , obj : {}},
      hirechannel : {list : [] , obj : {}},
      quittype : {list : [] , obj : {}},
      contractter :{list : [] , obj : {}},
      entrymaterials : {list : [] , obj : {}},
      areacode : {list : [{code : '0086', name : '+86'},{code : '00852', name : '+852'}] , obj : {'0086' : '+86' , '00852' : '+852'}},
      depttype : {list : [] , obj : {}},
      partTypes : {list : [] , obj : {}},
      settlement_type : {list : [],obj : {}},
      contractterm : {list : [] , obj : {}},
      idsAndNames : [{roleId : '',roleName : ''}],
      tax_type : {list : [] , obj :{}},
      orgTreeBaseInfo : {list : [], obj : {},arr : []}, //根据部门选择人的数据
      orgTreeExtInfo : [], //组织架构树形
      orgTreeExtInfoObj : {}, //组织架构索引
      menuList: [],
      menuListObj: {},
      body_position : {list : [], obj : {}}, //主体地位
      allCompanyList : {list: [],obj : {}},
      busi_material: {list :[],obj : {}},
      zodiac : {list : [{
        value: '1',
        label: '鼠'
      },{
        value: '2',
        label: '牛'
      },{
        value: '3',
        label: '虎'
      },{
        value: '4',
        label: '兔'
      },{
        value: '5',
        label: '龙'
      },{
        value: '6',
        label: '蛇'
      },{
        value: '7',
        label: '马'
      },{
        value: '8',
        label: '羊'
      },{
        value: '9',
        label: '猴'
      },{
        value: '10',
        label: '鸡'
      },{
        value: '11',
        label: '狗'
      },{
        value: '12',
        label: '猪'
      }] , obj : {}},
      optionsCitys : [],
      traffiType : {list : [] , obj : {}}, //出行方式
   },
  mutations : {

  },
  actions : {
    getCity({state,dispatch},payload){
      return new Promise(resolve=>{
          if(state.optionsCitys.length != 0){
              resolve(state.optionsCitys);
              return;
          }else{
              api.provinceCity().then(obj=>{
                  state.optionsCitys = obj.data.data;
                  resolve(obj.data.data);
              })
          }
      })
    },
    // 获取角色下拉
    getIdsAndNames({state,dispatch},payload){
      return new Promise(resolve=>{
          if(state.idsAndNames[0].roleName){
            resolve(state.idsAndNames);
            return;
          }else{
              if(payload==undefined){
                payload={permission:''}
              }
              api.idsAndNames({permission:payload.permission}).then(obj=>{
                state.idsAndNames = obj.data.data;
                resolve(obj.data.data);
              })
              
          }
      })
    },
    // 获取归档分类数据
    getContractTreeData({state},payload){
       return new Promise(resolve=>{
         console.log(payload);
          api.getConClassTree(payload).then(obj=>{
            let list = [];
            list =  util.MSDataTransfer.treeToArray(obj.data.data, null, null, true);
            state.contractTreeData.list = Object.assign([],list);
            list.forEach((v)=>{
              state.contractTreeData.obj[v.id] = v.className;
              state.contractTreeData.objAll[v.id] = v;
            })
            resolve();
          })
       })
    },
    // 获取部门 人物 信息
  getOrgTreeInfo({state}){
    return new Promise(resolve=>{
       if(state.orgTreeBaseInfo.list[0]){
         resolve();
         return;
       }else{
          api.orgTreeBaseInfo().then((res) => {
             let data = res.data.data;
              let list = [];
              list =  util.MSDataTransfer.treeToArray(Object.assign([],data), null, null, true);
              let obj = {};
              detail(data);
              function detail(info){
                info.forEach((v)=>{
                  obj[v.id] = v.text;
                   if(v.children && v.children.length != 0){
                      detail(v.children);
                   }
                 })
              }
              state.orgTreeBaseInfo = Object.assign({},{
                list : res.data.data,
                obj : obj,
                arr : list
              });
              resolve(Object.assign({},state.orgTreeBaseInfo)) 
          })
       }
    })
  },
  // 获取组织架构  姓名 的树形结构
  getOrgPersonTree({state},payload){
    return new Promise(resolve=>{
      if(state.orgPersonTree.list[0]){
        resolve();
        return;
      }else{
        api.getOrgPersonTree().then((obj)=>{
          let data = obj.data.data;
          state.orgPersonTree.origin = Object.assign([],data);
          let list = [];
          let obj1 = {};
          detail(data);
          function detail(info){
            info.forEach((v,i)=>{
              if(v.id){  
                info[i].treeId = 'dep_' + v.id;
                obj1['dep_'+ v.id] = info[i].text;
              }
              if((v.children && v.children.lenght != 0) || (v.idNameList &&v.idNameList.length != 0)){
                if(v.children){
                  info[i].children.forEach((vv,ii)=>{
                    info[i].children[ii].treeId = 'dep_'+ vv.id;
                    obj1['dep_'+ v.id] = vv.text;
                  })
                }
                if(v.idNameList){
                   info[i].idNameList.forEach((vv,ii)=>{
                     let obj = {
                       treeId : 'user_'+ vv.userId,
                       text : vv.userName
                     }
                     obj1['user_'+ vv.userId] = vv.userName;
                     info[i].children.push(Object.assign({},obj));
                   })
                }
                if(v.children  && v.children.lenght != 0){
                  detail(v.children)
                }
              }
            })
          }
          state.orgPersonTree.list = Object.assign([],data);
          state.orgPersonTree.obj = Object.assign({},obj1);
          resolve();
        })
      }
    })
  },
  getAttendPersonTree({state,payload}){
    return new Promise((resolve,reject)=>{
      if(state.attendPersonTree.list[0]){
        resolve();
        return;
      }else{
        api.attendPersonTree().then((obj)=>{
          let data = obj.data.data;
          if(data){
            state.attendPersonTree.origin = Object.assign([],data);
            let list = [];
            let obj1 = {};
            detail(data);
            function detail(info){
              info.forEach((v,i)=>{
                if(v.id){  
                  info[i].treeId = 'dep_' + v.id;
                  obj1['dep_'+ v.id] = info[i].text;
                }
                if((v.children && v.children.lenght != 0) || (v.idNameList &&v.idNameList.length != 0)){
                  if(v.children){
                    info[i].children.forEach((vv,ii)=>{
                      info[i].children[ii].treeId = 'dep_'+ vv.id;
                      obj1['dep_'+ v.id] = vv.text;
                    })
                  }
                  if(v.idNameList){
                     info[i].idNameList.forEach((vv,ii)=>{
                       let obj = {
                         treeId : 'user_'+ vv.userId,
                         text : vv.userName
                       }
                       obj1['user_'+ vv.userId] = vv.userName;
                       info[i].children.push(Object.assign({},obj));
                     })
                  }
                  if(v.children  && v.children.lenght != 0){
                    detail(v.children)
                  }
                }
              })
            }
            state.attendPersonTree.list = Object.assign([],data);
            state.attendPersonTree.obj = Object.assign({},obj1);
            resolve();
          }else{
            reject();
          }
        })
      }
    })
  },
  getDicForAll({state},payload){
    return new Promise(resolve=>{
      if(state.sex.list.length != 0) {
         resolve();
         return;
      }else{
        api.getDicForAll().then(obj=>{
          let arr = obj.data.data.list;
          arr.forEach((v,i)=>{
            let key = Object.keys(v)[0];
            if(v && v[key]){
              if(!state[key]){
                Object.defineProperty(state, key, {
                  enumerable: true,
                  configurable: true,
                  writable: true,
                  value: {
                    list : [],
                    obj : {}
                  }
                });
              } 
              state[key].list = v[key];
              let objSet = {};
              v[key].forEach((vv,ii)=>{
                objSet[vv.code] = vv.name;
              })
              state[key].obj = Object.assign({},objSet);
            }
          })
          resolve();
        })
      }
    })
    },
      getData({state},payload){
        return new Promise(resolve=>{
            if(state[payload].list.length != 0){
               resolve();
               return;
            }else{
               api.getDicOptions({type:payload}).then(obj=>{
                   state[payload].list = obj.data.data.list;
                    obj.data.data.list.forEach(v => {
                        state[payload].obj[v.code] = v.name;
                    });
                resolve();
               })
            }
        })
      },
      // 获取组织架构部门 人物
      getOrgTreeExtInfo({state},payload){
        return new Promise(resolve=>{
          let obj = {};
          api.orgTreeBaseInfo().then(obj=>{
            let list = obj.data.data[0];
            function detail(item){
              Object.defineProperty(obj, item.id, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: item
              });
              if(item.children.length == 0){
                delete item.children;
              }else{
                item.children.forEach((v,i)=>{
                  detail(v);
                })
              }
            }
            detail(list);
            state.orgTreeExtInfoObj = obj;
            state.orgTreeExtInfo = Object.assign([],[list]);
            resolve(state.orgTreeExtInfo);
          })
        })
      },
      // 菜单层级
      getMenuList({state},payload){
        return new Promise(resolve=>{
          let obj = {};
          api.menuDataList({permission:payload.permission}).then(obj=>{
            let list = obj.data.data;
            function detail(item){
              Object.defineProperty(obj, item.id, {
                enumerable: true,
                configurable: true,
                writable: true,
                value: item
              });
              if(item.children.length == 0){
                delete item.children;
              }else{
                item.children.forEach((v,i)=>{
                  detail(v);
                })
              }
            }
            if(list != null){
              list.forEach(val => {
                detail(val);
              })
            }
            state.menuListObj = obj;
            state.menuList = Object.assign([],[list]);
            resolve();
          })
        })
      },
      // 获取所有公司
      getAllCompanyList({state},payload){
        // allCompanyList
        return new Promise(resolve=>{
          api.companyIdName().then(obj=>{
            let list = obj.data.data;
            let listAva = [];
            let obj1 = {};
            let obj2 = {};
            // state.allCompanyList = obj.data.data.list;
            list.forEach((v,i)=>{
              obj1[v.id] =  v.companyName;
              obj2[v.id] = v;
              if(v.status == 'Y'){
                listAva.push(v);
              }
              // list[i].id = Number(v.id)
            })
            state.allCompanyList.list = Object.assign([],list);
            state.allCompanyList.listAva = Object.assign([],listAva);
            state.allCompanyList.obj = Object.assign({},obj1);
            state.allCompanyList.objAva = Object.assign({},obj2);
          })
        })
      },
      getAllOrgIdInfoObj({state},payload){
        return new Promise(resolve=>{
          if(!payload) {
            resolve([]);
          }else{
            let arr = [];
            getArray(payload);
            function getArray(id){
              arr.unshift(id);
              if(state.orgTreeExtInfoObj[id].parentId){
                getArray(state.orgTreeExtInfoObj[id].parentId);
              }
            }
            resolve(arr);
          }
        })
      },
      getAllMenuListObj({state},payload){
        return new Promise(resolve=>{
          if(!payload) {
            resolve([]);
          }else{
            let arr = [];
            getArray(payload);
            function getArray(id){
              arr.unshift(id);
              if(state.menuListObj[id].parentId){
                getArray(state.menuListObj[id].parentId);
              }
            }
            resolve(arr);
          }
        })
      }

  }

}
export default selectData;
