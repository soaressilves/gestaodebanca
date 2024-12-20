document.addEventListener("DOMContentLoaded", function(e) {

    

    
    
    
    // Sidebar functionality
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                nav.classList.toggle('show')
                toggle.classList.toggle('bx-x')
                bodypd.classList.toggle('body-pd')
                headerpd.classList.toggle('body-pd')
            })
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

    // Função assíncrona para preencher os filtros
    const populateFilters = async () => {
        const mercadoSelect = document.getElementById('mercado-filter');
        const metodoSelect = document.getElementById('metodo-filter');

        // Preencher filtros de mercado
        const mercadosResponse = await fetch('/api/mercados');
        const mercados = await mercadosResponse.json();
        
        // Adicionar opção "Todos"
        mercadoSelect.innerHTML = '<option value="">Todos</option>';
        mercados.forEach(mercado => {
            const option = document.createElement('option');
            option.value = mercado;
            option.textContent = mercado;
            mercadoSelect.appendChild(option);
        });

        // Preencher filtros de método
        const metodosResponse = await fetch('/api/metodos');
        const metodos = await metodosResponse.json();
        
        // Adicionar opção "Todos"
        metodoSelect.innerHTML = '<option value="">Todos</option>';
        metodos.forEach(metodo => {
            const option = document.createElement('option');
            option.value = metodo;
            option.textContent = metodo;
            metodoSelect.appendChild(option);
        });

        // Adicionar evento para atualizar métodos quando mercado mudar
        mercadoSelect.addEventListener('change', async () => {
            const selectedMercado = mercadoSelect.value;
            const url = selectedMercado ? `/api/metodos/${selectedMercado}` : '/api/metodos';
            
            const response = await fetch(url);
            const filteredMetodos = await response.json();
            
            metodoSelect.innerHTML = '<option value="">Todos</option>';
            filteredMetodos.forEach(metodo => {
                const option = document.createElement('option');
                option.value = metodo;
                option.textContent = metodo;
                metodoSelect.appendChild(option);
            });
            
            updateDashboard();
        });
    };

    // Chamar a função para preencher os filtros
    populateFilters();

    // Navigation
    const navLinks = document.querySelectorAll('.nav_link')
    const sections = document.querySelectorAll('section')

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            const targetId = link.getAttribute('href').substring(1)
            
            sections.forEach(section => {
                section.classList.add('d-none')
            })
            
            document.getElementById(targetId).classList.remove('d-none')
            
            navLinks.forEach(l => l.classList.remove('active'))
            link.classList.add('active')
        })
    })

    // Chart initialization
    let plChart = null;
    let plLigaChart = null;
    let plMercadoChart = null;
    let plMetodoChart = null;

    const destroyCharts = () => {
        console.log('Destroying existing charts');
        if (plChart) {
            plChart.destroy();
            plChart = null;
        }
        if (plLigaChart) {
            plLigaChart.destroy();
            plLigaChart = null;
        }
        if (plMercadoChart) {
            plMercadoChart.destroy();
            plMercadoChart = null;
        }
        if (plMetodoChart) {
            plMetodoChart.destroy();
            plMetodoChart = null;
        }
    };

    const initCharts = (data) => {
        console.log('Starting chart initialization with data:', data);
        destroyCharts();

        try {
            // PL Acumulado Chart
            const ctxPL = document.getElementById('pl-chart');
            if (ctxPL && data.pl_acumulado && data.pl_acumulado.length > 0) {
                console.log('Initializing PL chart');
                plChart = new Chart(ctxPL, {
                    type: 'line',
                    data: {
                        labels: data.pl_acumulado.map(item => item.data),
                        datasets: [{
                            label: 'PL Acumulado',
                            data: data.pl_acumulado.map(item => item.pl),
                            borderColor: '#4723D9',
                            tension: 0.1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    }
                });
            }

            // PL por Liga Chart
            const ctxLiga = document.getElementById('pl-liga-chart');
            if (ctxLiga && data.pl_por_liga && data.pl_por_liga.length > 0) {
                console.log('Initializing Liga chart');
                plLigaChart = new Chart(ctxLiga, {
                    type: 'bar',
                    data: {
                        labels: data.pl_por_liga.map(item => item.liga),
                        datasets: [{
                            label: 'PL por Liga',
                            data: data.pl_por_liga.map(item => item.pl),
                            backgroundColor: data.pl_por_liga.map(item => 
                                item.pl >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
                            )
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }

            // PL por Mercado Chart
            const ctxMercado = document.getElementById('pl-mercado-chart');
            if (ctxMercado && data.pl_por_mercado && data.pl_por_mercado.length > 0) {
                console.log('Initializing Mercado chart');
                plMercadoChart = new Chart(ctxMercado, {
                    type: 'bar',
                    data: {
                        labels: data.pl_por_mercado.map(item => item.mercado),
                        datasets: [{
                            label: 'PL',
                            data: data.pl_por_mercado.map(item => item.pl),
                            backgroundColor: data.pl_por_mercado.map(item => 
                                item.pl >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
                            )
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'PL por Mercado'
                            }
                        }
                    }
                });
            }

            // PL por Método Chart
            const ctxMetodo = document.getElementById('pl-metodo-chart');
            if (ctxMetodo && data.pl_por_metodo && data.pl_por_metodo.length > 0) {
                console.log('Initializing Método chart');
                plMetodoChart = new Chart(ctxMetodo, {
                    type: 'bar',
                    data: {
                        labels: data.pl_por_metodo.map(item => item.metodo),
                        datasets: [{
                            label: 'PL',
                            data: data.pl_por_metodo.map(item => item.pl),
                            backgroundColor: data.pl_por_metodo.map(item => 
                                item.pl >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
                            )
                        }]
                    },
                    options: {
                        indexAxis: 'y',
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            },
                            title: {
                                display: true,
                                text: 'PL por Método'
                            }
                        }
                    }
                });
            }
            console.log('All charts initialized successfully');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    };

    // Função para atualizar o dashboard
    async function updateDashboard() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const mercado = document.getElementById('mercado-filter').value;
        const metodo = document.getElementById('metodo-filter').value;

        let url = '/api/dashboard';
        const params = new URLSearchParams();

        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);
        if (mercado) params.append('mercado', mercado);
        if (metodo) params.append('metodo', metodo);

        if (params.toString()) {
            url += '?' + params.toString();
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('Dashboard data:', data); // Debug log

            // Atualizar métricas básicas
            document.getElementById('pl-total').textContent = `R$ ${data.metricas.pl_total.toFixed(2)}`;
            document.getElementById('winrate').textContent = `${data.metricas.winrate.toFixed(2)}%`;
            document.getElementById('roi').textContent = `${data.metricas.roi.toFixed(2)}%`;
            document.getElementById('stake-media').textContent = `R$ ${data.metricas.stake_media.toFixed(2)}`;

            // Atualizar valores anteriores
            if (data.metricas.pl_ontem !== undefined) {
                document.getElementById('pl-anterior').textContent = `R$ ${data.metricas.pl_ontem.toFixed(2)}`;
                document.getElementById('winrate-anterior').textContent = `${data.metricas.winrate_ontem.toFixed(2)}%`;
                document.getElementById('roi-anterior').textContent = `${data.metricas.roi_ontem.toFixed(2)}%`;
                document.getElementById('stake-anterior').textContent = `R$ ${data.metricas.stake_media_ontem.toFixed(2)}`;
            }

            // Atualizar variações
            if (data.metricas.pl_variacao !== undefined) {
                updateVariationCard('pl', data.metricas.pl_variacao, data.metricas.pl_total);
                updateVariationCard('winrate', data.metricas.winrate_variacao, data.metricas.winrate);
                updateVariationCard('roi', data.metricas.roi_variacao, data.metricas.roi);
                updateVariationCard('stake', data.metricas.stake_variacao, data.metricas.stake_media);
            }

            // Verificar se os dados dos gráficos existem e não são vazios
            if (data.pl_acumulado && data.pl_acumulado.length > 0 && 
                data.pl_por_liga && data.pl_por_liga.length > 0 && 
                data.pl_por_mercado && data.pl_por_mercado.length > 0 && 
                data.pl_por_metodo && data.pl_por_metodo.length > 0) {
                console.log('Initializing charts with data:', data); // Debug log
                initCharts(data);
            } else {
                console.error('Missing or empty chart data:', {
                    pl_acumulado: data.pl_acumulado?.length || 0,
                    pl_por_liga: data.pl_por_liga?.length || 0,
                    pl_por_mercado: data.pl_por_mercado?.length || 0,
                    pl_por_metodo: data.pl_por_metodo?.length || 0
                });
            }
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }

    // Form submission
    const form = document.getElementById('aposta-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        const jogoId = data.jogo_id;
        delete data.jogo_id;  // Remove ID from data before sending
        
        try {
            const url = jogoId ? `/api/jogos/${jogoId}` : '/api/apostas';
            const method = jogoId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            
            if (response.ok) {
                alert(jogoId ? 'Aposta atualizada com sucesso!' : 'Aposta registrada com sucesso!')
                form.reset()
                // Remove o campo de ID oculto se existir
                const idInput = form.querySelector('[name="jogo_id"]');
                if (idInput) {
                    idInput.remove();
                }
                updateDashboard()
                // Se estiver editando, voltar para a lista de jogos
                if (jogoId) {
                    document.querySelector('a[href="#lista-jogos"]').click();
                }
            } else {
                alert(jogoId ? 'Erro ao atualizar aposta' : 'Erro ao registrar aposta')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Erro ao processar a aposta')
        }
    })
    
    // Dashboard update
    const updateVariationCard = (id, variation, value) => {
        const card = document.getElementById(`${id}-card`)
        const variationElement = document.getElementById(`${id}-variation`)
        const icon = variationElement.previousElementSibling
        
        // Atualizar valor da variação
        variationElement.textContent = `${Math.abs(variation).toFixed(2)}%`
        
        // Atualizar ícone
        icon.className = 'bx ' + (variation > 0 ? 'bx-up-arrow-alt' : 'bx-down-arrow-alt')
        
        // Atualizar cores do card baseado no valor atual
        if (value > 0) {
            card.style.backgroundColor = 'rgba(75, 192, 192, 0.1)'
            card.style.borderColor = 'rgba(75, 192, 192, 0.5)'
            variationElement.style.color = variation > 0 ? '#4CAF50' : '#f44336'
        } else {
            card.style.backgroundColor = 'rgba(255, 99, 132, 0.1)'
            card.style.borderColor = 'rgba(255, 99, 132, 0.5)'
            variationElement.style.color = variation > 0 ? '#4CAF50' : '#f44336'
        }
        
        // Adicionar classe para animação
        icon.style.color = variation > 0 ? '#4CAF50' : '#f44336'
    }

    // Add event listeners for filters
    document.getElementById('start-date').addEventListener('change', updateDashboard)
    document.getElementById('end-date').addEventListener('change', updateDashboard)
    document.getElementById('mercado-filter').addEventListener('change', updateDashboard)
    document.getElementById('metodo-filter').addEventListener('change', updateDashboard)

    // Função para carregar jogos
    const loadJogos = async () => {
        try {
            const response = await fetch('/api/jogos');
            const jogos = await response.json();
            
            const tbody = document.getElementById('jogos-table-body');
            tbody.innerHTML = '';
            
            jogos.forEach(jogo => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${jogo.data_aposta}</td>
                    <td>${jogo.hora_aposta}</td>
                    <td>${jogo.pais}</td>
                    <td>${jogo.liga}</td>
                    <td>${jogo.time_casa} x ${jogo.time_visitante}</td>
                    <td>${jogo.mercado}</td>
                    <td>${jogo.metodo}</td>
                    <td class="${jogo.pl > 0 ? 'text-success' : 'text-danger'}">
                        R$ ${jogo.pl.toFixed(2)}
                    </td>
                    <td>
                        <span class="badge ${jogo.pl > 0 ? 'bg-success' : 'bg-danger'}">
                            ${jogo.pl > 0 ? 'GREEN' : 'RED'}
                        </span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error loading jogos:', error);
        }
    };

    const editJogo = async (id) => {
        try {
            const response = await fetch(`/api/jogos/${id}`);
            const jogo = await response.json();
            
            // Preencher o formulário com os dados do jogo
            const form = document.getElementById('aposta-form');
            form.querySelector('[name="data_aposta"]').value = jogo.data_aposta;
            form.querySelector('[name="hora_aposta"]').value = jogo.hora_aposta;
            form.querySelector('[name="pais"]').value = jogo.pais;
            form.querySelector('[name="liga"]').value = jogo.liga;
            form.querySelector('[name="time_casa"]').value = jogo.time_casa;
            form.querySelector('[name="time_visitante"]').value = jogo.time_visitante;
            form.querySelector('[name="mercado"]').value = jogo.mercado;
            form.querySelector('[name="metodo"]').value = jogo.metodo;
            form.querySelector('[name="stake"]').value = jogo.stake;
            form.querySelector('[name="casa_aposta"]').value = jogo.casa_aposta;
            form.querySelector('[name="odd_entrada"]').value = jogo.odd_entrada;
            form.querySelector('[name="tipo_entrada"]').value = jogo.tipo_entrada;
            form.querySelector('[name="tipo_operacao"]').value = jogo.tipo_operacao;
            form.querySelector('[name="tipo_saida"]').value = jogo.tipo_saida;
            form.querySelector('[name="pl"]').value = jogo.pl;
            
            // Adicionar ID do jogo em um campo oculto
            let idInput = form.querySelector('[name="jogo_id"]');
            if (!idInput) {
                idInput = document.createElement('input');
                idInput.type = 'hidden';
                idInput.name = 'jogo_id';
                form.appendChild(idInput);
            }
            idInput.value = id;
            
            // Mudar para a seção de nova aposta
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('d-none');
            });
            document.getElementById('nova-aposta').classList.remove('d-none');
            
            // Atualizar navegação
            document.querySelectorAll('.nav_link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#nova-aposta') {
                    link.classList.add('active');
                }
            });
            
        } catch (error) {
            console.error('Error:', error);
            alert('Erro ao carregar dados do jogo');
        }
    };

    // Adicionar carregamento de jogos quando a seção for aberta
    document.querySelector('a[href="#lista-jogos"]').addEventListener('click', loadJogos);

    // Initial dashboard update
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, updating dashboard'); // Debug log
        updateDashboard();
    });
});
