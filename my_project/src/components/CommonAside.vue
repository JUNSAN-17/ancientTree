<script>
import { useCounterStore } from "../stores/counter"
import { mapState } from 'pinia'

export default {
    data() {
        return {
            list: [
                { path: '/main/home', label: '主页', icon: 'ri-home-smile-fill' },
                { path: '/main/treeData', label: '数据管理', icon: 'ri-user-fill' },
                {
                    label: '系统管理', path: '/others', children: [
                        { path: '/main/userManagement', label: '用户管理', icon: 'ri-user-fill' },
                        { path: '/main/roleManagement', label: '角色管理', icon: 'ri-user-fill' },
                        { path: '/main/systemSetting', label: '系统设置', icon: 'ri-user-fill' },
                    ]
                },
                {
                    label: '图表统计', path: '/others1', children: [
                        { path: '/main/treeStatistics', label: '古树名木统计', icon: 'ri-user-fill' },
                        { path: '/main/userStatistics', label: '用户统计', icon: 'ri-user-fill' },
                        { path: '/main/bigShow', label: '智慧大屏', icon: 'ri-user-fill' },
                    ]
                },
                {
                    label: '古树可视化', path: '/others2', children: [
                        { path: '/main/mapShow', label: '地图展示', icon: 'ri-earth-fill' },
                        { path: '/main/threeShow', label: '三维重建', icon: 'ri-user-fill' }
                    ]
                },
                {
                    label: '公众互动', path: '/others3', children: [
                        { path: '/main/chatOnline', label: '在线咨询', icon: 'ri-user-fill' },
                        { path: '/main/bodyShow', label: '风采展示', icon: 'ri-user-fill' },
                    ]
                },
                {
                    label: '专家诊断', path: '/others4', children: [
                        { path: '/main/userAsk', label: '用户问询', icon: 'ri-user-fill' },
                        { path: '/main/expertResponse', label: '专家回复', icon: 'ri-user-fill' }
                    ]
                },
            ],
        }
    },
    computed: {
        hasChildren() { return this.list.filter(item => item.children) },
        noChildren() { return this.list.filter(item => !item.children) },
        ...mapState(useCounterStore, ['isCollapse'])
    },
    methods: {
        menuRouter(item) { this.$router.push(item.path) }
    }
}
</script>


<template>
    <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu default-active="/page1" class="el-menu-vertical-demo" :collapse="isCollapse">
            <!-- Render menu items without children -->
            <el-menu-item v-for="(item, index) in noChildren" :key="index" :index="item.path" @click="menuRouter(item)">
                <i :class="item.icon" class="menu-icon"></i>
                <span>{{ item.label }}</span>
            </el-menu-item>

            <!-- Render sub-menus with children -->
            <el-sub-menu v-for="(item, index) in hasChildren" :key="index" :index="item.path">
                <template #title>
                    <i class="ri-arrow-up-circle-fill"></i>
                    <span>{{ item.label }}</span>
                </template>

                <el-menu-item-group>
                    <el-menu-item v-for="(subItem, subIndex) in item.children" :key="subIndex" :index="subItem.path" @click="menuRouter(subItem)">
                        <i :class="subItem.icon" class="sub-menu-icon"></i>
                        {{ subItem.label }}
                    </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-aside>
</template>


<style scoped>
/* Styling for the sidebar */
.el-aside {
    background: rgb(60, 69, 81); /* Updated background color */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow */
    transition: width 0.3s ease;
}

/* Styling for the menu container */
.el-menu-vertical-demo {
    height: 100%;
    background-color: rgb(60, 69, 81); /* Background for el-menu */
    border-right: none;
}

/* Styling for individual menu items */
.el-menu-item {
    color: #fff; /* Text color */
    font-size: 16px;
    transition: background 0.3s, color 0.3s;
    height: 42px;
}

/* When the menu item is active, change the background */
.el-menu-item.is-active {
    background-color: rgb(17, 132, 199); /* Active item background */
    color: #fff; /* Active item text color */
    height: 42px;
}

/* Hover effect for non-active menu items */
.el-menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1); /* Hover background color */
    color: rgb(17, 132, 199); /* Hover text color */
}

/* Styling for the sub-menu items */
.el-sub-menu {
    background-color: rgb(60, 69, 81); /* Sub-menu background */
    
}

/* When the sub-menu is active */
.el-sub-menu.is-active {
    background-color: rgb(17, 132, 199); /* Active sub-menu background */
    
}

/* Use ::deep to target the sub-menu title */
::v-deep .el-sub-menu__title {
    color: #fff !important; /* Ensure text color is white */
    font-size: 16px;
    transition: background 0.3s, color 0.3s;
    height: 42px;
}

/* Styling for sub-menu arrow icon */
::v-deep .el-sub-menu__title i.ri-arrow-up-circle-fill {
    margin-right: 15px;
    color: rgb(112, 168, 210); /* Icon color */
}

/* 去除菜单项分组标题的 padding */
::v-deep .el-menu-item-group__title {
    padding: 5px !important; /* 强制移除 padding */
    margin: 0 !important;  /* 如果需要，移除 margin */
}

/* Styling for sub-menu item group */
.el-sub-menu .el-menu-item-group {
    background-color: rgb(60, 69, 81); /* Item group background */
}

/* Styling for sub-menu items */
.el-sub-menu .el-menu-item {
    color: #fff; /* Sub-menu text color */
    font-size: 16px;
    transition: background 0.3s, color 0.3s;
}

/* When the sub-menu item is active */
.el-sub-menu .el-menu-item.is-active {
    background-color: rgb(17, 132, 199); /* Active sub-menu item background */
    color: #fff; /* Active sub-menu item text color */
}

/* Styling for sub-menu icons */
.menu-icon, .sub-menu-icon {
    margin-right: 15px;
    color: rgb(112, 168, 210); /* Icon color */
}

/* Arrow icon in sub-menu */
.ri-arrow-up-circle-fill {
    margin-right: 15px;
    color: rgb(112, 168, 210);
}

</style>


