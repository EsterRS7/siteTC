// ========== CONTROLE DO MENU LATERAL ==========
document.addEventListener('DOMContentLoaded', function() {
    const menuHamburguer = document.querySelector('.menu_hamburguer');
    const menuLateral = document.querySelector('.menu_lateral');
    const menuOverlay = document.querySelector('.menu_overlay');
    
    // Abrir/Fechar menu ao clicar no hamburguer
    if (menuHamburguer) {
        menuHamburguer.addEventListener('click', function(e) {
            e.stopPropagation();
            menuLateral.classList.toggle('active');
            menuOverlay.classList.toggle('active');
        });
    }
    
    // Fechar menu ao clicar no overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    }
    
    // Fechar menu ao clicar em um link
    const menuLinks = document.querySelectorAll('.menu_itens a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuLateral.classList.remove('active');
            menuOverlay.classList.remove('active');
        });
    });
});

// ========== ARMAZENAMENTO DE DADOS ==========
const dadosUsuario = {
    resiliencia: null,
    inteligencia: null,
    curso: null,
    instituicao: null
};

// ========== PASSO 1: RESILIÊNCIA E INTELIGÊNCIA ==========
if (document.getElementById('formPasso1')) {
    const radioResiliencia = document.getElementsByName('resiliencia');
    const radioInteligencia = document.getElementsByName('inteligencia');
    
    radioResiliencia.forEach(radio => {
        radio.addEventListener('change', function() {
            dadosUsuario.resiliencia = this.value;
            sessionStorage.setItem('resiliencia', this.value);
            console.log('Resiliência selecionada:', this.value);
        });
    });
    
    radioInteligencia.forEach(radio => {
        radio.addEventListener('change', function() {
            dadosUsuario.inteligencia = this.value;
            sessionStorage.setItem('inteligencia', this.value);
            console.log('Inteligência selecionada:', this.value);
        });
    });
    
    // Validar antes de avançar
    const btnProximo = document.querySelector('a[href="passo2.html"] .btn_iniciar');
    if (btnProximo) {
        btnProximo.addEventListener('click', function(e) {
            const resiliencia = sessionStorage.getItem('resiliencia');
            const inteligencia = sessionStorage.getItem('inteligencia');
            
            if (!resiliencia || !inteligencia) {
                e.preventDefault();
                alert('Por favor, selecione ambas as opções antes de continuar!');
            }
        });
    }
}

// ========== PASSO 2: CURSO E INSTITUIÇÃO ==========
if (document.getElementById('formPasso2')) {
    const selectCurso = document.getElementById('curso');
    const selectInstituicao = document.getElementById('instituicao');
    const inputCursoOutro = document.getElementById('cursoOutro');
    const erroCurso = document.getElementById('erroCurso');
    const btnProximo = document.getElementById('btnProximoPasso');
    
    // Lista de cursos existentes para validação (em minúsculas)
    const cursosExistentes = [
        'licenciaturas em geral', 'letras', 'pedagogia', 'história', 'geografia',
        'ed. física', 'educação física', 'matemática', 'física', 'química',
        'biologia', 'ciências sociais', 'logística', 'áudio visual', 'audiovisual',
        'rádio & tv', 'radio e tv', 'comex', 'publicidade', 'administração',
        'administracao', 'design', 'marketing', 'gestão', 'gestao', 'economia',
        'contábeis', 'contabeis', 'farmácia', 'farmacia', 'fisioterapia',
        'jornalismo', 'computação', 'computacao', 'ti', 'análise e desenvolvimento de sistemas',
        'analise e desenvolvimento de sistemas', 'psicologia', 'relações internacionais',
        'relacoes internacionais', 'direito', 'arquitetura', 'biomedicina',
        'veterinária', 'veterinaria', 'engenharias', 'odontologia', 'medicina'
    ];
    
    // Mostrar/ocultar campo "Outro" quando selecionado
    selectCurso.addEventListener('change', function() {
        if (this.value === 'outro') {
            inputCursoOutro.classList.add('show');
            erroCurso.classList.remove('show');
            inputCursoOutro.focus();
        } else {
            inputCursoOutro.classList.remove('show');
            erroCurso.classList.remove('show');
            
            // Salvar o valor do curso
            const cursoTexto = this.options[this.selectedIndex].text;
            const cursoValor = parseInt(this.value);
            sessionStorage.setItem('curso', cursoTexto.split('.')[0].trim());
            sessionStorage.setItem('cursoValor', cursoValor);
            console.log('Curso selecionado:', cursoTexto, '- Valor:', cursoValor);
        }
    });
    
    // Validar campo "Outro" ao digitar
    inputCursoOutro.addEventListener('blur', function() {
        const cursoDigitado = this.value.trim().toLowerCase();
        
        if (cursoDigitado && cursosExistentes.includes(cursoDigitado)) {
            // Curso já existe na lista
            erroCurso.classList.add('show');
            this.value = '';
        } else if (cursoDigitado) {
            // Curso válido (não existe na lista)
            erroCurso.classList.remove('show');
            sessionStorage.setItem('curso', this.value.trim());
            sessionStorage.setItem('cursoValor', 100); // Valor padrão para "Outro"
            console.log('Curso personalizado:', this.value.trim(), '- Valor: 100');
        }
    });
    
    // Salvar instituição selecionada
    selectInstituicao.addEventListener('change', function() {
        if (this.value) {
            const instituicaoTexto = this.options[this.selectedIndex].text;
            const instituicaoValor = parseInt(this.value);
            sessionStorage.setItem('instituicao', instituicaoTexto.split('.')[0].trim());
            sessionStorage.setItem('instituicaoValor', instituicaoValor);
            console.log('Instituição selecionada:', instituicaoTexto, '- Valor:', instituicaoValor);
        }
    });
    
    // Validar antes de ir para resultados
    btnProximo.addEventListener('click', function(e) {
        const cursoSelecionado = selectCurso.value;
        const instituicaoSelecionada = selectInstituicao.value;
        const cursoOutroPreenchido = inputCursoOutro.value.trim();
        
        // Validar curso
        if (!cursoSelecionado) {
            e.preventDefault();
            alert('Por favor, selecione um curso antes de continuar!');
            return;
        }
        
        // Se "Outro" foi selecionado, validar se foi preenchido
        if (cursoSelecionado === 'outro' && !cursoOutroPreenchido) {
            e.preventDefault();
            alert('Por favor, digite o nome do curso personalizado!');
            inputCursoOutro.focus();
            return;
        }
        
        // Se "Outro" foi preenchido, verificar se não existe na lista
        if (cursoSelecionado === 'outro' && cursosExistentes.includes(cursoOutroPreenchido.toLowerCase())) {
            e.preventDefault();
            erroCurso.classList.add('show');
            inputCursoOutro.value = '';
            return;
        }
        
        // Validar instituição
        if (!instituicaoSelecionada) {
            e.preventDefault();
            alert('Por favor, selecione uma instituição antes de continuar!');
            return;
        }
    });
}

