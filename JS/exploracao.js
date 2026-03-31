// =============================
// JOGO 1: Efeito Stroop (Cores vs Texto)
// =============================
var stroopPalavra = document.getElementById("stroop-palavra");
var stroopPontosEl = document.getElementById("stroop-pontos");
var stroopOpcoes = document.getElementById("stroop-opcoes");

var cores = ["vermelho", "verde", "azul", "amarelo"];
var pontos = 0;

// Função auxiliar para gerar um número inteiro aleatório até n
function rand(n) { return Math.floor(Math.random() * n); }

function iniciarStroop() {
  pontos = 0;
  atualizarPontos();
  proximaRonda();
}

function proximaRonda() {
  // 1. Escolhe aleatoriamente a palavra a ser escrita (ex: "AZUL")
  var textoIdx = rand(cores.length);
  // 2. Escolhe aleatoriamente a cor da tinta (ex: tinta vermelha)
  var corIdx = rand(cores.length);

  // Define o texto visível
  stroopPalavra.textContent = cores[textoIdx];
  // Aplica a classe CSS correspondente à cor da tinta (o desafio cognitivo)
  stroopPalavra.className = "stroop-word cor-" + cores[corIdx];

  // Gera os botões de resposta dinamicamente
  var html = "";
  for (var i = 0; i < cores.length; i++) {
    // Ao clicar, envia a cor escolhida e a cor real da tinta para verificação
    html += '<button class="botao botao-pequeno" onclick="verificarStroop(\'' + cores[i] + '\', \'' + cores[corIdx] + '\')">' + cores[i] + '</button>';
  }
  stroopOpcoes.innerHTML = html;
}

function verificarStroop(corClicada, corReal) {
  if (corClicada === corReal) {
    // Se o jogador acertou na cor da tinta, incrementa pontos e avança
    pontos++;
    atualizarPontos();
    proximaRonda();
  } else {
    // Se errou, termina o jogo e mostra botão de reinício
    stroopPalavra.textContent = "Errado! Fim.";
    stroopPalavra.className = "stroop-word"; 
    stroopOpcoes.innerHTML = '<button class="botao botao-primario" onclick="iniciarStroop()">Tentar de novo</button>';
  }
}

function atualizarPontos() {
  if(stroopPontosEl) stroopPontosEl.textContent = pontos;
}

// Expõe as funções no objeto global window para serem acessíveis pelo HTML (onclick)
window.iniciarStroop = iniciarStroop;
window.verificarStroop = verificarStroop;


// =============================
// JOGO 2: Respiração Guiada
// =============================
var btnRespirar = document.getElementById("btn-respirar");
var circulo = document.getElementById("circulo-respiracao");
var textoResp = document.getElementById("texto-respiracao");
var isBreathing = false;

if (btnRespirar && circulo && textoResp) {
  btnRespirar.addEventListener("click", function() {
    if (isBreathing) return; // Evita múltiplos cliques que sobreponham animações
    isBreathing = true;
    btnRespirar.textContent = "A decorrer...";
    btnRespirar.disabled = true;
    
    cicloRespiracao(); 
    // Configura o ciclo para repetir a cada 8 segundos (4 inspira + 4 expira)
    setInterval(cicloRespiracao, 8000); 
  });
}

function cicloRespiracao() {
  // Fase de inspiração: altera texto e classe para expandir o círculo
  textoResp.textContent = "Inspira";
  circulo.className = "circulo inspirar";

  // Agenda a fase de expiração para começar após 4 segundos (4000ms)
  setTimeout(function() {
    textoResp.textContent = "Expira";
    circulo.className = "circulo expirar";
  }, 4000);
}


// =============================
// JOGO 3: Neuro-Reflexos (Com Cronómetro em Tempo Real)
// =============================

