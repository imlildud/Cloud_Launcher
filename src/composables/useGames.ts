import { ref } from 'vue'
import { gamesData, type Game } from '../data/games'

// Carga todos los archivos .md de las carpetas de assets como texto sin procesar
const markdownFiles = import.meta.glob('../assets/**/description.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

export function useGames() {
  const games = gamesData

  const loadGameAssets = (game: Game) => {
    const folderPath = `../assets/${game.folder}`

    // Resuelve las imágenes principales
    const background = new URL(`${folderPath}/background.webp`, import.meta.url).href
    const wallpaper = new URL(`${folderPath}/wallpaper.webp`, import.meta.url).href
    const icon = new URL(`${folderPath}/iconcard.webp`, import.meta.url).href
    const titlecon = new URL(`${folderPath}/icon.webp`, import.meta.url).href
    const logo = new URL(`${folderPath}/logo.webp`, import.meta.url).href

    // Resuelve las capturas de pantalla dentro de /screenshots/
    const screenshots = game.screenshots.map(
      file => new URL(`${folderPath}/screenshots/${file}`, import.meta.url).href
    )

    // Obtiene el contenido crudo del .md guardado en la carpeta del juego
    const rawDescription = (markdownFiles[`${folderPath}/description.md`] as string) || ''

    return {
      background,
      wallpaper,
      icon,
      titlecon,
      logo,
      screenshots,
      rawDescription
    }
  }

  return { games, loadGameAssets }
}