// ========== PÁGINA DE RESULTADOS ==========
if (document.getElementById('resultadoPage')) {
    // Recuperar dados do sessionStorage
    const resiliencia = parseInt(sessionStorage.getItem('resiliencia') || 0);
    const inteligencia = parseInt(sessionStorage.getItem('inteligencia') || 0);
    const curso = sessionStorage.getItem('curso') || 'Não selecionado';
    const instituicao = sessionStorage.getItem('instituicao') || 'Não selecionado';
    const cursoValor = parseInt(sessionStorage.getItem('cursoValor') || 0);
    const instituicaoValor = parseInt(sessionStorage.getItem('instituicaoValor') || 0);
    
    // Preencher os cards com os dados
    document.getElementById('valorResiliencia').textContent = resiliencia;
    document.getElementById('valorInteligencia').textContent = inteligencia;
    document.getElementById('valorCurso').textContent = curso;
    document.getElementById('valorInstituicao').textContent = instituicao;
    
    // Calcular X (onde você está)
    const valorX = resiliencia + inteligencia;
    document.getElementById('calculoX').textContent = `Portanto, resiliência (${resiliencia}) + inteligência (${inteligencia}) = X = ${valorX}`;
    
    // Calcular Y (objetivo - baseado no curso e instituição escolhidos)
    const valorY = cursoValor + instituicaoValor;
    document.getElementById('calculoY').textContent = `Portanto, curso (${cursoValor}) + instituição (${instituicaoValor}) = Y = ${valorY}`;
    
    // Calcular TC (Tamanho da Chance)
    const tc = valorX - valorY;
    const distancia = Math.abs(tc);
    
    // Determinar mensagem baseada no TC
    let statusProximidade = '';
    
    if (tc >= 50) {
        statusProximidade = 'está MUITO PRÓXIMO e ACIMA';
    } else if (tc >= 20) {
        statusProximidade = 'está PRÓXIMO';
    } else if (tc >= 0) {
        statusProximidade = 'está no nível adequado';
    } else if (tc >= -30) {
        statusProximidade = 'NÃO está tão longe';
    } else if (tc >= -60) {
        statusProximidade = 'está LONGE';
    } else {
        statusProximidade = 'está MUITO LONGE';
    }
    
    const mensagemDistancia = `Em uma escala numérica, você está a ${distancia} casas de distância do curso de ${curso} na ${instituicao}. Isso significa que você ${statusProximidade} do seu objetivo!`;
    
    document.getElementById('mensagemDistancia').textContent = mensagemDistancia;
    
    // Log para debug
    console.log('=== RESULTADOS FINAIS ===');
    console.log('Resiliência:', resiliencia);
    console.log('Inteligência:', inteligencia);
    console.log('X (onde você está):', valorX);
    console.log('Curso:', curso, '- Valor:', cursoValor);
    console.log('Instituição:', instituicao, '- Valor:', instituicaoValor);
    console.log('Y (objetivo):', valorY);
    console.log('TC (distância):', tc);
    console.log('Status:', statusProximidade);
}