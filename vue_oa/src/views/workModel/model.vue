<template>
    
</template>

<script>
import axios from "axios"
export default {
    computed:{
        auth(){
            return this.$store.state.auth;
        }
    },
    created(){
        this.$api.createWorkModel().then(obj=>{
            window.sessionStorage['temAuth'] = this.auth;
            window.location = 'static/workModel/modeler.html?modelId='+obj.data.data.modelId;
        })
    }
}
</script>

<style>

</style>
