<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
              {{ scope.row }}
            </pre>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名称">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        :props="rightsProps"
        show-checkbox
        node-key="id"
        default-expand-all
        highlight-current
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //所有角色列表数据
      rolesList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      editForm: {},
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      setRightDialogVisible: false,
      rightsList: [],
      rightsProps: {
        label: "authName",
        children: "children",
      },
      defKeys: [],
      roleId: "", // 分配权限的角色id
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      await this.$api.roles
        .getRolesList()
        .then((res) => {
          this.rolesList = res.data;
        })
        .catch((err) => err);
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户的对话框
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) this.$message.error("添加用户失败！");
        this.$message.success("添加用户成功！");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 修改用户信息的对话框
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) this.$message.error("查询角色信息失败！");
      this.editForm = res.data;
    },
    // 监听修改用户信息对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改角色信息并提交
    async editRoleInfo() {
      // const { data: res } = await this.$http.put("roles/"+
      // this.editForm.roleId,this.editForm);
      // console.log(res);

      //从角色信息开始使用封装过的axios
      this.$api.roles
        .editRole(this.editForm.roleId, this.editForm)
        .then((res) => {
          // 关闭对话框、刷新用户数据、提示修改成功
          this.$message.success(res.meta.msg);
          this.editDialogVisible = false;
          this.getRolesList();
        })
        .catch((err) => err);
    },
    // 根据id删除角色信息
    async removeRoleById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      await this.$api.roles
        .deleteRole(id)
        .then((res) => {
          this.$message.success(res.meta.msg);
        })
        .catch((err) => err);
      this.getRolesList();
    },
    // 根据id删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      await this.$api.roles
        .deleteRight(role.id, rightId)
        .then((res) => {
          role.children = res.data;
          this.$message.success(res.meta.msg);
        })
        .catch((err) => err);
      // this.getRolesList();
    },
    // 给角色分配权限
    async showSetRightDialog(role) {
      this.$api.roles
        .getRightsList()
        .then((res) => {
          this.rightsList = res.data;
          this.setRightDialogVisible = true;
          this.defKeys = [];
          this.getDefKeys(role, this.defKeys);
          this.roleId = role.id;
        })
        .catch((err) => err);
    },
    // 得到defKeys数组
    getDefKeys(node, arr) {
      if (!node.children) {
        arr.push(node.id);
      } else {
        node.children.forEach((item) => {
          this.getDefKeys(item, arr);
        });
      }
    },
    // 分配权限
    allotRight() {
      var checkNode = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      var rids = checkNode.join(",");
      console.log(this.roleId,rids);
      this.$api.roles
        .allotRight(this.roleId, rids)
        .then((res) => {
          this.$message.success("分配权限成功！")
          this.getRolesList();
        })
        .catch((err) => err);
      this.setRightDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
  margin-left: 30px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
