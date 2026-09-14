# 🔧 Guia de Correção - Bugs Pendentes

Este documento fornece instruções passo a passo para corrigir os 10 bugs pendentes.

---

## Bug #7: Data Inexistente em Metas ✅ JÁ CORRIGIDO

**Status:** Método `isValidDate()` já foi adicionado
- Validação implementada em `src/app/features/goals/goals.ts`
- Rejeita datas inválidas como "2026-02-30"

---

## Bug #3: IA com Mensagens Diferentes

**Arquivo:** `src/app/features/goals/goals.ts`
**Função:** `askFinancialAssistant(question: string)`

**Problema Atual:**
```typescript
askFinancialAssistant(question: string): void {
  if (!question.trim()) return;
  this.assistantResponse.set(
    `Analisando sua pergunta ("${question}")... Com base nos seus aportes atuais...`
  ); // ❌ Resposta é sempre igual
}
```

**Solução:**

Substituir por lógica inteligente:

```typescript
askFinancialAssistant(question: string): void {
  if (!question.trim()) return;
  
  const q = question.toLowerCase();
  const progress = this.overallProgress();
  const monthlyProgress = this.monthlyProgress();
  const totalSaved = this.totalSaved();
  const monthlyTarget = this.monthlyTarget();
  
  let response = '';
  
  if (q.includes('mês') || q.includes('mensal')) {
    if (monthlyProgress >= 100) {
      response = `Excelente! Você já atingiu ${monthlyProgress}% da meta deste mês! 🎉`;
    } else if (monthlyProgress >= 50) {
      response = `Bom andamento! Você atingiu ${monthlyProgress}% da meta do mês. Continue assim!`;
    } else {
      const faltam = monthlyTarget - totalSaved;
      response = `Você está em ${monthlyProgress}% da meta. Faltam R$ ${faltam.toFixed(2)} para atingir o objetivo.`;
    }
  } else if (q.includes('total') || q.includes('geral')) {
    response = `Seu progresso total é ${progress}%. Continue economizando para alcançar seus objetivos!`;
  } else if (q.includes('quanto') || q.includes('cuanto')) {
    response = `Você já economizou R$ ${totalSaved.toFixed(2)} em suas metas.`;
  } else if (q.includes('prazo') || q.includes('deadline')) {
    const nextGoal = this.nextGoal();
    response = `Sua próxima meta é "${nextGoal.name}" com prazo em ${nextGoal.deadlineLabel}.`;
  } else {
    response = `Baseado em seus aportes atuais, seu progresso é de ${progress}%. Mantenha a disciplina!`;
  }
  
  this.assistantResponse.set(response);
}
```

---

## Bug #4: Botões de Ações Rápidas em Orçamentos

**Arquivo:** `src/app/features/budget/budget.ts`
**Funções:** `edit()` e `remove()`

**Para Debugar:**

1. Abra DevTools (F12)
2. Vá ao Console
3. Clique em "Editar" em um orçamento
4. Verifique se:
   - Form se abre
   - Valores aparecem corretamente
   - Campo categoria está preenchido

5. Clique em "Remover"
6. Verifique:
   - Mensagem de confirmação aparece
   - Orçamento é removido da lista
   - localStorage é atualizado

**Se não funcionar, adicione logs:**

```typescript
protected edit(row: BudgetRow): void {
  console.log('Edit chamado para:', row); // ⭐ Debug
  this.editing.set(row.category);
  this.form = { category: row.category, amount: row.amount };
  this.formOpen.set(true);
}

protected remove(category: string): void {
  console.log('Remove chamado para:', category); // ⭐ Debug
  if (!window.confirm(`Tem certeza que deseja remover o limite de ${category}?`)) return;
  
  this.limitsState.update((items) => {
    const before = items.length;
    const filtered = items.filter((item) => item.category !== category);
    console.log(`Antes: ${before}, Depois: ${filtered.length}`); // ⭐ Debug
    return filtered;
  });
  this.persist();
  this.feedback.set(`Limite de ${category} removido.`);
}
```

---

## Bug #8: Modo Compacto e Atalhos de Teclado

**Arquivo:** `src/app/features/settings/settings.ts`

**Implementação Sugerida:**

1. **Adicionar signal para modo compacto:**

```typescript
modoCompacto = signal(false);

toggleCompactMode(): void {
  this.modoCompacto.update(val => !val);
  try {
    localStorage.setItem('fluxo.compactMode', JSON.stringify(this.modoCompacto()));
  } catch {}
}

private readCompactMode(): boolean {
  try {
    const saved = localStorage.getItem('fluxo.compactMode');
    return saved ? JSON.parse(saved) : false;
  } catch {
    return false;
  }
}
```

2. **Adicionar HostListener para atalhos:**

```typescript
@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent) {
  // Ctrl+T = Toggle Tema
  if (event.ctrlKey && event.key === 't') {
    event.preventDefault();
    this.toggleTheme();
  }
  
  // Ctrl+Shift+C = Compact Mode
  if (event.ctrlKey && event.shiftKey && event.key === 'C') {
    event.preventDefault();
    this.toggleCompactMode();
  }
}
```

3. **Atualizar template para tags interativas:**

```html
<span class="tag" (click)="toggleCompactMode()" 
      [class.active]="modoCompacto()"
      role="button" tabindex="0">
  {{'settings.modoCompacto' | translate}}
</span>
<span class="tag" 
      title="Atalho: Ctrl+T"
      role="button" tabindex="0">
  {{'settings.atalhosTeclado' | translate}} (Ctrl+T / Ctrl+Shift+C)
</span>
```

---

## Bug #11: Botão Salvar Desnecessário em Acessibilidade

**Arquivo:** `src/app/features/settings/settings.ts`

