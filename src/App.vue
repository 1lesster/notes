<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <h1><a href="/">Vue Notes</a></h1>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
.v-app-bar h1 {
  width: 100%;
  text-align: center;
  a {
    text-decoration: none;
    color: #fff;
  }
}
</style>
