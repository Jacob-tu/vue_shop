<template>
  <div>
      <h3>Welcome</h3>
  </div>
</template>

<script>

export default {
  mounted () {
    this.$api.menu.getMenuList().then(res => {
      // console.log(res)
    }).catch(err => {
      console.log(err);
    })
  }
}
</script>

<style>

</style>