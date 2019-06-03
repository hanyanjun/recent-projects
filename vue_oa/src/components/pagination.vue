<template>
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="sizes"
        :page-size="size"
        :current-page.sync="currentPage"
        :layout="layout"
        :total="total">
    </el-pagination>
</template>

<script>
export default {
    name : 'pagination',
    props :{
        'sizes' : {
            type : Array,
            default : []
        },
        'size' : '',
        layout : '',
        total : '',
        current: {
            type: Number,
            default:1
        }
    },
    watch:{
        current : function(val){
            this.currentPage = val;
        }
    },
    data(){return{
        oldPage : 1,
        currentPage : 1
    }},
    methods : {
        handleCurrentChange(val){
            this.$emit('current-change',val);  
            this.oldPage = val;
            this.$emit("update:current",val);
        },
        handleSizeChange(val){
            if(Math.ceil(Number(this.total)/Number(val)) >= this.oldPage){
                this.$emit('size-change',{value : val , isLoad : true});
            }else{
                this.$emit('size-change',{value : val , isLoad : false});
            }
        }
    }

}
</script>

<style>

</style>
