<script setup>
import { useData } from 'vitepress';
const { params } = useData();
</script>

<h2>{{ params.title }}</h2>
<pre>{{ params }}</pre>
<!-- @content -->
