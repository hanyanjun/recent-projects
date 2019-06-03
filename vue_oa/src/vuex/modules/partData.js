
const partData = {
  state: {
    checkId: '',
    checkCode: '',
    handle: '',
    roleName: ''
  },
  mutations: {
    getCheckData (state, value) {
      state.checkId = value.id
      state.checkCode = value.code
      state.roleName = value.name
      state.handle = value.handle
    }
  },
  getters: {},
  actions: {}
}
export default partData
