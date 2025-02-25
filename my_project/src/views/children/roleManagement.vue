<template>
    <div class="role-management">
        <!-- 角色列表控制部分 -->
        <div class="control-container">
            <!-- 添加角色按钮 -->
            <el-button type="primary" @click="addRole" icon="el-icon-plus">添加角色</el-button>

            <!-- 搜索框 -->
            <div class="search-container">
                <el-input v-model="searchQuery" placeholder="请输入角色名称或描述进行搜索" prefix-icon="el-icon-search" clearable
                    @input="handleSearch" style="width: 300px"></el-input>
            </div>
        </div>

        <!-- 角色列表表格 -->
        <el-table :data="filteredRoleData" stripe style="width: 100%">
            <el-table-column label="名称" prop="role_name" width="180" align="center"></el-table-column>
            <el-table-column label="唯一编码" prop="role_code" width="180" align="center"></el-table-column>
            <el-table-column label="描述" prop="role_description" width="300" align="center"></el-table-column>

            <el-table-column label="状态" prop="role_status" width="150" align="center">
                <template #default="{ row }">
                    <el-tag :type="row.role_status === 'active' ? 'success' : 'danger'" size="default">
                        {{ row.role_status === 'active' ? '激活' : '禁用' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="350" align="center">
                <template #default="{ row }">
                    <el-button-group>
                        <el-button @click="assignPermissions(row)" size="small" type="info"
                            style="margin-right: 10px">分配权限</el-button>
                        <el-button @click="editRole(row)" size="small" type="primary"
                            style="margin-right: 10px">编辑</el-button>
                        <el-button @click="deleteRole(row)" size="small" type="danger">删除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加角色弹窗 -->
        <el-dialog title="添加角色" v-model="addRoleDialogVisible" width="400px">
            <el-form :model="newRole">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="newRole.role_name" />
                </el-form-item>
                <el-form-item label="唯一编码" :label-width="formLabelWidth">
                    <el-input v-model="newRole.role_code" />
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="newRole.role_description" />
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="newRole.role_status" placeholder="请选择状态">
                        <el-option label="激活" value="active" />
                        <el-option label="禁用" value="inactive" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveNewRole">保存</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色弹窗 -->
        <el-dialog title="编辑角色" v-model="editRoleDialogVisible" width="400px">
            <el-form :model="currentRole">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input v-model="currentRole.role_name" />
                </el-form-item>
                <el-form-item label="唯一编码" :label-width="formLabelWidth">
                    <el-input v-model="currentRole.role_code" />
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input v-model="currentRole.role_description" />
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="currentRole.role_status" placeholder="请选择状态">
                        <el-option label="激活" value="active" />
                        <el-option label="禁用" value="inactive" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveRoleEdit">保存</el-button>
            </span>
        </el-dialog>

        <!-- 删除角色弹窗 -->
        <el-dialog title="删除角色" v-model="deleteRoleDialogVisible" width="400px">
            <p>您确定要删除此角色吗？</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRoleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteRoleAction">删除</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限弹窗 -->
        <el-dialog title="分配权限" v-model="permissionsDialogVisible" width="500px">
            <el-tree :data="permissionData" show-checkbox node-key="id" :default-checked-keys="currentRole.permissions"
                :props="treeProps"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="permissionsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="savePermissions">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'RoleManagement',
    data() {
        return {
            roleData: [
                { role_name: 'Admin', role_code: '001', role_description: '管理员角色，拥有最高权限。', role_status: 'active', permissions: ['1', '2','3','4','5','6'] },
                { role_name: 'Expert', role_code: '002', role_description: '专家角色，拥有回复权限', role_status: 'inactive', permissions: ['1'] },
                { role_name: 'User', role_code: '003', role_description: '普通用户，只有查看基本信息的权限', role_status: 'active', permissions: ['2'] },
            ],
            permissionData: [
                {
                    id: '1',
                    label: '数据管理',
                    children: [
                        { id: '1-1', label: '添加数据' },
                        { id: '1-2', label: '删除数据' },
                        { id: '1-3', label: '修改数据' },
                        { id: '1-4', label: '查看数据' },
                    ],
                },
                {
                    id: '2',
                    label: '用户管理',
                    children: [
                        { id: '2-1', label: '添加用户' },
                        { id: '2-2', label: '删除用户' },
                        { id: '2-3', label: '修改用户' },
                        { id: '2-4', label: '查询用户' },
                        { id: '2-5', label: '重置密码' },
                    ],
                },
                {
                    id: '3',
                    label: '地图管理',
                    
                },
                {
                    id: '4',
                    label: '留言管理',
                    
                },
                {
                    id: '5',
                    label: '专家诊断信息管理',                    
                },
                {
                    id: '6',
                    label: '风采展示管理',                    
                },
            ],
            treeProps: {
                children: 'children',
                label: 'label',
            },
            searchQuery: '',
            addRoleDialogVisible: false,
            editRoleDialogVisible: false,
            deleteRoleDialogVisible: false,
            permissionsDialogVisible: false,
            formLabelWidth: '100px',
            currentRole: {},
            newRole: {
                role_name: '',
                role_code: '',
                role_description: '',
                role_status: 'active',
                permissions: [],
            },
        };
    },
    computed: {
        filteredRoleData() {
            return this.roleData.filter(role => {
                return (
                    role.role_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    role.role_description.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            });
        },
    },
    methods: {
        addRole() {
            this.addRoleDialogVisible = true;
        },
        saveNewRole() {
            this.roleData.push({ ...this.newRole });
            this.addRoleDialogVisible = false;
        },
        editRole(row) {
            this.currentRole = { ...row };
            this.editRoleDialogVisible = true;
        },
        saveRoleEdit() {
            const index = this.roleData.findIndex(role => role.role_code === this.currentRole.role_code);
            if (index !== -1) {
                this.$set(this.roleData, index, { ...this.currentRole });
            }
            this.editRoleDialogVisible = false;
        },
        deleteRole(row) {
            this.currentRole = { ...row };
            this.deleteRoleDialogVisible = true;
        },
        deleteRoleAction() {
            const index = this.roleData.findIndex(role => role.role_code === this.currentRole.role_code);
            if (index !== -1) {
                this.roleData.splice(index, 1);
            }
            this.deleteRoleDialogVisible = false;
        },
        assignPermissions(row) {
            this.currentRole = { ...row };
            this.permissionsDialogVisible = true;
        },
        savePermissions() {
            this.currentRole.permissions = this.$refs.tree.getCheckedKeys();
            this.permissionsDialogVisible = false;
        },
        handleSearch() {
            // 搜索逻辑处理
        },
    },
};
</script>

<style scoped>
.role-management {
    padding: 20px;
}

.control-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.search-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.dialog-footer {
    text-align: center;
}

.el-tag {
    font-size: 12px;
}
</style>