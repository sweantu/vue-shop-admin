<script setup>
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <router-view></router-view>
    <SiteFooter />
  </div>
</template>
