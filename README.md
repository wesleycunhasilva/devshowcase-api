# 🚀 DevShowcase API

A **DevShowcase API** é uma API RESTful desenvolvida para gerenciamento de portfólios de desenvolvedores, permitindo cadastrar perfis, projetos, tecnologias e feedbacks sobre os projetos. 

Este projeto foi desenvolvido como parte de um trabalho acadêmico utilizando o ecossistema **Node.js**, **TypeScript**, **Express** e **Prisma ORM** com banco de dados **SQLite**.

---

## 📌 Tecnologias Utilizadas

* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Ambiente de Execução:** [Node.js](https://nodejs.org/)
* **Framework Web:** [Express](https://expressjs.com/)
* **ORM:** [Prisma](https://www.prisma.io/)
* **Banco de Dados:** SQLite
* **Execução em Desenvolvimento:** `tsx`
* **Testes de API:** [Postman](https://www.postman.com/)

---

## 🗄️ Modelagem de Dados (Entidades)

A aplicação conta com 4 entidades relacionais modeladas no Prisma:

1. **Profile:** Representa o desenvolvedor (Nome, E-mail único, Bio).
2. **Technology:** Armazena as tecnologias/ferramentas utilizadas (Nome único).
3. **Project:** Projetos criados pelos desenvolvedores (Título, Descrição, URL do Repositório, Chave Estrangeira `profileId`).
4. **Feedback:** Avaliações enviadas para os projetos (Comentário, Nota/Rating, Chave Estrangeira `projectId`).

---

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* npm ou yarn instalado

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/rogerf-cmy/devshowcase-api.git](https://github.com/rogerf-cmy/devshowcase-api.git)
   cd devshowcase-api
