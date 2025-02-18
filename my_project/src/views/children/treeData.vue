<script>
import axios from 'axios'
let _fileObject
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        id: "",
        name: "",
        families: "",
        area: "",
        location: "",
        age: "",
        bustline: "",
        crown: "",
        height: "",
        rank: ""
      },
      hhh: [],
      rules: {
        id: [
          { required: true, message: "Please input Activity name", trigger: "blur" },
          { min: 0, max: 10, message: "Length should be 0 to 10", trigger: "blur" },
          { validator: this.checkUsername, trigger: 'blur', },
        ],
      },
      tableData: [
        {
          name: "孙悟空",
          age: 18,
          gender: "男",
          srcList: [
            '/TreeImg/tree6.png',
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
          ]
        },
        {
          name: "猪八戒",
          age: 28,
          gender: "男",
          srcList: [
            '/TreeImg/tree2.png',
            '/TreeImg/tree1.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "沙和尚",
          age: 38,
          gender: "男",
          srcList: [
            '/TreeImg/tree3.png',
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "唐僧",
          age: 8,
          gender: "男",
          srcList: [
            '/TreeImg/tree5.png',
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "唐僧",
          age: 8,
          gender: "男",
          srcList: [
            '/TreeImg/tree4.png',
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "唐僧",
          age: 8,
          gender: "男",
          srcList: [
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "唐僧",
          age: 8,
          gender: "男",
          srcList: [
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
        {
          name: "唐僧",
          age: 8,
          gender: "男",
          srcList: [
            '/TreeImg/tree1.png',
            '/TreeImg/tree2.png',
            '/TreeImg/tree3.png',
            '/TreeImg/tree4.png',
            '/TreeImg/tree5.png',
            '/TreeImg/tree6.png',
          ]
        },
      ],
      index: null,
      oldid: null,
      totalPage: 0,
      rightSearchId: "",
      idarr: [],
      fileList: []
    };
  },
  mounted() {
    this.start()
    setTimeout(() => {
      this.updatatable()
    }, 1000);
  },
  methods: {
    // 表单rules检查用户名是否存在
    checkUsername(rule, value, callback) {
      if (this.index === null) {
        let num = []
        for (const element of this.hhh) {
          num.push(element.id)
        }
        if (num.includes(value)) {
          callback(new Error("你输入的已经有了哎！"))
        } else {
          callback()
        }
      } else {
        let num2 = []
        for (const element of this.hhh) {
          num2.push(element.id)
        }
        num2.splice(this.index, 1)
        if (num2.includes(value)) {
          callback(new Error("你输入的已经有了哎！"))
        } else {
          callback()
        }
      }
      callback()
    },

    // 更新数据库的所有index1 ，index2 
    updatatable() {
      const idarr = this.idarr
      axios({
        method: "post",
        url: 'http://localhost:4000/updtable',
        data: idarr
      }).then((res) => {
      })
    },
    // 初试化信息
    start() {
      // 请求数据库中所有数据
      axios({
        method: "get",
        url: 'http://localhost:4000/user',
        data: {}
      }).then((res) => {
        this.hhh = res.data
        // console.log(this.hhh);
        this.hhh.forEach(element => this.idarr.push(element.id)
        )
      })

    },
    // 添加按钮打开的对话框里的文件状态
    fileChange(file) {
      console.log(file.raw);
      _fileObject = file.raw
    },
    // 最上面的添加按钮
    add() {
      this.dialogVisible = true;
      this.index = null;
      // this.updatatable()
    },
    // 点击add按钮后的确定按钮
    submit() {
      const feature = {
        "type": "Feature",
        "properties": {
          "id": this.form.id,
          "name": this.form.name,
          "families": this.form.families,
          "area": this.form.area,
          "location": this.form.location,
          "age": this.form.age,
          "bustline": this.form.bustline,
          "crown": this.form.crown,
          "height": this.form.height,
          "rank": this.form.rank,
        }
      }
      let _formData = new FormData()
      _formData.append("file", _fileObject)
      _formData.append("id", JSON.stringify(feature))
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: 'http://localhost:4000/add',
            data: _formData
          }).then((res) => {
            this.hhh = res.data
            console.log(this.form.id);
            this.resetForm();
            this.$message({
              type: "success",
              message: "添加成功",
            })
          })
        }
      });
    },
    // 点击edit后的确定按钮
    editSubmit() {
      const editSubmitArr = {
        "oldid": this.oldid,
        "properties": {
          "id": this.form.id,
          "name": this.form.name,
          "families": this.form.families,
          "area": this.form.area,
          "location": this.form.location,
          "age": this.form.age,
          "bustline": this.form.bustline,
          "crown": this.form.crown,
          "height": this.form.height,
          "rank": this.form.rank,
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url: 'http://localhost:4000/upd',
            data: editSubmitArr
          }).then((res) => {
            this.hhh = res.data
          })

          this.resetForm();
        }
      });
    },
    // 重置form表单
    resetForm() {
      this.form.id = "";
      this.form.name = "";
      this.form.families = "";
      this.form.area = "";
      this.form.location = "";
      this.form.age = "";
      this.form.bustline = "";
      this.form.crown = "";
      this.form.height = "";
      this.form.rank = "";
      this.dialogVisible = false;
      this.fileList = []
    },
    // tableEdit 按钮
    handleEdit(item) {
      this.dialogVisible = true;
      this.form.id = item.row.id
      this.form.name = item.row.name
      this.form.families = item.row.families
      this.form.area = item.row.area
      this.form.location = item.row.location
      this.form.age = item.row.age
      this.form.bustline = item.row.bustline
      this.form.crown = item.row.crown
      this.form.height = item.row.height
      this.form.rank = item.row.rank
      this.index = item.$index;
      this.oldid = item.row.id
      this.fileList.push({ url: "http://localhost:4000/" + item.row.src })
      console.log(item.row.src);
    },
    // tableDelete 按钮
    handleDelete(item) {
      const id = item.row.id
      console.log(item.row.id);
      this.$confirm("你确定要删除吗？", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
          method: "post",
          url: 'http://localhost:4000/del',
          data: { id }
        }).then((res) => {
          this.hhh = res.data
        })
        this.$message({
          type: "success",
          message: "删除成功",
        });
      })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消删除",
          });
        });
    },
    // 右侧搜索按钮
    search() {
      const rightSearchId = this.rightSearchId
      axios({
        method: "post",
        url: 'http://localhost:4000/search',
        data: { rightSearchId }
      }).then((res) => {
        this.hhh = res.data
        console.log(res.data);
      })
    },


  },
};

