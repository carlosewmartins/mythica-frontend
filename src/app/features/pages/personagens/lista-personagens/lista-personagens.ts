import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PersonagemService, Personagem } from '../../../../core/services/personagem';
import { CampanhaService } from '../../../../core/services/campanha';

@Component({
  selector: 'app-lista-personagens',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-personagens.html',
  styleUrl: './lista-personagens.scss'
})
export class ListaPersonagens implements OnInit {
  private personagemService = inject(PersonagemService);
  private campanhaService = inject(CampanhaService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  // State
  personagens = signal<Personagem[]>([]);
  isLoading = signal(true);
  isEmpty = signal(false);

  ngOnInit(): void {
    this.carregarPersonagens();
  }

  carregarPersonagens(): void {
    this.isLoading.set(true);
    this.personagemService.listarPersonagens().subscribe({
      next: (personagens) => {
        this.personagens.set(personagens);
        this.isEmpty.set(personagens.length === 0);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os personagens',
          life: 5000
        });
        this.isLoading.set(false);
      }
    });
  }

  // Redireciona para tela de criação de personagem
  criarPersonagem(): void {
    this.router.navigate(['/personagens/criar']);
  }

  // Redireciona para os detalhes do personagem
  verDetalhes(personagem: Personagem): void {
    this.personagemService.setPersonagemAtual(personagem);
    this.router.navigate(['/personagens', personagem.id]);
  }

  // Redireciona para a pagina de todas as campanhas
  verTodasCampanhas(): void {
    this.router.navigate(['/campanhas']);
  }

  // Inicia campanha com o personagem selecionado
  iniciarCampanha(personagem: Personagem): void {
    if (personagem.status.vida_atual <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Impossível Iniciar',
        detail: 'Este personagem está morto e não pode iniciar novas aventuras.',
        life: 4000
      });
      return;
    }

    this.personagemService.setPersonagemAtual(personagem);
    // Busca campanhas existentes
    this.campanhaService.listarCampanhas().subscribe({
      next: (campanhas) => {
        // Procura por uma campanha ativa deste personagem
        const campanhaExistente = campanhas.find(
          c => c.personagem_id === personagem.id && c.status === 'ativa'
        );
        if (campanhaExistente) {
          // Se já existe, navega para ela
          this.router.navigate(['/campanha', campanhaExistente.id]);
        } else {
          // Se não existe, cria uma nova
          this.router.navigate(['/campanha']); // Navega para rota de criação
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

  // Dialog de confirmar delete
  confirmarDelecao(event: Event, personagem: Personagem): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Tem certeza que deseja deletar ${personagem.nome}? Esta ação não pode ser desfeita.`,
      header: 'Confirmar Exclusão',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, deletar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-cancel', 
      accept: () => {
        this.deletarPersonagem(personagem.id);
      }
    });
  }

  // Deleta personagem
  private deletarPersonagem(id: string): void {
    this.personagemService.deletarPersonagem(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Personagem deletado com sucesso',
          life: 3000
        });
        // Atualiza a lista em seguida
        this.personagens.update(lista => lista.filter(p => p.id !== id));
        this.isEmpty.set(this.personagens().length === 0);
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

  // Retorna cor de tag baseado na classe
  getClasseColor(classe: string): string {
    const cores: { [key: string]: string } = {
      'guerreiro': 'danger',
      'mago': 'info',
      'ladino': 'warning',
      'clerigo': 'success',
      'paladino': 'primary'
    };
    return cores[classe.toLowerCase()] || 'secondary';
  }

  // Retorna icone baseado na raça
  getRacaIcon(raca: string): string {
    const icones: { [key: string]: string } = {
      'humano': 'pi-user',
      'elfo': 'pi-star',
      'orc': 'pi-bolt',
      'anao': 'pi-shield'
    };
    return icones[raca.toLowerCase()] || 'pi-user';
  }
}