document.addEventListener("DOMContentLoaded", function() {
  var area = document.getElementById("reflexo-area");
  var alvo = document.getElementById("reflexo-alvo");
  var btnStart = document.getElementById("reflexo-btn-start");
  var textoTempo = document.getElementById("reflexo-tempo");
  var textoContador = document.getElementById("reflexo-contador");
  var badge = document.getElementById("reflexo-badge");

  var inicioTempo = 0;
  var alvosAtingidos = 0;
  var maxAlvos = 5;
  var jogoAtivo = false;
  var timerInterval = null; 

  if (!area || !alvo || !btnStart) return;

  function iniciarJogo() {
    jogoAtivo = true;
    alvosAtingidos = 0;
    
    // Reseta a interface do utilizador para o estado inicial
    btnStart.style.display = "none";
    textoContador.textContent = "0 / " + maxAlvos;
    textoTempo.textContent = "0.00s";
    
    if(badge) {
        badge.textContent = "A decorrer...";
        badge.style.borderColor = "#eab308";
        badge.style.color = "#eab308";
    }

    inicioTempo = Date.now();
    
    // Limpa qualquer intervalo anterior para evitar conflitos
    if (timerInterval) clearInterval(timerInterval);
    
    // Inicia o cronómetro visual que atualiza a cada 50ms para feedback imediato
    timerInterval = setInterval(function() {
      var agora = (Date.now() - inicioTempo) / 1000;
      textoTempo.textContent = agora.toFixed(2) + "s";
    }, 50);

    moverAlvo();
  }

  function moverAlvo() {
    // Calcula coordenadas aleatórias garantindo que o alvo fica dentro da área
    var maxX = area.clientWidth - 50; 
    var maxY = area.clientHeight - 50;
    var x = Math.floor(Math.random() * maxX);
    var y = Math.floor(Math.random() * maxY);

    alvo.style.left = x + "px";
    alvo.style.top = y + "px";
    alvo.style.display = "block";
  }

  function alvoClicado() {
    if (!jogoAtivo) return;

    alvosAtingidos++;
    textoContador.textContent = alvosAtingidos + " / " + maxAlvos;

    // Verifica se o jogador atingiu o número objetivo de alvos
    if (alvosAtingidos >= maxAlvos) {
      fimDeJogo();
    } else {
      // Se não, esconde o alvo atual e move-o para nova posição
      alvo.style.display = "none";
      moverAlvo(); 
    }
  }

  function fimDeJogo() {
    jogoAtivo = false;
    alvo.style.display = "none";
    
    // Para a contagem do tempo
    if (timerInterval) clearInterval(timerInterval);
    
    // Calcula o tempo final exato
    var tempoFinal = (Date.now() - inicioTempo) / 1000;
    textoTempo.textContent = tempoFinal.toFixed(2) + "s";
    
    btnStart.textContent = "Tentar de novo";
    btnStart.style.display = "block";
    
    // Atualiza o crachá de estado
    if(badge) {
        badge.textContent = "Concluído!";
        badge.style.borderColor = "#22c55e";
        badge.style.color = "#22c55e";
    }
  }

  btnStart.addEventListener("click", iniciarJogo);
  alvo.addEventListener("mousedown", alvoClicado); 
});


// =============================
// JOGO 4: Sudoku (Lógica Completa)
// =============================
var sudokuBoard = document.getElementById("sudoku-board");
var sudokuSizeSel = document.getElementById("sudoku-size");
var sudokuLivesEl = document.getElementById("sudoku-lives");
var sudokuMsg = document.getElementById("sudoku-msg");
var sudokuNewBtn = document.getElementById("sudoku-new");
var sudokuResetBtn = document.getElementById("sudoku-reset");

