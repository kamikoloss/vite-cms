<script setup>
import { data } from './blog.data';
</script>

<h2>Blog</h2>
<ul>
  <li v-for="entry in data" :key="data.id">
    <a :href="`/blog/${entry.id}/`">{{ entry.metadata.title }}</a>
  </li>
</ul>
