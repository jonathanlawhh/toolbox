<template>
    <v-container class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="10" lg="8">
                <h1 class="text-h3 font-weight-bold mb-6 text-center text-gradient">
                    JSON Generator
                </h1>
                <p class="text-subtitle-1 text-center mb-6 text-grey-lighten-1">
                    [Generate a JSON array by injecting data into a template]
                </p>

                <v-card class="glass-card pa-6" elevation="10">
                    <v-row>
                        <v-col cols="12">
                            <!-- Statistics Card -->
                            <v-card class="glass-card mt-4 pa-3 text-center" elevation="2">
                                <v-row dense>
                                    <v-col cols="6">
                                        <div class="text-caption text-grey-lighten-2">Total Items</div>
                                        <div class="text-h6 text-primary">{{ stats.totalItems }}</div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div class="text-caption text-grey-lighten-2">Duplicate Lines</div>
                                        <div class="text-h6 text-secondary">{{ stats.duplicateLines }}</div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="4">
                            <v-textarea v-model="dataInput" label="Data Input (Multiple Rows)" variant="outlined"
                                rows="15" class="code-font" color="primary" bg-color="rgba(0,0,0,0.3)" clearable
                                @blur="copyResultOnBlur"></v-textarea>
                        </v-col>

                        <v-col cols="12" md="3">
                            <OutputCard title="Input Mapping" :content="idMapping" />
                        </v-col>

                        <v-col cols="12" md="5">
                            <v-textarea v-model="jsonTemplate" label="JSON Template" variant="outlined" rows="15"
                                class="code-font" color="secondary" bg-color="rgba(0,0,0,0.3)" clearable
                                @blur="copyResultOnBlur"></v-textarea>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-card class="glass-card pa-4" elevation="4">
                                <div class="text-subtitle-1 font-weight-bold mb-8 text-grey-lighten-1">
                                    <v-icon size="small" class="mr-1">mdi-cog-outline</v-icon>
                                    Configuration
                                </div>
                                <v-text-field v-model="delimiter" label="Delimiter" variant="outlined" density="compact"
                                    hide-details class="mb-3" placeholder="," max-width="128px"
                                    hint="Character to split each line by"></v-text-field>
                                <v-switch v-model="removeDuplicates" label="Remove duplicates" color="primary" inset
                                    hide-details></v-switch>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6">
                            <OutputCard title="Generated JSON Array" :content="generatedJson" />
                        </v-col>
                    </v-row>
                </v-card>

                <!-- Usage Tip -->
                <v-alert icon="mdi-information" class="mt-4 glass-card" border="start" border-color="primary">
                    <div class="text-subtitle-2">How to use</div>
                    <div class="text-caption">
                        1. Enter your data in the left box, one item per line.<br>
                        2. If using a delimiter (e.g., comma), splits will be available as <code>{{ [0] }}</code>,
                        <code>{{ [1] }}</code>, etc.<br>
                        3. Enter a JSON object template in the right box.<br>
                        4. The tool will generate a JSON array containing one object for each line of data.
                    </div>
                </v-alert>

            </v-col>
        </v-row>
        <v-snackbar v-model="snackbar" timeout="2000" color="success">
            Copied to clipboard!
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useHead } from '#app'

useHead({
    title: 'JSON Generator',
    meta: [
        { name: 'description', content: 'Generate JSON arrays by templating data into a JSON structure.' }
    ]
})

const dataInput = ref('')
const jsonTemplate = ref('{\n  "id": "{{[0]}}",\n  "value": "{{[1]}}"\n}')
const delimiter = ref(',')
const removeDuplicates = ref(true)
const snackbar = ref(false)

const processTemplate = (template: string, line: string, delim: string) => {
    let tailored = template
    const trimmedLine = line.trim()

    let parts = [trimmedLine]
    // If no delimeter, return the whole line
    if (delim) {
        parts = trimmedLine.split(delim).map(p => p.trim())
    }

    tailored = tailored.replace(/{{(\[(\d+)\])}}/g, (match, fullGroup, indexStr) => {
        const index = parseInt(indexStr, 10)
        return parts[index] !== undefined ? parts[index] : ''
    })

    return tailored
}

const stats = computed(() => {
    const lines = dataInput.value ? dataInput.value.split(/\r?\n/).filter(l => l.trim() !== '') : []
    const lineCount = new Map<string, number>()

    lines.forEach(line => {
        const trimmed = line.trim()
        lineCount.set(trimmed, (lineCount.get(trimmed) || 0) + 1)
    })

    let duplicates = 0
    lineCount.forEach(count => {
        if (count > 1) {
            duplicates += count - 1
        }
    })

    return {
        totalItems: lines.length,
        duplicateLines: duplicates
    }
})

const idMapping = computed(() => {
    if (!dataInput.value || !jsonTemplate.value) return '{}'

    const lines = dataInput.value.split(/\r?\n/)
    const firstLine = lines[0]

    // If no delimeter, return the whole line
    if (!delimiter.value) return JSON.stringify({ '{{[0]}}': firstLine }, null, 2)

    const valueMap = firstLine.split(delimiter.value)

    let idMap: Record<string, string> = {}
    for (let i = 0; i < valueMap.length; i++) {
        const tmpMapId = '{{[' + i.toString() + ']}}'
        idMap[tmpMapId] = valueMap[i]
    }

    return JSON.stringify(idMap, null, 2)
})

const generatedJson = computed(() => {
    if (!dataInput.value || !jsonTemplate.value) return '[]'


    let lines = dataInput.value.split(/\r?\n/).filter(line => line.trim() !== '')

    if (removeDuplicates.value) {
        lines = [...new Set(lines.map(l => l.trim()))]
    }

    const objects: any[] = []

    lines.forEach(line => {
        const tailored = processTemplate(jsonTemplate.value, line, delimiter.value)

        try {
            // Try to parse as JSON to ensure we output a valid JSON array of objects
            const parsed = JSON.parse(tailored)
            objects.push(parsed)
        } catch (e) {
            // Ignore invalid JSON
        }
    })

    return JSON.stringify(objects, null, 2)
})

const copyResultOnBlur = async () => {
    if (generatedJson.value && generatedJson.value !== '[]') {
        try {
            await navigator.clipboard.writeText(generatedJson.value)
            snackbar.value = true
        } catch (err) {
            console.error('Failed to auto-copy: ', err)
        }
    }
}

// Note: OutputCard handles the copy, but we can also auto-copy like linejoiner if desired.
// The user asked "provide a function to copy", OutputCard has that. 
// "As usual, ensure it will be copied to clipboard" might mean auto-copy or just the button.
// Linejoiner has auto-copy on boolean. I'll add the button (in OutputCard) effectively covers "function to copy".
// I'll skip auto-copy-on-blur for now unless requested, as generating JSON might take a few edits to get right.
</script>

<style scoped>
/* Scoped styles if needed, mostly using utility classes */
</style>
