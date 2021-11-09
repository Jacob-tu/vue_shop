<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCategoryKeys"
            :options="categoryList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- Tab标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addParamsDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="静态属性"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + dialogTitle"
      :visible.sync="addParamsDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      :title="'修改' + dialogTitle"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      selectedCategoryKeys: [],
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addParamsDialogVisible: false,
      addForm: { attr_name: "" },
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false,
      editForm: { attr_name: "" },
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    isBtnDisabled() {
      return this.selectedCategoryKeys.length !== 3 ? true : false;
    },
    categoryId() {
      return this.selectedCategoryKeys.length === 3
        ? this.selectedCategoryKeys[2]
        : null;
    },
    dialogTitle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
  methods: {
    getCategoryList() {
      this.$api.category
        .getCategoryList()
        .then((res) => {
          this.categoryList = res.data;
        })
        .catch((err) => err);
    },
    getParamsList() {
      if (this.selectedCategoryKeys.length !== 3) {
        this.selectedCategoryKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }
      this.$api.params
        .getParamsList(this.categoryId, {
          sel: this.activeName,
        })
        .then((res) => {
          res.data.forEach((item) => {
            item.inputVisible = false;
            item.inputValue = "";
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
          });
          if (this.activeName === "many") {
            this.manyTableData = res.data;
          } else {
            this.onlyTableData = res.data;
          }
        })
        .catch((err) => err);
    },
    // 级联选择框选中项变化的处理函数
    handleChange() {
      this.getParamsList();
    },
    // Tab标签页切换的处理函数
    handleClick() {
      this.getParamsList();
    },
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        this.$api.params
          .addParams(this.categoryId, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          .then((res) => {
            this.$message.success("添加成功！");
            this.addParamsDialogVisible = false;
            this.getParamsList();
          })
          .catch((err) => err);
      });
    },
    showEditDialog(attr_id) {
      this.$api.params
        .getParamsById(this.categoryId, attr_id, {
          attr_sel: this.activeName,
        })
        .then((res) => {
          this.editForm = res.data;
          this.editDialogVisible = true;
        });
    },
    editParams() {
      this.$api.params
        .editParams(this.categoryId, this.editForm.attr_id, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        })
        .then((res) => {
          this.editDialogVisible = false;
          this.$message.success("修改成功！");
          this.getParamsList();
        })
        .catch((err) => err);
    },
    async deleteParams(attr_id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      this.$api.params.deleteParams(this.categoryId, attr_id).then((res) => {
        this.$message.success("删除成功！");
        this.getParamsList();
      });
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.$api.params
        .editParams(this.categoryId, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {})
        .catch((err) => err);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.$api.params
        .editParams(this.categoryId, row.attr_id, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {})
        .catch((err) => err);
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.input-new-tag {
  width: 150px;
}
</style>
