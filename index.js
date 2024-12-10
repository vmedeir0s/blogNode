import express from 'express';
import path from 'path';

const PORT = 3000;

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

var usuarios_DB = [];

function validarDataNascimento(data) {
  const regex =
    /^(19[0-9]{2}|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

  if (!regex.test(data)) {
    return false; // Formato inválido
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataNascimento = new Date(ano, mes - 1, dia);
  const dataAtual = new Date();

  // Verifica se a data é válida no calendário
  if (
    dataNascimento.getFullYear() !== ano ||
    dataNascimento.getMonth() !== mes - 1 ||
    dataNascimento.getDate() !== dia
  ) {
    return false; // Data inválida
  }

  // Verifica se a data não está no futuro
  if (dataNascimento > dataAtual) {
    return false; // Data está no futuro
  }

  return true; // Data válida
}

app.get('/login', (req, res) => {
  res.redirect('/login.html');
});

app.post('/login', (req, res) => {
  const { nome, senha } = req.body;
  if (nome == 'admin' && senha == '123') {
    res.redirect('/');
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="styles.css" />
          <title>Blog Node - Login</title>
        </head>
        <body class="loginMain">
          <main>
            <div class="containerLogo">
              <img src="chatLogo.png" alt="LogoTipo" />
              <h1>Blog Node</h1>
            </div>
            <form
              action="/login"
              method="POST"
              class="container d-flex flex-column needs-validation justify-content-center align-items-center"
            >
              <div>
                <label for="nome" class="form-label">Usuário:</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Digite seu nome..."
                  id="nome"
                  name="nome"
                  required
                />
              </div>
              <div>
                <label for="senha" class="form-label">Senha:</label>
                <input
                  type="password"
                  class="form-control"
                  id="senha"
                  name="senha"
                  required
                />
              </div>
              <span>Usuário ou senha inválidos</span>
              <div class="mt-3">
                <button type="submit">Login</button>
              </div>
            </form>
          </main>
          <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
            crossorigin="anonymous"
          ></script>
        </body>
      </html>   
    `);
  }
});

app.get('/cadastroUsuario', (req, res) => {
  res.redirect('/cadastroUsuario.html');
});

app.post('/cadastrarUsuario', (req, res) => {
  const { nome, date, nick } = req.body;
  if (nome.length > 3 && validarDataNascimento(date) && nick.length > 3) {
    const user = { nome, date, nick };
    usuarios_DB.push(user);
    res.redirect('/listarUsuarios');
  } else {
    res.write(`
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="styles.css" />
          <title>Blog Node</title>
        </head>
        <body>
          <header>
            <a href="/">
              <div class="containerNavLogo">
                <img src="chatLogo.png" alt="Logotipo Blog Node" />
                <p>Blog Node</p>
              </div>
            </a>
            <p class="ultimoAcesso">Ultimo acesso: asdjalkdjsklda</p>
            <nav>
              <a href="/cadastroUsuario">Cadastro de Usuários</a>
              <a href="/chat">Bate-papo</a>
              <a href="/logout">Sair</a>
            </nav>
          </header>
          <main class="mainIndex">
            <h1>Cadastrar Usuário</h1>
            <form action="/cadastrarUsuario" method="POST">
              <div class="inptGroup">
                <label class="form-label" for="nome">Nome:</label>
                <input
                  class="form-control"
                  type="text"
                  id="nome"
                  name="nome"
                  value="${nome}"
                  required
                />      
    `);
    if (nome.length <= 3) {
      res.write(`<span>Informe um nome maior que 3 caracteres</span>`);
    }
    res.write(`
              </div>
              <div class="inptGroup">
                <label class="form-label" for="date">Data de Nascimento:</label>
                <input
                  class="form-control"
                  type="date"
                  id="date"
                  name="date"
                  value="${date}"
                  required
                />
    `);
    if (!validarDataNascimento(date)) {
      res.write(`<span>Informe uma data de nascimento válida</span>`);
    }
    res.write(`
              </div>
              <div class="inptGroup">
                <label class="form-label" for="nick">Nickname ou apelido:</label>
                <input
                  class="form-control"
                  type="text"
                  id="nick"
                  name="nick"
                  value="${nick}"
                  required
                />
    `);
    if (nick.length <= 3) {
      res.write(`<span>Informe uma nickname maior que 3 caracteres</span>`);
    }
    res.write(`
              </div>
              <button class="mt-3">Registrar</button>
        </form>
        </main>
        <footer class="mt-5 text-center">
          <p>
            Desenvolvido por
            <a href="https://www.github.com/vmedeir0s/" target="_blank"
              >Vinicius de Medeiros </a
            >👨‍💻
          </p>
        </footer>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
      </body>
    </html> 
    `);
  }
  res.end();
});

app.get('/listarUsuarios', (req, res) => {
  res.write(`
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
            crossorigin="anonymous"
          />
          <link rel="stylesheet" href="styles.css" />
          <title>Blog Node</title>
        </head>
        <body>
          <header>
            <a href="/">
              <div class="containerNavLogo">
                <img src="chatLogo.png" alt="Logotipo Blog Node" />
                <p>Blog Node</p>
              </div>
            </a>
            <p class="ultimoAcesso">Ultimo acesso: asdjalkdjsklda</p>
            <nav>
              <a href="/cadastroUsuario">Cadastro de Usuários</a>
              <a href="/chat">Bate-papo</a>
              <a href="/logout">Sair</a>
            </nav>
          </header>
          <main class="listarUsuarios mt-3">
            <h1>Listar Usuários</h1>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Nome:</th>
                  <th scope="col">Nascimento:</th>
                  <th scope="col">Nick:</th>
                </tr>
              </thead>
              <tbody>`);
  for (let i = 0; i < usuarios_DB.length; i++) {
    res.write(` <tr>
                  <td scope="row">${usuarios_DB[i].nome}</td>
                  <td scope="row">${usuarios_DB[i].date}</td>
                  <td scope="row">${usuarios_DB[i].nick}</td>
                </tr>
    `);
  }
  res.write(`
                </tbody>
              </table>
              <div class="d-flex gap-3">
                <a class="button" href="/cadastroUsuario">Voltar </a>
                <a class="button" href="/">Home</a>
              </div>
          </main>
          <footer class="mt-5 text-center">
          <p>
            Desenvolvido por
            <a href="https://www.github.com/vmedeir0s/" target="_blank"
              >Vinicius de Medeiros </a
            >👨‍💻
          </p>
        </footer>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
      </body>
    </html> 
  `);
  res.end();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossorigin="anonymous"
        />
        <link rel="stylesheet" href="styles.css" />
        <title>Blog - Node</title>
      </head>
      <body>
        <header>
          <a href="/">
            <div class="containerNavLogo">
              <img src="chatLogo.png" alt="Logotipo Blog Node" />
              <p>Blog Node</p>
            </div>
          </a>
          <p class="ultimoAcesso">Ultimo acesso: ${10}</p>
          <nav>
            <a href="/cadastroUsuario">Cadastro de Usuários</a>
            <a href="/chat">Bate-papo</a>
            <a href="/logout">Sair</a>
          </nav>
        </header>
        <main class="mainIndex">
          <p>Bem vindo ao Blog Node</p>
          <p>Acesse a guia Bate-papo para conferir as novidades</p>
        </main>
        <footer class="text-center">
          <p>
            Desenvolvido por
            <a href="https://www.github.com/vmedeir0s/" target="_blank"
              >Vinicius de Medeiros </a
            >👨‍💻
          </p>
        </footer>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossorigin="anonymous"
        ></script>
      </body>
    </html>  
  `);
});

app.listen(PORT, () => {
  console.log(`Aplicação ONLINE rodando da porta: ${PORT}`);
});
