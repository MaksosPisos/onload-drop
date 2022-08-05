<template>
  <div class="min-h-screen flex justify-center flex-col items-center bg-slate-900">
    <Auth v-if="!jwt">

    </Auth>
    <Dropzone v-else-if="jwt">

    </Dropzone>
  </div>

</template>

<script>
import Dropzone from "./components/Dropzone.vue";
import Auth from "./components/Auth.vue"
export default {
  components: {
    Dropzone,
    Auth,
  },
  computed: {
    jwt() {
      return this.$store.state.jwt
    }
  }
}
</script>

<style scoped>
</style>
