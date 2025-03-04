<template>
  <el-card class="card-container">
    <!-- 在线咨询按钮和异常信息提交按钮 -->
    <div style="text-align: left; margin-bottom: 20px;">
      <el-button type="primary" @click="openConsultationDialog">在线咨询</el-button>
      <el-button type="warning" @click="openExceptionDialog" style="margin-left: 10px;">提交异常信息</el-button>
    </div>

    <!-- 包含信件查询和查询部分的容器 -->
    <div class="query-wrapper">
      <!-- 信件查询部分 -->
      <div class="header">
        <el-row>
          <el-col :span="12">
            <span class="title">信件查询</span>
          </el-col>
          <el-col :span="12" class="text-right">
            <span>总信件数（{{ totalRecords }}） 草稿（{{ draft }}） 待处理（{{ pending }}） 处理中（{{ inProcess }}） 已办结（{{
              closed }}）</span>
          </el-col>
        </el-row>
      </div>

      <!-- 查询条件部分 -->
      <div class="query-container">
        <el-row justify="space-between">
          <!-- 左侧容器：日期选择器和分类选择器 -->
          <el-col :span="10">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-date-picker v-model="dateRange" type="daterange" placeholder="全部时间" style="width: 100%" />
              </el-col>
              <el-col :span="12">
                <el-select v-model="mailCategory" placeholder="信箱分类" style="width: 100%">
                  <el-option label="类别1" value="category1" />
                  <el-option label="类别2" value="category2" />
                  <el-option label="类别3" value="category3" />
                </el-select>
              </el-col>
            </el-row>
          </el-col>

          <!-- 右侧容器：输入框和查询按钮 -->
          <el-col :span="7">
            <el-row :gutter="1" justify="end">
              <el-col :span="9">
                <el-input v-model="keyword" placeholder="请输入关键字" style="width: 100%" />
              </el-col>
              <el-col :span="6" class="text-right">
                <el-button type="primary" size="middle" @click="handleSearch">查询</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 表格部分 -->
    <div class="content">
      <el-table 
        :data="tableData" 
        style="width: 100%" 
        stripe 
        border 
        :header-cell-style="{ backgroundColor: '#f5f5f5', textAlign: 'center' }"
      >
        <el-table-column prop="id" label="信件编号" width="180" header-align="center" align="center" />
        <el-table-column prop="title" label="信件标题" header-align="center" align="center" />
        <el-table-column prop="appealType" label="诉求类型" width="120" header-align="center" align="center" />
        <el-table-column prop="writeTime" label="写信时间" width="180" header-align="center" align="center" />
        <el-table-column prop="closeTime" label="办结时间" width="180" header-align="center" align="center" />
        <el-table-column prop="department" label="处理人" width="100" header-align="center" align="center" />
        <el-table-column prop="status" label="处理状态" width="120" header-align="center" align="center" />
        <el-table-column label="操作" width="120" header-align="center" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div style="text-align: center; margin-top: 30px;">
        <el-pagination 
          @current-change="handlePageChange" 
          :page-size="pageSize" 
          :current-page="currentPage"
          :total="totalRecords" 
          layout="prev, pager, next, jumper" 
          background 
        />
      </div>
    </div>

    <!-- 在线咨询的弹窗 -->
    <el-dialog v-model="dialogVisible" title="在线咨询" width="40%" center>
      <el-form :model="consultationForm" label-width="120px">
        <!-- 投递信箱 -->
        <el-form-item label="投递信箱" required>
          <el-select v-model="consultationForm.mailbox" placeholder="请选择投递信箱" style="width: 100%">
            <el-option label="在线咨询" value="online" />
          </el-select>
        </el-form-item>

        <!-- 信件标题 -->
        <el-form-item label="信件标题" required>
          <el-input v-model="consultationForm.title" placeholder="请输入信件标题" />
        </el-form-item>

        <!-- 诉求类型 -->
        <el-form-item label="诉求类型" required>
          <el-select v-model="consultationForm.appealType" placeholder="请选择诉求类型" style="width: 100%">
            <el-option label="咨询" value="consult" />
            <el-option label="投诉" value="complaint" />
            <el-option label="建议" value="suggestion" />
            <el-option label="求助" value="help" />
          </el-select>
        </el-form-item>

        <!-- 信件分类 -->
        <el-form-item label="信件分类" required>
          <el-select v-model="consultationForm.category" placeholder="请选择信件分类" style="width: 100%">
            <el-option label="城市建设" value="construction" />
            <el-option label="环境保护" value="environment" />
            <el-option label="古树名木" value="traffic" />
            <el-option label="林业" value="education" />
          </el-select>
        </el-form-item>

        <!-- 是否接受公开 -->
        <el-form-item label="是否接受公开">
          <el-radio-group v-model="consultationForm.isPublic">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 是否接受部门联系 -->
        <el-form-item label="是否接受联系">
          <el-radio-group v-model="consultationForm.isContact">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 事发区域 -->
        <el-form-item label="事发区域">
          <el-input v-model="consultationForm.area" placeholder="在此输入街道、门牌号" />
        </el-form-item>

        <!-- 信件内容 -->
        <el-form-item label="信件内容" required>
          <el-input v-model="consultationForm.content" type="textarea" :rows="4" placeholder="请输入信件内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitConsultation">提交</el-button>
      </template>
    </el-dialog>

    <!-- 异常信息提交的弹窗 -->
    <el-dialog v-model="exceptionDialogVisible" title="异常信息提交" width="40%" center>
      <el-form :model="exceptionForm" label-width="120px">
        <!-- 异常类型 -->
        <el-form-item label="异常类型" required>
          <el-select v-model="exceptionForm.type" placeholder="请选择异常类型" style="width: 100%">
            <el-option label="系统崩溃" value="crash" />
            <el-option label="数据错误" value="dataError" />
            <el-option label="性能问题" value="performance" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <!-- 异常描述 -->
        <el-form-item label="异常描述" required>
          <el-input v-model="exceptionForm.description" type="textarea" :rows="4" placeholder="请输入异常描述" />
        </el-form-item>

        <!-- 发生时间 -->
        <el-form-item label="发生时间" required>
          <el-date-picker v-model="exceptionForm.time" type="datetime" placeholder="请选择发生时间" style="width: 100%" />
        </el-form-item>

        <!-- 是否需要处理 -->
        <el-form-item label="是否需要处理">
          <el-radio-group v-model="exceptionForm.needHandle">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 其他信息 -->
        <el-form-item label="其他信息">
          <el-input v-model="exceptionForm.otherInfo" placeholder="请输入其他相关信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="exceptionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitException">提交</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      totalRecords: 1, // 总记录数
      draft: 0, // 草稿数量
      pending: 0, // 待处理数量
      inProcess: 0, // 处理中数量
      closed: 1, // 已办结数量
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的记录数
      tableData: [
        {
          id: "2025011146402444",
          title: "对第七次南京市古树名木普查公示结果提出...",
          appealType: "咨询",
          writeTime: "2025-01-11 20:53",
          closeTime: "2025-01-16 15:12",
          department: "admin",
          status: "已办结"
        }
      ],
      dateRange: [], // 存储日期范围
      mailCategory: "", // 存储信箱分类
      keyword: "", // 存储关键字
      dialogVisible: false, // 控制在线咨询弹窗显示
      exceptionDialogVisible: false, // 控制异常信息弹窗显示
      consultationForm: {
        mailbox: "", // 投递信箱
        title: "", // 信件标题
        appealType: "", // 诉求类型
        category: "", // 信件分类
        isPublic: true, // 是否接受公开
        isContact: true, // 是否接受部门联系
        area: "", // 事发区域
        content: "" // 信件内容
      },
      exceptionForm: {
        title: "", // 异常标题
        type: "", // 异常类型
        description: "" // 异常描述
      }
    };
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
      console.log("当前页码:", page);
    },
    handleSearch() {
      console.log("查询条件 - 日期范围:", this.dateRange, " 信箱分类:", this.mailCategory, " 关键字:", this.keyword);
    },
    openConsultationDialog() {
      this.dialogVisible = true;
    },
    openExceptionDialog() {
      this.exceptionDialogVisible = true;
    },
    submitConsultation() {
      console.log("提交的表单内容:", this.consultationForm);
      this.dialogVisible = false;
      this.$message.success("信件提交成功！");
    },
    submitException() {
      if (!this.exceptionForm.title || !this.exceptionForm.type || !this.exceptionForm.description) {
        this.$message.warning("请填写完整的异常信息！");
        return;
      }
      console.log("提交的异常信息:", this.exceptionForm);
      this.exceptionDialogVisible = false;
      this.$message.success("异常信息提交成功！");
    }
  }
};
</script>

<style scoped>
.card-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.query-wrapper {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
}

.header {
  background-color: #f5f5f5;
  padding: 15px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.text-right {
  text-align: right;
}

.query-container {
  background-color: #ffffff;
  padding: 15px;
  margin-top: 0;
}

.content {
  padding: 20px;
}

.el-table {
  margin-bottom: 30px;
}

.el-pagination {
  margin-top: 30px;
}
</style>  