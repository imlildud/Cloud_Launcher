<!-- src/components/launcher/GameActionMenu.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import VersionModal from '../project/VersionModal.vue'

const props = defineProps<{
  gameId: string
}>()

const isDropdownOpen = ref(false)
const isModalOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const buttonRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({ top: '0px', left: '0px', width: '240px' })

const isInstalled = ref(false)
const currentVersion = ref('v1.2.0')
const mockVersions = ['v1.2.0', 'v1.1.5', 'v1.0.0', 'beta-0.9']
const autoUpdate = ref(true)

watch(() => props.gameId, async (newId) => {
  isInstalled.value = newId === 'bee-fight'
}, { immediate: true })

function toggleDropdown() {
  if (!isDropdownOpen.value && buttonRef.value) {
    const rect = buttonRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      width: '240px'
    }
  }
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node) &&
      buttonRef.value && !buttonRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onUnmounted(() => window.removeEventListener('click', handleClickOutside))

function handlePrimaryAction() {
  if (isInstalled.value) {
    console.log(`Lanzando ${props.gameId}...`)
  } else {
    console.log(`Iniciando descarga de ${props.gameId}...`)
  }
}

function openVersions() {
  isDropdownOpen.value = false
  isModalOpen.value = true
}

function handleVersionSelect(version: string) {
  currentVersion.value = version
  // Ya no cerramos el modal aquí: isModalOpen.value = false se elimina
}
</script>

<template>
  <div class="action-group" :class="{ 'state-installed': isInstalled, 'state-download': !isInstalled }">
    <button class="btn-primary" @click="handlePrimaryAction">
      {{ isInstalled ? 'Jugar' : 'Descargar' }}
    </button>

    <div class="dropdown-wrapper">
      <button ref="buttonRef" class="btn-arrow" @click.stop="toggleDropdown">▼</button>
    </div>

    <Teleport to="body">
      <ul v-if="isDropdownOpen" ref="dropdownRef" class="dropdown-menu" :style="dropdownStyle">
        <li class="menu-item version-info">Versión: {{ currentVersion }}</li>
        <hr class="divider" />
        <li class="menu-item" @click="openVersions">Cambiar versión</li>
        <li class="menu-item">
          <label class="checkbox-label" @click.stop>
            <input type="checkbox" v-model="autoUpdate" /> Act. Automática
          </label>
        </li>
        <hr class="divider" />
        <li class="menu-item danger">Desinstalar</li>
      </ul>
    </Teleport>

    <VersionModal
      :is-open="isModalOpen"
      :versions="mockVersions"
      :current-version="currentVersion"
      @close="isModalOpen = false"
      @select="handleVersionSelect"
    />
  </div>
</template>

<style scoped>
.action-group {
  display: inline-flex;
  align-items: stretch;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.dropdown-wrapper {
  position: relative;
  display: flex;
  align-items: stretch;
}

.btn-primary, .btn-arrow {
  border: none;
  color: #111;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: background 0.3s ease;
}

.btn-primary:active, .btn-arrow:active {
  transform: scale(0.96);
}

.btn-primary {
  padding: 1rem 3rem;
  border-radius: 12px 0 0 12px;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-arrow {
  display: flex;
  align-items: center;
  padding: 0 1.2rem;
  border-radius: 0 12px 12px 0;
  border-left: 1px solid rgba(0, 0, 0, 0.2);
}

.state-download .btn-primary,
.state-download .btn-arrow {
  background: rgba(234, 179, 8, 0.9);
}
.state-download .btn-primary:hover,
.state-download .btn-arrow:hover {
  background: rgba(250, 204, 21, 1);
}

.state-installed .btn-primary,
.state-installed .btn-arrow {
  background: rgba(34, 197, 94, 0.9);
  color: #fff;
}
.state-installed .btn-primary:hover,
.state-installed .btn-arrow:hover {
  background: rgba(22, 163, 74, 1);
}
.state-installed .btn-arrow {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.dropdown-menu {
  position: fixed;
  z-index: 99999;
  background: rgba(20, 14, 32, 0.95);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 10px;
  padding: 0.5rem 0;
  list-style: none;
  margin: 0;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
}
.menu-item { padding: 0.85rem 1.25rem; color: #e5e7eb; font-size: 0.95rem; cursor: pointer; transition: background 0.2s ease;}
.menu-item:hover:not(.version-info) { background: rgba(168, 85, 247, 0.2); }
.menu-item.danger { color: #ef4444; }
.version-info { font-size: 0.85rem; color: #94a3b8; cursor: default; }
.divider { border-color: rgba(255, 255, 255, 0.05); margin: 0.2rem 0; }
.checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; width: 100%; }
</style>
