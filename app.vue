<template>
  <v-app theme="dark">
    <v-app-bar elevation="0" color="transparent" class="glass-header">
      <v-app-bar-title class="text-h5 font-weight-bold text-gradient ml-16">
        Toolbox
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn to="/" variant="text" class="text-grey-lighten-1 mr-2">
        Home
      </v-btn>
      <!-- <v-btn to="/jsonmap" variant="text" class="text-grey-lighten-1 mr-2">
        JSON Mapping
      </v-btn> -->
      <v-btn to="/json-generator" variant="text" class="text-grey-lighten-1 mr-4">
        JSON Generator
      </v-btn>
      <v-btn to="/linejoiner" variant="text" class="text-grey-lighten-1 mr-2">
        Line Joiner
      </v-btn>
    </v-app-bar>

    <v-main class="main-bg">
      <NuxtPage />
    </v-main>

    <v-footer>
      <v-container class="mt-4">
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <p>[
              <v-btn variant="text" size="small" href="https://jonathanlawhh.com/" target="_blank">
                <strong>Jonathan Law Hui Hao</strong>
              </v-btn>
              ]
            </p>
          </v-col>
          <v-col cols="12" md="8">
            <p class="text-right">
              [
              <v-btn variant="text" size="small" href="https://jonathanlawhh.com/works/ai/" target="_blank">Other
                Projects
              </v-btn>
              ,
              <v-btn variant="text" size="small" href="https://github.com/jonathanlawhh/toolbox" target="_blank">Source
                Code
              </v-btn>
              ,
              <v-btn variant="text" size="small" href="https://jonathanlawhh.medium.com/" target="_blank">Blog</v-btn>
              ]
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>
