<template>
    <el-container class="full-height">
      <!-- 头部 -->
      <el-header class="header">
        <h1>NeRFStudio 训练界面</h1>
      </el-header>
  
      <el-main class="main-content">
        <!-- 上半部分：参数选择和三维模型展示 -->
        <el-row :gutter="20" class="top-section">
          <!-- 左侧：参数选择 -->
          <el-col :span="12">
            <el-card>
              <el-form :model="form" label-width="120px">
                <!-- 方法选择 -->
                <el-form-item label="训练方法">
                  <el-select v-model="form.method" placeholder="请选择训练方法">
                    <el-option label="Nerfacto" value="nerf"></el-option>
                    <el-option label="Instant NGP" value="instant_ngp"></el-option>
                    <el-option label="Mip-NeRF" value="mip_nerf"></el-option>
                    <el-option label="NeRF" value="NeRF"></el-option>
                    <el-option label="TensoRF" value="TensoRF"></el-option>
                    <el-option label="Splatfacto" value="Splatfacto"></el-option>
                  </el-select>
                </el-form-item>
  
                <!-- 模型参数设置 -->
                <el-form-item label="下采样因子">
                  <el-input-number v-model="form.learningRate" :min="1" :max="15" :step="1"></el-input-number>
                </el-form-item>
                <el-form-item label="迭代步数">
                  <el-input-number v-model="form.iterations" :min="10000" :max="100000" :step="5000"></el-input-number>
                </el-form-item>
  
                <!-- 图片文件夹选择 -->
                <el-form-item label="图片文件夹">
                  <el-upload action="#" :auto-upload="false" :on-change="handleImageFolderChange" :show-file-list="false">
                    <el-button type="primary">选择文件夹</el-button>
                  </el-upload>
                </el-form-item>
  
                <!-- COLMAP 操作 -->
                <el-form-item label="COLMAP 操作">
                  <el-button type="primary" @click="runColmap">运行 COLMAP</el-button>
                  <el-button type="danger" @click="resetColmap">重置 COLMAP</el-button>
                </el-form-item>
  
                <!-- 开始训练按钮 -->
                <el-form-item>
                  <el-button type="primary" @click="startTraining" :disabled="!isColmapCompleted">开始训练</el-button>
                  <!-- 保存结果按钮, 只有训练完成后才能点击 -->
                  <el-button class="btn" type="success" @click="saveResults" :disabled="!isTrainingComplete">保存结果</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
  
          <!-- 右侧：三维模型展示 -->
          <el-col :span="12">
            <el-card>
              <h3>三维模型展示</h3>
              <div class="model-viewer">
                <p v-if="!modelData">暂无模型数据</p>
                <div v-else>
                  <p>三维模型展示区域</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
  
        <!-- 训练进度和日志 -->
        <el-row class="middle-section">
          <el-col :span="24">
            <el-card>
              <h3>训练进度</h3>
              <el-progress :percentage="progressPercentage" :status="progressStatus"></el-progress>
              <p>当前步骤：{{ currentStep }}</p>
              <p>剩余时间：{{ remainingTime }}</p>
            </el-card>
          </el-col>
        </el-row>
  
        <!-- 日志显示 -->
        <el-row class="log-section">
          <el-col :span="24">
            <el-card>
              <h3>日志信息</h3>
              <div class="log-content">
                <pre>{{ log }}</pre>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          method: 'nerf',
          learningRate: 0.001,
          iterations: 10000,
          imageFolder: null,
        },
        isColmapCompleted: false, // COLMAP 是否完成
        isTrainingComplete: false, // 训练是否完成
        progressPercentage: 0, // 进度条百分比
        progressStatus: 'success', // 进度条状态
        currentStep: '等待开始', // 当前步骤描述
        remainingTime: '00:00:00', // 剩余时间
        modelData: null, // 三维模型数据
        log: '', // 日志信息
      };
    },
    methods: {
      handleImageFolderChange(file) {
        this.form.imageFolder = file.raw;
        this.log += `图片文件夹已选择：${file.name}\n`;
      },
      async runColmap() {
        this.currentStep = '运行 COLMAP 中...';
        this.progressStatus = 'success';
  
        // 模拟 COLMAP 运行过程
        for (let i = 0; i <= 100; i += 10) {
          this.progressPercentage = i;
          await this.sleep(500); // 模拟延迟
        }
  
        this.isColmapCompleted = true;
        this.currentStep = 'COLMAP 完成';
        this.log += 'COLMAP 运行成功\n';
        this.$message.success('COLMAP 运行成功');
      },
      resetColmap() {
        this.isColmapCompleted = false;
        this.progressPercentage = 0;
        this.currentStep = '等待开始';
        this.log += 'COLMAP 已重置\n';
        this.$message.warning('COLMAP 已重置');
      },
      async startTraining() {
        if (!this.isColmapCompleted) {
          this.$message.warning('请先完成 COLMAP 处理');
          return;
        }
  
        this.currentStep = '训练模型中...';
        this.progressStatus = 'success';
  
        // 模拟训练过程
        for (let i = 0; i <= 100; i += 10) {
          this.progressPercentage = i;
          this.remainingTime = this.formatTime(3600 - i * 36); // 模拟剩余时间
          await this.sleep(500); // 模拟延迟
        }
  
        this.currentStep = '训练完成';
        this.isTrainingComplete = true; // 设置训练完成
        this.log += '训练完成\n';
        this.$message.success('训练完成');
      },
      async saveResults() {
        if (!this.isTrainingComplete) {
          this.$message.warning('请先完成训练');
          return;
        }
  
        try {
          // 使用浏览器的文件保存 API
          if (window.showSaveFilePicker) {
            const handle = await window.showSaveFilePicker({
              types: [
                {
                  description: 'NeRF 模型文件',
                  accept: {
                    'application/octet-stream': ['.nerf'],
                  },
                },
              ],
            });
            const writable = await handle.createWritable();
            await writable.write('这里是保存的模型数据'); // 替换为实际数据
            await writable.close();
            this.log += `结果已保存到：${handle.name}\n`;
            this.$message.success('结果已保存');
          } else {
            // 如果不支持 showSaveFilePicker，使用传统的文件下载方式
            const blob = new Blob(['这里是保存的模型数据'], { type: 'application/octet-stream' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'model.nerf';
            link.click();
            URL.revokeObjectURL(link.href);
            this.log += '结果已保存\n';
            this.$message.success('结果已保存');
          }
        } catch (error) {
          this.log += `保存失败：${error.message}\n`;
          this.$message.error('保存失败');
        }
      },
      sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      },
      formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      },
    },
  };
  </script>
  
  <style scoped>
  .btn {
    margin-left: 60px;
  }
  .full-height {
    height: 100%;
  }
  
  .header {
    text-align: center;
    padding: 20px 0;
    background-color: #409eff;
    color: white;
  }
  
  .main-content {
    padding: 20px;
    height: calc(100vh - 60px);
    /* 减去 header 的高度 */
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    /* 底部 padding */
  }
  
  .top-section {
    flex: 1;
    display: flex;
    margin-bottom: 20px;
  }
  
  .middle-section {
    height: 120px;
    /* 固定高度 */
    margin-bottom: 20px;
  }
  
  .bottom-section {
    flex: 1;
    display: flex;
    margin-bottom: 20px;
  }
  
  .log-section {
    height: 100%;
  }
  
  .model-viewer,
  .reconstructed-model {
    height: 100%;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;
  }
  
  .log-content {
    height: 150px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
    background-color: #f9f9f9;
  }
  
  .el-card {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .el-card__body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  </style>
  