</script>

<template>
  <div class="userHeader">
    <!-- 左边添加按钮 -->
    <el-button type="primary" @click="add()">
      添加
    </el-button>

    <!-- 右侧search Form -->
    <el-form :inline="true" class="rightForm">
      <el-form-item>
        <el-input v-model="rightSearchId" :clearable="true" @clear="start()" placeholder="查询挂牌号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search"> 搜索 </el-button>
      </el-form-item>
    </el-form>
  </div>

  <div class="userContent">
    <!-- 表格table -->
    <el-table style="width: 100%" :data=hhh height="100%" stripe>
      <el-table-column prop="id" label="挂牌号" width="90" align="center" />
      <el-table-column prop="name" label="树名" width="125" align="center" />
      <el-table-column prop="families" label="科属" width="170" align="center" />
      <el-table-column prop="area" label="区属" width="90" align="center" />
      <el-table-column prop="location" label="地址(位置)" width="280" align="center" />
      <el-table-column prop="age" label="树龄(年)" width="110" sortable align="center" />
      <el-table-column prop="bustline" label="胸围(厘米)" width="100" align="center" />
      <el-table-column prop="crown" label="冠幅(米)" width="100" align="center" />
      <el-table-column prop="height" label="树高(米)" width="100" align="center" />
      <el-table-column prop="rank" label="等级" width="90" sortable align="center" />
      <!-- <el-table-column label="缩略图" width="220">
        <template #default="scope">
          <el-image style="width: 70px; height: 70px" :src="scope.row.srcList[0]" :zoom-rate="1.2"
            :preview-src-list="scope.row.srcList" :initial-index="4" fit="cover" :preview-teleported="true" />
        </template>
</el-table-column> -->
      <el-table-column label="图片" width="180" align="center">
        <template #default="scope">
          <el-image style="width: 70px; height: 70px" :src="'http://localhost:4000/' + scope.row.src"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <!--填写用户form信息弹窗 -->
    <el-dialog v-model="dialogVisible" title="南京市古树名木" width="800" :before-close="resetForm">
      <el-form :model="form" label-width="120px" :rules="rules" ref="form" :inline="true">
        <el-form-item label="挂牌号" prop="id">
          <el-input v-model="form.id"></el-input>
        </el-form-item>

        <el-form-item label="树名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="科属">
          <el-input v-model="form.families"></el-input>
        </el-form-item>

        <el-form-item label="区域">
          <el-input v-model="form.area"></el-input>
        </el-form-item>

        <el-form-item label="地址(位置)">
          <el-input v-model="form.location"></el-input>
        </el-form-item>

        <el-form-item label="树龄(年)">
          <el-input v-model="form.age"></el-input>
        </el-form-item>

        <el-form-item label="胸围(厘米)">
          <el-input v-model="form.bustline"></el-input>
        </el-form-item>

        <el-form-item label="冠幅(米)">
          <el-input v-model="form.crown"></el-input>
        </el-form-item>

        <el-form-item label="树高(米)">
          <el-input v-model="form.height"></el-input>
        </el-form-item>

        <el-form-item label="等级">
          <el-input v-model="form.rank"></el-input>
        </el-form-item>

        <el-form-item label="Add Picture">
          <el-upload action="" list-type="picture-card" :file-list="fileList" :on-change="fileChange"
            :http-request="submit" :auto-upload="false">
            <i class="ri-add-line"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm()">取消</el-button>
          <el-button type="primary" @click="index === null ? submit() : editSubmit()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>

  <!-- <div class="nextPage">
    <el-pagination background layout="prev, pager, next" :total="tableData.length" :page-size="1" />
  </div> -->
</template>



<style scoped>
.userContent {
  height: 79%;
}

.userHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 8%;
}

.rightForm {
  position: relative;
  top: 10px;
}

.nextPage {
  display: flex;
  height: 8%;
  /* align-items: center; */
  justify-content: right;
}
</style>