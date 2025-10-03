import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PersonagemService, Personagem } from '../../../../core/services/personagem';
import { CampanhaService } from '../../../../core/services/campanha';

@Component({
  selector: 'app-detalhes-personagem',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule,
    ProgressBarModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService],
  templateUrl: './detalhes-personagem.html',
  styleUrl: './detalhes-personagem.scss'
})
export class DetalhesPersonagem implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private personagemService = inject(PersonagemService);
  private campanhaService = inject(CampanhaService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  personagem = signal<Personagem | null>(null);
  isLoading = signal(true);
  personagemId = signal<string>('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.personagemId.set(id);
      this.carregarPersonagem(id);
    } else {
      this.voltarParaLista();
    }
  }

  carregarPersonagem(id: string): void {
    this.isLoading.set(true);
    this.personagemService.buscarPersonagem(id).subscribe({
      next: (personagem) => {
        this.personagem.set(personagem);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar o personagem',
          life: 5000
        });
        this.isLoading.set(false);
        setTimeout(() => this.voltarParaLista(), 2000);
      }
    });
  }

  iniciarCampanha(): void {
    const perso = this.personagem();
    if (!perso) return;

    if (perso.status.vida_atual <= 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ação Bloqueada',
        detail: 'Personagens mortos não podem iniciar campanhas.',
        life: 4000
      });
      return;
    }

    this.personagemService.setPersonagemAtual(perso);
    this.campanhaService.listarCampanhas().subscribe({
      next: (campanhas) => {
        const campanhaExistente = campanhas.find(
          c => c.personagem_id === perso.id && c.status === 'ativa'
        );
        if (campanhaExistente) {
          this.router.navigate(['/campanha', campanhaExistente.id]);
        } else {
          this.router.navigate(['/campanha']);
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível verificar campanhas existentes',
          life: 5000
        });
      }
    });
  }

  confirmarDelecao(event: Event): void {
    const p = this.personagem();
    if (!p) return;
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja deletar ${p.nome}? Esta ação não pode ser desfeita e todas as campanhas relacionadas serão perdidas.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-cancel',
      accept: () => {
        this.deletarPersonagem();
      }
    });
  }

  private deletarPersonagem(): void {
    const id = this.personagemId();
    this.personagemService.deletarPersonagem(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Personagem deletado com sucesso',
          life: 3000
        });
        setTimeout(() => this.voltarParaLista(), 1000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível deletar o personagem',
          life: 5000
        });
      }
    });
  }

  voltarParaLista(): void {
    this.router.navigate(['/personagens']);
  }

  getClasseColor(classe: string): string {
    const cores: { [key: string]: string } = {
      'guerreiro': 'danger', 'mago': 'info', 'ladino': 'warning', 'clerigo': 'success', 'arqueiro': 'primary',
    };
    return cores[classe.toLowerCase()];
  }

  getRacaIcon(raca: string): string {
    const icones: { [key: string]: string } = {
      'humano': 'pi-user', 'elfo': 'pi-star', 'orc': 'pi-bolt', 'anao': 'pi-shield',
    };
    return icones[raca.toLowerCase()];
  }

  getPorcentagemVida(): number {
    const p = this.personagem();
    if (!p || p.status.vida_maxima === 0) return 0;
    return (p.status.vida_atual / p.status.vida_maxima) * 100;
  }
}