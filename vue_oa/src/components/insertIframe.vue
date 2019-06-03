<template>
    <div class="insertIframe" v-if="pdfShow">
        <iframe src="/static/pdf/web/viewer.html" frameborder="0"></iframe>
    </div>
</template>

<script>
export default {
    computed:{
        pdfShow(){
            return this.$store.state.pdfShow
        }
    }
}
</script>

<style lang="scss" scoped>
.insertIframe{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    z-index: 99999;
    left: 0;
    iframe{
        position: relative;
        width: 100%;
        height: 100%;
    }
} 

</style>
