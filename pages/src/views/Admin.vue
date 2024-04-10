<script setup lang="ts">
import { ref } from 'vue';

const pages = ref(null);

async function getPages() {
  fetch(`${location.origin}/api/pages`)
    .then(async response => {
      const result = await response.json();
      pages.value = result.keys;
    })
    .catch(error => console.error(error));
}
</script>

<template>
  <div>
    <h2>Admin</h2>
    <button @click="getPages">Get Pages</button>
    <div v-if="pages">
      <div v-for="page of pages" class="pages">
        <pre>{{ page }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pages {
  font-size: 0.75rem;
}
</style>
