# Reten-front

Interface do Reten — cada história tem uma trilha sonora.
React 19 + TypeScript + Vite, com React Router, TanStack Query, Lucide e CSS Modules.

A API fica no repositório [Reten-api](https://github.com/Jhxnn/Reten-api).

## Rodando

```bash
npm install
npm run dev        # http://127.0.0.1:5173 (use 127.0.0.1, não localhost: exigência do OAuth da Spotify)
```

Em desenvolvimento, as chamadas para `/api` são encaminhadas para a API em `http://localhost:8090`
(altere com `RETEN_API_URL` num arquivo `.env.local`). Frontend e API compartilham a mesma origem,
o que mantém o cookie de sessão first-party e dispensa CORS.

Outros comandos: `npm run build`, `npm run lint`, `npm run preview`.

## Estrutura

```
src/
├── app/           providers, roteador e cliente do TanStack Query
├── styles/        tokens de design (cores, tipografia, espaço) e estilos globais
├── components/
│   ├── brand/     logo e marca
│   ├── ui/        componentes básicos (botões)
│   └── book/      capa tipográfica (também usada quando um livro não tem imagem)
└── pages/
    ├── landing/   página inicial e suas seções
    └── upcoming/  páginas de rotas ainda em construção
```

## Identidade visual

- Cores: branco `#FAFAF7`, verde quase preto `#10241E`, verde-floresta `#1F5C4A`, menta `#D3E6DA`, sálvia `#8FB5A2`.
- Tipografia: Fraunces em pesos leves (títulos) e Manrope (texto), servidas localmente via Fontsource.
- Marca: três barras de alturas diferentes — livros na estante e equalizador ao mesmo tempo.
