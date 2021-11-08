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
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
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
          console.log(res);
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
