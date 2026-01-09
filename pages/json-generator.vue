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
                                        <div class="text-caption text-grey-lighten-2">Valid JSON Objects</div>
                                        <div class="text-h6 text-success">{{ stats.validItems }}</div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-textarea v-model="dataInput" label="Data Input (Multiple Rows)" variant="outlined"
                                rows="15" class="code-font" color="primary" bg-color="rgba(0,0,0,0.3)"
                                hint="One item per line" persistent-hint clearable
                                @blur="copyResultOnBlur"></v-textarea>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-textarea v-model="jsonTemplate" label="JSON Template" variant="outlined" rows="15"
                                class="code-font" color="secondary" bg-color="rgba(0,0,0,0.3)"
                                hint="Use {{INPUT_DATA_01}} as placeholder" persistent-hint clearable
                                @blur="copyResultOnBlur"></v-textarea>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-card class="glass-card pa-4" elevation="4">
                                <div class="text-subtitle-2 mb-3 text-grey-lighten-1">
                                    <v-icon size="small" class="mr-1">mdi-cog-outline</v-icon>
                                    Configuration
                                </div>
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
                        2. Enter a JSON object template in the right box, using <code v-pre>{{ INPUT_DATA_01 }}</code>
                        where
                        you
                        want the
                        data to appear.<br>
                        3. The tool will generate a JSON array containing one object for each line of data.
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
const jsonTemplate = ref('{\n  "id": "{{INPUT_DATA_01}}",\n  "value": "Sample"\n}')
const removeDuplicates = ref(true)
const snackbar = ref(false)

const stats = computed(() => {
    const lines = dataInput.value ? dataInput.value.split(/\r?\n/).filter(l => l.trim() !== '') : []
    // We calculate valid items based on whether the substitution result is valid JSON
    let valid = 0
    lines.forEach(line => {
        const tailored = jsonTemplate.value.replace(/{{INPUT_DATA_01}}/g, line.trim())
        try {
            JSON.parse(tailored)
            valid++
        } catch (e) {
            // invalid
        }
    })

    return {
        totalItems: lines.length,
        validItems: valid
    }
})

const generatedJson = computed(() => {
    if (!dataInput.value || !jsonTemplate.value) return '[]'


    let lines = dataInput.value.split(/\r?\n/).filter(line => line.trim() !== '')

    if (removeDuplicates.value) {
        lines = [...new Set(lines.map(l => l.trim()))]
    }

    const objects: any[] = []

    lines.forEach(line => {
        const trimmedLine = line.trim() // Trim the input data usually
        // Simple string replacement
        const tailored = jsonTemplate.value.replace(/{{INPUT_DATA_01}}/g, trimmedLine)

        try {
            // Try to parse as JSON to ensure we output a valid JSON array of objects
            const parsed = JSON.parse(tailored)
            objects.push(parsed)
        } catch (e) {
            // If it fails to parse (e.g. user made strings without quotes), we can't easily include it in a purely valid JSON array 
            // without it being a string or fixing it. 
            // For now, let's include it if it's a "string" but since we want an array of objects/mixed, 
            // maybe we just push a placeholder or the raw string if the user intends that?
            // But typically "JSON Generator" implies structural validity.
            // Let's create a fallback object including error or just skip? 
            // User request: "replace... combine... output". 
            // If the template is just a string `{{INPUT_DATA_01}}` (no quotes), result might be `value`. 
            // If that's not valid JSON (like a string without quotes), JSON.parse fails.

            // Let's be lenient: If parse fails, treat the whole tailored string as a string value? 
            // No, that might confuse structure. 
            // Let's just try to fix common issues or just ignore?
            // Better strategy: If we can't parse it, we don't add it to the 'real' JSON array but maybe we should show an error?
            // Given the tool nature, let's just attempt to push a string representation if object parse fails, 
            // or simplisticly: just push the raw string if it looks like a primitive, otherwise skip.
            // Actually, safest is to just output what we can. 
            // Let's push an error object? { "error": "Invalid JSON", "raw": ... }?
            // Or just skip.
            // Let's just ignore invalid ones to keep the array valid, but the stats show mismatch.
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
