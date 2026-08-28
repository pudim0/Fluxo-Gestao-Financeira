import { Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Idioma = 'pt-BR' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  idioma = signal<Idioma>('pt-BR');

  constructor(private translate: TranslateService) {
    const idiomaSalvo = localStorage.getItem('idioma') as Idioma | null;

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
