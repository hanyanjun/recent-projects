import _ from 'lodash'
export default function (list, id, addChild = true) {
  const menu = _.sortBy(list, function (item) {
    if (addChild)item.children = []
    return item.sort
  })
  const keyNav = _.keyBy(menu, id)
  menu.map(value => {
    if (keyNav[value.parentId]) {
      if (!keyNav[value.parentId].children && !addChild) {
        keyNav[value.parentId].children = []
      }
      keyNav[value.parentId].children.push(value)
    }
  })
  return menu.filter(val => !val.parentId)
}