if (sudokuBoard) {
  var lives = 3;

  // Estrutura de dados dos puzzles: define o estado inicial e a solução
  var puzzles = {
    4: {
      puzzle: [
        [0,3,0,0],
        [0,0,0,2],
        [1,0,0,0],
        [0,0,4,0]
      ],
      solution: [
        [2,3,1,4],
        [4,1,3,2],
        [1,4,2,3],
        [3,2,4,1]
      ]
    },
    9: {
      puzzle: [
        [0,0,5,0,2,4,0,1,3],
        [0,0,6,0,3,1,0,0,0],
        [0,0,1,0,8,9,5,0,7],
        [1,6,0,0,9,7,0,0,5],
        [7,5,8,3,0,0,0,9,0],
        [0,0,9,8,0,5,0,0,0],
        [5,0,7,0,6,0,3,2,4],
        [0,1,0,4,5,0,9,7,0],
        [0,4,3,0,0,2,0,0,0]
      ],
      solution: [
        [9,8,5,7,2,4,6,1,3],
        [4,7,6,5,3,1,2,8,9],
        [2,3,1,6,8,9,5,4,7],
        [1,6,4,2,9,7,8,3,5],
        [7,5,8,3,1,6,4,9,2],
        [3,2,9,8,4,5,7,6,1],
        [5,9,7,1,6,8,3,2,4],
        [8,1,2,4,5,3,9,7,6],
        [6,4,3,9,7,2,1,5,8]
      ]
    }
  };

  var current = null;        
  var workingGrid = null;    // Armazena cópia do puzzle para permitir reinício
  var size = 9;

  // Função para criar uma cópia profunda (deep copy) da matriz, evitando referências partilhadas
  function deepCopy(grid) {
    return grid.map(function (row) { return row.slice(); });
  }

  function setMessage(text, tone) {
    sudokuMsg.textContent = text;
    sudokuMsg.style.color = (tone === "bad") ? "#fca5a5" : (tone === "good") ? "#6afaff" : "#9ca3af";
  }

  function setLives(n) {
    lives = n;
    sudokuLivesEl.textContent = String(lives);
  }

  // Constrói a grelha visualmente no DOM criando inputs para cada célula
  function buildBoard(n) {
    sudokuBoard.innerHTML = "";
    sudokuBoard.classList.remove("sudoku-4", "sudoku-9");
    sudokuBoard.classList.add(n === 4 ? "sudoku-4" : "sudoku-9");
    sudokuBoard.style.gridTemplateRows = "repeat(" + n + ", 1fr)";

    for (var r = 0; r < n; r++) {
      var rowEl = document.createElement("div");
      rowEl.className = "sudoku-row";
      rowEl.style.gridTemplateColumns = "repeat(" + n + ", 1fr)";

      for (var c = 0; c < n; c++) {
        var cell = document.createElement("input");
        cell.className = "sudoku-cell";
        cell.setAttribute("inputmode", "numeric");
        cell.setAttribute("maxlength", "1"); 
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);

        var value = current.puzzle[r][c];
        
        // Se a célula já tem um valor inicial, bloqueia e aplica estilo específico
        if (value !== 0) {
          cell.value = String(value);
          cell.disabled = true;
          cell.classList.add("prefilled");
        } else {
          cell.value = "";
          cell.disabled = false;
        }

        cell.addEventListener("input", onCellInput);
        
        // Adiciona bordas visuais para separar os quadrantes (UX)
        if (n === 4) {
          if (c === 1) cell.classList.add("sep-right");
          if (r === 1) cell.classList.add("sep-bottom");
        }
        if (n === 9) {
          if (c === 2 || c === 5) cell.classList.add("sep-right");
          if (r === 2 || r === 5) cell.classList.add("sep-bottom");
        }

        rowEl.appendChild(cell);
      }
      sudokuBoard.appendChild(rowEl);
    }
  }

  // Lógica principal: valida a entrada do utilizador em tempo real
  function onCellInput(e) {
    if (lives <= 0) return;

    var cell = e.target;
    var r = parseInt(cell.dataset.r, 10);
    var c = parseInt(cell.dataset.c, 10);

    // Validação básica: garante que é um número dentro dos limites
    var v = parseInt(cell.value, 10);
    if (!Number.isFinite(v) || v < 1 || v > size) {
      cell.value = ""; 
      return;
    }

    var correct = current.solution[r][c];

    if (v === correct) {
      // Jogada correta: bloqueia a célula e verifica vitória
      cell.classList.add("correct");
      cell.disabled = true; 
      cell.classList.add("locked");
      setMessage("Certo ✅ Continua.", "good");
      checkWin();
    } else {
      // Jogada errada: penaliza uma vida e aplica autocorreção
      setLives(lives - 1);
      cell.classList.add("wrong");
      
      // Funcionalidade de autocorreção: insere o valor correto para não frustrar o jogador
      cell.value = String(correct);
      cell.disabled = true;
      cell.classList.add("locked");

      if (lives > 0) {
        setMessage("Errado ❌ O jogo corrigiu para ti. Restam " + lives + " vidas.", "bad");
      } else {
        setMessage("Sem vidas. O jogo terminou. Clica em “Novo jogo”.", "bad");
        lockAllEditable(); // Fim de jogo
      }
    }
  }

  function lockAllEditable() {
    var cells = sudokuBoard.querySelectorAll(".sudoku-cell");
    cells.forEach(function (cell) {
      cell.disabled = true;
    });
  }

  // Verifica se todas as células estão preenchidas e bloqueadas (estado de vitória)
  function checkWin() {
    var cells = sudokuBoard.querySelectorAll(".sudoku-cell");
    for (var i = 0; i < cells.length; i++) {
      if (!cells[i].disabled) return; 
    }
    setMessage("Parabéns 🎉 Sudoku concluído!", "good");
  }

  function loadGame(newSize) {
    size = newSize;
    current = puzzles[size];
    workingGrid = deepCopy(current.puzzle);

    setLives(3);
    setMessage("Preenche os espaços. Se errares, o jogo corrige automaticamente.", "neutral");
    buildBoard(size);
  }

  // Eventos dos botões de controlo do jogo
  sudokuNewBtn.addEventListener("click", function () {
    var n = parseInt(sudokuSizeSel.value, 10);
    loadGame(n === 4 ? 4 : 9);
  });

  sudokuResetBtn.addEventListener("click", function () {
    // Reinicia o estado atual usando a cópia de segurança (workingGrid)
    current = puzzles[size];
    current.puzzle = deepCopy(workingGrid);
    setLives(3);
    setMessage("Reiniciado. Tens novamente 3 vidas.", "neutral");
    buildBoard(size);
  });

  sudokuSizeSel.addEventListener("change", function () {
    var n = parseInt(sudokuSizeSel.value, 10);
    loadGame(n === 4 ? 4 : 9);
  });

  // Inicializa o jogo ao carregar a página
  loadGame(parseInt(sudokuSizeSel.value, 10));
}