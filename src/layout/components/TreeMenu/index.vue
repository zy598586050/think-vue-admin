<template>
  <template v-for="menu in menuList" :key="menu.path">
    <el-sub-menu v-if="menu.children.length > 0" :index="menu.path">
        <template #title>
          <svg-icon :name="menu.icon" class="svg-icon"></svg-icon>
          <span class="menu-text">{{menu.meta.title}}</span>
        </template>
        <tree-menu :menuList="menu.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="menu.path">
       <template #title>
          <svg-icon :name="menu.icon" class="svg-icon"></svg-icon>
          <span class="menu-text">{{menu.meta.title}}</span>
        </template>
    </el-menu-item>
  </template>
</template>

<script>
export default {
  name: "TreeMenu",
  props: {
    menuList: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="scss">
.svg-icon{
    width: 20px;
    height: 20px;
    margin-right: 5px;
}
.menu-text{
    font-size: 14px;
}
</style>