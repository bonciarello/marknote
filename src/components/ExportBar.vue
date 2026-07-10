<script setup>
const emit = defineEmits(['export-html', 'export-txt'])

function handleHtml() { emit('export-html') }
function handleTxt() { emit('export-txt') }
</script>

<template>
  <footer class="export-bar">
    <div class="export-hint">Scarica la nota come</div>
    <div class="export-actions">
      <button class="export-btn export-html" @click="handleHtml" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        HTML
      </button>
      <button class="export-btn export-txt" @click="handleTxt" type="button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        TXT
      </button>
    </div>
  </footer>
</template>

<style scoped>
.export-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-card);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.export-hint {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.export-actions {
  display: flex;
  gap: var(--space-2);
}

.export-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast), transform var(--transition-fast), box-shadow var(--transition-fast);
  min-height: 40px;
  white-space: nowrap;
  color: #FFF;
}

.export-btn:active {
  transform: scale(0.97);
}

.export-html {
  background: var(--color-accent);
}

.export-html:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-md);
}

.export-txt {
  background: var(--color-accent-blue);
}

.export-txt:hover {
  background: var(--color-accent-blue-hover);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .export-bar {
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }

  .export-btn {
    flex: 1;
    justify-content: center;
  }

  .export-actions {
    width: 100%;
  }
}
</style>
