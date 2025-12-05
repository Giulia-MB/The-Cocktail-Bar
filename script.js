// Variável para armazenar todos os dados do catálogo
let todosOsCoqueteis = [];

const containerCatalogo = document.getElementById('container-catalogo');
const inputBusca = document.getElementById('input-busca');
const selectFiltro = document.getElementById('select-filtro');
const semResultados = document.getElementById('sem-resultados');
const cardPreparo = document.getElementById('card-preparo');
const areaConteudoCard = document.getElementById('area-conteudo-card');

async function carregarCatalogo() {
    try {
        const response = await fetch('catalogo.json');
        
        if (!response.ok) {
            throw new Error(`Erro ao carregar o JSON: ${response.statusText}`);
        }
        
        todosOsCoqueteis = await response.json();
        
        renderizarCatalogo(todosOsCoqueteis);
        
    } catch (error) {
        console.error("Falha ao carregar o catálogo:", error);
        
        document.getElementById('container-catalogo').innerHTML = 
            `<p class="text-primary text-center col-span-full mt-10">
                Erro ao carregar dados. Verifique se o arquivo catalogo.json foi carregado corretamente.
            </p>`;
    }
}

function renderizarCatalogo(coqueteis) {
    containerCatalogo.innerHTML = ''; 

    if (coqueteis.length === 0) {
        semResultados.classList.remove('hidden');
        return;
    }
    
    semResultados.classList.add('hidden');

    coqueteis.forEach(coquetel => {
        const card = document.createElement('div');
        card.className = 'cocktail-card bg-primary text-secondary rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out cursor-pointer hover:shadow-2xl flex flex-col'; 
        card.setAttribute('data-id', coquetel.id);

        card.innerHTML = `
            <!-- 'flex-shrink-0' serve para manter a altura fixa -->
            <img src="${coquetel.imagem}" alt="Imagem de ${coquetel.nome}" onerror="this.onerror=null;this.src='https://placehold.co/400x400/ca6212/454545?text=Sem+Foto';" class="cocktail-image rounded-t-xl flex-shrink-0">
            
            <div class="p-5 flex flex-col flex-grow justify-between"> 
                
                <!-- Nome e Categoria -->
                <div> 
                    <h3 class="text-2xl font-extrabold mb-1">${coquetel.nome}</h3>
                    <span class="inline-block bg-secondary text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                        ${coquetel.tipo}
                    </span>
                </div>
                
                <button 
                    onclick="showPreparationcardPreparo(${coquetel.id}); event.stopPropagation();"
                    class="mt-4 w-full bg-accent hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02]"
                >
                    Ver Preparo
                </button>
            </div>
        `;
        containerCatalogo.appendChild(card);
    });
}

function showPreparationcardPreparo(cocktailId) {
    const cocktail = todosOsCoqueteis.find(c => c.id === cocktailId);
    
    if (!cocktail) return; 

    document.getElementById('nome-drink-card').textContent = cocktail.nome;
    document.getElementById('categoria-drink-card').textContent = `Categoria: ${cocktail.tipo}`;
    const cardPreparoImage = document.getElementById('imagem-drink-card');
    cardPreparoImage.src = cocktail.imagem;
    cardPreparoImage.alt = `Imagem de ${cocktail.nome}`;
    cardPreparoImage.onerror = function() { this.src = 'https://placehold.co/400x400/ca6212/454545?text=Sem+Foto'; };


    const ingredientsList = document.getElementById('lista-ingredientes-card');
    ingredientsList.innerHTML = cocktail.ingredientes.map(ing => 
        `<li class="hover:text-accent transition duration-150">${ing}</li>`
    ).join('');

    const preparationSteps = cocktail.preparo.split('. ').filter(step => step.trim() !== '');

    const preparationList = document.getElementById('lista-preparo-card');
    preparationList.innerHTML = preparationSteps.map(step => 
        `<li class="pb-1">${step.trim()}${step.endsWith('.') ? '' : '.'}</li>`
    ).join('');

    cardPreparo.classList.remove('hidden');
    cardPreparo.classList.add('flex');
    document.body.style.overflow = 'hidden'; 
    
    setTimeout(() => {
        areaConteudoCard.classList.remove('scale-95', 'opacity-0');
        areaConteudoCard.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closePreparationModal(event) {
    if (event && event.target.id !== 'preparation-cardPreparo' && event.currentTarget.id === 'preparation-cardPreparo') {
        return; 
    }

    areaConteudoCard.classList.add('scale-95', 'opacity-0');
    areaConteudoCard.classList.remove('scale-100', 'opacity-100');

    setTimeout(() => {
        cardPreparo.classList.add('hidden');
        cardPreparo.classList.remove('flex');
        document.body.style.overflow = ''; 
    }, 300); 
}

function filtrarCatalogo() {
    const termoBusca = inputBusca.value.toLowerCase().trim();
    const tipoFiltro = selectFiltro.value;
    
    const resultadosFiltrados = todosOsCoqueteis.filter(coquetel => {
        
        const matchBusca = !termoBusca || 
                            coquetel.nome.toLowerCase().includes(termoBusca) ||
                            coquetel.ingredientes.some(ingrediente => 
                                ingrediente.toLowerCase().includes(termoBusca)
                            );
                            
        const matchFiltro = !tipoFiltro || coquetel.tipo === tipoFiltro;
        
        return matchBusca && matchFiltro;
    });

    renderizarCatalogo(resultadosFiltrados);
}

window.onload = carregarCatalogo;