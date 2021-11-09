<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCategoryDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green;"
          ></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0"
            >一级</el-tag
          >
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditCategoryDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCategory(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="添加分类"
        :visible.sync="addCategoryDialogVisible"
        width="50%"
        @close="addCategoryDialogClose"
      >
        <el-form
          :model="addCategoryForm"
          :rules="addCategoryRules"
          ref="addCategoryFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCategoryForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              class="el-cascader"
              v-model="selectedKeys"
              :options="parentCategoryList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true,
              }"
              @change="parentCategoryChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCategory">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑分类的对话框 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="editCategoryDialogVisible"
        width="50%"
      >
        <el-form
          :model="editCategoryForm"
          :rules="editCategoryFormRules"
          ref="editCategoryFormRef"
          label-width="100px"
        >
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="editCategoryForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCategoryDialogVisible = false"
            >取 消</el-button
          >
          <el-button type="primary" @click="categoryChange">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      categoryList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "operation",
        },
      ],
      addCategoryDialogVisible: false,
      addCategoryForm: {
        // 默认添加一级分类
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCategoryRules: {
        cat_name: [
          { required: true, message: "请输入分类名称！", trigger: "blur" },
        ],
      },
      parentCategoryList: [],
      // 选中的父级分类的id数组
      selectedKeys: [],
      editCategoryDialogVisible: false,
      editCategoryForm: {
        cat_name: "",
        cat_id: null,
      },
      editCategoryFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称！", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    getCategoryList() {
      this.$api.category
        .getCategoryList(this.queryInfo)
        .then((res) => {
          this.categoryList = res.data.result;
          this.total = res.data.total;
        })
        .catch((err) => err);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCategoryList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum;
      this.getCategoryList();
    },
    showAddCategoryDialog() {
      this.getParentCategoryList();
      this.addCategoryDialogVisible = true;
    },
    getParentCategoryList() {
      this.$api.category
        .getCategoryList({ type: 2 })
        .then((res) => {
          this.parentCategoryList = res.data;
        })
        .catch((err) => err);
    },
    parentCategoryChange() {
      if (this.selectedKeys.length > 0) {
        this.addCategoryForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addCategoryForm.cat_level = this.selectedKeys.length;
      } else {
        this.addCategoryForm.cat_pid = 0;
        this.addCategoryForm.cat_level = 0;
      }
    },
    addCategory() {
      this.$api.category
        .addCategory(this.addCategoryForm)
        .then((res) => {
          this.$message.success("添加分类成功！");
          this.getCategoryList();
          this.addCategoryDialogVisible = false;
        })
        .catch((err) => err);
    },
    // 对话框关闭时重置表单数据
    addCategoryDialogClose() {
      this.$refs.addCategoryFormRef.resetFields();
      this.selectedKeys = [];
      this.addCategoryForm.cat_level = 0;
      this.addCategoryForm.cat_pid = 0;
    },
    async deleteCategory(row) {
      // 功能待完善，如果删除一级或二级分类则需要递归删除该分类下的所有子分类，用Promise.all???
      if (row._childrenLen > 0) {
        this.$message.error("无法一次删除多个分类！");
        return;
      }
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
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
      this.$api.category
        .deleteCategory(row.cat_id)
        .then((res) => {
          console.log(res);
          this.getCategoryList();
        })
        .catch((err) => err);
    },
    // 展示编辑分类对话框
    showEditCategoryDialog(row) {
      this.$api.category
        .getCategoryById(row.cat_id)
        .then((res) => {
          this.editCategoryForm.cat_name = res.data.cat_name;
          this.editCategoryForm.cat_id = res.data.cat_id;
          this.editCategoryDialogVisible = true;
        })
        .catch((err) => err);
    },
    // 修改分类的处理函数
    categoryChange() {
      this.$api.category
        .categoryChange(
          this.editCategoryForm.cat_id,
          this.editCategoryForm.cat_name
        )
        .then((res) => {
          this.getCategoryList();
          this.editCategoryDialogVisible = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
