import type { ListeningMode } from './api'

/** Os três modos, apresentados como os lados de um mesmo disco (mesma linguagem da landing). */
export const listeningModes: { id: ListeningMode; side: string; name: string; summary: string }[] = [
  {
    id: 'THEMATIC',
    side: 'Lado A',
    name: 'Trilha temática',
    summary: 'Trilhas de cinema e peças instrumentais que soam como o mundo do livro.',
  },
  {
    id: 'VOCAL',
    side: 'Lado B',
    name: 'Músicas com voz',
    summary: 'Canções de vários gêneros que carregam os sentimentos da história.',
  },
  {
    id: 'FOCUS',
    side: 'Lado C',
    name: 'Concentração',
    summary: 'Lo-fi, ambient e piano suave para ler por horas sem distração.',
  },
]

export function modeName(mode: ListeningMode) {
  return listeningModes.find((m) => m.id === mode)?.name ?? mode
}
