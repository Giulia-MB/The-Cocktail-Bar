// Variável para armazenar todos os dados do catálogo (variável global)
let todosOsCoqueteis = [];

// 1. Função para Carregar os Dados do JSON
async function carregarCatalogo() {
    try {
        const response = await fetch('catalogo.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar o JSON: ${response.statusText}`);
        }
        
        todosOsCoqueteis = await response.json();
        
        // Renderiza o catálogo completo ao carregar
        renderizarCatalogo(todosOsCoqueteis);
        
    } catch (error) {
        console.error("Falha ao carregar o catálogo:", error);
        // Mensagem de erro amigável na tela
        document.getElementById('catalogue-container').innerHTML = 
            `<p class="text-red-500 text-center col-span-full">Erro ao carregar dados. Verifique se o arquivo catalogo.json existe e está formatado corretamente.</p>`;
    }
}

// 2. Função para Renderizar os Coquetéis na Tela
function renderizarCatalogo(coqueteis) {
    const container = document.getElementById('catalogue-container');
    const noResults = document.getElementById('no-results');
    container.innerHTML = ''; // Limpa o container antes de renderizar

    if (coqueteis.length === 0) {
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');

    coqueteis.forEach(coquetel => {
        // Usa template string para criar o HTML do card de forma elegante (Tailwind)
        const cardHTML = `
            <div class="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition duration-500 ease-in-out border border-gray-100">
                <img src="${coquetel.imagem}" alt="${coquetel.nome}" class="w-full h-48 object-cover object-center border-b border-gray-200">
                <div class="p-5">
                    <h3 class="text-xl font-bold text-primary mb-2">${coquetel.nome}</h3>
                    <p class="text-sm text-gray-500 mb-4 uppercase tracking-widest">${coquetel.tipo}</p>
                    <p class="text-primary text-sm line-clamp-2 mb-4">Ingredientes: ${coquetel.ingredientes.join(', ')}</p>
                    <button 
                        data-id="${coquetel.id}"
                        onclick="mostrarDetalhes('${coquetel.nome}', '${coquetel.preparo.replace(/'/g, "\\'")}')"
                        class="w-full bg-accent hover:bg-primary text-white font-semibold py-2 rounded-lg transition duration-300 shadow-md"
                    >
                        Ver Preparo
                    </button>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// 3. Função para Implementar a Busca e Filtro (Chamada nos eventos 'oninput' e 'onchange' do index.html)
function filtrarCatalogo() {
    // 1. Obter valores normalizados (em minúsculas e sem espaços extras)
    const termoBusca = document.getElementById('search-input').value.toLowerCase().trim();
    const tipoFiltro = document.getElementById('filter-select').value;
    
    const resultadosFiltrados = todosOsCoqueteis.filter(coquetel => {
        
        // Lógica de Busca: Verifica se o termo de busca está no nome OU nos ingredientes
        const matchBusca = termoBusca === '' || 
                           coquetel.nome.toLowerCase().includes(termoBusca) ||
                           coquetel.ingredientes.some(ingrediente => 
                               ingrediente.toLowerCase().includes(termoBusca)
                           );
                           
        // Lógica de Filtro por Tipo: Verifica se o tipo corresponde ao filtro selecionado
        const matchFiltro = tipoFiltro === '' || coquetel.tipo === tipoFiltro;
        
        // Retorna apenas se corresponderem a AMBOS (Busca E Filtro)
        return matchBusca && matchFiltro;
    });

    renderizarCatalogo(resultadosFiltrados);
}

// 4. Função para Mostrar Detalhes (usando alert para simplicidade e foco no JS)
// Nota: O replace acima no onclick garante que a string de preparo seja passada corretamente.
function mostrarDetalhes(nome, preparo) {
    alert(`🍸 ${nome}\n\nPreparo:\n${preparo}`);
}

// Inicia o carregamento dos dados quando a página é carregada
carregarCatalogo();