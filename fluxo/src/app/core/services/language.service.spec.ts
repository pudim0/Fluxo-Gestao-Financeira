import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

describe('Serviço de idioma', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideTranslateService(), LanguageService],
    });
  });

  it('usa português quando não existe idioma armazenado', () => {
    const service = TestBed.inject(LanguageService);
    expect(service.idioma()).toBe('pt-BR');
    expect(TestBed.inject(TranslateService).getCurrentLang()).toBe('pt-BR');
  });

  it('carrega um idioma armazenado válido e persiste as alterações', () => {
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