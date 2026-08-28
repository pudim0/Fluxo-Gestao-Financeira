import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Idioma = 'pt-BR' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly translate = inject(TranslateService);

  idioma = signal<Idioma>(this.carregarIdioma());

    const idiomaInicial: Idioma =
      idiomaSalvo === 'en' || idiomaSalvo === 'pt-BR' ? idiomaSalvo : 'pt-BR';

    this.idioma.set(idiomaInicial);

    this.translate.setFallbackLang('pt-BR');
    this.translate.use(idiomaInicial);
  }

  mudarIdioma(idioma: Idioma): void {
    this.idioma.set(idioma);

    localStorage.setItem('idioma', idioma);

    this.translate.use(idioma);
  }
}
