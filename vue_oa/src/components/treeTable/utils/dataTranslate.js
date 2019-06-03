/*
* @Author: sunlandong
* @Date:   2017-03-11 12:06:49
* @Last Modified by:   sunlandong
* @Last Modified time: 2017-03-11 16:30:03
*/

import Vue from 'vue'
function DataTransfer (data) {
  if (!(this instanceof DataTransfer)) {
    return new DataTransfer(data, null, null)
  }
}
// _level  层级
// _borLen 兄弟节点格式
// _index 在父级节点的位置
// _search  是否被搜索选中
// _selected 是否被点击选中
// _isBtn  是否显示功能按钮
DataTransfer.treeToArray = function (data, parent, level, expandedAll) {
  let tmp = [] 
  Array.from(data).forEach(function (record,index) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandedAll)
    }
    if (parent) {
      Vue.set(record, '_parent', parent)
    }
    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    Vue.set(record, '_selected', false)
    Vue.set(record, '_index', index)
    Vue.set(record, '_isBtn', false)
    if(record._parent){
      Vue.set(record, '_broLen', record._parent.children.length)
    }else{
      Vue.set(record, '_broLen', data.length)
    }
    Vue.set(record, '_search', false)
    tmp.push(record)
    if ( record.children && record.children.length > 0) {
      let children = DataTransfer.treeToArray(record.children, record, _level, expandedAll)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}

export default DataTransfer
