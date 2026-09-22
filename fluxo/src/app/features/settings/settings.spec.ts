import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';
import { vi } from 'vitest';

import { LanguageService } from '../../core/services/language.service';
import { Settings } from './settings';

describe('Configurações', () => {
  let component: Settings;
  let language: { idioma: ReturnType<typeof signal<'pt-BR' | 'en'>>; mudarIdioma: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    localStorage.clear();
    language = { idioma: signal<'pt-BR' | 'en'>('pt-BR'), mudarIdioma: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [provideTranslateService(), { provide: LanguageService, useValue: language }],
    }).compileComponents();
    component = TestBed.createComponent(Settings).componentInstance;
  });

  it('alterna entre abas de configurações', () => {
    component.mostrarAba('preferencias');
    expect(component.abaAtiva()).toBe('preferencias');
    component.mostrarAba('acessibilidade');
    expect(component.abaAtiva()).toBe('acessibilidade');
  });

  it('delega alterações de idioma ao serviço', () => {
    component.mudarIdioma('en');
    expect(language.mudarIdioma).toHaveBeenCalledWith('en');
  });

  it('alterna o tema e abre canais de suporte', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const initial = component.theme();
    component.toggleTheme();
    expect(component.theme()).not.toBe(initial);
    expect(localStorage.getItem('fluxo.theme')).toBe(component.theme());
    component.contactSupport('email');
    component.contactSupport('whatsapp');
    expect(open).toHaveBeenCalledTimes(2);
    open.mockRestore();
  });
});