<template>
    <v-container class="fill-height">
        <v-row justify="center" align="center">
            <v-col cols="12" md="8" lg="6">
                <h1 class="text-h2 font-weight-bold mb-4 text-center text-gradient">
                    404
                </h1>
                <p class="text-h6 text-center text-grey-lighten-1 mb-8">
                    [Page Not Found]
                </p>

                <v-row justify="center">
                    <v-col cols="12" md="6">
                        <v-card class="glass-card pa-6" elevation="4" hover to="/">
                            <div class="d-flex align-center justify-center mb-3">
                                <v-icon size="large" color="primary" class="mr-3">mdi-home</v-icon>
                                <h2 class="text-h5 text-grey-lighten-1">Return Home</h2>
                            </div>
                            <p class="text-body-2 text-grey-lighten-2 text-center">
                                Go back to the main dashboard
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
    title: '404',
    meta: [
        { name: 'robots', content: 'noindex' }
    ]
})
</script>
