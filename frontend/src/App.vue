<template>
  <div id="app">
    <h1>Productiv Ramp Up: Metrics</h1>
    <p>
      <router-link to="/">Gmail</router-link>
      <router-link to="/twitter">Twitter</router-link>
    </p>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img {
  display: inline-block;
  margin: 0 auto;
  padding: 3px;
  max-width: 75%;
}

.loader {
  margin: 0 auto;
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
