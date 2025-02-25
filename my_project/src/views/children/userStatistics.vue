<template>
  <div class="user-statistics">
    <h2>用户统计</h2>

    <div class="chart-container">
      <!-- 用户角色分布图 -->
      <div class="chart-item" style="height: 350px; width: 500px;">
        <div id="roleChart" class="chart"></div>
      </div>

      <!-- 用户状态分布图 -->
      <div class="chart-item" style="height: 350px; width: 500px;">
        <div id="statusChart" class="chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'UserStatistics',
  data() {
    return {
      users: [
        { user_id: 1, user_role: 'admin', user_status: '激活' },
        { user_id: 2, user_role: 'expert', user_status: '禁用' },
        { user_id: 3, user_role: 'guest', user_status: '激活' },
        { user_id: 4, user_role: 'admin', user_status: '激活' },
        { user_id: 5, user_role: 'expert', user_status: '禁用' },
      ],
    };
  },
  mounted() {
    this.initCharts();  // 加载图表
  },
  beforeDestroy() {
    // 销毁图表实例，避免内存泄漏
    this.disposeChart('roleChart');
    this.disposeChart('statusChart');
  },
  methods: {
    // 初始化图表
    initCharts() {
      // 用户角色分布
      this.disposeChart('roleChart');  // 销毁旧实例
      const roleChart = echarts.init(document.getElementById('roleChart'));
      const roleData = this.getRoleData();
      const roleOption = {
        title: {
          text: '用户角色分布',
          left: 'center',
          top: 'top',
          textStyle: { fontSize: 18, fontWeight: 'bold' },
        },
        tooltip: { trigger: 'item' },
        color: ['#EA8379', '#7DAEE0', '#B395BD'],  // 自定义颜色
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: roleData,
            label: { formatter: '{b}: {d}%' },
          },
        ],
      };
      roleChart.setOption(roleOption);

      // 用户状态分布
      this.disposeChart('statusChart');  // 销毁旧实例
      const statusChart = echarts.init(document.getElementById('statusChart'));
      const statusData = this.getStatusData();
      const statusOption = {
        title: {
          text: '用户状态分布',
          left: 'center',
          top: 'top',
          textStyle: { fontSize: 18, fontWeight: 'bold' },
        },
        tooltip: { trigger: 'item' },
        color: ['#48C0AA','#FF6347'],  // 自定义颜色
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: statusData,
            label: { formatter: '{b}: {d}%' },
          },
        ],
      };
      statusChart.setOption(statusOption);
    },

    // 销毁图表实例
    disposeChart(chartId) {
      const chart = echarts.getInstanceByDom(document.getElementById(chartId));
      if (chart) {
        chart.dispose();
      }
    },

    // 获取用户角色统计数据
    getRoleData() {
      const roleCount = this.users.reduce((acc, user) => {
        acc[user.user_role] = (acc[user.user_role] || 0) + 1;
        return acc;
      }, {});

      return Object.keys(roleCount).map((role) => ({
        name: role,
        value: roleCount[role],
      }));
    },

    // 获取用户状态统计数据
    getStatusData() {
      const statusCount = this.users.reduce((acc, user) => {
        acc[user.user_status] = (acc[user.user_status] || 0) + 1;
        return acc;
      }, {});

      return Object.keys(statusCount).map((status) => ({
        name: status,
        value: statusCount[status],
      }));
    },
  },
};
</script>

<style scoped>
.user-statistics {
  padding: 20px;
}

h2 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.chart-container {
  display: flex;
  justify-content: space-around;
}

.chart-item {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 500px;
  height: 350px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
