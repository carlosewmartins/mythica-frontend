import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { PersonagemService, CreatePersonagemDto } from '../../../../core/services/personagem';

interface OpcaoSelect {
  label: string;
  value: string;
}

@Component({
  selector: 'app-criar-personagem',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    SliderModule,
    CardModule,
    DividerModule
  ],
  templateUrl: './criar-personagem.html',
  styleUrl: './criar-personagem.scss'
})
export class CriarPersonagem implements OnInit {
  private fb = inject(FormBuilder);
  private personagemService = inject(PersonagemService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  personagemForm!: FormGroup;
  isSubmitting = signal(false);

  // opcoes para os dropdowns
  racas: OpcaoSelect[] = [
    { label: 'Humano', value: 'Humano' },
    { label: 'Elfo', value: 'Elfo' },
    { label: 'Anão', value: 'Anão' },
    { label: 'Orc', value: 'Orc' }
  ];

  classes: OpcaoSelect[] = [
    { label: 'Guerreiro', value: 'Guerreiro' },
    { label: 'Mago', value: 'Mago' },
    { label: 'Ladino', value: 'Ladino' },
    { label: 'Clérigo', value: 'Clérigo' },
    { label: 'Arqueiro', value: 'Arqueiro' }
  ];

  // sistema de distribuicao de pontos
  pontosDisponiveis = signal(21);
  pontosGastos = computed(() => 21 - this.pontosDisponiveis());

  ngOnInit(): void {
    this.inicializarFormulario();
    this.configurarWatchersAtributos();
  }

  private inicializarFormulario(): void {
    this.personagemForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      raca: [null, Validators.required],
      classe: [null, Validators.required],
      descricao: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      atributos: this.fb.group({
        forca: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        destreza: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        constituicao: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        inteligencia: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        sabedoria: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
        carisma: [1, [Validators.required, Validators.min(1), Validators.max(20)]]
      })
    });
  }

  // configura watch para verificar quantidade de pontos disponiveis
  private configurarWatchersAtributos(): void {
    const atributosGroup = this.personagemForm.get('atributos') as FormGroup;
    
    atributosGroup.valueChanges.subscribe(() => {
      this.calcularPontosDisponiveis();
    });
  }

  /**
   * Calcula pontos disponíveis baseado nos valores dos atributos
   * Sistema: cada ponto a partir de 1 custa 1 ponto do pool
   */
  private calcularPontosDisponiveis(): void {
    const atributos = this.personagemForm.get('atributos')?.value;
    
    const custoTotal = 
      (atributos.forca - 1) +
      (atributos.destreza - 1) +
      (atributos.constituicao - 1) +
      (atributos.inteligencia - 1) +
      (atributos.sabedoria - 1) +
      (atributos.carisma - 1);
    
    this.pontosDisponiveis.set(21 - custoTotal);
  }

  // verifica se pode aumentar um atributo (atributo precisa ser menor que 20)
  podeAumentarAtributo(nomeAtributo: string): boolean {
    const atributo = this.personagemForm.get(`atributos.${nomeAtributo}`);
    return this.pontosDisponiveis() > 0 && (atributo?.value || 1) < 20;
  }


  // verifica se pode diminuir um atributo (atributo precisa ser maior que 1)
  podeDiminuirAtributo(nomeAtributo: string): boolean {
    const atributo = this.personagemForm.get(`atributos.${nomeAtributo}`);
    return (atributo?.value || 1) > 1;
  }

  // aumenta o valor de um atributo
  aumentarAtributo(nomeAtributo: string): void {
    if (this.podeAumentarAtributo(nomeAtributo)) {
      const atributo = this.personagemForm.get(`atributos.${nomeAtributo}`);
      atributo?.setValue((atributo.value || 8) + 1);
    }
  }

  // diminui o valor de um atributo
  diminuirAtributo(nomeAtributo: string): void {
    if (this.podeDiminuirAtributo(nomeAtributo)) {
      const atributo = this.personagemForm.get(`atributos.${nomeAtributo}`);
      atributo?.setValue((atributo.value || 1) - 1);
    }
  }

  // distribui pontos aleatoriamente
  distribuirAleatoriamente(): void {
    const atributos = ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'];
    
    // reseta todos para 1
    atributos.forEach(attr => {
      this.personagemForm.get(`atributos.${attr}`)?.setValue(1);
    });

    // distribui os 21 pontos aleatoriamente
    let pontosRestantes = 21;
    while (pontosRestantes > 0) {
      const atributoAleatorio = atributos[Math.floor(Math.random() * atributos.length)];
      const valorAtual = this.personagemForm.get(`atributos.${atributoAleatorio}`)?.value || 1;
      
      if (valorAtual < 20) {
        this.personagemForm.get(`atributos.${atributoAleatorio}`)?.setValue(valorAtual + 1);
        pontosRestantes--;
      }
    }
  }
  
  onSubmit(): void {
    if (this.personagemForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos corretamente',
        life: 3000
      });
      return;
    }

    if (this.pontosDisponiveis() !== 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: `Você ainda tem ${this.pontosDisponiveis()} pontos para distribuir`,
        life: 3000
      });
      return;
    }

    this.isSubmitting.set(true);

    const dados: CreatePersonagemDto = {
      nome: this.personagemForm.value.nome,
      raca: this.personagemForm.value.raca,
      classe: this.personagemForm.value.classe,
      descricao: this.personagemForm.value.descricao,
      atributos: this.personagemForm.value.atributos
    };

    this.personagemService.criarPersonagem(dados).subscribe({
      next: (personagem) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: `${personagem.nome} foi criado com sucesso!`,
          life: 3000
        });

        // aguarda um pouco e redireciona para a lista
        setTimeout(() => {
          this.router.navigate(['/personagens']);
        }, 1000);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.message || 'Não foi possível criar o personagem',
          life: 5000
        });
        this.isSubmitting.set(false);
      }
    });
  }

  // cancela e volta pra lista de personagens
  cancelar(): void {
    this.router.navigate(['/personagens']);
  }

  // verifica se um campo e valido
  isInvalid(fieldName: string): boolean {
    const field = this.personagemForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
}