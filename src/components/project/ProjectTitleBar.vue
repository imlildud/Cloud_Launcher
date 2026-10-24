<!-- src/components/project/ProjectTitleBar.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import GameActionMenu from '../launcher/GameActionMenu.vue'

type ProjectCategory = 'games' | 'apps'

interface Props {
  gameId: string
  icon?: string
  name: string
  highlight: string
  tags?: string[]
  releaseDate?: string
  category?: ProjectCategory
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  tags: () => [],
  releaseDate: '',
  category: 'games'
})

const hovered = ref(false)

const MOCK_STATS = ref({
  playTimeHours: 12.5,
  lastPlayedIso: '2026-09-11T18:30:00Z',
  achievements: {
    current: 3,
    total: 16
  }
})

const achievementProgress = computed(() => {
  const { current, total } = MOCK_STATS.value.achievements
  if (total === 0) return 0
  return Math.min((current / total) * 100, 100)
})

function formatDate(iso: string, short: boolean = false) {
  if (!iso) return '--'
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: short ? 'short' : 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  } catch {
    return iso
  }
}
</script>

<template>
  <header
    class="project-titlebar"
    :style="{ '--bar-highlight': highlight }"
  >
    <div
      class="project-titlebar__inner"
      :class="{ 'project-titlebar__inner--hovered': hovered }"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <div class="project-titlebar__grid" aria-hidden="true"></div>

      <!-- Icono grande -->
      <div class="project-titlebar__icon">
        <img v-if="icon" :src="icon" :alt="name" />
      </div>

      <!-- Nombre (arriba) + Botón y tags (abajo) -->
      <div class="project-titlebar__meta">
        <h1 class="project-titlebar__name">{{ name }}</h1>

        <div class="project-titlebar__controls">
          <GameActionMenu :game-id="gameId" />

          <div class="project-titlebar__tags">
            <span v-if="releaseDate" class="project-titlebar__tag project-titlebar__tag--date">
              {{ formatDate(releaseDate) }}
            </span>
            <span
              v-for="tag in props.tags"
              :key="tag"
              class="project-titlebar__tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Estadísticas tipo Steam -->
      <div class="project-titlebar__stats">

        <div class="stat-block">
          <span class="stat-label">TIEMPO JUGADO</span>
          <span class="stat-value">{{ MOCK_STATS.playTimeHours.toFixed(1) }} hrs</span>
        </div>

        <div class="stat-block">
          <span class="stat-label">ÚLTIMA VEZ JUGADO</span>
          <span class="stat-value">{{ formatDate(MOCK_STATS.lastPlayedIso, true) }}</span>
        </div>

        <div class="stat-block stat-block--achievements">
          <div class="stat-achievements-text">
            <span class="stat-label">LOGROS</span>
            <span class="stat-value">
              {{ MOCK_STATS.achievements.current }}/{{ MOCK_STATS.achievements.total }}
            </span>
          </div>
          <div class="stat-progress-track">
            <div
              class="stat-progress-fill"
              :class="{ 'stat-progress-fill--completed': achievementProgress === 100 }"
              :style="{ width: `${achievementProgress}%` }"
            ></div>
          </div>
        </div>

      </div>

    </div>
  </header>
</template>

<style scoped>
.project-titlebar {
  position: sticky;
  top: 1rem;
  z-index: 50;
  margin: -80px auto 0;
  max-width: 1200px;
  padding: 0 1.5rem;
}

.project-titlebar__inner {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 20px;

  background: rgba(15, 10, 24, 0.65);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);

  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.15),
    inset 0 -1px 1px rgba(168, 85, 247, 0.08),
    6px 6px 28px rgba(0, 0, 0, 0.55),
    12px 12px 56px rgba(88, 28, 135, 0.2);

  transition: box-shadow 0.4s ease, background 0.4s ease;
}

.project-titlebar__inner--hovered {
  background: rgba(20, 13, 32, 0.75);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.22),
    inset 0 -1px 1px color-mix(in srgb, var(--bar-highlight) 45%, transparent),
    8px 8px 32px rgba(0, 0, 0, 0.6),
    16px 16px 72px color-mix(in srgb, var(--bar-highlight) 35%, transparent);
}

.project-titlebar__icon {
  position: relative;
  z-index: 1;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(10, 7, 18, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 0 20px color-mix(in srgb, var(--bar-highlight) 40%, transparent);
}

.project-titlebar__icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 6px;
}

.project-titlebar__meta {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
  flex: 1; /* Permite que el contenedor empuje las estadísticas hacia la derecha */
}

.project-titlebar__name {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: clamp(1.4rem, 1.6vw, 2.2rem);
  font-weight: 700;
  color: #f5f3ff;
  text-shadow:
    0 1px 0 #000,
    0 2px 8px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-titlebar__controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.project-titlebar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.project-titlebar__tag {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.05);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    inset 0 -1px 1px rgba(0, 0, 0, 0.2);
}

.project-titlebar__tag--date {
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.04);
}

/* ============================================================
                 ESTADÍSTICAS TIPO STEAM
============================================================ */
.project-titlebar__stats {
  position: relative;
  z-index: 1;
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-left: 2rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  justify-content: center;
}

.stat-label {
  font-family: 'Fira Code', monospace;
  font-size: 0.65rem;
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

.stat-value {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: #f5f3ff;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
}

.stat-block--achievements {
  min-width: 140px;
}

.stat-achievements-text {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.3rem;
}

.stat-progress-track {
  height: 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.6);
}

.stat-progress-fill {
  height: 100%;
  background: var(--bar-highlight);
  border-radius: 3px;
  box-shadow: 0 0 10px color-mix(in srgb, var(--bar-highlight) 60%, transparent);
  transition: width 0.4s ease, background 0.4s ease;
}

.stat-progress-fill--completed {
  background: #22c55e !important;
  box-shadow: 0 0 12px #22c55e !important;
}

/* ============================================================
                        RESPONSIVE
============================================================ */
@media (max-width: 900px) {
  .project-titlebar__stats {
    display: none;
  }
}

@media (max-width: 640px) {
  .project-titlebar {
    top: 0.5rem;
    padding: 0 1rem;
  }
  .project-titlebar__inner {
    padding: 1rem 1.1rem;
    gap: 0.9rem;
  }
  .project-titlebar__icon {
    width: 60px;
    height: 60px;
  }
}
</style>
