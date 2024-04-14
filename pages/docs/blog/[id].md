<script setup>
import { useData } from 'vitepress'
const { params } = useData()
console.log(params.value)
</script>

<pre>{{ params }}</pre>
<!-- @content -->
