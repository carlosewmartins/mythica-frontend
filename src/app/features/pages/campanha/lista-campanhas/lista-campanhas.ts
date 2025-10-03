import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CampanhaService, Campanha } from '../../../../core/services/campanha';
import { HistoricoService, InteracaoHistorico } from '../../../../core/services/historico';
import { PersonagemService } from '../../../../core/services/personagem';

type FiltroStatus = 'todas' | 'ativa' | 'concluida';

@Component({
  selector: 'app-lista-campanhas',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    DialogModule,
    ConfirmDialogModule,
    DividerModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-campanhas.html',
  styleUrl: './lista-campanhas.scss'
})
export class ListaCampanhas implements OnInit {
  private campanhaService = inject(CampanhaService);
  private historicoService = inject(HistoricoService);
  private personagemService = inject(PersonagemService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // State
  campanhas = signal<Campanha[]>([]);
  isLoading = signal(true);
  filtroAtual = signal<FiltroStatus>('todas');
  personagemIdFiltro = signal<string | null>(null);
  
  // Dialog de histórico
  dialogHistoricoVisible = signal(false);
  historico = signal<InteracaoHistorico[]>([]);
  campanhaAtual = signal<Campanha | null>(null);
  isLoadingHistorico = signal(false);

  // Computed - campanhas filtradas
  campanhasFiltradas = computed(() => {
    const filtro = this.filtroAtual();
    const personagemId = this.personagemIdFiltro();
    let todas = this.campanhas();

    // Filtro por status
    if (filtro === 'todas') return todas;
    return todas.filter(campanha => campanha.status === filtro);
  });

  ngOnInit(): void {
    // Carrega personagens primeiro para ter os nomes em cache
    this.personagemService.listarPersonagens().subscribe({
      next: () => {
        this.carregarCampanhas();
      },
      error: () => {
        this.carregarCampanhas();
      }
    });
  }

  carregarCampanhas(): void {
    this.isLoading.set(true);
    
    this.campanhaService.listarCampanhas().subscribe({
      next: (campanhas) => {
        this.campanhas.set(campanhas);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar as campanhas',
          life: 5000
        });
        this.isLoading.set(false);
      }
    });
  }

  // Filtro
  setFiltro(filtro: FiltroStatus): void {
    this.filtroAtual.set(filtro);
  }

  // Continuar campanha
  continuarCampanha(campanha: Campanha): void {
    this.router.navigate(['/campanha', campanha.id]);
  }

  // Ver histórico completo
  verHistorico(campanha: Campanha): void {
    this.campanhaAtual.set(campanha);
    this.isLoadingHistorico.set(true);
    this.dialogHistoricoVisible.set(true);

    this.historicoService.buscarHistorico(campanha.id).subscribe({
      next: (historico) => {
        this.historico.set(historico);
        this.isLoadingHistorico.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar o histórico',
          life: 5000
        });
        this.isLoadingHistorico.set(false);
        this.dialogHistoricoVisible.set(false);
      }
    });
  }

  // Fechar dialog de histórico
  fecharHistorico(): void {
    this.dialogHistoricoVisible.set(false);
    this.historico.set([]);
    this.campanhaAtual.set(null);
  }

  // Excluir campanha
  confirmarExclusao(event: Event, campanha: Campanha): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja excluir a campanha de ${this.getNomePersonagem(campanha)}?`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.excluirCampanha(campanha);
      }
    });
  }

  excluirCampanha(campanha: Campanha): void {
    this.campanhaService.deletarCampanha(campanha.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Campanha excluída com sucesso',
          life: 3000
        });
        this.carregarCampanhas();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível excluir a campanha',
          life: 5000
        });
      }
    });
  }

  getNomePersonagem(campanha: Campanha): string {
    // Tenta buscar do cache
    const personagem = this.personagemService.getPersonagemDoCache(campanha.personagem_id);
    
    if (personagem) {
      return `${personagem.nome} - ${personagem.classe} ${personagem.raca}`;
    }
    
    // Fallback: retorna apenas um indicador
    return `Personagem ${campanha.personagem_id.substring(0, 8)}...`;
  }

  getDataFormatada(data: string): string {
    const date = new Date(data);
    const agora = new Date();
    const diffMinutos = agora.getTime() - date.getTime();
    const diffHoras = Math.floor(diffMinutos / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    if (diffHoras < 1) return 'Agora mesmo';
    if (diffHoras < 24) return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    if (diffDias < 7) return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
    
    return date.toLocaleDateString('pt-BR');
  }

  getSeverityTag(status: string): 'success' | 'info' {
    switch (status) {
      case 'ativa': return 'success';
      case 'concluida': return 'info';
      default: return 'info';
    }
  }

  getIconeStatus(status: string): string {
    switch (status) {
      case 'ativa': return 'pi-play-circle';
      case 'concluida': return 'pi-check-circle';
      default: return 'pi-circle';
    }
  }

  // Verifica se é a primeira mensagem (introdução)
  isPrimeiraMensagem(interacao: InteracaoHistorico): boolean {
    return interacao.acao_jogador === '[INÍCIO DA CAMPANHA]';
  }

  // Helpers para contadores nos filtros
  getCountAtivas(): number {
    return this.campanhasFiltradas().filter(campanha => campanha.status === 'ativa').length;
  }

  getCountConcluidas(): number {
    return this.campanhasFiltradas().filter(campanha => campanha.status === 'concluida').length;
  }

  // Helper para formatar timestamp
  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString('pt-BR');
  }
}