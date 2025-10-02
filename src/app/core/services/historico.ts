import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api';

export interface InteracaoHistorico {
  acao_jogador: string;
  resposta_llm: {
    narrativa: string;
    acoesDisponiveis: string[];
    evento: any;
    estadoJogador: any;
    proximaEtapa?: string;
  };
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {
  private apiService = inject(ApiService);

  // Busca histórico completo da campanha
  buscarHistorico(campanhaId: string): Observable<InteracaoHistorico[]> {
    return this.apiService.get<InteracaoHistorico[]>(`/historico/${campanhaId}`);
  }

  // Limpa histórico (mantem introdução)
  limparHistorico(campanhaId: string): Observable<any> {
    return this.apiService.delete(`/historico/${campanhaId}`);
  }
}