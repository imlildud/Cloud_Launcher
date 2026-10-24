<!-- src/views/LauncherView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useGames } from '../composables/useGames'
import { renderMarkdown } from '../composables/useMarkdown'
import GameSidebar from '../components/launcher/GameSidebar.vue'
import ProjectContent from '../components/project/ProjectContent.vue'
import ProjectTitleBar from '../components/project/ProjectTitleBar.vue'

const { games, loadGameAssets } = useGames()
const activeIndex = ref(0)

const gamesPreloaded = computed(() => {
  return games.map(game => {
    const assets = loadGameAssets(game)
    return {
      ...game,
      assets,
      html: renderMarkdown(assets.rawDescription || '')
    }
  })
})

onMounted(() => {
  gamesPreloaded.value.forEach(g => {
    if (!g.assets.wallpaper) return
    const img = new Image()
    img.src = g.assets.wallpaper
    img.decode().catch(() => {})
  })
})

let isScrolling = false
function handleWheel(event: WheelEvent) {
  if (isScrolling) return
  isScrolling = true
  setTimeout(() => { isScrolling = false }, 350)

  if (event.deltaY > 0) {
    activeIndex.value = Math.min(activeIndex.value + 1, games.length - 1)
  } else {
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  }
}
</script>

<template>
  <div class="launcher-layout">
    <GameSidebar
      :games="games"
      :active-index="activeIndex"
      @update:active-index="activeIndex = $event"
      @wheel="handleWheel"
    />

    <main class="launcher-main">
      <div
        class="views-track"
        :style="{ transform: `translateY(-${activeIndex * 100}%)` }"
      >
        <div v-for="game in gamesPreloaded" :key="game.id" class="game-view">

          <div class="hero-banner">
            <img
              v-if="game.assets.wallpaper"
              :src="game.assets.wallpaper"
              class="hero-wallpaper"
              decoding="async"
            />
            <div class="hero-overlay"></div>
          </div>

          <!-- TitleBar Sticky de Steam con el ID para el botón y el logo correcto -->
          <ProjectTitleBar
            :game-id="game.id"
            :icon="game.assets.titlecon"
            :name="game.name"
            :highlight="game.highlight"
            :tags="(game as any).tags || []"
            :release-date="(game as any).releaseDate || ''"
            :category="(game as any).category || 'games'"
          />

          <div class="game-details">
            <ProjectContent
              :description-html="game.html"
              :screenshots="game.assets.screenshots"
              :highlight="game.highlight"
            />
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.launcher-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background-color: #0a0712;
  background-image: url('../assets/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.launcher-main {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.views-track {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

.game-view {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  contain: layout paint;
  transform: translateZ(0);
}

.hero-banner {
  position: relative;
  height: 48vh;
  min-height: 340px;
  display: flex;
  align-items: flex-end;
  padding: 3rem;
  flex-shrink: 0;
}

.hero-wallpaper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(10, 7, 18, 0.95) 0%,
    rgba(10, 7, 18, 0.4) 60%,
    rgba(10, 7, 18, 0.1) 100%
  );
  z-index: 1;
}

.game-details {
  padding: 3rem;
  padding-top: 5rem;
  flex: 1;
  background: rgba(10, 7, 18, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
</style>
