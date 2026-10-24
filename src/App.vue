<script setup lang="ts">
import LauncherView from './views/LauncherView.vue'
</script>

<template>
  <LauncherView />
</template>

<style>
/* Reset global para que el fondo oscuro ocupe el 100% sin márgenes ni barras blancas */
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0a0712;
  color: #f5f3ff;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Scrollbar personalizado con estilo glassmorphism */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 7, 18, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(168, 85, 247, 0.6);
}
</style>
