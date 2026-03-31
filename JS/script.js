// ============================= NeuroFlow - script.js
// Lógica geral do site (Menus, Relógio, Slider, etc.)
// =============================

(function () {
    "use strict";

    // Funções utilitárias para simplificar a seleção de elementos (evita repetir document.querySelector)
    function $(sel, root) {
        return (root || document).querySelector(sel);
    }
    function $all(sel, root) {
        return Array.from((root || document).querySelectorAll(sel));
    }

    // ==========================================
    // 1. RELÓGIO DIGITAL
    // ==========================================
    function initRelogio() {
        // Obtém a referência para o elemento do relógio no HTML
        var clockEl = document.getElementById("relogio");
        
        // Se o elemento não existir na página, cancela a função para evitar erros
        if (!clockEl) return;
        
        // Função responsável por calcular e formatar a hora atual
        function atualizar() {
            var agora = new Date(); 
            
            // Formatar com zeros à esquerda para manter sempre dois dígitos (ex: 09 em vez de 9)
            var dia = String(agora.getDate()).padStart(2, "0");
            var mes = String(agora.getMonth() + 1).padStart(2, "0");
            var ano = agora.getFullYear();
            var horas = String(agora.getHours()).padStart(2, "0");
            var minutos = String(agora.getMinutes()).padStart(2, "0");
            var segundos = String(agora.getSeconds()).padStart(2, "0");
            
            // Atualiza o conteúdo de texto do elemento com a data formatada
            clockEl.textContent = dia + "/" + mes + "/" + ano + " " + horas + ":" +
                    minutos + ":" + segundos;
        }

        // Executa a primeira vez para não esperar 1 segundo até aparecer
        atualizar(); 
        
        // Configura o intervalo para atualizar a hora a cada 1000ms (1 segundo)
        setInterval(atualizar, 1000); 
    }

    // ==========================================
    // 2. SUBMENUS (Para Desktop)
    // ==========================================
    function initSubmenus() {
        // Seleciona todos os itens de menu que possuem submenus
        var items = $all(".has-submenu");
        if (!items.length) return;
        
        // Adiciona eventos de rato para mostrar/esconder o submenu
        items.forEach(function (item) {
            item.addEventListener("mouseenter", function () {
                item.classList.add("open");
            });
            item.addEventListener("mouseleave", function () {
                item.classList.remove("open");
            });

            // Acessibilidade: Garante que o menu abre também ao navegar com a tecla Tab
            $all("a", item).forEach(function (link) {
                link.addEventListener("focus", function () {
                    item.classList.add("open");
                });
                link.addEventListener("blur", function () {
                    item.classList.remove("open");
                });
            });
        });
    }

    // ==========================================
    // 3. MENU MOBILE (DRAWER / GAVETA)
    // ==========================================
    function initDrawerMenu() {
        // Verifica se estamos num ecrã largo; se sim, não ativa o menu mobile
        if (window.matchMedia("(min-width: 751px)").matches) return;
        
        var openBtn = document.getElementById("menu-toggle");
        var drawer = document.getElementById("nav-drawer");
        var closeBtn = document.getElementById("nav-close");
        
        if (!openBtn || !drawer || !closeBtn) return;
        
        // Função para abrir menu lateral
        function open() {
            drawer.classList.add("open");
            // Atualiza atributos ARIA para leitores de ecrã (acessibilidade)
            drawer.setAttribute("aria-hidden", "false"); 
            openBtn.setAttribute("aria-expanded", "true");
            // Bloqueia o scroll do corpo da página para focar no menu
            document.body.style.overflow = "hidden"; 
        }

        // Função para fechar a gaveta lateral e restaurar o scroll
        function close() {
            drawer.classList.remove("open");
            drawer.setAttribute("aria-hidden", "true");
            openBtn.setAttribute("aria-expanded", "false");
            document.body.style.overflow = ""; 
        }

        openBtn.addEventListener("click", open);
        closeBtn.addEventListener("click", close);

        // Permite fechar o menu ao pressionar a tecla ESC
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && drawer.classList.contains("open")) close();
        });
        
        // Fecha o menu se o utilizador clicar na área escura fora do painel
        drawer.addEventListener("click", function (e) {
            if (!e.target.closest(".nav-panel")) close();
        });

        // Garante que o menu fecha automaticamente ao clicar num link
        drawer.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", close);
        });

        // Lógica de acordeão para os submenus dentro da versão mobile
        // MUDANÇA: Agora usamos '.nav-arrow' em vez de '.nav-line'
        drawer.querySelectorAll(".has-submenu-mobile .nav-arrow").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                // Impede que o clique se propague ou cause erros
                e.stopPropagation();
                
                var li = btn.closest(".has-submenu-mobile");
                // Alterna a classe open para expandir ou colapsar a lista
                li.classList.toggle("open"); 
            });
        });
    }

    // ==========================================
    // 4. SLIDER (Página Inicial)
    // ==========================================
    function initSlider(sliderId) {
        var slider = document.getElementById(sliderId);
        if (!slider) return;
        
        var slides = $all(".slide", slider);
        // Se houver apenas 1 ou 0 slides, não é necessário ativar a rotação
        if (slides.length <= 1) return; 
        
        var prevBtn = $(".slider-anterior", slider);
        var nextBtn = $(".slider-seguinte", slider);
        var dotsWrap = document.getElementById("slider-pontos");

        var index = 0; // Índice do slide atual

        // Cria dinamicamente os botões de navegação (pontos) inferiores
        var dots = [];
        if (dotsWrap) {
            dotsWrap.innerHTML = "";
            slides.forEach(function (_, i) {
                var b = document.createElement("button");
                b.addEventListener("click", function () {
                    index = i;
                    render();
                    // Reinicia o temporizador automático se o utilizador interagir manualmente
                    restartAuto(); 
                });
                dotsWrap.appendChild(b);
                dots.push(b);
            });
        }

        // Função auxiliar para definir a imagem do slide como background do contentor principal
        function activeBgFromSlide(i) {
            var img = slides[i].querySelector("img");
            if (img && img.getAttribute("src")) {
                slider.style.backgroundImage = "url(" + img.getAttribute("src") + ")";
            }
        }

        // Atualiza a interface ativando o slide e o ponto correspondente ao índice atual
        function render() {
            slides.forEach(function (s, i) {
                s.classList.toggle("active", i === index);
            });
            dots.forEach(function (d, i) {
                d.classList.toggle("active", i === index);
            });
            activeBgFromSlide(index);
        }

        // Avança para o próximo slide (volta ao início se chegar ao fim - loop)
        function next() {
            index = (index + 1) % slides.length; 
            render();
        }

        // Recua para o slide anterior
        function prev() {
            index = (index - 1 + slides.length) % slides.length;
            render();
        }

        // Configura os eventos dos botões de setas
        if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restartAuto(); });
        if (nextBtn) nextBtn.addEventListener("click", function () { next(); restartAuto(); });
        
        // Lógica para rotação automática dos slides a cada 5 segundos
        var timer = null;
        function startAuto() { timer = setInterval(next, 5000); }
        function restartAuto() { if (timer) clearInterval(timer); startAuto(); }

        // Inicializa o slider
        render();
        startAuto();
    }

    // ==========================================
    // 5. INTERAÇÕES SIMPLES (Botões de Estado/Emoção)
    // ==========================================
    
    // Controlador dos botões de estado mental na Home
    function initEstadoMental() {
        var estadoTexto = document.getElementById("estado-texto");
        var estadoBtns = $all("[data-estado]");
        
        if (!estadoTexto || !estadoBtns.length) return;
        
        // Mapeamento de descrições para cada estado possível
        var mensagens = {
            calmo: "Atividade estável — foco suave, respiração lenta e clareza mental.",
            moderado: "Atividade moderada — atenção ativa e pensamentos em organização.",
            intenso: "Atividade intensa — emoções elevadas e alta energia mental."
        };

        estadoBtns.forEach(function (btn) {
            btn.addEventListener("click", function () {
                // Remove a classe active de todos os botões para garantir seleção única
                estadoBtns.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                
                // Atualiza o texto descritivo com base no atributo data-estado
                var estado = btn.getAttribute("data-estado");
                estadoTexto.textContent = mensagens[estado];
            });
        });
    }

    // Controlador do painel de emoções na página Mente
    function initEmocoesMente() {
        var emocaoTexto = document.getElementById("emocao-texto");
        var emocaoBadge = document.getElementById("emocao-badge");
        var botoesEmocao = $all("[data-emocao]");
        
        if (!emocaoTexto || !emocaoBadge) return;

        var desc = {
            calma: "Calma: foco suave, respiração estável e clareza mental.",
            ansiedade: "Ansiedade: pensamento acelerado e sensação de urgência interna.",
            alegria: "Alegria: energia positiva, leveza e maior abertura ao mundo."
        };

        botoesEmocao.forEach(function (btn) {
            btn.addEventListener("click", function () {
                botoesEmocao.forEach(function (b) { b.classList.remove("active"); });
                btn.classList.add("active");
                
                var e = btn.getAttribute("data-emocao");
                emocaoTexto.textContent = desc[e];
                // Capitaliza a primeira letra para exibir no crachá (badge)
                emocaoBadge.textContent = e.charAt(0).toUpperCase() + e.slice(1); 
            });
        });
    }

    // Inicializa todas as funções apenas quando o DOM estiver pronto
    document.addEventListener("DOMContentLoaded", function () {
        initRelogio();
        initSubmenus();
        initDrawerMenu();
        initSlider("slider");
        initEstadoMental();
        initEmocoesMente();
    });
})();