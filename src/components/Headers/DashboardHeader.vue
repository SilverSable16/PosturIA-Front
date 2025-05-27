<template>
  
  <!-- Main Sidebar -->
  <component :is="navbarFixed ? 'a-affix' : 'div'" :offset-top="top">

    <!-- Layout Header -->
    <a-layout-header>
      <a-row type="flex">

        <!-- Header Breadcrumbs & Title Column -->
        <a-col :span="24" :md="6">
          <a-breadcrumb>
            <a-breadcrumb-item>
              <router-link to="/home">Inicio</router-link>
            </a-breadcrumb-item>
            <a-breadcrumb-item>{{ $route.name }}</a-breadcrumb-item>
          </a-breadcrumb>

          <div class="ant-page-header-heading">
            <span class="ant-page-header-heading-title">{{ $route.name }}</span>
          </div>
        </a-col>

        <!-- Header Control Column -->
        <a-col :span="24" :md="18" class="header-control">

          <!-- Ajustes secundarios -->
          <a-button
            type="link"
            ref="secondarySidebarTriggerBtn"
            @click="$emit('toggleSettingsDrawer', true)"
          >
            <!-- icono de engranaje -->
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.4892 3.17094C11.1102 1.60969 8.8898 1.60969 8.51078 3.17094C8.26594 4.17949 7.11045 4.65811 6.22416 4.11809C4.85218 3.28212 3.28212 4.85218 4.11809 6.22416C4.65811 7.11045 4.17949 8.26593 3.17094 8.51078C1.60969 8.8898 1.60969 11.1102 3.17094 11.4892C4.17949 11.7341 4.65811 12.8896 4.11809 13.7758C3.28212 15.1478 4.85218 16.7179 6.22417 15.8819C7.11045 15.3419 8.26594 15.8205 8.51078 16.8291C8.8898 18.3903 11.1102 18.3903 11.4892 16.8291C11.7341 15.8205 12.8896 15.3419 13.7758 15.8819C15.1478 16.7179 16.7179 15.1478 15.8819 13.7758C15.3419 12.8896 15.8205 11.7341 16.8291 11.4892C18.3903 11.1102 18.3903 8.8898 16.8291 8.51078C15.8205 8.26593 15.3419 7.11045 15.8819 6.22416C16.7179 4.85218 15.1478 3.28212 13.7758 4.11809C12.8896 4.65811 11.7341 4.17949 11.4892 3.17094ZM10 13C11.6569 13 13 11.6569 13 10C13 8.34315 11.6569 7 10 7C8.34315 7 7 8.34315 7 10C7 11.6569 8.34315 13 10 13Z"
                fill="#111827"
              />
            </svg>
          </a-button>

          <!-- Toggle sidebar -->
          <a-button
            type="link"
            class="sidebar-toggler"
            @click="$emit('toggleSidebar', !sidebarCollapsed); resizeEventHandler()"
          >
            <svg width="20" height="20" viewBox="0 0 448 512">
              <path
                d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
              />
            </svg>
          </a-button>

        </a-col>
        <!-- / Header Control Column -->

      </a-row>
    </a-layout-header>
    <!-- /Layout Header -->

  </component>
  <!-- / Main Sidebar -->

</template>

<script>
export default {
  props: {
    navbarFixed: {
      type: Boolean,
      default: false,
    },
    sidebarCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      top: 0,
      wrapper: null,
    };
  },
  methods: {
    resizeEventHandler() {
      this.top = this.top ? 0 : -0.01;
    },
  },
  mounted() {
    this.wrapper = document.getElementById('layout-dashboard');
  },
  created() {
    window.addEventListener('resize', this.resizeEventHandler);
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeEventHandler);
  },
};
</script>
