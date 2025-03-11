<template>
  <el-card class="card-container">
    <!-- 用户列表标题 -->
    <el-row class="title-row" style="margin-bottom: 20px;">
      <el-col :span="24">
        <h2>咨询列表</h2>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <el-row style="margin-bottom: 20px;" gutter="20">
      <el-col :span="5">
        <el-input v-model="searchText" placeholder="搜索信件编号或标题" prefix-icon="el-icon-search" clearable></el-input>
      </el-col>
      <el-col :span="5">
        <el-select v-model="selectedAppealType" placeholder="选择诉求类型" clearable>
          <el-option label="所有" value=""></el-option>
          <el-option label="咨询" value="咨询"></el-option>
          <el-option label="建议" value="建议"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期范围"></el-date-picker>
      </el-col>
      <el-col :span="5">
        <el-select v-model="selectedStatus" placeholder="选择处理状态" clearable>
          <el-option label="所有" value=""></el-option>
          <el-option label="待回复" value="待回复"></el-option>
          <el-option label="已回复" value="已回复"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-col>
    </el-row>

    <!-- 咨询列表 -->
    <div class="consultation-list">
      <el-table :data="filteredConsultationList" style="width: 100%" stripe border
        :header-cell-style="{ backgroundColor: '#f5f5f5', textAlign: 'center' }" @row-click="handleRowClick">
        <el-table-column prop="id" label="信件编号" width="180" header-align="center" align="center" sortable />
        <el-table-column prop="title" label="信件标题" header-align="center" align="center" sortable />
        <el-table-column prop="consultant" label="咨询人" width="120" header-align="center" align="center" sortable />
        <el-table-column prop="appealType" label="诉求类型" width="120" header-align="center" align="center" sortable />
        <el-table-column prop="writeTime" label="写信时间" width="180" header-align="center" align="center" sortable />
        <el-table-column prop="status" label="处理状态" width="120" header-align="center" align="center" sortable />
        <el-table-column prop="replyContent" label="专家回复" width="200" header-align="center" align="center" />
        <el-table-column label="操作" width="120" header-align="center" align="center">
          <template v-slot="scope">
            <el-button type="text" size="small" @click="handleReply(scope.row)">回复</el-button>
            <el-button type="text" size="small" @click="handleHistory(scope.row, $event)">历史记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination :page-size="pageSize" :current-page="currentPage" :total="consultationList.length"
        layout="prev, pager, next" @current-change="handlePageChange" style="text-align: center; margin-top: 20px;">
      </el-pagination>
    </div>

    <!-- 回复弹窗 -->
    <el-dialog v-model="replyDialogVisible" title="专家回复" width="50%" center>
      <el-form :model="replyForm" label-width="100px">
        <!-- 咨询内容 -->
        <el-form-item label="信件标题">
          <el-input v-model="selectedConsultation.title" disabled />
        </el-form-item>
        <el-form-item label="咨询人">
          <el-input v-model="selectedConsultation.consultant" disabled />
        </el-form-item>
        <el-form-item label="诉求类型">
          <el-input v-model="selectedConsultation.appealType" disabled />
        </el-form-item>
        <el-form-item label="信件内容">
          <el-input v-model="selectedConsultation.content" type="textarea" :rows="4" disabled />
        </el-form-item>

        <!-- 回复内容 -->
        <el-form-item label="回复内容" required>
          <el-input v-model="replyForm.content" type="textarea" :rows="6" placeholder="请输入回复内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReply">提交回复</el-button>
      </template>
    </el-dialog>

    <!-- 历史记录弹窗 -->
    <el-dialog v-model="historyDialogVisible" title="历史回复记录" width="50%" center @close="handleHistoryClose">
      <el-card v-for="(reply, index) in selectedConsultation.historyReplies" :key="index" class="reply-card">
        <p><strong>回复时间：</strong>{{ reply.time }}</p>
        <p><strong>回复内容：</strong>{{ reply.content }}</p>
      </el-card>
      <template #footer>
        <el-button @click="historyDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      consultationList: [
        {
          id: "2025011146402444",
          title: "对第七次南京市古树名木普查公示结果提出...",
          consultant: "t3",
          appealType: "咨询",
          writeTime: "2025-01-11 20:53",
          status: "已回复",
          content: "请问古树名木的普查结果何时公示？",
          replyContent: "收到来信，请耐心等待，保持关注。",
          historyReplies: [{ time: "2025-01-12 11:00", content: "感谢您的建议，我们会加强古树名木的保护工作。" }]
        },
        {
          id: "2025011146402445",
          title: "关于古树名木保护的建议",
          consultant: "t4",
          appealType: "建议",
          writeTime: "2025-01-12 10:30",
          status: "未回复",
          content: "建议加强对古树名木的保护措施，定期检查健康状况。",
          replyContent: "",
          historyReplies: []
        }
      ],
      searchText: '',
      selectedAppealType: '',
      selectedStatus: '',
      dateRange: [],
      currentPage: 1,
      pageSize: 5,
      selectedConsultation: {},
      replyDialogVisible: false,
      historyDialogVisible: false,
      replyForm: { content: "" }
    };
  },
  computed: {
    filteredConsultationList() {
      return this.consultationList.filter(item => {
        const matchesText = item.id.includes(this.searchText) || item.title.includes(this.searchText);
        const matchesType = this.selectedAppealType ? item.appealType === this.selectedAppealType : true;
        const matchesStatus = this.selectedStatus ? item.status === this.selectedStatus : true;
        const matchesDateRange = this.dateRange.length === 0 || (
          new Date(item.writeTime) >= new Date(this.dateRange[0]) &&
          new Date(item.writeTime) <= new Date(this.dateRange[1])
        );
        return matchesText && matchesType && matchesStatus && matchesDateRange;
      });
    }
  },
  methods: {
    handleRowClick(row) {
      this.selectedConsultation = { ...row };
      this.replyDialogVisible = true;
    },
    handleReply(row) {
      this.selectedConsultation = { ...row };
      this.replyDialogVisible = true;
    },
    submitReply() {
      if (!this.replyForm.content) {
        this.$message.warning("请填写回复内容！");
        return;
      }

      // 更新回复内容
      const index = this.consultationList.findIndex(item => item.id === this.selectedConsultation.id);
      if (index !== -1) {
        this.consultationList[index].status = "已回复";
        this.consultationList[index].replyContent = this.replyForm.content;
        this.consultationList[index].historyReplies.push({
          time: new Date().toLocaleString(),
          content: this.replyForm.content
        });
      }

      this.replyDialogVisible = false;
      this.replyForm.content = "";
      this.$message.success("回复成功！");
    },
    handleHistory(row, event) {
      this.selectedConsultation = { ...row };
      this.historyDialogVisible = true;

      // 阻止冒泡事件，以防止点击历史记录时触发其他点击事件
      event.stopPropagation();
    },
    handleHistoryClose() {
      this.historyDialogVisible = false;
    },
    handleSearch() {
      // 搜索和筛选会自动应用，计算属性会处理
    },
    handlePageChange(page) {
      this.currentPage = page;
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

.title-row {
  margin-bottom: 20px;
}

.consultation-list {
  margin-bottom: 20px;
}

.el-table {
  margin-bottom: 30px;
}

.el-dialog {
  border-radius: 10px;
}

.el-form-item {
  margin-bottom: 20px;
}

.reply-card {
  margin-bottom: 10px;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}
</style>