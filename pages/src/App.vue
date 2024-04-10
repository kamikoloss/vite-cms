<script setup lang="ts">
</script>

<template>
  <div>
    <header>
      <h1>Vite CMS</h1>
      <nav>
        <RouterLink to="/">Top</RouterLink>
        <RouterLink to="/admin">Admin</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
