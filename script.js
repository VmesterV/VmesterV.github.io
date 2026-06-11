document.addEventListener("DOMContentLoaded", () => {
    // 1. GENERACIÓN DE DATOS (1° a 6°, Secciones A, B, C)
    const aulas = [];
    const grados = [1, 2, 3, 4, 5, 6];
    const secciones = ['A', 'B', 'C'];
    
    grados.forEach(grado => {
        secciones.forEach(seccion => {
            aulas.push({
                id: `${grado}${seccion}`,
                grado: grado,
                seccion: seccion,
                score: Math.floor(Math.random() * 500) + 150, // Puntajes realistas de inicio (150 a 650)
                rank: 0,
                domElement: null
            });
        });
    });

    const ROW_HEIGHT = 56; // 48px de alto + 8px de margen virtual
    const container = document.getElementById('ranking-body');

    // 2. CREACIÓN DEL DOM INICIAL
    aulas.forEach(aula => {
        const row = document.createElement('div');
        row.className = 'ranking-row';
        
        row.innerHTML = `
            <div class="col-2 fw-bold text-muted rank-text"></div>
            <div class="col-6 fw-semibold text-eco-dark">Grado ${aula.grado}° "${aula.seccion}"</div>
            <div class="col-4 text-end text-eco-green fw-bold">
                <i class="bi bi-recycle me-1"></i><span class="score-text">${aula.score}</span>
            </div>
        `;
        aula.domElement = row;
        container.appendChild(row);
    });

    // 3. FUNCIÓN DE ORDENAMIENTO Y ANIMACIÓN VISUAL
    function renderRanking() {
        const fGrado = document.getElementById('filterGrado').value;
        const fSeccion = document.getElementById('filterSeccion').value;

        // Filtrar visualmente
        let aulasVisibles = aulas.filter(aula => {
            const matchGrado = (fGrado === 'all' || aula.grado == fGrado);
            const matchSeccion = (fSeccion === 'all' || aula.seccion == fSeccion);
            return matchGrado && matchSeccion;
        });

        // Ordenar de mayor a menor puntaje
        aulasVisibles.sort((a, b) => b.score - a.score);

        // Ocultar todas primero (para manejar el filtro)
        aulas.forEach(aula => {
            aula.domElement.style.opacity = '0';
            aula.domElement.style.pointerEvents = 'none';
        });

        // Reposicionar las aulas visibles con transición suave (FLIP / Absolute Transform)
        aulasVisibles.forEach((aula, index) => {
            const el = aula.domElement;
            const rankAnterior = aula.rank;
            aula.rank = index + 1; // Actualizar ranking interno
            
            // Mostrar y mover a la coordenada Y (index * Altura)
            el.style.opacity = '1';
            el.style.pointerEvents = 'auto';
            el.style.transform = `translateY(${index * ROW_HEIGHT}px)`;
            
            // Actualizar textos
            el.querySelector('.rank-text').innerText = `#${aula.rank}`;
            el.querySelector('.score-text').innerText = aula.score;

            // Manejo de Clases Top 3
            el.classList.remove('rank-1', 'rank-2', 'rank-3');
            if (aula.rank === 1) el.classList.add('rank-1');
            if (aula.rank === 2) el.classList.add('rank-2');
            if (aula.rank === 3) el.classList.add('rank-3');

            // Celebración Dinámica (Si sube de posición y entra/se mueve en el top 3)
            // rankAnterior > 0 asegura que no destelle al cargar la página por primera vez
            if (aula.rank <= 3 && rankAnterior > aula.rank && rankAnterior > 0) {
                el.classList.remove('celebrate'); // Resetear animación
                void el.offsetWidth; // Reflow forzado para reiniciar CSS keyframes
                el.classList.add('celebrate');
            }
        });

        // Ajustar altura del contenedor dinámicamente según filtros aplicados
        container.style.height = `${aulasVisibles.length * ROW_HEIGHT}px`;
    }

    // 4. SIMULACIÓN EN TIEMPO REAL (Lluvia de botellas)
    setInterval(() => {
        // Encontrar solo los salones que están pasando los filtros en este momento
        const fGrado = document.getElementById('filterGrado').value;
        const fSeccion = document.getElementById('filterSeccion').value;
        
        let aulasActivas = aulas.filter(aula => {
            return (fGrado === 'all' || aula.grado == fGrado) && 
                   (fSeccion === 'all' || aula.seccion == fSeccion);
        });

        if (aulasActivas.length > 0) {
            // Escoger un salón al azar de la vista actual y sumarle 1 botella
            const indexAzar = Math.floor(Math.random() * aulasActivas.length);
            aulasActivas[indexAzar].score += 1;
            
            // Re-renderizar la vista
            renderRanking();
        }
    }, 1500); // Se añade una botella a algún salón cada 1.5 segundos

    // Eventos para filtros
    document.getElementById('filterGrado').addEventListener('change', renderRanking);
    document.getElementById('filterSeccion').addEventListener('change', renderRanking);

    // Inicializar primer render
    renderRanking();

    // 5. NAVEGACIÓN Y EFECTO SLIDER
    const navBtn = document.getElementById('navBtn');
    const sliderTrack = document.getElementById('sliderTrack');
    const navText = document.getElementById('navText');
    const navIcon = document.getElementById('navIcon');
    let enHistorial = false;

    navBtn.addEventListener('click', () => {
        if (!enHistorial) {
            // Mover a Vista 2
            sliderTrack.classList.add('slide-active');
            navText.innerText = "Ranking";
            navIcon.className = "bi bi-trophy-fill me-1 text-warning";
            navBtn.classList.remove('btn-eco');
            navBtn.classList.add('btn-dark');
        } else {
            // Regresar a Vista 1
            sliderTrack.classList.remove('slide-active');
            navText.innerText = "Historial";
            navIcon.className = "bi bi-clock-history me-1";
            navBtn.classList.remove('btn-dark');
            navBtn.classList.add('btn-eco');
        }
        enHistorial = !enHistorial;
    });
});
