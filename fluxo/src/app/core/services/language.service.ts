import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type Idioma = 'pt-BR' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly translate = inject(TranslateService);

  idioma = signal<Idioma>(this.carregarIdioma());

  constructor() {
    this.translate.use(this.idioma());
  }

  mudarIdioma(idioma: Idioma): void {
    this.idioma.set(idioma);

    localStorage.setItem('idioma', idioma);

    this.translate.use(idioma);
  }

  texto(pt: string, en: string): string {
    return this.idioma() === 'pt-BR' ? pt : en;
  }

  private carregarIdioma(): Idioma {
    const idiomaSalvo = localStorage.getItem('idioma');

    if (idiomaSalvo === 'pt-BR' || idiomaSalvo === 'en') {
      return idiomaSalvo;
    }

    return 'pt-BR';
  }
}