**Solução Simples:**

Envolver o card de "Salvar" com condicional:

```html
@if (abaAtiva() !== 'acessibilidade') {
  <section class="page-grid page-grid--single">
    <ds-card eyebrow="{{'settings.salvar' | translate}}" title="{{'settings.msgSalvar' | translate}}">
      <div class="page-actions">
        <ds-button [style.opacity]="alterado ? '1' : '0.5'" 
                   [disabled]="!alterado" 
                   (click)="salvarAlteracoes()" 
                   class="button-save">
          {{'settings.salvarAlteracoes' | translate}}
        </ds-button>
        <ds-button (click)="cancelarAlteracoes()" variant="secondary">
          {{'settings.cancelar' | translate}}
        </ds-button>
      </div>
    </ds-card>
  </section>
}
```

---

## Bug #16: Remover Categorias em Acompanhamento

**Arquivo:** `src/app/features/budget/budget.ts`
**Função:** `remove(category: string)`

**Debug Passo a Passo:**

1. No template, adicione confirmação visual:

```html
<button class="ghost-button danger-button" 
        type="button" 
        (click)="remove(row.category)"
        [disabled]="feedback() === `Removendo ${row.category}...`">
  Remover
</button>
```

2. No TypeScript, melhore a função:

```typescript
protected remove(category: string): void {
  const confirmed = window.confirm(
    `Tem certeza que deseja remover o limite de "${category}"? Esta ação não pode ser desfeita.`
  );
  
  if (!confirmed) return;
  
  try {
    console.log('Removendo categoria:', category);
    
    // Remover
    this.limitsState.update((items) => {
      const novoArray = items.filter((item) => item.category !== category);
      console.log('Array antes:', items);
      console.log('Array depois:', novoArray);
      return novoArray;
    });
    
    // Persistir
    this.persist();
    
    // Feedback
    this.feedback.set(`Limite de "${category}" removido com sucesso.`);
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => this.feedback.set(''), 3000);
    
  } catch (error) {
    console.error('Erro ao remover:', error);
    this.feedback.set(`Erro ao remover o limite de "${category}".`);
  }
}
```

---

## Bug #17: Conta Criada Já com Despesas

**Arquivo:** `src/app/repositories/mock-transaction.repository.ts`

**Opção 1: Remover dados demo (Limpar para novo usuário)**

```typescript
private readonly defaultTransactions: Transaction[] = []; // ✅ Novo usuário começa vazio

// Mover dados para um método separado se quiser demo
private getDemoTransactions(): Transaction[] {
  return [
    { id: 'tx-1', description: 'Mercado Central', amount: 182.4, type: 'expense', ... },
    // ... resto
  ];
}
```

**Opção 2: Manter como dados demo (Mais amigável para teste)**

```typescript
// Adicionar comentário explicativo
/**
 * Dados de demonstração carregados para novos usuários
 * Removra em produção ou deixe vazio para experiência limpa
 */
private readonly defaultTransactions: Transaction[] = [
  // ... dados originais
];
```

**Recomendação:** Usar Opção 1 (começar vazio) para melhor UX

---

## Bug #19: Painel Não Atualizado Conforme Onboarding

**Arquivos:**
- `src/app/features/dashboard/dashboard.ts`
- `src/app/features/onboarding/onboarding/onboarding.ts`
- `src/app/services/financial-profile.service.ts`

**Problema:** Profile é salvo mas dashboard não detecta mudança

**Solução:**

1. **Em `financial-profile.service.ts`, certificar que signal é reativo:**

```typescript
@Injectable({ providedIn: 'root' })
export class FinancialProfileService {
  private readonly profileState = signal<FinancialProfile>(this.read());
  readonly profile = this.profileState.asReadonly(); // ✅ Readonly computed

  save(profile: FinancialProfile): void {
    const copy = { ...profile, debtTypes: [...profile.debtTypes] };
    this.profileState.set(copy); // ✅ Atualiza signal
    
    // Persistir
    try {
      const email = this.getCurrentUserEmail();
      localStorage.setItem(`${PROFILE_STORAGE_PREFIX}${email}`, JSON.stringify(copy));
    } catch {}
  }
}
```

2. **Em `dashboard.ts`, adicionar effect para sincronizar:**

```typescript
export class DashboardComponent {
  private readonly profileService = inject(FinancialProfileService);
  protected readonly profile = this.profileService.profile;
  
  protected readonly profileSummary = computed(() => {
    const profile = this.profile();
    if (!profile.goal) return 'Complete seu onboarding...';
    
    // ... lógica computada
    return summary;
  });
  
  constructor() {
    // ✅ Sincronizar quando profile muda
    effect(() => {
      const profile = this.profile();
      console.log('Profile atualizado no dashboard:', profile);
      // Força recalculação de computed signals que dependem de profile
    });
  }
}
```

3. **Em `onboarding.ts`, certificar que salva corretamente:**

```typescript
private saveAndContinue(): void {
  this.profileService.save(this.profile); // ✅ Salva
  
  // Aguardar um tick para signal atualizar
  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 100);
}
```

---

## 🧪 CHECKLIST DE TESTES

Após implementar cada correção:

- [ ] Funcionalidade funciona como esperado
- [ ] Dados persistem após F5
- [ ] Sincronização entre telas funciona
- [ ] Mensagens de erro são claras
- [ ] Sem erros no console
- [ ] Interface responde rápido

---

## 📞 SUPORTE

Se alguma correção não funcionar:

1. Verificar console (F12 → Console)
2. Procurar por mensagens de erro
3. Usar `console.log()` para debugar
4. Verificar localStorage em DevTools (F12 → Application → Storage)

---

**Última Atualização:** 01/09/2026
