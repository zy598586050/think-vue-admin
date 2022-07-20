<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <transition-group name="breadcrumb">
          <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
              <router-link to="/welcome" v-if="index != breadList.length-1">{{item.meta.title}}</router-link>
              <span v-else>{{ item.meta.title }}</span>
          </el-breadcrumb-item>
      </transition-group>
  </el-breadcrumb>
</template>
<script>
export default {
  name: "BreadCrumb",
  computed: {
    breadList() {
      return this.$route.matched;
    },
  },
};
</script>