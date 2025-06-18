document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        once: true,
    });

    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("tsparticles", {
            background: { color: { value: 'transparent' } },
            particles: {
                number: { value: 60 },
                color: { value: "#F44673" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: { min: 1, max: 5 } },
                move: { enable: true, speed: 1 }
            },
            interactivity: {
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    repulse: { distance: 100 },
                    push: { quantity: 4 }
                }
            },
            detectRetina: true
        });
    } else {
        console.warn("tsParticles no está cargado. Asegúrate de incluirlo.");
    }

    // --- Datos (REEMPLAZA LOS videoModal CON TUS URLs DE YOUTUBE) ---
    const capitulosData = [
        {
            id: 1,
            nombre: "Capítulo 1",
            imagen: "UCuentame.PNG",
            descripcion: "Iniciamos un el podcast con nuestro primer capítulo.",
            imagenModal: "UCuentame.PNG",
            textoModal: "Falta introducción.",
            videoModal: "https://www.youtube.com/embed/BLsEVkIazd8?si=VZX-pURXSfwZZLz7" // ID de video de ejemplo
        },
        {
            id: 2,
            nombre: "Capítulo 2",
            imagen: "UCuentame.PNG",
            descripcion: "Nuestro segundo capítulo hablamos de un tema importante",
            imagenModal: "UCuentame.PNG",
            textoModal: "Falta introducción.",
            videoModal: "https://www.youtube.com/embed/KsXHzSa0Yss?si=Kvf7xfd_qinNySq8" // ID de video de ejemplo
        },

    ];

    const protagonistasData = [
        {
            id: 1,
            nombre: "Ana García",
            imagen: "mujer.PNG",
            descripcion: "La voz principal de UCuéntame, con años de experiencia en narración.",
            imagenModal: "mujer.PNG",
            textoModal: "Ana García es la fuerza motriz detrás de cada episodio. Conoce su trayectoria y su visión.",
            
        },
        {
            id: 2,
            nombre: "Luis Mendoza",
            imagen: "hombre.PNG",
            descripcion: "Cuenta sus experiencias en la violencia familiar.",
            imagenModal: "hombre.PNG",
            textoModal: "Luis Mendoza, el meticuloso investigador. Descubre cómo su trabajo enriquece cada episodio.",
            
        }
    ];

    // --- Elementos del DOM ---
    const catalogoCapitulos = document.getElementById("catalogoCapitulos");
    const catalogoProtagonistas = document.getElementById("catalogoProtagonistas");
    const busquedaCapitulos = document.getElementById("busquedaCapitulos");
    const busquedaProtagonistas = document.getElementById("busquedaProtagonistas");
    const darkModeToggle = document.getElementById("darkModeToggle");

    // Modal elements
    const videoModal = document.getElementById('videoModal');
    const modalImage = document.getElementById('modalImage');
    const modalText = document.getElementById('modalText');
    const youtubePlayer = document.getElementById('youtubePlayer');
    const videoContainer = document.getElementById('videoContainer');
    const closeButton = document.querySelector('.modal .close-button');

    // --- Funciones ---

    function mostrarContenido(lista, contenedor) {
        contenedor.innerHTML = "";
        lista.forEach(item => {
            const div = document.createElement("div");
            div.className = "content-card";
            div.setAttribute("data-aos", "zoom-in");
            
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
                <p>${item.descripcion}</p>
            `;
            contenedor.appendChild(div);

            div.addEventListener('click', () => {
                abrirModal(item);
            });
        });
    }

    function filtrarContenido(data, searchInput, targetContainer) {
        const texto = searchInput.value.toLowerCase();
        const filtrados = data.filter(item => item.nombre.toLowerCase().includes(texto));
        mostrarContenido(filtrados, targetContainer);
    }

    function abrirModal(item) {
        modalImage.src = item.imagenModal || item.imagen;
        modalText.textContent = item.textoModal || item.descripcion;

        if (item.videoModal) {
            // Añadimos autoplay y otros parámetros a la URL
            youtubePlayer.src = `${item.videoModal}?autoplay=1&rel=0`;
            videoContainer.style.display = 'block';
        } else {
            youtubePlayer.src = '';
            videoContainer.style.display = 'none';
        }

        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function cerrarModal() {
        videoModal.style.display = 'none';
        // Detiene el video de YouTube eliminando la URL del src
        youtubePlayer.src = '';
        document.body.style.overflow = '';
    }

    closeButton.addEventListener('click', cerrarModal);
    window.addEventListener('click', (event) => {
        if (event.target === videoModal) {
            cerrarModal();
        }
    });

    function toggleDarkMode() {
        document.body.classList.toggle("modoOscuro");
        localStorage.setItem("darkMode", document.body.classList.contains("modoOscuro") ? "enabled" : "disabled");
    }

    function loadDarkModePreference() {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("modoOscuro");
        }
    }

    // --- Inicialización ---
    mostrarContenido(capitulosData, catalogoCapitulos);
    mostrarContenido(protagonistasData, catalogoProtagonistas);
    loadDarkModePreference();

    busquedaCapitulos.addEventListener("input", () => filtrarContenido(capitulosData, busquedaCapitulos, catalogoCapitulos));
    busquedaProtagonistas.addEventListener("input", () => filtrarContenido(protagonistasData, busquedaProtagonistas, catalogoProtagonistas));
    darkModeToggle.addEventListener("click", toggleDarkMode);
});