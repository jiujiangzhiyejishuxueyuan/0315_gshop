<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:!pwd_show}" @click="pwd_show=false">短信登录</a>
          <a href="javascript:;" :class="{on:pwd_show}" @click="pwd_show=true">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="load_login">
          <div :class="{on:!pwd_show}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification"
                      :class="{right_phone: rightPhone}" @click.prevent="getCode">
                {{computedTime>0 ? `${computedTime}s后重新获取` : phone_tip }}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:pwd_show}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input :type="pwd_type" maxlength="8" placeholder="密码" v-model="pwd">
                <div class="switch_button" @click="pwd_type = pwd_type === 'password' ? 'tel' : 'password'"
                     :class="pwd_type === 'password' ? 'off' : 'on'">
                  <div class="switch_circle" :class="pwd_type==='tel' ? 'right' : ''"></div>
                  <span class="switch_text">{{pwd_type==='tel' ? 'abc' : ''}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha" @keydown.enter="load_login">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" ref="captcha" @click="getCaptcha">
              </section>
            </section>
          </div>
          <van-button class="login_submit" type="primary" :loading="Btn_loading">登录</van-button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.go(-1)">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alert-text="alertText" v-show="alertshow" @closeTip="closeTip"></AlertTip>
  </section>

</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'
  import {reqPwdLogin,reqSendCode,reqSmsLogin} from '../../api'

  export default {
    components: {
      AlertTip,

    },
    data(){
      return {
        pwd_show: false,  // 用户名/手机 登录切换
        phone: '', // 电话号
        computedTime: 0,  //发送短信倒计时
        phone_tip : '获取验证码',
        and_rightPhone: true,  //获取短信是否可用
        pwd: '', //密码
        pwd_type: 'password', //密码输入框类型
        code: '', // 短信验证码
        name: '', //用户名
        captcha: '', //图形验证码
        alertText: '', //提示文字
        alertshow: false, //是否显示提示框
        Btn_loading: false, //登录框是否加载
      }
    },
    computed: {
      rightPhone() {
        return /^1\d{10}$/.test(this.phone)&&this.and_rightPhone
      },
    },
    methods: {
      //模拟登录加载
      load_login(event) {
        this.Btn_loading = true
        setTimeout(()=> {
          this.login()
        },1000)
      },
      //发送短信验证码
      async getCode() {
        if(!this.computedTime) {  //启动倒计时
          this.phone_tip = '重新获取'
          this.and_rightPhone = false
          this.computedTime = 30
          this.intervalId = setInterval(()=> {
            this.computedTime--
            if(this.computedTime<=0) {
              clearInterval(intervalId)
              this.and_rightPhone = true
            }
          },1000)
          //发送ajax请求
          const result = await reqSendCode(this.phone)
          //发送失败
          if(result.code==1) {
            //显示提示
            this.showAlert(result.msg)
            //停止倒计时
            if(this.computedTime) {
              this.computedTime = 0
              this.and_rightPhone = true
              clearInterval(this.intervalId)
            }
          }
        }
      },
      //提交登录验证表单
      async login() {
        let result = {}
        this.and_rightPhone = true
        if(!this.pwd_show) { //短信登录
          const {rightPhone,phone,code} = this
          if(!rightPhone) {
            //手机号不正确
            this.showAlert('手机号不正确')
            return
          } else if(!/^\d{6}$/.test(code)) {
            //验证码不正确
            this.showAlert('验证码不正确')
            return
          }
          result = await reqSmsLogin(phone,code)
        } else { // 密码登录
          const {name,captcha,pwd} = this
          if(!name) {
            //请输入用户名
            this.showAlert('请输入用户名')
            return
          } else if (!pwd) {
            //请输入密码
            this.showAlert('请输入密码')
            return
          } else if (!captcha) {
            //请输入验证码
            this.showAlert('请输入验证码')
            return
          }
          result = await reqPwdLogin({name,captcha,pwd})
        }
        if(!result.code) { // 成功
          const user = result.data //储存用户信息
          this.$store.dispatch('recordUser',user)
          if(this.computedTime) {  //清除定时器
            this.computedTime = 0
            this.and_rightPhone = true
            clearInterval(this.intervalId)
          }
          this.Btn_loading = false
          this.$notify({ type: 'success', message: '登陆成功' })
          this.$router.go(-1)
        } else { //失败
          this.showAlert(result.msg)
          this.getCaptcha()
        }

      },
      //显示提示框
      showAlert(alertText) {
        this.alertshow = true
        this.alertText = alertText
      },
      //隐藏提示框
      closeTip() {
        this.alertshow = false
        this.Btn_loading = false
        this.alertText = ''
      },
      //重新获取图片验证码'
      getCaptcha() {
        this.$refs.captcha.src = this.$refs.captcha.src? 'http://localhost:4000/captcha?time=' + Date.now() : undefined
      }
    },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixins.styl'
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color #000000
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
