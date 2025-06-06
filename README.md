# Sistema de Gestão de Usuários

## Descrição
Este projeto consiste em um **Sistema de Gestão de Usuários**, onde os usuários podem realizar ações básicas como login e cadastro. O sistema foi desenvolvido com **HTML**, **CSS** e **JavaScript** para fornecer uma interface simples e funcional, com o objetivo de demonstrar práticas de gerenciamento de configuração de software (GCS) e Git Flow.

## Funcionalidades
- **Login de Usuário**: Permite que o usuário entre no sistema com credenciais fixas (admin / 12345).
- **Cadastro de Usuário**: O sistema permite cadastrar novos usuários com um nome de usuário e senha.
- **Interface Simples**: Design simples e claro para facilitar a navegação.

## Tecnologias Utilizadas
- **HTML5**: Para estruturação da página.
- **CSS3**: Para estilização e layout da interface.
- **JavaScript**: Para funcionalidade do login e cadastro (simulados).

## Como Rodar o Projeto

1. **Clone o Repositório**:
   Primeiro, clone o repositório para o seu computador:
   ```bash
   git clone https://github.com/fabioramos-02/usuario-gestao.git
   cd usuario-gestao
   2. **Instale o JSON Server** (caso ainda não tenha):
      ```bash
      npm install -g json-server
      ```

   3. **Inicie o JSON Server**:
      Execute o comando abaixo para rodar o servidor fake na porta 3003 usando o arquivo `db.json`:
      ```bash
      json-server --watch db.json --port 3003
      ```