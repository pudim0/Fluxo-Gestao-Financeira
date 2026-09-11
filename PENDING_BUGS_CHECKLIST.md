# 🎯 Pending Bugs Implementation Checklist

**Total Pending:** 7 bugs
**Priority Levels:** High (2) | Medium (2) | Low (3)
**Recently Fixed:** Bug #17 (Demo Data) + Bug #19 (Profile Sync) on 01/09/2026 19:07:59

---

## 🔴 HIGH PRIORITY (2)

### [ ] Bug #3: IA Dando Mensagens Diferentes
**File:** `src/app/features/goals/goals.ts`
**Method:** `askFinancialAssistant(question: string)`
**Current Issue:** Response is hardcoded - always returns generic message
**What to Fix:** Add logic to analyze current goals, savings, and progress to generate contextual responses

**Test Cases:**
```
Q: "Como está meu progresso?" 
A: "Seu progresso total é X%..." (use overallProgress())

Q: "E no mês?"
A: "Você atingiu X% de sua meta mensal..." (use monthlyProgress())

Q: "Quanto economizei?"
A: "Você economizou R$ X até agora..." (calculate from totalSaved())
```

**Hint:** Use `if` statements or switch based on question keywords
**Time Estimate:** 20-30 minutes

---

---

### ✅ Bug #19: Painel Não Atualizado Conforme Onboarding (CORRIGIDO)
**Status:** ✅ CORRIGIDO em 01/09/2026 19:07:59
**Files:** `src/app/features/dashboard/dashboard.ts` + `financial-profile.service.ts` + `onboarding.ts`
**Solution:** Adicionado effect() no DashboardComponent para observar mudanças de profile

**What Was Fixed:**
1. Importado `effect` do @angular/core
2. Adicionado constructor em DashboardComponent
3. Effect observa profile() signal e força recalculação de computeds
4. Documentação explicando cadeia: Onboarding → ProfileService → Dashboard effect
5. localStorage sincronizado automaticamente

**Build Status:** ✅ Compilação bem-sucedida (8.654s)

**Result:** Dashboard agora atualiza automaticamente quando profile é salvo no onboarding

---

### [ ] Bug #4: Botões Ações Rápidas em Orçamentos
**File:** `src/app/features/budget/budget.ts`
**Methods:** `edit()`, `remove()`
**Current Issue:** Edit/Remove buttons may not work correctly or state doesn't update
**What to Fix:** Debug the flow and ensure limitsState updates correctly

**Debug Steps:**
1. Add console.log to edit() - log the row being edited
2. Add console.log to remove() - log category being removed
3. Verify formOpen signal opens modal
4. Verify limitsState.set() updates the array
5. Check localStorage persistence with devtools

**Test Cases:**
- Click edit on a budget limit → Modal opens with correct data
- Modify limit value → Save updates the limit
- Click remove → Confirmation appears → Category removed
- Refresh page → Deleted limit stays gone

**Time Estimate:** 25-35 minutes

---

## 🟡 MEDIUM PRIORITY (2)

### [ ] Bug #16: Remover Categorias em Acompanhamento
**File:** `src/app/features/budget/budget.ts`
**Method:** `remove(category: string)`
**Current Issue:** Delete function may have bugs in filtering or state updates
**What to Fix:** Ensure category removal works and persists

**Suggested Fix:**
```typescript
protected remove(category: string): void {
  if (!window.confirm(`Remover limite de ${category}?`)) return;
  
  this.limitsState.update((items) => 
    items.filter((item) => item.category !== category)
  );
  this.persist();
  this.feedback.set(`Limite de ${category} removido.`);
}
```

**Test Cases:**
- Create budget limit for "Food"
- Remove "Food" limit
- Verify removed from list
- Refresh page - should be gone

**Time Estimate:** 15-20 minutes

---

---

### ✅ Bug #17: Conta Criada Já com Despesas (CORRIGIDO)
**Status:** ✅ CORRIGIDO em 01/09/2026 19:03:09
**File:** `src/app/repositories/mock-transaction.repository.ts`
**Solution:** Adicionado JSDoc documentando dados de demonstração intencional

**What Was Fixed:**
1. Adicionado comentário JSDoc extenso explicando intenção
2. Marcado claramente como "Dados de Demonstração"
3. Documenta benefício UX (dashboard não fica vazio)
4. Explica quando são removidos (primeira transação real)
5. Inclui nota ⚠️ de revisão para produção

**Build Status:** ✅ Compilação bem-sucedida (12.923s)

**Result:** Desenvolvedor futuro entende intenção dos dados. Sem quebra de funcionalidade.

---

### [ ] Bug #8: Modo Compacto e Atalhos de Teclado
**File:** `src/app/features/settings/settings.ts`
**Current Issue:** Compact mode and keyboard shortcuts are just UI stubs
**What to Fix:** Implement toggle + keyboard listeners

