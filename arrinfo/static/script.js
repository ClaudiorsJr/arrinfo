document.addEventListener('DOMContentLoaded', function() {
    // Controle do intervalo do carrossel
    let carouselInterval = null;
    
    // Controle da sidebar
    let sidebarState = localStorage.getItem('sidebarOpen') === 'true';
    
    // Marca o body como carregado
    document.body.classList.add('loaded');
    
    // Configura animações para links de navegação
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Transição de conteúdo principal
    function setupMainContent() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '1';
        }
    }
    
    // Configura elementos com efeito fade-in
    function setupFadeElements() {
        const fadeElements = document.querySelectorAll('.fade-in:not([style*="animation-delay"])');
        fadeElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.15 + 0.1}s`;
        });
    }
    
    // Configura interação com cards clicáveis
    function setupClickableCards() {
        document.querySelectorAll('.link-card').forEach(card => {
            const link = card.querySelector('a');
            if (!link) return;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('a')) {
                    window.location.href = link.href;
                }
            });
            
            // Melhoria: teclado acessível
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.target.closest('a')) {
                    window.location.href = link.href;
                }
            });
        });
    }
    
    // Controlador do carrossel de banners
    function initBannerCarousel() {
        const bannerContainer = document.querySelector('.banner-container');
        if (!bannerContainer) return;
        
        const slides = bannerContainer.querySelectorAll('.banner-slide');
        if (slides.length < 2) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        };
        
        const startCarousel = () => {
            stopCarousel();
            carouselInterval = setInterval(nextSlide, 5000);
        };
        
        const stopCarousel = () => {
            if (carouselInterval) {
                clearInterval(carouselInterval);
                carouselInterval = null;
            }
        };
        
        const setupControls = () => {
            const prevBtn = bannerContainer.querySelector('.banner-prev');
            const nextBtn = bannerContainer.querySelector('.banner-next');
            
            if (prevBtn && nextBtn) {
                const handleInteraction = (btn, action) => {
                    btn.addEventListener(action, (e) => {
                        e.stopPropagation();
                        stopCarousel();
                        
                        if (action === 'click') {
                            currentSlide = (currentSlide + (btn === prevBtn ? -1 : 1) + totalSlides) % totalSlides;
                            showSlide(currentSlide);
                        }
                        
                        if (action === 'mouseleave') {
                            startCarousel();
                        }
                    });
                };
                
                [prevBtn, nextBtn].forEach(btn => {
                    handleInteraction(btn, 'mouseenter');
                    handleInteraction(btn, 'click');
                    handleInteraction(btn, 'mouseleave');
                });
            }
        };
        
        showSlide(currentSlide);
        startCarousel();
        setupControls();
        
        window.addEventListener('blur', stopCarousel);
        window.addEventListener('focus', startCarousel);
    }
    
    // Controlador da Sidebar
    function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const mainContent = document.querySelector('.main-content');

    if (!sidebar) return;

    // Função para atualizar o estado
    const updateSidebar = () => {
        const isMobile = window.innerWidth <= 992;
        const shouldOpen = isMobile ? sidebarState : true;
        
        sidebar.classList.toggle('active', shouldOpen);
        mainContent.style.marginLeft = shouldOpen ? '250px' : '0';
        
        if (sidebarOverlay) {
            sidebarOverlay.style.opacity = shouldOpen && isMobile ? '1' : '0';
            sidebarOverlay.style.visibility = shouldOpen && isMobile ? 'visible' : 'hidden';
        }
        
        // Atualiza ícone do toggle
        if (sidebarToggle) {
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                icon.className = shouldOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
            }
        }
    };

    // Alternar estado
    const toggleSidebar = () => {
        sidebarState = !sidebarState;
        localStorage.setItem('sidebarOpen', sidebarState);
        updateSidebar();
    };

    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Fechar ao clicar fora (apenas mobile)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            e.target !== sidebarToggle) {
            sidebarState = false;
            updateSidebar();
        }
    });

    // Atualizar no resize
    window.addEventListener('resize', updateSidebar);

    // Estado inicial
    updateSidebar();
}
    
    // Inicializa todos os componentes
    function init() {
        setupNavLinks();
        setupMainContent();
        setupFadeElements();
        setupClickableCards();
        initBannerCarousel();
        initSidebar();
    }
    
    init();
});