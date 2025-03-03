<template>
    <div class="tree-display">
      <!-- Title Section -->
      <div class="page-title">
        <h1>金陵树王风采展示</h1>
      </div>
  
      <!-- Card Section -->
      <el-row :gutter="20">
        <el-col :span="8" v-for="(tree, index) in trees" :key="index">
          <el-card class="tree-card" @click="openDetailDialog(tree)">
            <img :src="tree.image" class="card-img" alt="Tree Image"/>
            <div class="card-body">
              <h3 class="tree-name">{{ tree.name }}</h3>
              <p class="tree-info">{{ tree.shortDescription }}</p>
            </div>  
          </el-card>
        </el-col>
      </el-row>
  
      <!-- Overlay for Tree Details -->
      <div v-if="selectedTree" class="overlay" @click="selectedTree = null">
        <el-card class="overlay-card">
          <img :src="selectedTree.image" class="overlay-img" alt="Tree Image"/>
          <h3 class="tree-name">{{ selectedTree.name }}</h3>
          <p class="tree-description">{{ selectedTree.description }}</p>
        </el-card>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        trees: [
          {
            name: "古树1",
            image: "/images/bodyShowBg.png",
            shortDescription: "这是古树1的简介",
            description: "这是古树1的详细描述，关于它的历史、文化等内容。",
          },
          {
            name: "古树2",
            image: "/images/bodyShowBg.png",
            shortDescription: "这是古树2的简介",
            description: "这是古树2的详细描述，关于它的历史、文化等内容。",
          },
          // 其他古树的数据
        ],
        selectedTree: null, // 选中的树对象
      };
    },
    methods: {
      openDetailDialog(tree) {
        this.selectedTree = tree; // 设置选中的树对象
      },
    },
  };
  </script>
  
  <style scoped>
  .tree-display {
    padding: 20px;
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 30px;
    background: url('/images/bodyShowBg.png') no-repeat center top;
    background-size: cover;
    padding: 50px 0;
    background-position: center;
  }
  
  .page-title h1 {
    font-size: 56px;
    font-weight: bold;
    text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2);
    background: rgb(255, 255, 255);
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: 2px;
  }
  
  .tree-card {
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .tree-card:hover {
    transform: scale(1.05);
  }
  
  .card-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .card-body {
    padding: 10px;
  }
  
  .tree-name {
    font-size: 18px;
    font-weight: bold;
  }
  
  .tree-info {
    font-size: 14px;
    color: #888;
  }
  
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .overlay-card {
    width: 60%; /* Adjusted width, change to fit your needs */
    max-width: 700px; /* Optional: add a max width */
    padding: 20px;
    background-color: white;
    border-radius: 8px;
  }
  
  .overlay-img {
    width: 100%;
    height: 300px;
    object-fit: cover;
  }
  
  .tree-description {
    margin-top: 20px;
    font-size: 16px;
    color: #333;
  }
  </style>
  