# Mythica RPG - Frontend

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-2196F3?style=for-the-badge&logo=primeng&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

Este é o frontend da aplicação Mythica RPG, uma Single-Page Application (SPA) construída com Angular. A interface permite que os jogadores se cadastrem, criem seus personagens de RPG, gerenciem suas campanhas e joguem uma aventura interativa guiada por uma Inteligência Artificial.

---

## ✨ Funcionalidades Principais

* **Interface Reativa**: Construída com Angular e Signals para uma experiência de usuário fluida.
* **UI Moderna**: Componentes da biblioteca PrimeNG com um tema customizado.
* **Autenticação**: Telas de Login e Registro com gerenciamento de sessão.
* **Criação de Personagem**: Formulário completo para criar heróis com atributos, raças e classes.
* **Gerenciamento de Personagens**: Listagem e visualização dos detalhes de cada personagem.
* **Gerenciamento de Campanhas**: Visualize, continue ou delete campanhas existentes.
* **Tela de Gameplay**: Interface de chat para interagir com a narrativa gerada pela IA, com visualização de status, inventário e ações sugeridas.

---

## 🛠️ Tecnologias Utilizadas

* **Framework**: Angular 20
* **Linguagem**: TypeScript
* **Componentes UI**: PrimeNG
* **Estilização**: Tailwind CSS e tema customizado PrimeUIX
* **Gerenciamento de Estado**: Angular Signals
* **Roteamento**: Angular Router com Guards para proteção de rotas

---

## 🚀 Rodando Localmente

Siga os passos abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

* Node.js v18 ou superior
* NPM ou Yarn
* O [Backend do Mythica RPG](#) rodando localmente ou acessível pela rede.

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd <PASTA_DO_PROJETO_FRONTEND>
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    * Crie uma cópia do arquivo `src/environments/environment.example.ts` e renomeie para `src/environments/environment.ts`.
    * Certifique-se que a variável `apiUrl` aponta para o seu backend local:
        ```typescript
        // src/environments/environment.ts
        export const environment = {
          production: false,
          apiUrl: 'http://localhost:8000/api' // URL do backend local
        };
        ```

4.  **Execute a aplicação:**
    ```bash
    ng serve
    # ou
    npm start
    ```
    A aplicação estará disponível em `http://localhost:4200/`.

---

## ☁️ Versão em Produção (Deploy)

A aplicação está disponível online e pode ser acessada publicamente através da URL abaixo.

* **URL da Aplicação**: `https://mythica-rpg.vercel.app/`

Esta versão está configurada para se comunicar com a API em produção (`https://mythica-backend.onrender.com`).
