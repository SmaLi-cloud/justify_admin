<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <img class="avatar" :src="avatar" v-if="avatar" alt="" />
      <div class="avatar-text business-text" v-else>
      </div>
      <div class="user-text">
        <div class="user-name">
          {{ trueName }}({{ employeeNo }})
        </div>
        <div class="user-position">{{ title }}</div>
      </div>
      <!-- <span class="name"
        >{{ user.tenantName ? user.tenantName + "/" : ""
        }}{{ user.userName }}</span -->
      >
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="modifyPersonalData">
        <a-icon type="user" />
        <span>修改个人信息</span>
      </a-menu-item>
      <a-menu-item @click="personalCenter">
        <a-icon type="user" />
        <span>修改密码</span>
      </a-menu-item>
      <!-- <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item> -->
      <a-menu-divider />
      <a-menu-item @click="doLogout">
        <a-icon style="margin-right: 8px" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('staff', ['staffInfo']),
    trueName() {
      return this.staffInfo?.trueName || '';
    },
    avatar(){
      return this.staffInfo?.avatar?.attachPath||""
    },
    employeeNo() {
      return this.staffInfo?.staffId || '';
    },
    title() {
      return this.staffInfo?.title || '';
    }
  },
  methods: {
    ...mapActions('staff', ['logout']),
    doLogout() {
      this.logout();
      //this.$router.push('/login')
      this.$router.push('/login');
      // window.location.replace(window.location.protocol + '//'+ window.location.host+'/#/login');    
    },
    personalCenter(){
      this.$router.push('/personalCenter');
    },
    modifyPersonalData() {
      this.$router.push('/modifyPersonal');
    }
  },
};
</script>

<style lang="less">
.header-avatar {
  display: flex;
  height: 64px;
  align-items: center;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
  }
  .avatar-text {
    width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .name {
    font-weight: 500;
  }
  .user-text {
    color: #fff;
    margin-left: 13px;
    .user-name {
      font-size: 16px;
      line-height: 21px;
      margin-bottom: 5px;
    }
    .user-position {
      font-size: 14px;
      line-height: 19px;
    }
  }
}
.avatar-menu {
  width: 150px;
}
</style>
