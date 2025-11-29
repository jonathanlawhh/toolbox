<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10" lg="8">
        <h1 class="text-h3 font-weight-bold mb-6 text-center text-gradient">
          JSON Mapping
        </h1>
        <p class="text-subtitle-1 text-center mb-6 text-grey-lighten-1">
          The tool will convert the input JSON into an output JSON based on the schema given.
        </p>

        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-expansion-panels class="mb-6">
              <v-expansion-panel class="glass-card">
                <v-expansion-panel-title class="text-grey-lighten-1">
                  <v-icon start icon="mdi-help-circle-outline" class="mr-2"></v-icon>
                  User Manual
                </v-expansion-panel-title>
                <v-expansion-panel-text class="text-grey-lighten-2">
                  <ul class="pl-4">
                    <li class="mb-2"><strong>source parameter</strong>: Search path to start with <code>.orders</code>
                    </li>
                    <li class="mb-2"><strong>Array path</strong>: Has asterisks: <code>.orders*</code></li>
                    <li class="mb-2"><strong>Static Array</strong>: If given a number 1, an array will be created
                      without reference</li>
                    <li class="mb-2"><strong>Fix data</strong>: Starts immediately: <code>HELLO</code></li>
                    <li><strong>Add 2 values together</strong>: <code>.orders.item + .orders.color</code></li>
                  </ul>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <v-card class="glass-card pa-6" elevation="10">
          <v-row>
            <v-col cols="12" md="6">
              <v-textarea v-model="jsonInput1" label="Input JSON" variant="outlined" rows="15"
                :error-messages="errorMessages1" class="code-font" color="primary"
                bg-color="rgba(0,0,0,0.3)"></v-textarea>

            </v-col>



            <v-col cols="12" md="6">
              <v-textarea v-model="jsonSchemaMapping" label="JSON Schema Mapping" variant="outlined" rows="15"
                :error-messages="errorMessagesMapping" class="code-font" color="primary"
                bg-color="rgba(0,0,0,0.3)"></v-textarea>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="6">
              <OutputCard title="Generated Schema" :content="schemaResult1"></OutputCard>
            </v-col>
            <v-col cols="12" md="6">
              <OutputCard title="Transformed Result" :content="transformedResult"></OutputCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000" color="success">
      Copied to clipboard!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHead } from '#app'

useHead({
  title: 'JSON Mapping',
  meta: [
    { name: 'description', content: 'Transform JSON data using custom schema mappings. Generate schemas, map keys, and preview results.' }
  ]
})

const jsonInput1 = ref('')
const errorMessages1 = ref<string[]>([])
const schemaResult1 = ref('')

const validateJson = (input: string, errorRef: any) => {
  if (!input) {
    errorRef.value = []
    return
  }
  try {
    JSON.parse(input)
    errorRef.value = []
  } catch (e) {
    errorRef.value = ['Invalid JSON format']
  }
}

watch(jsonInput1, (newVal) => {
  validateJson(newVal, errorMessages1)

  if (!newVal || errorMessages1.value.length > 0) {
    schemaResult1.value = ''
    return
  }

  try {
    const parsed = JSON.parse(newVal)
    // Generate schema map
    const schema = createSchemaMap(parsed)
    schemaResult1.value = JSON.stringify(schema, null, 2)
  } catch (e) {
    schemaResult1.value = ''
  }
})





const jsonSchemaMapping = ref('')
const errorMessagesMapping = ref<string[]>([])
const transformedResult = ref('')

watch([jsonSchemaMapping, jsonInput1], ([mappingVal, inputVal]) => {
  validateJson(mappingVal, errorMessagesMapping)

  if (!mappingVal || !inputVal || errorMessagesMapping.value.length > 0 || errorMessages1.value.length > 0) {
    transformedResult.value = ''
    return
  }

  try {
    const mapping = JSON.parse(mappingVal)
    const input = JSON.parse(inputVal)
    const result = newSchemaLoop(mapping, input, "")
    transformedResult.value = JSON.stringify(result, null, 2)
  } catch (e) {
    transformedResult.value = ''
  }
})

const snackbar = ref(false)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    snackbar.value = true
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
</script>
