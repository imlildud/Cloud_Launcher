// src/composables/useMarkdown.ts
// ============================================================
//          MINI PARSER DE MARKDOWN (sin dependencias)
// ============================================================
// Soporta:
//   ## H2        → <h2>
//   ### H3       → <h3>
//   **negrita**  → <strong>
//   *cursiva*    → <em>
//   - item       → lista con viñeta
//   ✦ item       → mismo tratamiento que "-"
//   Párrafos separados por línea en blanco.
//
// Se cachea por contenido: si parseas el mismo string dos veces,
// devuelve el resultado ya calculado. Con esto el coste real es
// "una vez por visita al proyecto" en vez de en cada render.
// ============================================================

const cache = new Map<string, string>()

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Inline: **bold**, *italic*
function parseInline(text: string): string {
  // Escapamos primero para neutralizar HTML del input
  let out = escapeHtml(text)
  // **bold** (no greedy, sin cruzar saltos de línea)
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  // *italic* — evitamos chocar con lo que ya es <strong>
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  return out
}

function parseBlock(block: string): string {
  const trimmed = block.trim()
  if (!trimmed) return ''

  // ## H2
  if (trimmed.startsWith('## ')) {
    return `<h2>${parseInline(trimmed.slice(3))}</h2>`
  }
  // ### H3
  if (trimmed.startsWith('### ')) {
    return `<h3>${parseInline(trimmed.slice(4))}</h3>`
  }
  // #### H4 (por si acaso)
  if (trimmed.startsWith('#### ')) {
    return `<h4>${parseInline(trimmed.slice(5))}</h4>`
  }

  // Listas: líneas que empiezan con "-" o "✦"
  const lines = trimmed.split('\n')
  const isList = lines.every(
    l => /^\s*(-|✦)\s+/.test(l) || l.trim() === ''
  )
  if (isList) {
    const items = lines
      .filter(l => /^\s*(-|✦)\s+/.test(l))
      .map(l => {
        const content = l.replace(/^\s*(-|✦)\s+/, '')
        return `<li>${parseInline(content)}</li>`
      })
      .join('')
    return `<ul>${items}</ul>`
  }

  // Párrafo normal (respetando saltos internos como <br>)
  return `<p>${parseInline(trimmed).replace(/\n/g, '<br>')}</p>`
}

export function renderMarkdown(source: string): string {
  if (cache.has(source)) return cache.get(source)!

  // Separar por doble salto de línea (párrafos/bloques)
  const blocks = source
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map(parseBlock)
    .filter(Boolean)
    .join('\n')

  cache.set(source, blocks)
  return blocks
}
