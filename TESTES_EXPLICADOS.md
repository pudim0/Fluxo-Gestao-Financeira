# Testes do Fluxo

Todos os nomes de suítes e casos (`describe`, `it` e `test`) foram padronizados em português. Abaixo está o papel de cada grupo e o motivo de usar o tipo de teste atual.

## Como interpretar

- **Teste unitário:** verifica uma função, serviço ou regra isolada. É rápido e aponta diretamente a regra que falhou.
- **Teste de componente:** cria um componente Angular com `TestBed` e verifica estado, template e eventos. É mais próximo do uso real sem depender de um navegador completo.
- **Teste de integração:** verifica a colaboração entre partes, como componente, serviço, roteador, armazenamento ou HTTP simulado.
- **Teste E2E:** abre um navegador e percorre um fluxo completo. É o mais próximo da experiência do usuário, mas é mais lento e mais sensível ao ambiente.

## Testes Angular

### Aplicação principal (`fluxo/src/app/app.spec.ts`)

Tipo: componente. O `TestBed` cria a aplicação e verifica sua estrutura mínima.

- **Deve criar a aplicação:** confirma que a classe raiz é instanciada sem erro. É um teste unitário de sanidade, útil para detectar problemas de configuração e dependências.
- **Deve renderizar o ponto de saída do roteador:** procura o `router-outlet` no DOM. É melhor que testar apenas uma propriedade porque valida o contrato visual essencial da aplicação.

Testes possíveis: verificar uma rota inicial e o título da página. Esses testes seriam complementares, mas o teste estrutural atual é mais barato e identifica falhas de bootstrap antes de testar navegação.

### Proteções de rota (`fluxo/src/app/core/guards/*.spec.ts`)

Tipo: integração leve. Os guards são executados em um contexto de injeção real, com `AuthService` e `Router` do Angular.

- **Permite que usuários autenticados continuem:** cria uma sessão e espera `true`. Cobre o caminho permitido.
- **Redireciona usuários anônimos para o login com a rota pretendida:** verifica a URL `/login?redirectTo=...`. Validar a URL completa é melhor que apenas verificar se houve redirecionamento, pois protege também o retorno à rota original.
- **Permite que usuários anônimos acessem páginas públicas de autenticação:** confirma o caminho permitido pelo guard de visitante.
- **Redireciona usuários autenticados para o painel:** confirma que uma sessão ativa não volta para login/cadastro e termina no painel.

Testes possíveis: testar uma URL com parâmetros, uma rota filha e uma sessão expirada. São variações úteis, mas os casos atuais cobrem as duas decisões principais de cada guard com menos duplicação.

### Serviços de autenticação e idioma (`fluxo/src/app/core/services/*.spec.ts`)

Tipo: unitário com dependência real de `localStorage` isolada por `beforeEach`.

- **Inicia e encerra a sessão temporária de demonstração:** verifica a transição anônimo -> autenticado -> anônimo.
- **Não aceita um token vazio como sessão autenticada:** verifica que o estado inicial sem credencial não concede acesso.
- **Usa português quando não existe idioma armazenado:** valida o padrão do serviço e o idioma efetivamente configurado no tradutor.
- **Carrega um idioma armazenado válido e persiste as alterações:** valida leitura, alteração, persistência e atualização do `TranslateService`.

Testes possíveis: token inválido, recuperação após recarregar a página e idioma armazenado desconhecido. Os testes atuais são melhores como base porque cobrem os contratos de estado e persistência sem depender de rede ou navegador.

### Login (`fluxo/src/app/features/auth/login.spec.ts`)

Tipo: integração de componente. O componente real usa um `AuthService`, uma rota ativada e um `Router` falso observável.

- **Rejeita um e-mail inválido antes de navegar:** garante validação antecipada e impede efeito colateral de navegação.
- **Inicia uma sessão e preserva `redirectTo` em um login válido:** confirma autenticação e navegação para a rota pretendida.

