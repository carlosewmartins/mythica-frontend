import { Component, inject, OnInit, signal, computed, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MessageService } from 'primeng/api';
import { CampanhaService, Campanha, InteracaoHistorico } from '../../../../core/services/campanha';
import { PersonagemService, Personagem } from '../../../../core/services/personagem';

@Component({
  selector: 'app-gameplay',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
    TagModule,
    ScrollPanelModule
  ],
  templateUrl: './gameplay.html',
  styleUrl: './gameplay.scss'
})
export class Gameplay implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private campanhaService = inject(CampanhaService);
  private personagemService = inject(PersonagemService);
  private messageService = inject(MessageService);

  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  private shouldScrollToBottom = false;

  campanha = signal<Campanha | null>(null);
  personagem = signal<Personagem | null>(null);
  isLoading = signal(true);
  isEnviandoAcao = signal(false);
  acaoLivre = signal('');

  historico = computed(() => this.campanha()?.historico || []);
  estado = computed(() => this.campanha()?.estado_atual);
  ultimaResposta = computed(() => {
    const hist = this.historico();
    return hist.length > 0 ? hist[hist.length - 1].resposta_llm : null;
  });

  ngOnInit(): void {
    const campanhaId = this.route.snapshot.paramMap.get('id');
    
    if (campanhaId) {
      // Carrega campanha existente
      this.carregarCampanha(campanhaId);
    } else {
      // Cria nova campanha
      this.criarNovaCampanha();
    }
  }

  // Inicia o scroll do chat na ultima interação
  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  // Cria uma nova campanha com o personagem atual
  private criarNovaCampanha(): void {
    const personagem = this.personagemService.personagemAtual$();
    
    if (!personagem) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nenhum personagem selecionado',
        life: 3000
      });
      this.voltarParaPersonagens();
      return;
    }

    this.personagem.set(personagem);
    this.isLoading.set(true);

    this.campanhaService.criarCampanha(personagem.id).subscribe({
      next: (campanha) => {
        this.campanha.set(campanha);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
        
        // Atualiza a URL para incluir o ID da campanha
        this.router.navigate(['/campanha', campanha.id], { replaceUrl: true });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar a campanha',
          life: 5000
        });
        this.isLoading.set(false);
        setTimeout(() => this.voltarParaPersonagens(), 2000);
      }
    });
  }

  // Carrega campanha existente
  private carregarCampanha(id: string): void {
    this.isLoading.set(true);

    this.campanhaService.buscarCampanha(id).subscribe({
      next: (campanha) => {
        this.campanha.set(campanha);

        // Carrega o personagem da campanha
        this.personagemService.buscarPersonagem(campanha.personagem_id).subscribe({
          next: (personagem) => {
            this.personagem.set(personagem);
            this.isLoading.set(false);
            this.shouldScrollToBottom = true;
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar a campanha',
          life: 5000
        });
        this.isLoading.set(false);
        setTimeout(() => this.voltarParaPersonagens(), 2000);
      }
    });
  }

  // Envia ação sugerida
  enviarAcaoSugerida(acao: string): void {
    this.enviarAcao(acao);
  }

  // Envia ação livre do usuario
  enviarAcaoLivre(): void {
    const acao = this.acaoLivre().trim();
    
    if (!acao) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Digite uma ação antes de enviar',
        life: 3000
      });
      return;
    }

    this.enviarAcao(acao);
    this.acaoLivre.set('');
  }

  // Envia a ação para o backend
  private enviarAcao(acao: string): void {
    const campanhaId = this.campanha()?.id;
    if (!campanhaId) return;

    this.isEnviandoAcao.set(true);

    this.campanhaService.enviarAcao(campanhaId, acao).subscribe({
      next: (campanhaAtualizada) => {
        this.campanha.set(campanhaAtualizada);
        this.isEnviandoAcao.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível enviar a ação',
          life: 5000
        });
        this.isEnviandoAcao.set(false);
      }
    });
  }

  // calcula porcentagem de vida
  getPorcentagemVida(): number {
    const est = this.estado();
    if (!est) return 0;
    const porcentagem = (est.vida_atual / est.vida_maxima) * 100;
    console.log('DEBUG - Calculando vida:', {
      vida_atual: est.vida_atual,
      vida_maxima: est.vida_maxima,
      porcentagem: porcentagem
    });
    return porcentagem;
  }

  // Scroll automatico
  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        const element = this.chatContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch(err) {
      console.error('Erro ao fazer scroll:', err);
    }
  }

  // volta para lista de personagens
  voltarParaPersonagens(): void {
    this.personagemService.limparCache();
    this.router.navigate(['/personagens']);
  }

  
  // Verifica se é a primeira mensagem (inicio da campanha)
  isPrimeiraMensagem(interacao: InteracaoHistorico): boolean {
    return interacao.acao_jogador === '[INÍCIO DA CAMPANHA]';
  }
}