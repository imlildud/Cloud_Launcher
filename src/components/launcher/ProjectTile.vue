<script setup lang="ts">
import { computed } from 'vue'
import type { Game } from '../../data/games'
import { useGames } from '../../composables/useGames'

const props = defineProps<{
  game: Game
  isActive?: boolean
}>()

const emit = defineEmits(['select'])

const { loadGameAssets } = useGames()

const assets = computed(() => loadGameAssets(props.game))
</script>

<template>
  <button
    class="project-tile"
    :class="{ 'project-tile--active': isActive }"
    :style="{ '--tile-highlight': game.highlight }"
    @click="emit('select', game.id)"
  >
    <!-- Borde trazado que se dibuja al estar activo -->
    <span class="project-tile__border" aria-hidden="true"></span>

    <!-- Capa de imágenes -->
    <div class="project-tile__media">
      <img v-if="assets.background" :src="assets.background" :alt="game.name" class="project-tile__bg" />
      <img v-if="assets.icon" :src="assets.icon" :alt="`${game.name} icon`" class="project-tile__icon" />
      <img v-if="assets.logo" :src="assets.logo" :alt="`${game.name} logo`" class="project-tile__logo" />
    </div>

    <!-- Nombre -->
    <div class="project-tile__label">
      <span class="project-tile__name">{{ game.name }}</span>
    </div>
  </button>
</template>

<style scoped>
.project-tile {
  all: unset;
  position: relative;
  display: flex;
  flex-direction: column;
  aspect-ratio: 16 / 10;
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  background: rgba(12, 8, 20, 0.6);

  opacity: 0.5;
  filter: grayscale(100%) brightness(0.4);
  transform: scale(0.92);
  will-change: transform;
  transition:
    transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.35s ease,
    filter 0.35s ease;
}

/* HOVER en tarjeta NO seleccionada: solo crece ligeramente */
.project-tile:not(.project-tile--active):hover {
  transform: scale(0.98);
}

/* SOLO ACTIVA: Color original y tamaño normal */
.project-tile--active {
  opacity: 1;
  filter: grayscale(0%) brightness(1);
  transform: scale(1);
}

/* ============================================================
        BORDE TRAZADO DE NEÓN
============================================================ */
.project-tile__border {
  position: absolute;
  inset: 0;
  border-radius: 18px;
  pointer-events: none;
  z-index: 3;
  padding: 2px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0deg,
    var(--tile-highlight) 90deg,
    color-mix(in srgb, var(--tile-highlight) 40%, transparent) 180deg,
    transparent 270deg,
    transparent 360deg
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask-composite: exclude;

  opacity: 0;
  transition: opacity 0.35s ease;
}

.project-tile--active .project-tile__border {
  opacity: 1;
  animation: border-trace 3s linear infinite;
}

@keyframes border-trace {
  from { --border-angle: 0deg; }
  to   { --border-angle: 360deg; }
}

/* ============================================================
                        MEDIA (3 capas)
============================================================ */
.project-tile__media {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.project-tile__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Reducimos el tamaño máximo del icono/personajes del 100% / 300px al 70% / 180px */
.project-tile__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-width: 180px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease;
}

/* Ajustamos también el tamaño del logo para mantener la proporción visual */
.project-tile__logo {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 28%;
  max-width: 100px;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.7));
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), filter 0.4s ease;
}

/* ============================================================
        ACTIVE: zoom + glow del color + float
============================================================ */
.project-tile--active .project-tile__icon {
  transform: translate(-50%, -50%) scale(1.08);
  filter:
    drop-shadow(0 0 5px var(--tile-highlight))
    drop-shadow(0 0 11px color-mix(in srgb, var(--tile-highlight) 60%, transparent))
    drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6));
  animation: tile-float-icon 1.4s ease-in-out infinite;
}

.project-tile--active .project-tile__logo {
  transform: translate(-50%, -50%) scale(1.06);
  filter:
    drop-shadow(0 0 4px var(--tile-highlight))
    drop-shadow(0 0 9px color-mix(in srgb, var(--tile-highlight) 55%, transparent))
    drop-shadow(0 6px 16px rgba(0, 0, 0, 0.7));
  animation: tile-float-logo 1.2s ease-in-out infinite reverse;
}

@keyframes tile-float-icon {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -5px; }
}

@keyframes tile-float-logo {
  0%, 100% { translate: 0 0; }
  50%      { translate: 0 -3px; }
}

/* ============================================================
                        LABEL
============================================================ */
.project-tile__label {
  position: relative;
  padding: 0.85rem 1rem;
  background: rgba(10, 7, 18, 0.75);
  border-top: 1px solid rgba(168, 85, 247, 0.12);
  z-index: 2;
}

.project-tile__name {
  display: block;
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #f5f3ff;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}
</style>

<style>
/* Variable CSS nativa para animar el borde gradiente */
@property --border-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
</style>
