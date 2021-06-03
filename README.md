## 🚀 Como rodar este projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/), [Postgresql](https://www.postgresql.org/)
Além disto é bom ter um editor para trabalhar com o código como [VSCode][vscode]

### 🧭 Rodando a aplicação web (Front End e Back End)

```bash
# Clone este repositório
$ git clone https://github.com/paulobeckman/Foodfy.git

# Acesse a pasta do projeto no terminal/cmd
$ cd Foodfy

# Instale as dependências
$ npm install

# O servidor inciará na porta:3000 - acesse http://localhost:3000
```

### Configurando banco de dados 

O script SQL para criar o banco de dados está no arquivo database.sql

Para fazer a configuração da aplicação com o banco de dados será necessário fazer alterações no arquivo de configurações do banco de dados.

- Na pasta src > config > db.js
- Das informações fornecidas, para que a aplicação possa se conectar ao seu banco de dados postgres, modifique as seguintes informações conforme está no seu registrado no seu banco de dados: 
```
    user: '', //aqui deve está o user que está registrado no seu banco de dados.
    password: '', //senha do seu banco de dados
    database: '' //nome do banco de dados que voce criou para armazenar as informações.
```


### Configurando conexão com o mailtrap usando o mailer
Acesse a pasta: src > lib > mailer.js

e faça a alteração dos dados para seus dados encontrados no mailtrap ao criar um novo projeto na aba SMTP Setting em Integrations mude para nodemailer.