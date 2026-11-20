/*
 * Conteúdo editorial da landing page.
 * Os exemplos abaixo foram escolhidos à mão pela equipe do Reten para ilustrar o conceito —
 * não são resultado de uma geração por IA e são apresentados na página como exemplo editorial.
 * As faixas citadas existem; no produto, cada faixa é verificada na Spotify Web API.
 */
import type { CoverTone } from '../../components/book/TypographicCover'

export type ListeningModeId = 'thematic' | 'vocal' | 'focus'

export type DemoTrack = {
  title: string
  artist: string
  reason: string
}

export type ListeningMode = {
  id: ListeningModeId
  /** Cada modo é apresentado como um lado do mesmo disco. */
  side: string
  name: string
  playlistName: string
  summary: string
  tracks: DemoTrack[]
}

export const demoBook = {
  title: 'O Nome do Vento',
  author: 'Patrick Rothfuss',
  tone: 'forest' as CoverTone,
  atmosphere: ['Fantasia', 'Mistério', 'Melancolia', 'Contemplação', 'Aventura épica'],
}

export const listeningModes: ListeningMode[] = [
  {
    id: 'thematic',
    side: 'Lado A',
    name: 'Trilha temática',
    playlistName: 'Silêncio em três partes',
    summary: 'Trilhas de cinema e peças instrumentais que soam como o mundo do livro.',
    tracks: [
      { title: 'On the Nature of Daylight', artist: 'Max Richter', reason: 'Cordas lentas para o silêncio em três partes que abre a história.' },
      { title: 'Flight from the City', artist: 'Jóhann Jóhannsson', reason: 'Um piano que caminha sozinho, como Kvothe pelas ruas de Tarbean.' },
      { title: 'Saman', artist: 'Ólafur Arnalds', reason: 'Íntima e frágil, para as noites de alaúde e memória.' },
      { title: 'The Last of Us', artist: 'Gustavo Santaolalla', reason: 'Cordas dedilhadas para a estrada da trupe Edema Ruh.' },
      { title: 'Time', artist: 'Hans Zimmer', reason: 'O crescendo de quem está contando a própria lenda.' },
    ],
  },
  {
    id: 'vocal',
    side: 'Lado B',
    name: 'Músicas com voz',
    playlistName: 'Canções da trupe',
    summary: 'Canções de vários gêneros que carregam os sentimentos da história.',
    tracks: [
      { title: "The Mummers' Dance", artist: 'Loreena McKennitt', reason: 'Celta e ritual, como as canções levadas de cidade em cidade.' },
      { title: 'Holocene', artist: 'Bon Iver', reason: 'A sensação de ser pequeno diante de algo muito antigo.' },
      { title: 'Blue Ridge Mountains', artist: 'Fleet Foxes', reason: 'Harmonias de estrada e saudade de casa.' },
      { title: 'Riverside', artist: 'Agnes Obel', reason: 'Água escura e piano: a melancolia por trás do talento.' },
      { title: "The Blower's Daughter", artist: 'Damien Rice', reason: 'Para Denna, sempre um passo fora de alcance.' },
    ],
  },
  {
    id: 'focus',
    side: 'Lado C',
    name: 'Concentração',
    playlistName: 'Uma tarde nos Arquivos',
    summary: 'Lo-fi, ambient e piano suave para ler por horas sem distração.',
    tracks: [
      { title: 'Aruarian Dance', artist: 'Nujabes', reason: 'Batida leve e flauta: ritmo de estudo nos Arquivos.' },
      { title: 'An Ending (Ascent)', artist: 'Brian Eno', reason: 'Ambiente aberto, sem palavras, para capítulos longos.' },
      { title: 'Gymnopédie No. 1', artist: 'Erik Satie', reason: 'Piano espaçado que não disputa atenção com o texto.' },
      { title: 'Says', artist: 'Nils Frahm', reason: 'Repetição hipnótica para ler sem perceber o tempo.' },
      { title: 'Water Copy', artist: 'Hiroshi Yoshimura', reason: 'Gotas de sintetizador, quase silêncio.' },
    ],
  },
]

/** O sumário de climas: o que o Reten procura num livro antes de escolher qualquer música. */
export const atmosphereIndex = [
  { title: 'Duna', author: 'Frank Herbert', mood: 'deserto, profecia, vastidão' },
  { title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', mood: 'memória, calor, destino circular' },
  { title: 'O Morro dos Ventos Uivantes', author: 'Emily Brontë', mood: 'vento, obsessão, charneca' },
  { title: 'Grande Sertão: Veredas', author: 'Guimarães Rosa', mood: 'travessia, pacto, sertão' },
  { title: 'Orgulho e Preconceito', author: 'Jane Austen', mood: 'salões, ironia, afeto contido' },
  { title: 'Frankenstein', author: 'Mary Shelley', mood: 'gelo, culpa, solidão' },
]

/** Lombadas da estante do hero. Os títulos aparecem nas lombadas mais largas. */
export const shelfTitles = [
  'Dom Casmurro',
  'O Nome do Vento',
  'Duna',
  'Cem Anos de Solidão',
  'A Hora da Estrela',
  'Frankenstein',
  'Grande Sertão: Veredas',
  'Orgulho e Preconceito',
  'O Morro dos Ventos Uivantes',
  'Memórias Póstumas de Brás Cubas',
]
