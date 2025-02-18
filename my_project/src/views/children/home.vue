<script>
export default {
    data() {
        return {
            tableData: [
                {
                    name: '银杏',
                    h: "100m",
                    w: '200m',
                },
                {
                    name: '鹅掌楸',
                    h: "100m",
                    w: '200m',
                },
                {
                    name: '二球悬铃木',
                    h: "100m",
                    w: '200m',
                },
                {
                    name: '二球悬铃木',
                    h: "100m",
                    w: '200m',
                },
                {
                    name: '二球悬铃木',
                    h: "100m",
                    w: '200m',
                },
                {
                    name: '二球悬铃木',
                    h: "100m",
                    w: '200m',
                },
             

            ],

            tableLabel:{
                name:"树种",
                h:"高度",
                w:"直径"
            },

            countData:[
                {
                    name:"今日已统计",
                    value:"1234",  
                    icon:"ri-check-line"  
                },
                {
                    name:"今日已统计",
                    value:"1234",   
                    icon:"ri-check-line"
                },
                {
                    name:"今日已统计",
                    value:"1234",   
                    icon:"ri-check-line"
                },
                {
                    name:"今日已统计",
                    value:"1234",   
                    icon:"ri-check-line"
                },
                {
                    name:"今日已统计",
                    value:"1234",   
                    icon:"ri-check-line"
                },
                {
                    name:"今日已统计",
                    value:"1234",   
                    icon:"ri-check-line"
                },
            ]
        }
    }
}
</script>
<template>
    <el-row>
        <el-col :span="24">
            <div class="grid-content ep-bg-purple">
                <el-card class="box-card">
                    <div class="user">
                        <img src="/public/images/3.jpg" alt="管理员头像">

                        <div class="useInfo">
                            <h1 class="name">Admin</h1>
                            <p class="access">超级管理员</p>
                        </div>
                    </div>
                    <div class="login-info">
                        <p> 上次登录时间: &nbsp;&nbsp;&nbsp;2023/5/6</p>
                        <p>上次登录地点: &nbsp;&nbsp;&nbsp;南京</p>
                    </div>
                </el-card>

                <el-card class="box-card" style="margin-top:20px">
                    <div class="grid-content ep-bg-purple-light">
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column :prop="key" :label="val"  v-for="(val,key) in tableLabel "/>
                        </el-table>
                    </div>
                </el-card>
            </div>
            <div class="num">
                <el-card v-for="item in countData" body-style="display: flex; padding:0px; width:300px" >
                    <i :class="item.icon" id="single"></i>
                    <div class="dataContent">
                        <p>{{ item.value }}</p>
                        <p>{{ item.name }}</p>
                    </div>
                </el-card>
            </div>
        </el-col>
        <!-- <el-col :span="18">
            <div class="num">
                <el-card v-for="item in countData" body-style="display: flex; padding:0px; width:300px" >
                    <i :class="item.icon" id="single"></i>
                    <div class="dataContent">
                        <p>{{ item.value }}</p>
                        <p>{{ item.name }}</p>
                    </div>
                </el-card>
            </div>

        </el-col> -->
    </el-row>
</template>

<style scoped>
.user {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid rgb(94, 93, 93);
}

.user img {
    width: 100px;
    border-radius: 50%;
    margin-right: 40px;
}

.useInfo .name {
    margin-bottom: 20px;
    font-size: 34px;
}

.num{
    display: flex;
    flex-wrap: wrap;
    justify-content:flex-start;
}

.num i{
    width:80px;
    height: 80px;
    background-color: rgb(243, 130, 10);
    text-align: center;
    line-height: 80px;

}

.num .dataContent{
    margin-left:50px;
}



</style>
