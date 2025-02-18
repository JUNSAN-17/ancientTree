<template>
    <el-header class="top-bar">
        <div class="left-content">
            <el-button size="large" round @click="updateCollapse" class="menu-button">
                <i class="ri-menu-line"></i>
            </el-button>
        </div>

        <div class="title-container">
            <img class="tree-icon" src="/images/雪松.png" alt="雪松图标">
            <span class="title">南京市古树名木管理系统</span>
        </div>

        <div class="right-content">
            <el-dropdown>
                <span class="el-dropdown-link">
                    <img class="user" :src="arr[0].img" alt="User Avatar">
                </span>

                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>个人中心</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>
        </div>
    </el-header>
</template>

<script>
import { useCounterStore } from "../stores/counter";
const countStore = useCounterStore();
export default {
    data() {
        return {
            arr: [
                {
                    id: 1,
                    img: "/images/3.jpg", // example avatar image
                }
            ],
        };
    },

    methods: {
        updateCollapse() {
            countStore.updateCollapse();
        }
    },
};
</script>

<style scoped>
.top-bar {
    height: 60px;
    display: flex;
    justify-content: space-between;
    background: rgb(60, 69, 81); 
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); 
}


.left-content {
    display: flex;
    align-items: center;
}

.menu-button {
    font-size: 20px;
    color: white;
    background: transparent;
    border: 2px solid white;
    padding: 10px;
    transition: background 0.3s;
    border-radius: 6px;
    /* rounded corners for button */
}

.menu-button:hover {
    background: rgba(255, 255, 255, 0.2);
}

.title-container {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tree-icon {
    width: 58px;
    height: 58px;
    margin-right: 10px;
}

.title {
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 1px;
}

.right-content {
    position: absolute;
    right: 20px;
    display: flex;
    align-items: center;
}

.user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user:hover {
    transform: scale(1.1);
    /* Zoom in effect */
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    /* Enhanced shadow on hover */
}

.el-dropdown-link {
    padding-bottom: 0;
}

.el-dropdown-menu {
    min-width: 180px;
}

.el-dropdown-item {
    font-size: 14px;
    padding: 12px 20px;
    transition: background-color 0.3s ease;
    font-weight: 500;
}

.el-dropdown-item:hover {
    background-color: #e8f0fa;
    /* Soft blue hover effect */
}
</style>
