# Sistema de Gestão de Banca

Um sistema web para gerenciamento de apostas esportivas, desenvolvido com Flask e SQLite, oferecendo visualização de dados através de gráficos e métricas em tempo real.

## 🚀 Funcionalidades

- Dashboard com métricas em tempo real
- Gráficos de desempenho (PL por Liga, Mercado e Método)
- Gráfico de PL Acumulado
- Filtros por data, mercado e método
- Cadastro e listagem de apostas
- Indicadores de performance (Winrate, ROI, Stake Média)
- Comparação com métricas do dia anterior

## 📋 Pré-requisitos

- Python 3.8+
- SQLite3
- Navegador web moderno

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd gestao-de-banca
```

2. Crie um ambiente virtual e ative-o:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Inicialize o banco de dados:
```bash
python
>>> from app import db, app
>>> with app.app_context():
...     db.create_all()
```

## ⚙️ Configuração do Banco de Dados

O arquivo `database.sql` contém a estrutura do banco de dados. As principais tabelas são:

- `apostas`: Armazena as apostas realizadas


## 🏃‍♂️ Executando o Sistema

1. Inicie o servidor Flask:
```bash
python app.py
```

2. Acesse no navegador:
```
http://localhost:5000
```

## 📊 Estrutura do Projeto

```
gestao-de-banca/
├── app.py              # Aplicação Flask principal
├── database.sql        # Estrutura do banco de dados
├── requirements.txt    # Dependências do projeto
├── static/
│   ├── css/           # Arquivos CSS
│   └── js/            # Arquivos JavaScript
└── templates/         # Templates HTML
```

## 🛠️ Tecnologias Utilizadas

- Backend:
  - Flask 2.3.3 (Framework web)
  - Flask-SQLAlchemy 3.1.1 (ORM)
  - MySQL (Banco de dados)
  - python-dotenv 1.0.0 (Variáveis de ambiente)
  - Flask-WTF 1.1.1 (Formulários)
  - PyMySQL 1.1.0 (Conector MySQL)

- Frontend:
  - HTML5
  - CSS3
  - JavaScript
  - Chart.js (Gráficos)
  - Bootstrap (Framework CSS)
  - Boxicons (Ícones)

## 📈 Funcionalidades do Dashboard

### Métricas Principais
- PL Total
- Winrate
- ROI
- Stake Média

### Gráficos
- PL Acumulado
- PL por Liga
- PL por Mercado
- PL por Método

### Filtros
- Data Inicial
- Data Final
- Mercado
- Método

## 💡 Uso

1. **Cadastro de Apostas**:
   - Acesse a aba "Cadastrar Aposta"
   - Preencha os dados da aposta
   - Clique em "Salvar"

2. **Visualização de Dados**:
   - O dashboard é atualizado automaticamente
   - Use os filtros para análises específicas
   - Acompanhe o desempenho através dos gráficos

3. **Lista de Jogos**:
   - Acesse a aba "Lista de Jogos"
   - Visualize e gerencie os jogos cadastrados

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## ✒️ Autores

* **Paulo** - *Desenvolvimento* - [Seu GitHub](https://github.com/seu-usuario)

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes
