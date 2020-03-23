<template>
  <div id="app">
    <router-view/>
    <FooterGuide/>
  </div>
</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide'
  import {mapActions} from 'vuex'
  export default {
    components: {
      FooterGuide
    },
    methods: {
      ...mapActions(['getAddress','getUserInfo'])
    },
    mounted () {
      this.getAddress()
      this.getUserInfo()
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    background #f5f5f5
    position relative
</style>
