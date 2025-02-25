<template>
  <div class="dashboard">
    <!-- 总体布局 -->
    <div class="charts-container">
      <!-- 左侧部分：第一个和第二个图表上下排列 -->
      <div class="left-container">
        <!-- 第一个图表 - 环形图 -->
        <div class="chart-item" style="height: 350px; width:500px">
          <div id="chart1" class="chart"></div>
        </div>

        <!-- 第二个图表 - 柱状图 -->
        <div class="chart-item" style="height: 350px;">
          <div id="chart2" class="chart"></div>
        </div>
      </div>

      <!-- 右侧部分：地图图表 -->
      <div class="map-item">
        <div id="chart3" class="chart" style="height: 100%;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'Dashboard',
  data() {
    return {
      treeData: [],  // 用来存储从后端获取的数据
      areaCount: {},  // 用来存储area统计结果
      rankCount: {}   // 用来存储rank统计结果
    };
  },
  mounted() {
    this.fetchData();  // 页面加载时调用fetchData来加载数据
  },
  beforeDestroy() {
    // 销毁图表实例
    if (this.chart1) {
      this.chart1.dispose();
    }
    if (this.chart2) {
      this.chart2.dispose();
    }
    if (this.chart3) {
      this.chart3.dispose();
    }
  },
  methods: {
    // 请求后端接口获取数据
    fetchData() {
      axios.get('http://localhost:4000/allTree')  // 调用后端接口
        .then(response => {
          this.treeData = response.data;  // 存储数据
          this.statisticalAreaCount();  // 统计area的出现次数
          this.statisticalRankCount();  // 统计rank的出现次数
          this.initCharts();  // 初始化图表
        })
        .catch(error => {
          console.error('数据加载失败', error);
        });
    },

    // 统计area出现的次数
    statisticalAreaCount() {
      this.areaCount = this.treeData.reduce((acc, item) => {
        const area = item.area;  // 获取area属性
        if (area) {
          acc[area] = (acc[area] || 0) + 1;  // 如果area已存在，则加1，否则初始化为1
        }
        return acc;
      }, {});
      console.log(this.areaCount);  // 打印统计结果
    },

    // 统计rank出现的次数
    statisticalRankCount() {
      this.rankCount = this.treeData.reduce((acc, item) => {
        const rank = item.rank;  // 获取rank属性
        if (rank) {
          acc[rank] = (acc[rank] || 0) + 1;  // 如果rank已存在，则加1，否则初始化为1
        }
        return acc;
      }, {});
      console.log(this.rankCount);  // 打印统计结果
    },

    // 初始化图表
    initCharts() {
      // 检查并销毁已有实例
      if (echarts.getInstanceByDom(document.getElementById('chart1'))) {
        echarts.getInstanceByDom(document.getElementById('chart1')).dispose();
      }

      // 第一个图表：环形图，显示area的出现次数
      this.chart1 = echarts.init(document.getElementById('chart1'));
      const option1 = {
        title: {
          text: '古树名木各区占比', // 标题
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          padding: [0, 0, 10, 0],  // 拉开标题与图表之间的距离
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            data: Object.keys(this.areaCount).map(area => ({
              name: area,  // 使用统计的area
              value: this.areaCount[area],  // area出现的次数
            })),
            label: {
              formatter: '{b}: {d}%',  // 格式化显示
            },
          },
        ],
      };
      this.chart1.setOption(option1);

      // 第二个图表：柱状图，显示古树名木等级分类
      if (echarts.getInstanceByDom(document.getElementById('chart2'))) {
        echarts.getInstanceByDom(document.getElementById('chart2')).dispose();
      }
      this.chart2 = echarts.init(document.getElementById('chart2'));
      const option2 = {
        title: {
          text: '古树名木等级分类', // 标题
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          padding: [20, 0, 10, 0],  // 拉开标题与图表之间的距离
        },
        xAxis: {
          type: 'category',
          data: ['一级', '二级', '三级', '名木'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            type: 'bar',
            data: [
              this.rankCount['一级'] || 0,
              this.rankCount['二级'] || 0,
              this.rankCount['三级'] || 0,
              this.rankCount['名木'] || 0,
            ],
            label: {
              show: true,
              position: 'top',
            },
          },
        ],
      };
      this.chart2.setOption(option2);

      // 第三个图表：地图图表，根据各区数量的颜色来调整
      if (echarts.getInstanceByDom(document.getElementById('chart3'))) {
        echarts.getInstanceByDom(document.getElementById('chart3')).dispose();
      }
      this.chart3 = echarts.init(document.getElementById('chart3'));
      axios.get('https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=320100_full')
        .then(response => {
          const option3 = {
            title: {
              text: '古树名木专题图', // 标题
              left: 'center',
              top: 'top',
              textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
              },
              padding: [20, 0, 10, 0],  // 拉开标题与图表之间的距离
            },
            visualMap: {
              min: Math.min(...Object.values(this.areaCount)),
              max: Math.max(...Object.values(this.areaCount)),
              type: 'continuous',
              inRange: {
                color: ['#f1c40f', '#e74c3c', '#8e44ad'], // 根据数量设置颜色渐变
              },
              text: ['High', 'Low'],
              show: true,  // 显示颜色映射
            },
            series: [
              {
                type: 'map',
                map: '南京',
                roam: true,
                label: {
                  show: true,
                },
                data: Object.keys(this.areaCount).map(area => ({
                  name: area,  // 区域名
                  value: this.areaCount[area]  // 数量
                })),
              },
            ],
          };
          echarts.registerMap('南京', response.data); // 注册地图
          this.chart3.setOption(option3);
        })
        .catch(error => {
          console.error('地图数据加载失败', error);
        });
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.charts-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.left-container {
  display: flex;
  flex-direction: column;
  /* 上下排列 */
  flex: 1;
}

.chart-item {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.map-item {
  flex: 2;
  /* 地图部分占用较大空间 */
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
