document.addEventListener('DOMContentLoaded', function() {
    // Controles globais
    const controls = {
        carouselInterval: null,
        sidebarState: localStorage.getItem('sidebarOpen') === 'true'
    };

    // Marca o body como carregado
    document.body.classList.add('loaded');

    // Configura animações para links de navegação
    function setupNavLinks() {
        document.querySelectorAll('.nav-link').forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Transição de conteúdo principal
    function setupMainContent() {
        const mainContent = document.querySelector('.main-content');
        mainContent && (mainContent.style.opacity = '1');
    }

    // Configura elementos com efeito fade-in
    function setupFadeElements() {
        document.querySelectorAll('.fade-in:not([style*="animation-delay"])').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.15 + 0.1}s`;
        });
    }

    // Manipulador de clique para cards
    function handleCardInteraction(e, link) {
        if (!e.target.closest('a') && (e.type === 'click' || e.key === 'Enter')) {
            window.location.href = link.href;
        }
    }

    // Configura interação com cards clicáveis
    function setupClickableCards() {
        document.querySelectorAll('.link-card').forEach(card => {
            const link = card.querySelector('a');
            if (!link) return;

            card.addEventListener('click', (e) => handleCardInteraction(e, link));
            card.addEventListener('keydown', (e) => handleCardInteraction(e, link));
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
            controls.carouselInterval = setInterval(nextSlide, 5000);
        };

        const stopCarousel = () => {
            controls.carouselInterval && clearInterval(controls.carouselInterval);
            controls.carouselInterval = null;
        };

        const setupControls = () => {
            const prevBtn = bannerContainer.querySelector('.banner-prev');
            const nextBtn = bannerContainer.querySelector('.banner-next');

            if (!prevBtn || !nextBtn) return;

            const handleInteraction = (btn, action) => {
                const handler = (e) => {
                    e.stopPropagation();
                    stopCarousel();

                    if (action === 'click') {
                        currentSlide = (currentSlide + (btn === prevBtn ? -1 : 1) + totalSlides) % totalSlides;
                        showSlide(currentSlide);
                    }

                    action === 'mouseleave' && startCarousel();
                };

                btn.addEventListener(action, handler);
            };

            [prevBtn, nextBtn].forEach(btn => {
                ['mouseenter', 'click', 'mouseleave'].forEach(action => {
                    handleInteraction(btn, action);
                });
            });
        };

        // Inicialização do carrossel
        showSlide(currentSlide);
        startCarousel();
        setupControls();

        // Controles de visibilidade da página
        window.addEventListener('blur', stopCarousel);
        window.addEventListener('focus', startCarousel);
    }

    // Controlador da Sidebar
    function initSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');
        const mainContent = document.querySelector('.main-content');

        const updateSidebar = () => {
            const isMobile = window.innerWidth <= 992;
            const shouldOpen = isMobile ? controls.sidebarState : true;

            sidebar.classList.toggle('active', shouldOpen);
            mainContent && (mainContent.style.marginLeft = shouldOpen ? '250px' : '0');

            if (sidebarOverlay) {
                sidebarOverlay.style.opacity = shouldOpen && isMobile ? '1' : '0';
                sidebarOverlay.style.visibility = shouldOpen && isMobile ? 'visible' : 'hidden';
            }

            // Atualiza ícone do toggle
            if (sidebarToggle) {
                const icon = sidebarToggle.querySelector('i');
                icon && (icon.className = shouldOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars');
            }
        };

        const toggleSidebar = () => {
            controls.sidebarState = !controls.sidebarState;
            localStorage.setItem('sidebarOpen', controls.sidebarState);
            updateSidebar();
        };

        // Event listeners
        sidebarToggle && sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });

        sidebarOverlay && sidebarOverlay.addEventListener('click', toggleSidebar);

        // Fechar ao clicar fora (apenas mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && 
                !sidebar.contains(e.target) && 
                e.target !== sidebarToggle) {
                controls.sidebarState = false;
                updateSidebar();
            }
        });

        // Atualizar no resize
        const resizeHandler = () => updateSidebar();
        window.addEventListener('resize', resizeHandler);

        // Estado inicial
        updateSidebar();
    }

    // Inicialização controlada
    const initFunctions = [
        setupNavLinks,
        setupMainContent,
        setupFadeElements,
        setupClickableCards,
        initBannerCarousel,
        initSidebar
    ];

    // Executa todas as funções de inicialização
    initFunctions.forEach(fn => {
        try {
            fn();
        } catch (e) {
            console.error(`Error initializing ${fn.name}:`, e);
        }
    });
});