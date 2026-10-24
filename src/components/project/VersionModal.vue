<!-- src/components/project/VersionModal.vue -->
<script setup lang="ts">
defineProps<{
  isOpen: boolean
  versions: string[]
  currentVersion: string
}>()

const emit = defineEmits(['close', 'select'])
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card">

        <div class="modal-header">
          <h3>Seleccionar Versión</h3>
          <button class="btn-close" @click="emit('close')">&times;</button>
        </div>

        <div class="modal-body">
          <ul class="version-list">
            <li
              v-for="ver in versions"
              :key="ver"
              class="version-item"
              :class="{ 'is-active': ver === currentVersion }"
              @click="emit('select', ver)"
            >
              <span>{{ ver }}</span>
              <span v-if="ver === currentVersion" class="badge-active">Actual</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(10, 7, 18, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.25s ease;
}

.modal-card {
  width: 100%;
  max-width: 400px;
  background: rgba(20, 14, 32, 0.95);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.modal-header h3 {
  margin: 0;
  font-family: 'Fira Code', monospace;
  font-size: 1.1rem;
  color: #f5f3ff;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s ease;
}

.btn-close:hover {
  color: #fff;
}

.modal-body {
  padding: 1rem;
}

.version-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.version-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  color: #e5e7eb;
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.version-item:hover {
  background: rgba(168, 85, 247, 0.15);
  border-color: rgba(168, 85, 247, 0.3);
}

.version-item.is-active {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.4);
  color: #4ade80;
}

.badge-active {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
