<template>
    <v-container class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <h1 class="text-h2 font-weight-bold mb-4 text-center text-gradient">
                    Toolbox
                </h1>
                <p class="text-h6 text-center text-grey-lighten-1 mb-8">
                    All the tools I probably need in one place
                </p>

                <v-row>
                    <v-col cols="12" md="6">
                        <v-card class="glass-card pa-6" elevation="4" hover to="/jsonmap">
                            <div class="d-flex align-center mb-3">
                                <v-icon size="large" color="primary" class="mr-3">mdi-code-json</v-icon>
                                <h2 class="text-h5 text-grey-lighten-1">JSON Mapping</h2>
                            </div>
                            <p class="text-body-2 text-grey-lighten-2">
                                Transform JSON data using custom schema mappings
                            </p>
                        </v-card>
                    </v-col>

                    <v-col cols="12" md="6">
                        <v-card class="glass-card pa-6" elevation="4" hover to="/linejoiner">
                            <div class="d-flex align-center mb-3">
                                <v-icon size="large" color="secondary" class="mr-3">mdi-format-line-spacing</v-icon>
                                <h2 class="text-h5 text-grey-lighten-1">Line Joiner</h2>
                            </div>
                            <p class="text-body-2 text-grey-lighten-2">
                                Join multiple lines with custom delimiters and formatting
                            </p>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useHead } from '#app'

useHead({
    title: 'Home',
    meta: [
        { name: 'description', content: 'Toolbox - All the tools I probably need in one place, including Line Joiner and JSON Mapping.' }
    ]
})
</script>
