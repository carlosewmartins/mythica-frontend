import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api';

// Interfaces para os tipos de dados
export interface Atributos {
  forca: number;
  destreza: number;
  constituicao: number;
  inteligencia: number;
  sabedoria: number;
  carisma: number;
}

export interface Status {
  vida_atual: number;
  vida_maxima: number;
  nivel: number;
  experiencia: number;
  inventario: string[];
}

export interface Personagem {
  id: string;
  nome: string;
  raca: string;
  classe: string;
  descricao: string;
  atributos: Atributos;
  status: Status;
  user_id: string;
  created_at: string;
}

export interface CreatePersonagemDto {
  nome: string;
  raca: string;
  classe: string;
  descricao: string;
  atributos: Atributos;
}

@Injectable({
  providedIn: 'root'
})
export class PersonagemService {
  private apiService = inject(ApiService);

  // Signal para armazenar a lista de personagens em cache
  private personagens = signal<Personagem[]>([]);
  personagens$ = this.personagens.asReadonly();

  // Signal para o personagem selecionado atualmente
  private personagemAtual = signal<Personagem | null>(null);
  personagemAtual$ = this.personagemAtual.asReadonly();

  // Lista personagens apenas quando autenticado
  listarPersonagens(): Observable<Personagem[]> {
    return this.apiService.get<Personagem[]>('/personagem').pipe(
      tap(personagens => {
        this.personagens.set(personagens);
      })
    );
  }

  // Busca personagem por ID
  buscarPersonagem(id: string): Observable<Personagem> {
    return this.apiService.get<Personagem>(`/personagem/${id}`).pipe(
      tap(personagem => {
        this.personagemAtual.set(personagem);
      })
    );
  }

  criarPersonagem(dados: CreatePersonagemDto): Observable<Personagem> {
    return this.apiService.post<Personagem>('/personagem', dados).pipe(
      tap(novoPersonagem => {
        // Adiciona o novo personagem à lista em cache
        this.personagens.update(lista => [...lista, novoPersonagem]);
      })
    );
  }


  deletarPersonagem(id: string): Observable<void> {
    return this.apiService.delete<void>(`/personagem/${id}`).pipe(
      tap(() => {
        // Remove o personagem da lista em cache
        this.personagens.update(lista => 
          lista.filter(p => p.id !== id)
        );
        
        // Se era o personagem atual, limpa
        if (this.personagemAtual()?.id === id) {
          this.personagemAtual.set(null);
        }
      })
    );
  }

  // Define o personagem atual
  setPersonagemAtual(personagem: Personagem | null): void {
    this.personagemAtual.set(personagem);
  }

  // Limpa cache de personagens
  limparCache(): void {
    this.personagens.set([]);
    this.personagemAtual.set(null);
  }


  // Retorna um personagem específico do cache
  getPersonagemDoCache(id: string): Personagem | undefined {
    return this.personagens().find(p => p.id === id);
  }

  // Verifica se há personagens no cache
  temPersonagens(): boolean {
    return this.personagens().length > 0;
  }
}