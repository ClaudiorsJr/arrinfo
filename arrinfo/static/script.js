document.addEventListener('DOMContentLoaded', function() {
    // Marca o body como carregado
    document.body.classList.add('loaded');
    
    // Efeito de transição suave para os links de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Efeito de transição ao mudar de página
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.opacity = '1';
    }
    
    // Suaviza o carregamento de elementos dinâmicos
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        // Se o elemento já tem um delay definido, não alteramos
        if (!el.style.animationDelay) {
            el.style.animationDelay = `${index * 0.15 + 0.3}s`;
        }
    });

    // Código para interação com os cards (novo)
    document.querySelectorAll('.link-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Se não clicou diretamente no link, redireciona
            if (!e.target.closest('a')) {
                const link = card.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });
});
