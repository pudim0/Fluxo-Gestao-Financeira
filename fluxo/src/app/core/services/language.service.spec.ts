import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), LanguageService],
    });
  });

  it('uses Portuguese when no stored language exists', () => {
    const service = TestBed.inject(LanguageService);
    expect(service.idioma()).toBe('pt-BR');
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('pt-BR');
  });

  it('loads a valid stored language and persists changes', () => {
    localStorage.setItem('idioma', 'en');
    const service = TestBed.inject(LanguageService);
    const translate = TestBed.inject(TranslateService);
    expect(service.idioma()).toBe('en');
    expect(translate.getCurrentLang()).toBe('en');

    service.mudarIdioma('pt-BR');
    expect(service.idioma()).toBe('pt-BR');
    expect(localStorage.getItem('idioma')).toBe('pt-BR');
    expect(translate.getCurrentLang()).toBe('pt-BR');
  });
});