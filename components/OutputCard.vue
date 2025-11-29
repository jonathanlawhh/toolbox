<template>
  <v-card class="glass-card pa-4" elevation="4" style="min-height: 200px ">
    <div class="d-flex justify-space-between align-center mb-2">
      <div class="text-subtitle-2 text-grey-lighten-1">{{ title }}</div>
      <v-btn icon="mdi-content-copy" variant="text" density="compact" color="grey-lighten-1"
        @click="copyToClipboard"></v-btn>
    </div>
    <pre v-if="isJSON" class="code-output" v-html="highlightedJSON"></pre>
    <pre v-else class="code-output">{{ content }}</pre>
    <v-snackbar v-model="snackbar" timeout="2000" color="success">
      Copied to clipboard!
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title: string
  content: string
}>()

const snackbar = ref(false)

// Check if content is valid JSON
const isJSON = computed(() => {
  if (!props.content) return false
  return typeof props.content === 'object'
})

// Syntax highlight JSON
const highlightedJSON = computed(() => {
  if (!isJSON.value) return props.content

  return props.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'json-number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key'
        } else {
          cls = 'json-string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean'
      } else if (/null/.test(match)) {
        cls = 'json-null'
      }
      return `<span class="${cls}">${match}</span>`
    })
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.content)
    snackbar.value = true
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>

<style scoped>
.json-key {
  color: #A5D6A7;
  font-weight: bold;
}

.json-string {
  color: #80CBC4;
}

.json-number {
  color: #FFE082;
}

.json-boolean {
  color: #EF9A9A;
}

.json-null {
  color: #B0BEC5;
}
</style>
