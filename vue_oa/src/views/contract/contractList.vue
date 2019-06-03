<template>
 <div class="contractList">
     <div class="classify">
        <conClass :classType="type" @search="selected" @selected="selected"></conClass>    
     </div>
     <div class="content">
         <router-view>

         </router-view>
     </div>  
 </div>   
</template>

<script>
import conClass from "@/components/conClass"
import adList from "./adList"
import busList from "./busList"
export default {
    name : "contractList",
    components:{adList,conClass,busList},
    data(){return{
        type : '',
    }},
    created(){
        this.type =  this.$route.name == 'contractbusList' ? 'B' : 'A';
    },
    methods:{
        change(){
            this.type =  this.$route.name == 'contractbusList' ? 'B' : 'A'
        },
        selected(item){
            this.$store.state.contract.filterClassId = item;
        }
    },
    watch : {
        "$route" : 'change'
    }
}
</script>

<style lang="scss" scoped>
@import "../../assets/css/common.scss";
.contractList{
    display: flex;
    height: 100%;
    .classify{
        width: 300px;
        background: white;
        border-radius:2px;
        border: 1px solid $gray_f1;
        box-sizing: border-box;
        padding: 24px 26px;
    }
        .search{
            height: 30px;
        }
    .content{
        width: calc(100% - 320px); 
        height: 100%; 
        border: 1px solid $gray_f1;
        background: white;
        border-radius:2px;
        margin-left: 20px;
        overflow: hidden;
    }
}
</style>