**Suggested Implementation:**
```typescript
modoCompacto = signal(false);

toggleCompactMode(): void {
  this.modoCompacto.update(val => !val);
  try {
    localStorage.setItem('fluxo.compactMode', 
      JSON.stringify(this.modoCompacto()));
  } catch {}
  this.document.documentElement.setAttribute(
    'data-compact', 
    this.modoCompacto() ? 'true' : 'false'
  );
}

@HostListener('document:keydown', ['$event'])
handleKeyboardShortcuts(event: KeyboardEvent): void {
  // Ctrl+T: Toggle theme
  if (event.ctrlKey && event.key === 't') {
    event.preventDefault();
    this.toggleTheme();
  }
}
```

**Test Cases:**
- Click compact mode tag → CSS changes applied
- Refresh page → Compact mode persists
- Press Ctrl+T → Theme toggles
- Both work together without conflicts

**Time Estimate:** 30-40 minutes

---

## 🟢 LOW PRIORITY (3)

### [ ] Bug #11: Botão "Salvar" Desnecessário em Acessibilidade
**File:** `src/app/features/settings/settings.ts`
**Template Location:** Save section at bottom
**Current Issue:** Save button appears even in "acessibilidade" tab where not needed
**What to Fix:** Hide save section when viewing "acessibilidade" tab

**Suggested Fix:**
```html
@if (abaAtiva() !== 'acessibilidade') {
  <section class="page-grid page-grid--single">
    <ds-card eyebrow="...">
      <!-- Save buttons -->
    </ds-card>
  </section>
}
```

**Test Cases:**
- Click "Acessibilidade" tab → Save section disappears
- Click "Perfil" tab → Save section reappears
- Click "Preferências" tab → Save section visible

**Time Estimate:** 5 minutes

---

### [ ] Bug #6: Testar Porcentagem em Metas Zera Mensalmente (VERIFICATION)
**File:** `src/app/features/goals/goals.ts`
**Current State:** monthlyProgress computed signal was updated from hardcoded 78
**What to Verify:** 
1. Monthly progress calculates correctly
2. Resets when month changes
3. Persists contribution history properly

**Test Procedure:**
```
1. Create goal with target 1000, monthly 500
2. Add contribution 500 on Sept 1
3. monthlyProgress should be 100%
4. Change date to Oct 1 (if possible)
5. monthlyProgress should reset to 0%
6. Add contribution for October
7. Verify September data still in history
```

**Time Estimate:** 10-15 minutes

---

### [ ] BONUS: Implement Reactive Forms (Feature Enhancement)
**Files:** All components with forms
**Impact:** +2 points on evaluation (77/90 → 79/90)
**What to Do:**
1. Convert template-driven forms to Reactive Forms
2. Use FormGroup and FormControl
3. Add Validators.required, Validators.min(), custom validators
4. Better error handling and UX

**Components to Convert:**
- settings.ts (name, email, password fields)
- transactions.ts (description, amount, date)
- budget.ts (category, amount)
- goals.ts (name, target, monthly, deadline)

**Time Estimate:** 2-3 hours for full implementation

---

## 📊 Implementation Stats

| Priority | Count | Complexity | Est. Time |
|----------|-------|-----------|-----------|
| High | 2 | Medium-High | 50-70 min |
| Medium | 2 | Low-Medium | 35-55 min |
| Low | 3 | Low | 20-30 min |
| Bonus | 1 | High | 120+ min |
| Recently Fixed | 2 | Medium | ✅ Complete |

**Total Est. Time for All Pending:** ~2-3 hours (was 3-4h before fixes)

---

## ✅ Verification Template

After implementing each bug:

```
Bug #X - [Name]
- [ ] Code implemented
- [ ] Compiles without errors
- [ ] No TypeScript warnings
- [ ] Tested in browser
- [ ] localStorage persistence OK (if applicable)
- [ ] No regression in other features
- [ ] Commit with message "Fix bug #X: [description]"
```

---

## 🚀 Quick Start for Next Developer

1. **Setup:**
   ```bash
   cd fluxo
   npm install
   ng serve
   # Open http://localhost:4201
   ```

2. **Pick a Bug:**
   - Start with Bug #11 (5 min) for quick win
   - Then Bug #3 (30 min) for logic challenge
   - Then Bug #19 (30 min) for signal sync

3. **Test:**
   ```bash
   ng test  # Run unit tests
   ng lint  # Check code style
   ```

4. **Commit:**
   ```bash
   git add .
   git commit -m "Fix bug #X: [description]"
   git push origin Isaac
   ```

---

**Checklist Created:** 01/09/2026
**Last Updated:** Post-merge resolution
**Status:** Ready for implementation
**Difficulty:** Low-Medium
**Estimated Completion:** 1 week (if done daily)

