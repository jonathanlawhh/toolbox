<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="10" lg="8">
        <h1 class="text-h3 font-weight-bold mb-6 text-center text-gradient">
          Line Joiner
        </h1>
        <p class="text-subtitle-1 text-center mb-6 text-grey-lighten-1">
          [Joining each line, one at a time]
        </p>

        <v-card class="glass-card pa-6" elevation="10">
          <v-row>
            <v-col cols="12">
              <!-- Statistics Card -->
              <v-card class="glass-card mt-4 pa-3 text-center" elevation="2">
                <v-row dense>
                  <v-col cols="4">
                    <div class="text-caption text-grey-lighten-2">Total Lines</div>
                    <div class="text-h6 text-primary">{{ stats.totalLines }}</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-caption text-grey-lighten-2">Duplicate Lines</div>
                    <div class="text-h6 text-secondary">{{ stats.duplicateLines }}</div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-caption text-grey-lighten-2">Empty Lines</div>
                    <div class="text-h6 text-grey-lighten-1">{{ stats.emptyLines }}</div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" md="6" style="max-width: 560px">
              <v-textarea v-model="inputText" label="Input Lines" variant="outlined" rows="15" class="code-font"
                color="primary" bg-color="rgba(0,0,0,0.3)" @blur="copyResultOnBlur" clearable></v-textarea>
            </v-col>

            <v-col cols="12" md="6" style="max-width:560px">
              <OutputCard title="Joined Result" :content="joinedText" />
            </v-col>
          </v-row>
        </v-card>

        <!-- Configuration Card -->
        <v-card class="glass-card mt-4 pa-4" elevation="4">
          <div class="text-subtitle-2 mb-3 text-grey-lighten-1">
            <v-icon size="small" class="mr-1">mdi-lightning-bolt</v-icon>
            Quick Presets
          </div>
          <div class="d-flex flex-wrap" style="gap: 12px;">
            <v-btn color="primary" variant="tonal" prepend-icon="mdi-warehouse" @click="applyWMSPreset">
              WMS
            </v-btn>
            <v-btn color="secondary" variant="tonal" prepend-icon="mdi-database" @click="applySQLINPreset">
              SQL IN
            </v-btn>
          </div>

          <v-expansion-panels class="mt-8">
            <v-expansion-panel>
              <v-expansion-panel-title class="text-grey-lighten-1">
                <v-icon start icon="mdi-cog-outline" class="mr-2"></v-icon>
                Configuration
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- Output Formatting Category -->
                <div class="mb-4">
                  <div class="text-subtitle-1 font-weight-bold mb-3 text-grey-lighten-1">
                    <v-icon size="small" class="mr-1">mdi-format-text</v-icon>
                    Output Formatting
                  </div>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="delimiter" label="Delimiter" variant="outlined" placeholder=","
                        hint="Character(s) to join lines with" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="outputPrefix" label="Output Prefix" variant="outlined" placeholder=""
                        hint="Text to add before entire result" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field v-model="outputSuffix" label="Output Suffix" variant="outlined" placeholder=""
                        hint="Text to add after entire result" persistent-hint></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-4"></v-divider>

                <!-- Line Formatting Category -->
                <div class="mb-4">
                  <div class="text-subtitle-1 font-weight-bold mb-3 text-grey-lighten-1">
                    <v-icon size="small" class="mr-1">mdi-format-line-spacing</v-icon>
                    Line Formatting
                  </div>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="linePrefix" label="Line Prefix" variant="outlined" placeholder=""
                        hint="Text to add before each line" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field v-model="lineSuffix" label="Line Suffix" variant="outlined" placeholder=""
                        hint="Text to add after each line" persistent-hint></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch v-model="trim" label="Trim whitespace" color="primary" inset></v-switch>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch v-model="removeEmpty" label="Remove empty lines" color="primary" inset></v-switch>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch v-model="sortLines" label="Sort lines" color="primary" inset></v-switch>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-switch v-model="removeDuplicates" label="Remove duplicates" color="primary" inset></v-switch>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" timeout="2000" color="success">
      Copied to clipboard!
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead } from '#app'

useHead({
  title: 'Line Joiner',
  meta: [
    { name: 'description', content: 'Join multiple lines of text with custom delimiters, prefixes, suffixes, sorting, and more.' }
  ]
})

const inputText = ref('')
const snackbar = ref(false)

// Output formatting options
const delimiter = ref(',')
const outputPrefix = ref('')
const outputSuffix = ref('')

// Line formatting options
const linePrefix = ref('')
const lineSuffix = ref('')
const trim = ref(true)
const removeEmpty = ref(true)
const sortLines = ref(true)
const removeDuplicates = ref(true)

// Statistics
const stats = computed(() => {
  if (!inputText.value) return {
    totalLines: 0,
    duplicateLines: 0,
    uniqueLines: 0,
    emptyLines: 0
  }

  const allLines = inputText.value.split(/\r?\n/)
  const totalLines = allLines.length
  const emptyLines = allLines.filter(line => line.trim() === '').length

  // Count duplicates
  const lineCount = new Map<string, number>()
  allLines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine !== '') {
      lineCount.set(trimmedLine, (lineCount.get(trimmedLine) || 0) + 1)
    }
  })

  let duplicateLines = 0
  lineCount.forEach(count => {
    if (count > 1) {
      duplicateLines += count - 1
    }
  })

  const uniqueLines = lineCount.size

  return {
    totalLines,
    duplicateLines,
    uniqueLines,
    emptyLines
  }
})

const joinedText = computed(() => {
  if (!inputText.value) return ''

  let lines = inputText.value.split(/\r?\n/)

  if (removeEmpty.value) {
    lines = lines.filter(line => line.trim() !== '')
  }

  if (trim.value) {
    lines = lines.map(line => line.trim())
  }

  // Remove duplicates if enabled
  if (removeDuplicates.value) {
    lines = [...new Set(lines)]
  }

  // Sort lines if enabled
  if (sortLines.value) {
    lines = lines.sort((a, b) => a.localeCompare(b))
  }

  // Add line prefix and suffix
  if (linePrefix.value || lineSuffix.value) {
    lines = lines.map(line => `${linePrefix.value}${line}${lineSuffix.value}`)
  }

  const joined = lines.join(delimiter.value)
  return `${outputPrefix.value}${joined}${outputSuffix.value}`
})

// Preset functions
const applyWMSPreset = () => {
  delimiter.value = ';'
  outputPrefix.value = '{'
  outputSuffix.value = '}'
  linePrefix.value = ''
  lineSuffix.value = ''
  trim.value = true
  removeEmpty.value = true
  sortLines.value = true
  removeDuplicates.value = true
}

const applySQLINPreset = () => {
  delimiter.value = ','
  outputPrefix.value = '('
  outputSuffix.value = ')'
  linePrefix.value = '"'
  lineSuffix.value = '"'
  trim.value = true
  removeEmpty.value = true
  sortLines.value = true
  removeDuplicates.value = true
}

// Apply WMS preset on page load
onMounted(() => {
  applyWMSPreset()
})

// Auto-copy to clipboard when input loses focus
const copyResultOnBlur = async () => {
  if (joinedText.value) {
    try {
      await navigator.clipboard.writeText(joinedText.value)
      snackbar.value = true
    } catch (err) {
      console.error('Failed to auto-copy: ', err)
    }
  }
}
</script>