Testes possíveis: senha vazia, e-mail válido com senha inválida, ausência de `redirectTo` e mensagens exibidas no template. Os casos atuais priorizam as duas decisões de maior risco: bloquear entrada inválida e concluir o fluxo válido.

### Orçamento (`fluxo/src/app/features/budget/budget.spec.ts`)

Tipo: unitário de regras de negócio com o componente e o serviço de transações simulados.

- **Calcula categorias, despesas mensais e orçamento restante:** verifica filtros e cálculos derivados para um mês.
- **Trata listas de transações vazias e salva um novo limite válido:** cobre estado sem dados, validação de categoria e persistência por usuário.
- **Rejeita limites inválidos, edita os existentes e os remove:** testa validação, atualização, exclusão e feedback quando não há item.
- **Marca categorias acima do limite como alertas:** verifica a regra que transforma excesso de gasto em alerta.

Testes possíveis: dois meses, limites decimais, categorias repetidas e exatamente no limite. Os atuais oferecem maior cobertura por caso e mantêm o teste rápido, enquanto um E2E seria excessivo para cálculos puros.

### Painel (`fluxo/src/app/features/dashboard/dashboard.spec.ts`)

Tipo: componente com integração do template, `TransactionsService` e roteador de teste.

- **Deve criar o componente:** verifica inicialização.
- **Deve renderizar cartões de métricas:** garante que o resumo financeiro está presente no DOM.
- **Deve renderizar os painéis de visão geral do modelo do painel:** verifica as duas regiões principais da tela.
- **Exibe somente três transações recentes na prévia do painel:** protege o limite de itens exibidos.
- **Renderiza links rápidos para notificações, transações e metas:** verifica quantidade e destinos dos links.

Testes possíveis: valores exibidos nos cartões, estado vazio e ativação dos links. Os testes atuais são melhores para a estrutura porque não ficam presos a detalhes de estilo ou a um navegador real.

### Metas (`fluxo/src/app/features/goals/goals.spec.ts`)

Tipo: componente e estado persistido localmente.

- **Deve criar o componente:** verifica instanciação.
- **Deve mostrar a dica do gráfico quando um ponto é selecionado:** simula interação no SVG e verifica conteúdo derivado.
- **Deve adicionar e remover contribuições:** valida a aritmética do valor economizado.
- **Deve adicionar uma nova meta com valor economizado igual a zero:** confirma o estado inicial de uma meta.
- **Deve persistir alterações das metas no armazenamento local:** verifica o efeito externo da alteração.

Testes possíveis: valor negativo, meta concluída, dados corrompidos e seleção de cada ponto do gráfico. Os casos atuais protegem regras e interação sem o custo de screenshot ou E2E.

### Notificações (`fluxo/src/app/features/notifications/notifications.spec.ts`)

Tipo: componente. O fixture verifica tanto o DOM quanto os sinais públicos do componente.

- **Deve criar o componente:** verifica instanciação.
- **Deve renderizar o feed de notificações:** confere título, cartões de resumo e itens.
- **Deve disponibilizar a lista de notificações no componente:** verifica quantidade e dados representativos.
- **Marca uma única notificação como lida:** valida alteração pontual e contador.
- **Marca todas as notificações como lidas:** valida a ação em lote e contador zerado.

Testes possíveis: persistência após recarregar, notificação inexistente e filtro por categoria. Os testes atuais cobrem o comportamento individual e em lote, que são os dois caminhos funcionais principais.

### Integração inicial (`fluxo/src/app/features/onboarding/onboarding/onboarding.spec.ts`)

Tipo: integração de componente. O fluxo combina formulário, sinais, serviço de perfil e roteador simulado.

- **Deve criar o componente:** verifica instanciação.
- **Renderiza o estado de boas-vindas e inicia o questionário:** confirma tela inicial e transição para perguntas.
- **Impede o avanço com respostas inválidas e aceita uma renda formatada:** verifica bloqueio de avanço e normalização de valor monetário.
- **Remove as respostas de dívida quando o usuário muda para sem dívidas:** protege a consistência entre respostas dependentes.
- **Permite selecionar e desselecionar tipos de dívida:** valida comportamento de alternância.
- **Conclui um fluxo válido sem dívidas e navega para o painel:** verifica resumo, salvamento e navegação final.

