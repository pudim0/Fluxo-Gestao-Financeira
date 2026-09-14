# Fluxo

Fluxo é um aplicativo web de organização financeira pessoal desenvolvido com Angular, pensado para centralizar controle de receitas, despesas, orçamento, metas e perfil financeiro do usuário em uma interface moderna e responsiva.

A ideia do produto está alinhada ao roadmap do projeto: começar com uma base sólida em frontend, evoluindo para uma plataforma financeira completa, com autenticação real, persistência em backend, relatórios e, no futuro, Open Finance e IA financeira.

## Status atual do projeto

Este repositório representa a etapa de base e protótipo funcional do produto, com foco em:

- autenticação demonstrativa
- onboarding de perfil financeiro
- dashboard com indicadores de saldo, receitas e despesas
- cadastro, edição e exclusão de transações
- orçamento e metas
- notificações internas
- shell de aplicação, guards, services, design system e layout responsivo

O projeto ainda não implementa backend real, autenticação segura em produção, integrações bancárias nem IA financeira. O comportamento atual é orientado para demonstração e validação de fluxo de experiência.

## Visão do produto

O objetivo do Fluxo é ser um "copiloto financeiro" que ajude o usuário a:

- entender onde o dinheiro entra e sai
- acompanhar patrimônio e fluxo financeiro
- categorizar gastos
- controlar orçamento por categoria
- definir metas pessoais
- receber alertas e recomendações simples no app
- evoluir para cenários com Open Finance e IA no futuro

## Funcionalidades implementadas

### Autenticação e sessão

- cadastro e login de demonstração
- proteção de rotas com guards
- sessão persistida em localStorage para simular uma experiência real de frontend
- logout e recuperação de senha em fluxo inicial

### Onboarding e perfil financeiro

- cadastro de perfil inicial do usuário
- dados como objetivo financeiro, renda, dívidas, reserva de emergência e principais preocupações
- persistência por usuário em storage local

### Dashboard

- resumo financeiro com saldo, receitas e despesas
- visualização de movimentações recentes
- indicadores e destaques de categoria
- cards de alertas e visão de performance financeira

### Transações

- cadastro de receitas e despesas
- listagem e ordenação por data
- edição e remoção
- categorização com normalização de nomes
- cálculo de métricas do histórico financeiro

### Orçamento e metas

- estrutura para acompanhamento de orçamento
- definição de metas financeiras
- organização de objetivos e progresso do planejamento

### Notificações e configurações

- central de notificações
- tela de preferências/configurações
- fluxo de navegação e área de conteúdo do app

## Stack tecnológica

- Angular 21
- TypeScript
- Angular Router
- Standalone Components
- RxJS
- Angular Forms
- CSS customizado / design system interno
- internacionalização com @ngx-translate
- testes com Angular + Vitest / Playwright

## Estrutura do projeto

```text
fluxo/
├── angular.json
├── package.json
├── tsconfig.json
├── public/
├── src/
│   ├── app/
│   │   ├── core/
│   │   ├── features/
│   │   ├── layout/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── shared/
│   │   ├── utils/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── index.html
│   └── styles.css
└── README.md
```

## Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js 20+ recomendado
- npm

## Instalação

No diretório do projeto:

```bash
npm install
```

## Executando o projeto

Para iniciar o ambiente de desenvolvimento:

```bash
npm start
```

A aplicação será aberta em:

```text
http://localhost:4201/
```

## Build de produção

```bash
npm run build
```

Os artefatos gerados ficam na pasta `dist/`.

## Testes

Para rodar os testes do projeto:

```bash
npm test -- --watch=false
```

## Observações importantes sobre persistência e segurança

A autenticação e parte da persistência no projeto são implementadas como demonstração de frontend.

- token de sessão e e-mail são armazenados em localStorage
- dados de perfil, transações e metas são persistidos localmente por usuário
- o comportamento é útil para prototipagem e validação de UX
- esta solução não deve ser tratada como autenticação ou segurança de produção

Em produção, o ideal é:

- autenticação real com backend
- tokens emitidos pelo servidor
- autorização por usuário
- persistência segura em banco de dados
- isolamento de dados por conta de usuário
- validação, logs e regras de negócio no backend

## Roadmap e maturidade

A implementação atual está mais próxima da fase de "Fundação + Transações + Dashboard" do roadmap financeiro do produto, conforme a visão do projeto:

- ✅ base Angular e arquitetura inicial
- ✅ shell, guards, services e design system
- ✅ autenticação demonstrativa
- ✅ perfil financeiro, transações e dashboard inicial
- ✅ navegação e estados de app
- ⏳ backend real
- ⏳ Open Finance
- ⏳ IA financeira
- ⏳ relatórios avançados e notificações inteligentes

## Contribuição

Contribuições são bem-vindas. Para manter a qualidade do projeto, é recomendado:

- manter o código alinhado com a arquitetura atual do Angular
- preservar o padrão de componentes standalone
- validar alterações com testes e build local
- evitar prometer recursos que ainda não existem no backend ou no produto real

## Licença

Este projeto não possui licença definida no repositório neste momento.

## Referência de produto

O presente README foi alinhado ao roadmap e à visão do produto documentados no projeto, priorizando a realidade da implementação atual em frontend e deixando explícito que o fluxo completo de gestão financeira e IA ainda será evoluído em etapas futuras.
