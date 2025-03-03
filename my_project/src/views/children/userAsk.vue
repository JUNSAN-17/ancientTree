<template>
    <div class="app-container" :style="{ height: windowHeight - 50 + 'px' }">
      <div class="header">
        <el-form inline>
          <!-- 起点输入框 -->
          <el-form-item label="起点：" prop="startAddress">
            <el-input class="serach1" v-model="startAddress" placeholder="请输入起点地址"></el-input>
          </el-form-item>
  
          <!-- 终点（固定不变，不需要输入框） -->
          <el-form-item label="终点：" prop="endAddress">
            <el-input class="serach1" v-model="endAddress" disabled placeholder="终点固定为南京某点"></el-input>
          </el-form-item>
  
          <el-button class="button primary-action" type="primary" @click="planRoute">规划路线</el-button>
        </el-form>
      </div>
  
      <div class="map-and-panel-container">
        <div id="container" class="map"></div>
        <div id="panel" class="route-result-panel"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "index",
    data() {
      return {
        windowHeight: window.innerHeight,
        map: null, // 地图实例
        startAddress: "", // 起点地址（用户输入）
        startLngLat: null, // 起点经纬度
        endLngLat: [118.47051413302131, 32.04701650521554], // 固定终点经纬度
      };
    },
    mounted() {
      window.onresize = () => {
        this.windowHeight = document.documentElement.clientHeight;
      };
      this.initMap(); // 初始化地图
    },
    methods: {
      // **1️⃣ 初始化地图**
      initMap() {
        this.map = new AMap.Map("container", {
          resizeEnable: true,
          zoom: 13,
        });
      },
  
      // **2️⃣ 规划路线**
      async planRoute() {
        if (!this.startAddress) {
          this.$message.error("请输入起点地址");
          return;
        }
  
        try {
          // 获取起点的经纬度
          this.startLngLat = await this.getGeoLocation(this.startAddress);
  
          if (!this.startLngLat) {
            this.$message.error("❌ 起点地址解析失败，请检查输入");
            return;
          }
  
          console.log("✅ 起点经纬度:", this.startLngLat);
          console.log("✅ 终点经纬度（固定）:", this.endLngLat);
  
          // 计算路径
          this.calculateRoute();
        } catch (error) {
          console.error("❌ 获取起点经纬度失败:", error);
          this.$message.error("地址转换失败，请检查输入");
        }
      },
  
      // **3️⃣ 使用高德 Geocoder 获取起点经纬度**
      getGeoLocation(address) {
        return new Promise((resolve, reject) => {
          AMap.plugin("AMap.Geocoder", () => {
            let geocoder = new AMap.Geocoder();
            geocoder.getLocation(address, (status, result) => {
              if (status === "complete" && result.geocodes.length > 0) {
                resolve([result.geocodes[0].location.lng, result.geocodes[0].location.lat]);
              } else {
                reject("地址解析失败");
              }
            });
          });
        });
      },
  
      // **4️⃣ 计算路线（起点 & 固定终点的经纬度）**
      calculateRoute() {
        AMap.plugin("AMap.Driving", () => {
          let driving = new AMap.Driving({
            policy: 0, // 速度优先
            map: this.map,
            panel: "panel",
          });
  
          console.log("🚀 查询路线: 起点", this.startLngLat, "终点（固定）", this.endLngLat);
  
          driving.search(this.startLngLat, this.endLngLat, (status, result) => {
            if (status === "complete") {
              console.log("✅ 路线规划成功", result);
              this.$message({ message: "路线规划成功", type: "success" });
            } else {
              console.error("❌ 获取驾车数据失败:", result);
              this.$message.error("路线规划失败");
            }
          });
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .app-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    background-color: #f5f7fa;
    padding: 10px;
  }
  .map-and-panel-container {
    display: flex;
    width: 100%;
    height: calc(100% - 5rem);
  }
  .map {
    flex-grow: 1;
    width: 70%;
    height: 100%;
  }
  .route-result-panel {
    width: 30%;
    height: 100%;
    background-color: white;
    overflow-y: auto;
    padding: 1rem;
  }
  .serach1 {
    width: 200px;
  }
  .primary-action {
    margin-left: 1rem;
  }
  </style>
  