Testes possíveis: fluxo com dívida, retorno para etapa anterior, renda inválida e atualização de perfil existente. Os casos atuais são melhores porque cobrem transições e regras de dependência com mocks determinísticos, sem precisar preencher a tela inteira pelo navegador.

### Relatórios (`fluxo/src/app/features/reports/reports.spec.ts`)

Tipo: unitário de transformação de dados dentro do componente, com transações controladas por sinal.

- **Cria seis linhas mensais e trata dados de despesas vazios:** verifica série padrão e comportamento sem dados.
- **Agrupa despesas por categoria e calcula saldos mensais:** confirma agrupamento, percentual, receita, despesa e saldo.

Testes possíveis: meses sem movimentação no meio da série, percentuais arredondados e somente receitas. Os casos atuais verificam simultaneamente o cenário vazio e um cenário representativo com categorias distintas.

### Configurações (`fluxo/src/app/features/settings/settings.spec.ts`)

Tipo: componente com serviço de idioma e efeitos do navegador simulados.

- **Alterna entre abas de configurações:** verifica estado ativo para duas opções.
- **Delega alterações de idioma ao serviço:** confirma que o componente não duplica a regra do serviço.
- **Alterna o tema e abre canais de suporte:** verifica estado, persistência e chamadas de suporte.

Testes possíveis: tema armazenado ao criar o componente, opção de aba inválida e falha de abertura de janela. Os atuais são melhores para o contrato público do componente e evitam testar a implementação interna do serviço de idioma novamente.

### Transações (`fluxo/src/app/features/transactions/transactions.spec.ts`)

Tipo: componente com serviço simulado. A suíte verifica filtros, estados visuais, validação e chamadas CRUD.

- **Filtra pela busca e retorna resultado vazio para filtros sem correspondência:** valida filtro e limpeza do filtro.
- **Calcula os totais de receitas e despesas:** verifica agregação separada por tipo.
- **Renderiza os estados de carregamento, erro e vazio:** garante mensagens para os três estados principais.
- **Rejeita formulários inválidos e salva fluxos válidos de criação e edição:** verifica validação e chamadas de criação/atualização.
- **Trata a criação de categorias e a exclusão confirmada:** valida normalização da categoria e exclusão após confirmação.
- **Deve mostrar mensagem quando a descrição estiver vazia:** cobre campo obrigatório.
- **Deve mostrar mensagem quando a descrição tiver menos de 3 caracteres:** cobre tamanho mínimo.
- **Deve mostrar mensagem quando a data for inválida:** cobre formato de data incorreto.
- **Deve mostrar mensagem quando a conta estiver vazia:** cobre outro campo obrigatório.

Testes possíveis: cancelar exclusão, valor zero ou negativo, filtros combinados, edição sem mudanças e erro do serviço. Os casos atuais são melhores como testes de unidade/componente porque conseguem verificar cada mensagem e chamada sem depender de API ou banco.

### Conta do usuário (`fluxo/src/app/features/user-account/user-account.spec.ts`)

Tipo: integração de componente com HTTP simulado. O `HttpTestingController` substitui a API, mas mantém o fluxo de carregamento real.

- **Deve criar o componente e exibir os dados recebidos da API:** confirma resposta HTTP e renderização.
- **Deve alternar entre dados pessoais e segurança:** verifica aba e conteúdo correspondente.
- **Deve exigir senha antiga e senha nova com pelo menos oito caracteres:** cobre validações e confirmação divergente.
- **Deve salvar o novo e-mail quando os dados de segurança forem válidos:** verifica alteração válida sem erro.
- **Deve abrir o modal e salvar alterações dos dados pessoais:** valida abertura, edição e fechamento.
- **Deve abrir a confirmação e redirecionar para o login ao confirmar a saída:** verifica logout e navegação.
- **Deve aceitar uma imagem e atualizar a pré-visualização do avatar:** simula `FileReader` e verifica a prévia.

