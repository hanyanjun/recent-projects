<template>
  <div class="hw-search-componetns"  :style="{'background' : config.bg}" >
    <form action="" @submit.stop="search">
      <input type="search" name="" value=""  :placeholder="config.placeHolder" autocomplete="off" :class="['con-sear', {'con-sear-active' : !conShow}]" @click.stop="searchFocus" v-model="searchInput" ref="search" v-blur="searchBlur">
      <span class="con-position"  @click.stop="search">{{config.btn || '搜索'}}</span>
    </form>
  </div>
</template>

<script>
export default{
    name : 'search',
    props : ['config'],
    data(){return{
        searchInput : '',
        conShow : true,
        placeHolder : ''
    }},
    watch : {
      searchInput(){
          this.$emit('input',this.searchInput);
      }
    },
    methods :{
      searchFocus(){
            this.$refs.search.focus();
            this.conShow = false;
            this.placeHolder = this.config.placeHolder;
            this.$emit('focus',this.$refs.search.value);
       },
      searchBlur(){
          if(this.$refs.search.value == ''){
            this.placeHolder = '';
            this.conShow = true;
          }
      },
      search(e){
            e.preventDefault();
          this.$emit('search',this.searchInput);
      }
    },
//    mounted(){
//        let dom = this.$refs.search;
//        dom.addEventListener('keypress',(e)=> {
//          var keycode = e.keyCode;
//          if(keycode=='13') {
//            e.preventDefault();
//            //请求搜索接口
//            this.$emit('search',dom.value);
//          }
//        })
//    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../assets/css/common";
.hw-search-componetns {
    form{
      width: 100%;
      box-sizing: border-box;
      padding: .2rem 1rem .2rem .3rem;
      display: flex;
      justify-content: space-between;
    }
    input::-webkit-input-placeholder{
      color: $i2Gray;
    }
  }

.hw-search-componetns .con-sear {
    display: inline-block;
    width: 7.1rem;
    height: .8rem;
    padding-left: 0.6rem;
    line-height: .5rem;
    background: #f2f2f2;
    font-size: .3rem;
    box-sizing: border-box;
  }
.hw-search-componetns .con-sear-active{
    background: #f2f2f2;
  }
.hw-search-componetns .con-sear-addnew{
    background-image: none;
    background: #f2f2f2;
  }
.hw-search-componetns .con-position{
    display: inline-block;
    position: absolute;
    font-size: .3rem;
    height: 0.8rem;
    line-height: 0.8rem;
    color:$baseBlue;
    width: 1rem;
    text-align: center;
    right: 0;
    top: 0.2rem;
  }

</style>
