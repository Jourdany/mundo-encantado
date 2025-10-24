// Puxa as referências dos elementos
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');

let currentImageIndex = 0;
let imageSources = []; // Lista de URLs das imagens
let galleryImages;     // Lista de elementos <img> na galeria

// 1. Inicialização: Coleta todas as URLs das imagens e adiciona listeners de clique
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todas as tags <img> dentro dos itens da galeria
    galleryImages = document.querySelectorAll('.gallery-item img');

    galleryImages.forEach((img, index) => {
        // 1.1. Armazena a URL e garante que o índice do item esteja correto
        imageSources.push(img.src);
        img.parentElement.setAttribute('data-index', index);
        
        // 1.2. Adiciona o listener de clique para as imagens
        img.addEventListener('click', (event) => {
            // Puxa o índice da imagem que foi clicada
            const clickedIndex = parseInt(img.parentElement.getAttribute('data-index'));
            openLightbox(img.src, clickedIndex);
            event.stopPropagation(); // Evita que o clique se propague
        });
    });
});


// 2. Função para Abrir o Lightbox
function openLightbox(src, index) {
    // Define a fonte da imagem e o índice atual
    lightboxImage.src = src;
    currentImageIndex = index;
    
    // Mostra o lightbox
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Evita a rolagem da página
}


// 3. Função para Fechar o Lightbox
function closeLightbox(event) {
    // Fecha apenas se clicar no fundo escuro (lightbox) ou no botão de fechar (X)
    // Os botões de navegação agora estão FORA do lightbox-content-wrapper,
    // então eles não vão mais disparar o closeLightbox ao serem clicados.
    if (event.target.id === 'lightbox' || event.target.classList.contains('close-btn')) {
        lightbox.classList.remove('visible');
        document.body.style.overflow = 'auto'; // Restaura a rolagem da página
    }
}

// Para fechar se clicar no X
const closeBtn = document.querySelector('.close-btn');
closeBtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    lightbox.classList.remove('visible');
    document.body.style.overflow = 'auto'; 
});


// 4. Função para Navegação (Próxima/Anterior)
function navigate(direction) {
    // direction será 1 para Próxima e -1 para Anterior
    // event.stopPropagation() não é mais estritamente necessário aqui se os botões estiverem fora do wrapper e tiverem pointer-events: auto;
    // mas não atrapalha manter.
    
    const totalImages = imageSources.length;
    let newIndex = currentImageIndex + direction;

    // Lógica de loop (volta para a primeira ou última imagem)
    if (newIndex < 0) {
        newIndex = totalImages - 1; // Volta para a última imagem
    } else if (newIndex >= totalImages) {
        newIndex = 0; // Vai para a primeira imagem
    }

    // Atualiza o índice e a fonte da imagem
    currentImageIndex = newIndex;
    lightboxImage.src = imageSources[currentImageIndex];
}

// 5. Adiciona navegação por teclado (setas e ESC)
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('visible')) {
        if (e.key === 'ArrowRight') {
            navigate(1); // Próxima
        } else if (e.key === 'ArrowLeft') {
            navigate(-1); // Anterior
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('visible');
            document.body.style.overflow = 'auto';
        }
    }
});