Testes possíveis: erro HTTP, cancelamento do modal, arquivo inválido e senha com espaços. Os atuais são melhores para o contrato do componente porque isolam a rede e ainda exercitam o ciclo HTTP real.

### Perfil financeiro (`fluxo/src/app/services/financial-profile.service.spec.ts`)

Tipo: unitário de serviço com `localStorage` real do ambiente de teste.

- **Inicia com um perfil vazio quando não há dados armazenados:** verifica valores padrão.
- **Salva uma cópia do perfil e o persiste por usuário:** verifica estado, chave por usuário e cópia defensiva.
- **Combina valores armazenados com padrões e tolera armazenamento malformado:** verifica recuperação parcial e tolerância a dados incompletos.

Testes possíveis: JSON inválido, troca de usuário e perfil completo armazenado. Os casos atuais cobrem inicialização, persistência e resiliência com poucas dependências.

### Serviço de transações (`fluxo/src/app/services/transactions.service.spec.ts`)

Tipo: integração de serviço com repositório mockado. O repositório fornece dados controlados e o serviço calcula o estado compartilhado.

- **Calcula métricas financeiras a partir das transações do repositório:** verifica carregamento, totais, saldo e estados de erro/carregamento.
- **Cria, atualiza e exclui transações no estado compartilhado:** cobre o ciclo CRUD e seus efeitos nas métricas.
- **Reutiliza uma categoria existente quando só mudam maiúsculas, acentos ou espaços:** protege a normalização para não duplicar categorias.

Testes possíveis: falha do repositório, transação com valor zero, concorrência e persistência entre usuários. Os atuais são melhores para a regra do serviço porque o repositório falso torna os resultados determinísticos e rápidos.

### Componentes do sistema de design (`fluxo/src/app/shared/components/design-system/design-system.spec.ts`)

Tipo: componente. Cada teste instancia um componente visual isolado e simula eventos reais do DOM.

- **Renderiza a configuração do campo e emite valores digitados:** verifica inputs, texto auxiliar, valor inicial e `valueChange`.
- **Renderiza o conteúdo do modal e emite fechamento pelo botão, fundo e Escape:** cobre os três caminhos de fechamento.
- **Renderiza cabeçalhos e células da tabela, inclusive uma tabela vazia:** verifica dados e estado sem linhas.

Testes possíveis: acessibilidade por label, foco do modal, ordenação da tabela e projeção de conteúdo. Os atuais são melhores como base porque protegem o contrato reutilizado por várias telas sem repetir um E2E para cada componente.

## Testes E2E do Playwright

Os arquivos `fluxo/tests/example.spec.ts` e `tests/example.spec.ts` são exemplos padrão do Playwright e acessam `https://playwright.dev/`, não a aplicação Fluxo.

- **Deve exibir o título:** abre o site e verifica o título no navegador. É E2E porque valida navegação, carregamento e integração com o browser; um teste unitário não provaria que a página realmente carregou.
- **Deve abrir o link de início:** clica em um link por papel acessível e verifica o título da instalação. É E2E porque percorre uma ação do usuário entre páginas. Um teste de componente seria mais rápido, mas não validaria roteamento, documento e browser juntos.

Testes possíveis: rodar contra `http://localhost:4201`, testar login, cadastro e criação de transação. Esses seriam os E2E mais valiosos para o produto; os exemplos atuais servem apenas para confirmar que o Playwright está configurado. Para regras de validação, os testes Angular continuam melhores por serem rápidos e determinísticos.

## Resumo da escolha

A suíte usa o teste mais barato que consegue observar o comportamento necessário: regras ficam em testes unitários, renderização e eventos ficam em testes de componente, colaboração entre dependências fica em integração, e somente jornadas completas ficam no Playwright. Substituir tudo por E2E aumentaria tempo e instabilidade; substituir tudo por unitários deixaria de detectar problemas de template, roteamento e integração visual.
