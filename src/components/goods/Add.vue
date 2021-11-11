<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        title="消息提示的文案"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeTab * 1"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeTab"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0"
            ><el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input> </el-form-item
            ><el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input> </el-form-item
            ><el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
              ></el-input> </el-form-item
            ><el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addForm.goods_weight"
              ></el-input> </el-form-item
            ><el-form-item label="商品分类" prop="goods_cat"
              ><el-cascader
                v-model="addForm.goods_cat"
                :options="categoryList"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader
            ></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1"
            ><el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group> </el-form-item
          ></el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3"
            ><el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload></el-tab-pane
          >
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" /><el-button
              type="primary"
              class="addBtn"
              @click="addGoods"
              >添加商品</el-button
            ></el-tab-pane
          >
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewUrl" alt="wait please" class="previewImage" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      activeTab: "0",
      addForm: {
        goods_name: "",
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "输入不能为空！",
            trigger: "blur",
          },
        ],
      },
      categoryList: [],
      manyTableData: [],
      onlyTableData: [],
      headerObj: { Authorization: window.sessionStorage.getItem("token") },
      previewUrl: "",
      previewDialogVisible: false,
    };
  },
  created() {
    this.getCategoryList();
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
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message.info("请选择一个三级分类");
        this.addForm.goods_cat = [];
        return;
      }
    },
    beforeTabLeave(activeTab, oldTab) {
      if (oldTab === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.info("请先选择商品分类");
        return false;
      }
    },
    tabClick() {
      if (this.activeTab === "1") {
        this.$api.params
          .getParamsList(this.addForm.goods_cat[2], { sel: "many" })
          .then((res) => {
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTableData = res.data;
          })
          .catch((err) => err);
      } else if (this.activeTab === "2") {
        this.$api.params
          .getParamsList(this.addForm.goods_cat[2], { sel: "only" })
          .then((res) => {
            this.onlyTableData = res.data;
          })
          .catch((err) => err);
      }
    },
    handlePreview(file) {
      this.previewUrl = file.response.data.url;
      this.previewDialogVisible = true;
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => (x.tmp_path = filePath));
      this.addForm.pics.splice(i, 1);
    },
    handleSuccess(res) {
      const picInfo = { pic: res.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    addGoods() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项!");
        }
        this.manyTableData.forEach((item) => {
          const attrsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(attrsInfo);
        });
        this.onlyTableData.forEach((item) => {
          const attrsInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(attrsInfo);
        });
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        this.$api.list
          .addGoods(form)
          .then((res) => {
            this.$message.success("添加商品成功!")
            this.$router.push("/goods")
          })
          .catch((err) => err);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImage {
  width: 100%;
}
.addBtn {
  margin-top: 15px;
}
</style>
