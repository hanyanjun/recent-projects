<template>
 <div class="scrollContent">
     <el-scrollbar class="scrollWrap">
        <slot>



        </slot>
     </el-scrollbar>
 </div>   
</template>

<script>
export default {
    name : 'scrollContent'
}
</script>

<style lang="scss" scoped>
.scrollContent{
    width: 100%;
    height: calc(100% + 17px);
    overflow: hidden;  
    margin-top: -17px;
    .scrollWrap{
      height: 100%;
      width: 100%;
    }
}

</style>
