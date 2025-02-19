<script >
import { defineComponent } from 'vue';
import CommonHeader from '../components/CommonHeader.vue';
import CommonAside from '../components/CommonAside.vue';
export default defineComponent({
    components: {
        CommonHeader,
        CommonAside
    }
});
</script>

<template>
    <div class="common-layout">
        <CommonHeader></CommonHeader>
        <el-container>
            <CommonAside></CommonAside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
    .common-layout{
        height: 100%;
        overflow: hidden;
    }

    .common-layout .el-container{
        height: 100%;
  
    }

    .el-main{
        padding: 5px;
    }
</style>