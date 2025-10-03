import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api';

// Interfaces
export interface EstadoJogador {
  vida_atual: number;
  vida_maxima: number;
  nivel: number;
  experiencia: number;
  inventario: string[];
}

export interface Evento {
  tipo: string;
  [key: string]: any;
}

export interface RespostaLLM {
  narrativa: string;
  acoesDisponiveis: string[];
  evento: Evento;
  estadoJogador: EstadoJogador;
  proximaEtapa?: string;
}

export interface InteracaoHistorico {
  acao_jogador: string;
  resposta_llm: RespostaLLM;
  timestamp: string;
}

export interface Campanha {
  id: string;
  personagem_id: string;
  usuario_id: string;
  status: string;
  historico: InteracaoHistorico[];
  estado_atual: EstadoJogador;
  criada_em: string;
  atualizada_em: string;
  etapa_historia?: string;
}

export interface CreateCampanhaDto {
  personagem_id: string;
}

export interface EnviarAcaoDto {
  acao: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampanhaService {
  private apiService = inject(ApiService);

  // Signal para a campanha atual
  private campanhaAtual = signal<Campanha | null>(null);
  campanhaAtual$ = this.campanhaAtual.asReadonly();

  // Signal para lista de campanhas
  private campanhas = signal<Campanha[]>([]);
  campanhas$ = this.campanhas.asReadonly();

  // Cria nova campanha
  criarCampanha(personagemId: string): Observable<Campanha> {
    const dados: CreateCampanhaDto = {
      personagem_id: personagemId
    };

    return this.apiService.post<Campanha>('/campanha', dados).pipe(
      tap(campanha => {
        this.campanhaAtual.set(campanha);
      })
    );
  }

  // Lista todas campanhas do usuario
  listarCampanhas(): Observable<Campanha[]> {
    return this.apiService.get<Campanha[]>('/campanha').pipe(
      tap(campanhas => {
        this.campanhas.set(campanhas);
      })
    );
  }

  // Busca campanha especifica por ID
  buscarCampanha(id: string): Observable<Campanha> {
    return this.apiService.get<Campanha>(`/campanha/${id}`).pipe(
      tap(campanha => {
        this.campanhaAtual.set(campanha);
      })
    );
  }

  // Envia uma ação do jogador na campanha
  enviarAcao(campanhaId: string, acao: string): Observable<Campanha> {
    const dados: EnviarAcaoDto = { acao };

    return this.apiService.post<Campanha>(`/campanha/${campanhaId}/acao`, dados).pipe(
      tap(campanha => {
        this.campanhaAtual.set(campanha);
      })
    );
  }

  // Deleta a campanha
  deletarCampanha(id: string): Observable<void> {
    return this.apiService.delete<void>(`/campanha/${id}`).pipe(
      tap(() => {
        // Remove da lista em cache
        this.campanhas.update(lista => lista.filter(campanha => campanha.id !== id));
        
        // Se era a campanha atual, limpa
        if (this.campanhaAtual()?.id === id) {
          this.campanhaAtual.set(null);
        }
      })
    );
  }

  // Define a campanha atual
  setCampanhaAtual(campanha: Campanha | null): void {
    this.campanhaAtual.set(campanha);
  }
  // Limpa o cache
  limparCache(): void {
    this.campanhaAtual.set(null);
    this.campanhas.set([]);
  }

  // Retorna a ultima interação na campanha
  getUltimaInteracao(): InteracaoHistorico | null {
    const campanha = this.campanhaAtual();
    if (!campanha || campanha.historico.length === 0) return null;
    
    return campanha.historico[campanha.historico.length - 1];
  }
}