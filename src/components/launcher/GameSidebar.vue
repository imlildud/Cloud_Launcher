<!-- src/components/launcher/GameSidebar.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import ProjectTile from './ProjectTile.vue'
import type { Game } from '../../data/games'

const props = defineProps<{
  games: Game[]
  activeIndex: number
}>()

const emit = defineEmits(['update:activeIndex', 'wheel'])

const hovered = ref(false)

// Altura estimada de cada tarjeta + espacio (gap) en píxeles
const ITEM_HEIGHT = 160

// Calcula la posición para centrar el juego activo verticalmente
const trackTransform = computed(() => {
  return `translateY(calc(30vh - ${props.activeIndex * ITEM_HEIGHT}px))`
})
</script>

<template>
  <aside
    class="launcher-sidebar"
    :class="{ 'launcher-sidebar--hovered': hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @wheel.prevent="(e) => emit('wheel', e)"
  >
    <!-- ============================================================
                          CUADRÍCULA DE FONDO
         Solo visible en hover. Mismo patrón que la TopBar.
    ============================================================ -->
    <div class="sidebar__grid" aria-hidden="true"></div>

    <!-- ============================================================
                          CONTENIDO DEL SIDEBAR
    ============================================================ -->
    <div class="sidebar__inner">
      <header class="sidebar-header">
        <h2 class="sidebar-title">Librería</h2>
      </header>

      <!-- Viewport de la ruleta -->
      <div class="roulette-viewport">
        <!-- Pista deslizable -->
        <div class="roulette-track" :style="{ transform: trackTransform }">
          <ProjectTile
            v-for="(game, index) in games"
            :key="game.id"
            :game="game"
            :is-active="index === activeIndex"
            @select="emit('update:activeIndex', index)"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
/* ============================================================
                        CSS STYLES
============================================================ */
.launcher-sidebar {
  position: relative;
  flex: 0 0 20%;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Glass estilo TopBar */
  background: rgba(15, 12, 25, 0.55);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);

  /* Sistema de luces 3D sin borde sólido grueso */
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    inset 0 -1px 1px rgba(168, 85, 247, 0.1),
    6px 6px 24px rgba(0, 0, 0, 0.55),
    12px 12px 48px rgba(88, 28, 135, 0.25);

  transition:
    box-shadow 0.35s ease,
    background 0.35s ease;
  z-index: 10;
}

/* Estado Hover: Intensifica fondo y luces */
.launcher-sidebar--hovered {
  background: rgba(20, 14, 32, 0.7);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.25),
    inset 0 -1px 1px rgba(192, 132, 252, 0.2),
    8px 8px 28px rgba(0, 0, 0, 0.6),
    16px 16px 60px rgba(126, 34, 206, 0.45);
}

/* ============================================================
                        CUADRÍCULA MORADA
============================================================ */
.sidebar__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease;

  /* Dos capas de grid moradas de la TopBar */
  background-image:
    linear-gradient(to right, rgba(216, 180, 254, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(216, 180, 254, 0.08) 1px, transparent 1px);
  background-size: 12px 12px, 12px 12px;

  /* Máscara para desvanecer suavemente hacia los bordes */
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 85%);
}

.launcher-sidebar--hovered .sidebar__grid {
  opacity: 1;
}

/* ============================================================
                        CONTENIDO
============================================================ */
.sidebar__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem;
}

.sidebar-title {
  font-family: 'Fira Code', monospace;
  color: #a855f7;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* ============================================================
                        RULETA
============================================================ */
.roulette-viewport {
  position: relative;
  flex: 1;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
}

.roulette-track {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  padding-top: 2rem;
}
</style>
