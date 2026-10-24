<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  descriptionHtml: string
  screenshots?: string[]
  highlight?: string
}>()

const carouselRef = ref<HTMLElement | null>(null)

// Calcula el tamaño real de la captura y scrollea esa cantidad
function scrollCarousel(dir: number) {
  if (carouselRef.value) {
    const card = carouselRef.value.querySelector('.screenshot-card')
    const scrollAmount = card ? card.clientWidth + 20 : 300 // +20 por el gap
    carouselRef.value.scrollBy({ left: scrollAmount * dir, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="project-content" :style="{ '--content-highlight': highlight || '#a855f7' }">
    <!-- CARRUSEL HORIZONTAL -->
    <section v-if="screenshots && screenshots.length" class="screenshots-section">
      <div class="screenshots-header">
        <h3 class="section-title">Capturas</h3>

        <div class="carousel-controls">
          <button class="ctrl-btn" @click="scrollCarousel(-1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="ctrl-btn" @click="scrollCarousel(1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <div class="screenshots-carousel" ref="carouselRef">
        <div
          v-for="(img, index) in screenshots"
          :key="index"
          class="screenshot-card"
        >
          <img :src="img" :alt="`Captura ${index + 1}`" class="screenshot-img" />
        </div>
      </div>
    </section>

    <!-- DESCRIPCIÓN (MARKDOWN) -->
    <section class="description-section">
      <div class="markdown-body" v-html="descriptionHtml"></div>
    </section>
  </div>
</template>

<style scoped>
.project-content {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.screenshots-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.section-title {
  font-family: 'Fira Code', monospace;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: color-mix(in srgb, var(--content-highlight) 80%, #cbd5e1);
  margin: 0;
}

/* ============================================================
              CONTROLES DEL CARRUSEL
============================================================ */
.carousel-controls {
  display: flex;
  gap: 0.5rem;
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #cbd5e1;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
}

.ctrl-btn svg {
  width: 18px;
  height: 18px;
}

.ctrl-btn:hover {
  background: color-mix(in srgb, var(--content-highlight) 20%, transparent);
  border-color: var(--content-highlight);
  color: #f5f3ff;
  transform: translateY(-2px);
}

.ctrl-btn:active {
  transform: translateY(0) scale(0.95);
}

/* ============================================================
              CARRUSEL
============================================================ */
.screenshots-section {
  width: 100%;
}

.screenshots-carousel {
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--content-highlight) 40%, transparent) transparent;
}

.screenshots-carousel::-webkit-scrollbar {
  height: 6px;
}
.screenshots-carousel::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--content-highlight) 40%, transparent);
  border-radius: 999px;
}

.screenshot-card {
  /* Imágenes más pequeñas */
  flex: 0 0 clamp(240px, 30vw, 360px);
  scroll-snap-align: start;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(12, 8, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.08),
    6px 6px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.screenshot-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--content-highlight) 60%, transparent);
  box-shadow:
    6px 8px 24px rgba(0, 0, 0, 0.6),
    0 0 20px color-mix(in srgb, var(--content-highlight) 30%, transparent);
}

.screenshot-img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

/* ============================================================
              MARKDOWN
============================================================ */
.description-section {
  width: 100%;
}

:deep(.markdown-body) {
  color: #e2e8f0;
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.8;
  font-size: 1.05rem;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3) {
  font-family: 'Fira Code', monospace;
  color: #f5f3ff;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(.markdown-body h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid color-mix(in srgb, var(--content-highlight) 25%, transparent);
  padding-bottom: 0.5rem;
}

:deep(.markdown-body h3) {
  font-size: 1.2rem;
  color: color-mix(in srgb, var(--content-highlight) 80%, #f5f3ff);
}

:deep(.markdown-body p) {
  margin-bottom: 1.25rem;
}

:deep(.markdown-body ul) {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

:deep(.markdown-body li) {
  padding-left: 1rem;
  border-left: 2px solid color-mix(in srgb, var(--content-highlight) 40%, transparent);
}

:deep(.markdown-body blockquote) {
  border-left: 4px solid var(--content-highlight);
  margin: 1.5rem 0;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 10px 10px 0;
}
</style>
