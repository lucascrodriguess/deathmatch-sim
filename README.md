# Simulação de um Estilo de Jogo Mata-Mata Online

Projeto desenvolvido para a disciplina de Sistemas Distribuídos.

O objetivo do projeto é representar visualmente o fluxo de comunicação entre clientes e servidor em um ambiente multiplayer inspirado em jogos de tiro do tipo mata-mata.

A aplicação simula o envio e processamento de eventos em uma arquitetura distribuída utilizando uma interface web interativa.

---

## Integrantes

**Líder:** Lucas Correa Rodrigues  
Antone Bilheri Salbego  

---

## Objetivo

Demonstrar visualmente conceitos fundamentais de sistemas distribuídos através da simulação de uma partida online.

Entre os conceitos representados estão:

- Comunicação cliente-servidor
- Propagação de eventos
- Processamento centralizado
- Sincronização entre clientes
- Atualização de estado distribuído
- Fluxo de mensagens em tempo real

---

## Funcionalidades atuais

- Simulação de múltiplos jogadores com posições únicas no mapa
- Movimentação de jogadores em um mapa de grade
- Sistema de tiros com detecção de linha, dano e kills
- Vida dos jogadores e respawn automático ao morrer
- Placar de kills em tempo real
- Controle de latência configurável (ping)
- Simulação de perda de pacotes (30% de chance)
- Animação de envio e recebimento de pacotes entre nós
- Processamento centralizado e broadcast de estado pelo servidor
- Registro de logs detalhados de rede e servidor
- Interface de logs expansível/colapsável
- Estrutura preparada para escalabilidade

---

## Estrutura do Projeto

```text
src/
│
├── components/
│   │
│   ├── Player/
│   │   ├── Player.jsx
│   │   └── Player.css
│   │
│   ├── Connection/
│   │   ├── Connection.jsx
│   │   └── Connection.css
│   │
│   ├── GameMap/
│   │   ├── GameMap.jsx
│   │   └── GameMap.css
│   │
│   ├── Server/
│   │   ├── Server.jsx
│   │   └── Server.css
│   │
│   ├── Logs/
│   │   ├── Logs.jsx
│   │   └── Logs.css
│
├── App.jsx
├── App.css
├── main.jsx
```

---

## Tecnologias Utilizadas

### Frontend
- React
- JavaScript
- CSS

### Ambiente
- Vite
- Node.js
- npm

---

## Arquitetura da Simulação

```text
PLAYER A
     │
     ▼
GAME SERVER
     │
     ▼
PLAYER B
```

Fluxo simplificado:

1. Jogador executa ação
2. Evento é enviado ao servidor
3. Servidor processa o evento
4. Estado é atualizado
5. Outros jogadores recebem sincronização

---

## Como executar o projeto

### 1. Clonar repositório

```bash
git clone https://github.com/lucascrodriguess/deathmatch-sim.git
```

### 2. Entrar na pasta

```bash
cd deathmatch-sim
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Executar

```bash
npm run dev
```

O projeto estará disponível normalmente em:

```text
http://localhost:5173
```

---

## Estado atual do desenvolvimento

Versão final da demonstração contendo:

- Interface principal
- Simulação local dos eventos
- Comunicação visual cliente-servidor
- Componentização em React
- Latência configurável
- Simulação de perda de pacotes
- Sistema de disparos
- Vida dos jogadores
- Pontuação

---

## Observações

Esta aplicação possui objetivo educacional e busca facilitar o entendimento do funcionamento interno de sistemas distribuídos utilizados em jogos multiplayer online.