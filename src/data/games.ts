export interface Game {
  id: string
  name: string
  folder: string
  highlight: string
  screenshots: string[]
}

export const gamesData: Game[] = [
  {
    id: 'nuclearstic',
    name: 'Nuclear-Stic Mines',
    folder: 'nuclearstic',
    highlight: '#ffe0a9',
    screenshots: ['1.webp', '2.webp','3.webp', '4.webp','5.webp'],
  },
  {
      id: 'test',
      name: 'test',
      folder: 'test',
      highlight: '#1ab308',
      screenshots: ['screen1.jpg', 'screen2.jpg'] // Nombres de los archivos en assets/beefight/
  },
  {
      id: 'test2',
      name: 'test2',
      folder: 'test2',
      highlight: '#a308',
      screenshots: ['screen1.jpg', 'screen2.jpg'] // Nombres de los archivos en assets/beefight/
  },
  {
      id: 'test3',
      name: 'test3',
      folder: 'test3',
      highlight: '#208',
      screenshots: ['screen1.jpg', 'screen2.jpg'] // Nombres de los archivos en assets/beefight/
  },
]
