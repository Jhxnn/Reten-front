# Reten-front

Interface do Reten — cada história tem uma trilha sonora.
React 19 + TypeScript + Vite, com React Router, TanStack Query, Lucide e CSS Modules.

A API fica no repositório [Reten-api](https://github.com/Jhxnn/Reten-api).

## Rodando

```bash
npm install
npm run dev        # http://localhost:5173
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

- Cores: tinta `#171717`, sépia `#382A23`, papel `#F3EBDD`, pergaminho `#D8C8AD`, oliva `#66715A`, dourado `#B69A69`.
- Tipografia: Bodoni Moda (títulos) e Schibsted Grotesk (texto), servidas localmente via Fontsource.
