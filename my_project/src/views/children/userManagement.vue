<template>
    <div class="user-management">
        <!-- 用户列表控制部分 -->
        <div class="control-container">
            <!-- 添加用户按钮 -->
            <el-button type="primary" @click="addUser" icon="el-icon-plus">添加用户</el-button>

            <!-- 搜索框 -->
            <el-input v-model="searchQuery" placeholder="请输入用户名或邮箱进行搜索" prefix-icon="el-icon-search" clearable
                @input="handleSearch" style="width: 300px"></el-input>
        </div>

        <!-- 用户列表表格 -->
        <el-table :data="filteredUserData" stripe style="width: 100%">
            <el-table-column label="头像" width="100" align="center">
                <template #default="{ row }">
                    <img :src="row.user_avatar" alt="头像" class="user-avatar" />
                </template>
            </el-table-column>

            <el-table-column prop="user_id" label="用户ID" width="100" align="center"></el-table-column>
            <el-table-column prop="user_name" label="用户名" width="180" align="center"></el-table-column>
            <el-table-column prop="user_role" label="用户角色" width="180" align="center"></el-table-column>
            <el-table-column prop="user_email" label="用户邮箱" width="250" align="center"></el-table-column>

            <el-table-column prop="user_status" label="用户状态" width="150" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.user_status === 'active' ? 'success' : 'danger'" size="default">
                        {{ row.user_status === 'active' ? '激活' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="user_created" label="创建时间" width="180" align="center"></el-table-column>

            <el-table-column label="操作" width="400" align="center">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button @click="editUser(row)" size="small" type="primary">编辑</el-button>
                        <el-button @click="deleteUser(row)" size="small" type="danger">删除</el-button>
                        <el-button @click="assignRole(row)" size="small" type="info">分配角色</el-button>
                        <el-button @click="resetPassword(row)" size="small" type="warning">重置密码</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加用户弹窗 -->
        <el-dialog title="添加用户" v-model="addUserDialogVisible" width="400px">
            <el-form :model="newUser">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="newUser.user_name" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="newUser.user_email" />
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="newUser.user_role" placeholder="请选择角色">
                        <el-option label="Admin" value="admin" />
                        <el-option label="Expert" value="expert" />
                        <el-option label="Guest" value="guest" />
                    </el-select>
                </el-form-item>

                <!-- 用户头像上传 -->
                <el-form-item label="用户头像" :label-width="formLabelWidth">
                    <el-upload class="upload-demo" drag action="" :on-change="handleAvatarChange"
                        :before-upload="beforeAvatarUpload" :show-file-list="false">
                        <i class="el-icon-plus"></i>
                        <div class="el-upload__text">点击上传头像</div>
                    </el-upload>
                    <div v-if="newUser.user_avatar" class="avatar-preview">
                        <img :src="newUser.user_avatar" alt="头像预览" class="avatar-img" />
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewUser">保存</el-button>
            </span>
        </el-dialog>

        <!-- 编辑用户弹窗 -->
        <el-dialog title="编辑用户" v-model="editUserDialogVisible" width="400px">
            <el-form :model="currentUser">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input v-model="currentUser.user_name" />
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="currentUser.user_email" />
                </el-form-item>
                
                <!-- 增加状态选择 -->
                <el-form-item label="用户状态" :label-width="formLabelWidth">
                    <el-select v-model="currentUser.user_status" placeholder="请选择状态">
                        <el-option label="激活" value="active" />
                        <el-option label="禁用" value="inactive" />
                    </el-select>
                </el-form-item>

                <!-- 用户头像上传 -->
                <el-form-item label="用户头像" :label-width="formLabelWidth">                    
                    <div v-if="currentUser.user_avatar" class="avatar-preview">
                        <img :src="currentUser.user_avatar" alt="头像预览" class="avatar-img" />
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveUserEdit">保存</el-button>
            </span>
        </el-dialog>


        <!-- 删除用户弹窗 -->
        <el-dialog title="删除用户" v-model="deleteUserDialogVisible" width="400px">
            <p>您确定要删除此用户吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteUserDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteUserAction">删除</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色弹窗 -->
        <el-dialog title="分配角色" v-model="roleDialogVisible" width="400px">
            <el-form :model="currentUser">
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="selectedRole" placeholder="请选择角色">
                        <el-option label="Admin" value="admin" />
                        <el-option label="Expert" value="expert" />
                        <el-option label="Guest" value="guest" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="roleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveRole">保存</el-button>
            </span>
        </el-dialog>

        <!-- 重置密码弹窗 -->
        <el-dialog title="重置密码" v-model="resetPasswordDialogVisible" width="400px">
            <p>您确定要重置该用户的密码吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetPasswordDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="resetPasswordAction">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'UserManagement',
    data() {
        return {
            userData: [
                {
                    user_id: 1,
                    user_name: 'ADMIN',
                    user_avatar: '/images/3.jpg',
                    user_role: 'admin',
                    user_email: 'zhangsan@example.com',
                    user_status: 'active',
                    user_created: '2023-06-01 12:05:47',
                },
                {
                    user_id: 2,
                    user_name: 't2',
                    user_avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
                    user_role: 'expert',
                    user_email: 'lisi@example.com',
                    user_status: 'inactive',
                    user_created: '2023-09-15 14:30:34',
                },
                {
                    user_id: 3,
                    user_name: 't3',
                    user_avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
                    user_role: 'guest',
                    user_email: 'wangwu@example.com',
                    user_status: 'active',
                    user_created: '2024-03-10 23:45:17',
                },
                {
                    user_id: 4,
                    user_name: 't4',
                    user_avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                    user_role: 'admin',
                    user_email: 'zhaoliu@example.com',
                    user_status: 'active',
                    user_created: '2024-01-20 10:15:24',
                },
                {
                    user_id: 5,
                    user_name: 't5',
                    user_avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                    user_role: 'expert',
                    user_email: 'sunqi@example.com',
                    user_status: 'inactive',
                    user_created: '2025-02-15 20:51:53',
                }
            ],
            roleDialogVisible: false,
            resetPasswordDialogVisible: false,
            editUserDialogVisible: false,
            deleteUserDialogVisible: false,
            addUserDialogVisible: false,
            searchQuery: '',
            currentUser: {},
            selectedRole: '',
            newUser: {
                user_name: '',
                user_email: '',
                user_role: ''
            },
            formLabelWidth: '100px',
        };
    },
    computed: {
        filteredUserData() {
            return this.userData.filter(user => {
                return (
                    user.user_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    user.user_email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
    },
    methods: {
        // 处理头像更改
        handleAvatarChange(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.newUser.user_avatar = reader.result; // 存储图片的 base64 数据
            };
            reader.readAsDataURL(file.raw);
        },

        // 限制上传的图片类型和大小
        beforeAvatarUpload(file) {
            const isImage = file.type.startsWith('image/');
            const isLt2M = file.size / 1024 / 1024 < 2; // 限制文件大小 2MB

            if (!isImage) {
                this.$message.error('只能上传图片文件');
            }
            if (!isLt2M) {
                this.$message.error('图片大小不能超过 2MB');
            }
            return isImage && isLt2M;
        },
        addUser() {
            this.addUserDialogVisible = true;
        },
        editUser(row) {
            this.currentUser = { ...row };
            this.editUserDialogVisible = true;
        },
        deleteUser(row) {
            this.selectedUser = row;
            this.deleteUserDialogVisible = true;
        },
        assignRole(row) {
            this.currentUser = { ...row };
            this.selectedRole = row.user_role;
            this.roleDialogVisible = true;
        },
        resetPassword(row) {
            this.selectedUser = row;
            this.resetPasswordDialogVisible = true;
        },
        saveNewUser() {
            // 将新用户添加到前端数据中
            this.userData.push({ ...this.newUser, user_id: this.userData.length + 1, user_status: 'active', user_created: new Date().toISOString() });
            this.addUserDialogVisible = false; // 关闭弹窗
            this.newUser = { user_name: '', user_email: '', user_role: '' }; // 清空表单数据
        },
        saveUserEdit() {
            const index = this.userData.findIndex(user => user.user_id === this.currentUser.user_id);
            if (index !== -1) {
                // 更新用户信息
                this.userData[index] = { ...this.currentUser };
            }
            this.editUserDialogVisible = false; // 关闭弹窗
        },
        deleteUserAction() {
            const index = this.userData.findIndex(user => user.user_id === this.selectedUser.user_id);
            if (index !== -1) {
                this.userData.splice(index, 1); // 删除用户
            }
            this.deleteUserDialogVisible = false; // 关闭弹窗
        },
        saveRole() {
            this.currentUser.user_role = this.selectedRole; // 更新角色
            const index = this.userData.findIndex(user => user.user_id === this.currentUser.user_id);
            if (index !== -1) {
                this.userData[index] = { ...this.currentUser }; // 保存更新后的角色
            }
            this.roleDialogVisible = false; // 关闭弹窗
        },

        resetPasswordAction() {
            // 模拟重置密码操作
            this.resetPasswordDialogVisible = false; // 关闭弹窗
            this.$message.success('密码已重置'); // 提示用户
        },

        handleSearch() {
            this.filteredUserData = this.userData.filter(user => {
                return (
                    user.user_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    user.user_email.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },

    },
};
</script>

<style scoped>
.avatar-preview {
    margin-top: 10px;
}

.avatar-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.user-management {
    padding: 20px;
}

.control-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.dialog-footer {
    text-align: right;
}
</style>