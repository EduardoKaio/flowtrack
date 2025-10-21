# FlowTrack

Este projeto é um sistema de gerenciamento de fluxos, construído com um backend em Spring Boot e um frontend em Next.js/React.

## 🚀 Tecnologias Utilizadas

* **Backend:** Spring Boot, Java 21, Spring Data JPA, Maven
* **Frontend:** Next.js, React
* **Banco de Dados:** PostgreSQL

## 📋 Pré-requisitos

Para rodar este projeto, você precisará ter instalado em sua máquina:

* [JDK 21](https://www.oracle.com/java/technologies/downloads/#java21) (ou superior)
* [Apache Maven](https://maven.apache.org/download.cgi) (ou use o wrapper `mvnw` incluído)
* [Node.js](https://nodejs.org/) (versão 18.x ou superior)
* Uma instância local do PostgreSQL (necessário para rodar na rede UFRN)

## 🏁 Rodando o Backend (Spring Boot)

1.  Navegue até o diretório do backend (a raiz do projeto Spring).
2.  Configure o banco de dados (leia a seção sobre a UFRN abaixo).
3.  Execute o projeto usando o Maven wrapper:

    * No Linux/macOS:
        ```bash
        ./mvnw spring-boot:run
        ```
    * No Windows (CMD/PowerShell):
        ```bash
        .\mvnw.cmd spring-boot:run
        ```
4.  A API estará disponível em `http://localhost:8080/api`.
5.  A documentação da API (Swagger) está disponível em `http://localhost:8080/swagger-ui.html`.

## 🖥️ Rodando o Frontend (Next.js)

1.  Navegue até o diretório do frontend.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  Abra seu navegador e acesse `http://localhost:3000`.

---

## ⚠️ Atenção: Configuração do Banco de Dados (Rede UFRN)

A rede da UFRN (incluindo a Eduroam) **bloqueia o acesso** ao nosso banco de dados de produção hospedado na nuvem.

Se você estiver na rede da UFRN, **você deve** usar uma instância local do PostgreSQL.

O arquivo `src/main/resources/application.properties` no projeto backend está configurado para o banco de produção, mas **contém uma seção comentada para o ambiente local**.

### Como configurar o banco local:

1.  Certifique-se de que você tem o PostgreSQL instalado e rodando em sua máquina (normalmente na porta `5432`).
2.  Crie um novo banco de dados (ex: `flowtrack`).
3.  Abra o arquivo `src/main/resources/application.properties`.
4.  **Comente** o bloco de `PRODUÇÃO / AIVEN`.
5.  **Descomente** o bloco `AMBIENTE LOCAL` e ajuste o nome do banco, usuário e senha conforme a sua configuração local.

---

## 🤝 Como Contribuir

Para manter a organização do projeto, siga o fluxo de contribuição abaixo:

1.  Sempre puxe as atualizações mais recentes da branch principal:
    ```bash
    git checkout main
    git pull origin main
    ```
2.  Crie uma nova branch de funcionalidade (feature) a partir da `main`:
    ```bash
    git checkout -b feature/nome-da-sua-tarefa
    ```
3.  Após concluir suas alterações e testar, faça o commit e envie sua branch para o repositório remoto:
    ```bash
    git add .
    git commit -m "feat: descreva sua alteração"
    git push origin feature/nome-da-sua-tarefa
    ```
4.  Abra um **Pull Request (PR)** da sua branch para a branch `main`.
5.  Aguarde a revisão do código.
