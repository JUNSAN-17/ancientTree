<template>
  <el-row>
    <!-- 顶部区域：管理员信息 -->
    <el-col :span="24">
      <el-card class="header-card">
        <div class="user">
          <img src="/images/3.jpg" alt="管理员头像" class="admin-avatar" />
          <div class="useInfo">
            <h1 class="name">你好，{{ user }}</h1>
            <p class="access">欢迎来到南京市古树名木智慧管理系统</p>
          </div>
        </div>
      </el-card>
    </el-col>

    <!-- 中部区域：正在处理的事件和最新动态 -->
    <el-col :span="24">
      <div class="grid-content">
        <!-- 正在处理的事件 -->
        <el-card class="event-card" style="margin-bottom: 20px;">
          <div class="event-header">
            <h2>正在处理中的事件</h2>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-card class="event-item">
                <div class="event-info">
                  <i class="ri-tree-line"></i>
                  <div>
                    <p class="event-title">古树保护</p>
                    <p class="event-time">2024-03-06 05:52:04</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="event-item">
                <div class="event-info">
                  <i class="ri-question-answer-line"></i>
                  <div>
                    <p class="event-title">公众咨询</p>
                    <p class="event-time">2024-03-04 14:29:30</p>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card class="event-item">
                <div class="event-info">
                  <i class="ri-information-line"></i>
                  <div>
                    <p class="event-title">古树认定</p>
                    <p class="event-time">2024-03-04 11:50:06</p>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-card>

        <!-- 最新动态 -->
        <el-card class="recent-events-card">
          <div class="events-header">
            <h2>古树动态</h2>
          </div>
          <el-table :data="recentEvents" style="width: 100%">
            <el-table-column label="事件" prop="event" />
            <el-table-column label="时间" prop="time" />
            <el-table-column label="处理状态" prop="status" />
          </el-table>
        </el-card>
      </div>
    </el-col>

  </el-row>
</template>
<script>
import { useCounterStore } from "../../stores/counter";
const countStore = useCounterStore();
export default {
  data() {
    return {
      user: countStore.username,
      recentEvents: [
        { event: '古树保护警告', time: '2023-05-06 10:30', status: '处理中' },
        { event: '非法砍伐', time: '2023-05-05 16:20', status: '已处理' },
        { event: '树木修复完成', time: '2023-05-03 14:00', status: '已解决' },
      ]
    };
  },
};

</script>

<style scoped>
.header-card {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.user {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  /* 添加适当的底部间距 */
}

.admin-avatar {
  width: 100px;
  border-radius: 50%;
  margin-right: 20px;
  /* 增加头像和文字之间的间距 */
}

.useInfo .name {
  font-size: 28px;
  font-weight: bold;
}

.useInfo p {
  font-size: 18px;
  color: #ffffff;
  margin-top: 5px;
  /* 增加文字之间的间距 */
}

.event-card {
  background-color: #fff;
  padding: 20px;
}

.event-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.event-item {
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.event-info {
  display: flex;
  align-items: center;
}

.event-info i {
  font-size: 30px;
  margin-right: 15px;
}

.event-title {
  font-weight: bold;
}

.event-time {
  font-size: 12px;
  color: #888;
}

.recent-events-card {
  margin-top: 20px;
  padding: 20px;
}

.events-header {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.el-table th,
.el-table td {
  text-align: center;
}

.el-table th {
  background-color: #f4f4f4;
}
</style>