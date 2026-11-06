/**
 * FEM COMUNICACIONES - MOTOR DE LÍNEA DE TIEMPO EDITORIAL & VISUAL
 * Arquitectura de Interfaz Cinematográfica con Soporte Integral para Celular y Escritorio
 */

// Estado global reactivo
let timelineData = [];
let currentLightboxIndex = 0;
let currentLightboxMedia = [];
let activeCard = null;
let activeFilter = 'all';

// Elementos del DOM
const timelineContainer = document.getElementById('timelineContainer');
const timelineItemsContainer = document.getElementById('timelineItems');
const saturdaysNavTrack = document.getElementById('saturdaysNavTrack');
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const filterChipsBar = document.getElementById('filterChipsBar');
const navPrevBtn = document.getElementById('navPrevBtn');
const navNextBtn = document.getElementById('navNextBtn');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const statSaturdaysCount = document.getElementById('statSaturdaysCount');
const statMediaCount = document.getElementById('statMediaCount');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCounterText = document.getElementById('lightboxCounterText');
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxZoomBtn = document.getElementById('lightboxZoomBtn');
const toastElement = document.getElementById('toast');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    init3DUniverse();
    loadTimelineData();
    setupEventListeners();
    setupTouchGestures();
});

// ==========================================
// FONDO CÓSMICO 3D (THREE.JS) ADAPTATIVO
// ==========================================

function init3DUniverse() {
    const canvas = document.getElementById('universeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const isMobile = window.innerWidth <= 768;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3500);
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !isMobile, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.4 : 2));

    function createStarTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.25, 'rgba(251, 191, 36, 0.95)'); // Oro UPeU
        gradient.addColorStop(0.55, 'rgba(56, 189, 248, 0.5)');  // Azul celeste
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        
        return new THREE.CanvasTexture(pCanvas);
    }

    const starTexture = createStarTexture();

    // Capa 1: Polvo estelar cósmico
    const bgStarCount = isMobile ? 1800 : 5000;
    const bgGeometry = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarCount * 3);
    const bgColors = new Float32Array(bgStarCount * 3);

    const bgPalette = [
        new THREE.Color('#ffffff'),
        new THREE.Color('#cbd5e1'),
        new THREE.Color('#fef08a'),
        new THREE.Color('#60a5fa')
    ];

    for (let i = 0; i < bgStarCount; i++) {
        bgPositions[i * 3] = (Math.random() - 0.5) * 3200;
        bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 3200;
        bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 3200;

        const color = bgPalette[Math.floor(Math.random() * bgPalette.length)];
        bgColors[i * 3] = color.r;
        bgColors[i * 3 + 1] = color.g;
        bgColors[i * 3 + 2] = color.b;
    }

    bgGeometry.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeometry.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));

    const bgMaterial = new THREE.PointsMaterial({
        size: isMobile ? 2.5 : 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
    });

    const bgStarField = new THREE.Points(bgGeometry, bgMaterial);
    scene.add(bgStarField);

    // Capa 2: Estrellas brillantes de primer plano
    const fgStarCount = isMobile ? 800 : 1800;
    const fgGeometry = new THREE.BufferGeometry();
    const fgPositions = new Float32Array(fgStarCount * 3);
    const fgColors = new Float32Array(fgStarCount * 3);

    const fgPalette = [
        new THREE.Color('#f59e0b'), // Oro UPeU
        new THREE.Color('#ffffff'),
        new THREE.Color('#2563eb'), // Zafiro
        new THREE.Color('#38bdf8'), // Cian
        new THREE.Color('#fbbf24')  // Ámbar
    ];

    for (let i = 0; i < fgStarCount; i++) {
        fgPositions[i * 3] = (Math.random() - 0.5) * 2800;
        fgPositions[i * 3 + 1] = (Math.random() - 0.5) * 2800;
        fgPositions[i * 3 + 2] = (Math.random() - 0.5) * 2800;

        const color = fgPalette[Math.floor(Math.random() * fgPalette.length)];
        fgColors[i * 3] = color.r;
        fgColors[i * 3 + 1] = color.g;
        fgColors[i * 3 + 2] = color.b;
    }

    fgGeometry.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3));
    fgGeometry.setAttribute('color', new THREE.BufferAttribute(fgColors, 3));

    const fgMaterial = new THREE.PointsMaterial({
        size: isMobile ? 7 : 9.5,
        vertexColors: true,
        map: starTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const fgStarField = new THREE.Points(fgGeometry, fgMaterial);
    scene.add(fgStarField);

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.3;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.3;
    }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);

        bgStarField.rotation.y += 0.00025;
        bgStarField.rotation.x += 0.00012;

        fgStarField.rotation.y += 0.0006;
        fgStarField.rotation.x += 0.0003;

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ==========================================
// REGISTRO DE EVENTOS & INTERACTIVIDAD
// ==========================================

function setupEventListeners() {
    // Buscador interactivo
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            if (searchClearBtn) {
                searchClearBtn.style.display = searchInput.value ? 'flex' : 'none';
            }
            filterTimeline();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchClearBtn.style.display = 'none';
            filterTimeline();
            if (searchInput) searchInput.focus();
        });
    }

    // Atajo de teclado: Ctrl + K o barra '/' para buscar
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement !== searchInput)) {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // Chips de Filtro
    if (filterChipsBar) {
        filterChipsBar.addEventListener('click', (e) => {
            const pill = e.target.closest('.filter-pill');
            if (!pill) return;

            document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            activeFilter = pill.getAttribute('data-filter') || 'all';
            filterTimeline();
        });
    }

    // Controles Desktop de navegación horizontal
    if (navPrevBtn && timelineContainer) {
        navPrevBtn.addEventListener('click', () => {
            timelineContainer.scrollBy({ left: -440, behavior: 'smooth' });
        });
    }

    if (navNextBtn && timelineContainer) {
        navNextBtn.addEventListener('click', () => {
            timelineContainer.scrollBy({ left: 440, behavior: 'smooth' });
        });
    }

    // Botón Volver Arriba en Celular
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 280) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Lightbox Controles
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox-backdrop')) closeLightbox();
        });
    }

    if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightboxImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextLightboxImage);
    if (lightboxZoomBtn) lightboxZoomBtn.addEventListener('click', toggleFullscreen);

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) {
            // Teclas de dirección en escritorio
            if (timelineContainer && window.innerWidth > 900) {
                if (e.key === 'ArrowRight') timelineContainer.scrollBy({ left: 380, behavior: 'smooth' });
                if (e.key === 'ArrowLeft') timelineContainer.scrollBy({ left: -380, behavior: 'smooth' });
            }
            return;
        }

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevLightboxImage();
        if (e.key === 'ArrowRight') nextLightboxImage();
    });

    // Selección de tarjeta
    document.addEventListener('click', (e) => {
        const clickedCard = e.target.closest('.editorial-saturday-card');
        if (clickedCard) {
            if (e.target.closest('.btn-mosaic-zoom') || e.target.closest('.official-video-card')) return;
            document.querySelectorAll('.editorial-saturday-card').forEach(c => c.classList.remove('card-selected'));
            clickedCard.classList.add('card-selected');
            activeCard = clickedCard;
        } else if (!e.target.closest('.cinema-lightbox') && !e.target.closest('.app-header')) {
            document.querySelectorAll('.editorial-saturday-card').forEach(c => c.classList.remove('card-selected'));
            activeCard = null;
        }
    });

    // Arrastre con ratón en desktop (Drag to Scroll)
    setupDesktopDragScroll();

    // Rueda del ratón en desktop para scroll horizontal fluido
    if (timelineContainer) {
        timelineContainer.addEventListener('wheel', (e) => {
            if (window.innerWidth <= 900 || e.deltaY === 0) return;

            const targetCard = activeCard || e.target.closest('.editorial-saturday-card');
            if (targetCard) {
                const canScrollDown = e.deltaY > 0 && Math.ceil(targetCard.scrollTop + targetCard.clientHeight) < targetCard.scrollHeight;
                const canScrollUp = e.deltaY < 0 && targetCard.scrollTop > 0;

                if (canScrollDown || canScrollUp) {
                    targetCard.scrollTop += e.deltaY * 0.85;
                    e.preventDefault();
                    return;
                }
            }

            timelineContainer.scrollLeft += e.deltaY * 1.35;
            e.preventDefault();
        }, { passive: false });
    }

    window.addEventListener('resize', updateTimelineLine);
}

// Soporte de gestos táctiles (Swipe en Lightbox para móviles)
function setupTouchGestures() {
    if (!lightbox) return;

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 45) {
            if (diff < 0) {
                nextLightboxImage(); // Deslizar izquierda = siguiente
            } else {
                prevLightboxImage(); // Deslizar derecha = anterior
            }
        }
    }, { passive: true });
}

// Arrastre con ratón en la línea de tiempo (Desktop)
function setupDesktopDragScroll() {
    if (!timelineContainer) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    timelineContainer.addEventListener('mousedown', (e) => {
        if (window.innerWidth <= 900 || e.target.closest('.editorial-saturday-card')) return;
        isDown = true;
        startX = e.pageX - timelineContainer.offsetLeft;
        scrollLeft = timelineContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        isDown = false;
    });

    timelineContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - timelineContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        timelineContainer.scrollLeft = scrollLeft - walk;
    });
}

// ==========================================
// CARGA Y RENDERIZADO EDITORIAL DE DATOS
// ==========================================

async function loadTimelineData() {
    try {
        let response = await fetch('/api/data').catch(() => null);
        if (!response || !response.ok) {
            response = await fetch('data.json').catch(() => null);
        }

        if (response && response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                timelineData = data;
                updateStatsBadges();
                renderSaturdaysNavTrack();
                renderTimeline();
                return;
            }
        }

        generateInitialSaturdays();
        updateStatsBadges();
        renderSaturdaysNavTrack();
        renderTimeline();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        generateInitialSaturdays();
        updateStatsBadges();
        renderSaturdaysNavTrack();
        renderTimeline();
    }
}

function updateStatsBadges() {
    if (statSaturdaysCount) {
        statSaturdaysCount.innerText = `${timelineData.length} Sábados`;
    }

    let totalPhotos = 0;
    let totalVideos = 0;

    timelineData.forEach(s => {
        if (s.activities) {
            s.activities.forEach(a => {
                if (a.photos) totalPhotos += a.photos.length;
                if (a.videos) totalVideos += a.videos.length;
            });
        }
    });

    if (statMediaCount) {
        statMediaCount.innerText = `${totalPhotos}+ Fotos & Videos`;
    }
}

// Mini barra de navegación rápida por sábados en el Hero
function renderSaturdaysNavTrack() {
    if (!saturdaysNavTrack) return;
    saturdaysNavTrack.innerHTML = '';

    timelineData.forEach((saturday, index) => {
        const parsed = parseDateParts(saturday.date);
        const item = document.createElement('button');
        item.className = `nav-track-item ${index === 0 ? 'active' : ''}`;
        item.setAttribute('data-target-id', saturday.id);
        item.innerHTML = `Sáb ${index + 1}: ${parsed.day} ${parsed.monthShort}`;

        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-track-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const targetWrapper = document.querySelector(`.timeline-card-wrapper[data-id="${saturday.id}"]`);
            if (targetWrapper) {
                if (window.innerWidth <= 900) {
                    targetWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    targetWrapper.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                }

                // Resaltar tarjeta seleccionada
                document.querySelectorAll('.editorial-saturday-card').forEach(c => c.classList.remove('card-selected'));
                const card = targetWrapper.querySelector('.editorial-saturday-card');
                if (card) card.classList.add('card-selected');
            }
        });

        saturdaysNavTrack.appendChild(item);
    });
}

function generateInitialSaturdays() {
    timelineData = [];
    let currentDate = '2026-08-22';

    for (let i = 0; i < 14; i++) {
        timelineData.push({
            id: 'sat_' + (i + 1),
            date: currentDate,
            formattedDate: formatSpanishDate(currentDate),
            activities: [
                { id: `sat_${i+1}_act_1`, name: 'Revisión y Planificación', description: 'Reunión inicial de coordinación.', photos: [] },
                { id: `sat_${i+1}_act_2`, name: 'Talleres Prácticos', description: 'Desarrollo de las dinámicas planificadas.', photos: [] }
            ]
        });
        currentDate = calculateNextSaturdayDate(currentDate);
    }
}

// Mapeo inteligente de iconos para proyectos FEM
function getProjectIconClass(activityName) {
    const name = activityName.toUpperCase();
    if (name.includes('CREARQ')) return 'fa-compass-drafting';
    if (name.includes('SEMBRANDO ESPERANZA')) return 'fa-seedling';
    if (name.includes('CHECKPOINT')) return 'fa-laptop-code';
    if (name.includes('MATEMÁTICAS') || name.includes('MATEMATICAS')) return 'fa-calculator';
    if (name.includes('SALVADOS PARA SERVIR')) return 'fa-heart-pulse';
    if (name.includes('ABRIENDO CAMINOS')) return 'fa-route';
    if (name.includes('REVIVE') || name.includes('ELEGIDOS')) return 'fa-dove';
    if (name.includes('MANUALIDADES')) return 'fa-palette';
    if (name.includes('GUERREROS DE ESPERANZA')) return 'fa-shield-halved';
    if (name.includes('ECOTRANSFORMADORES')) return 'fa-leaf';
    if (name.includes('LENGUA DE SEÑAS')) return 'fa-hands-asl-interpreting';
    if (name.includes('KERYGMA')) return 'fa-bullhorn';
    if (name.includes('SONRISAS') || name.includes('MIMOS')) return 'fa-face-smile';
    if (name.includes('LUCES DE ESPERANZA')) return 'fa-sun';
    if (name.includes('REUNIÓN DE LÍDERES')) return 'fa-users-gear';
    if (name.includes('CIERRE DE ACTIVIDADES')) return 'fa-award';
    return 'fa-hands-holding-circle';
}

function parseDateParts(dateString) {
    const date = new Date(dateString + 'T12:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const monthShort = months[date.getMonth()];
    const year = date.getFullYear();
    return { day, monthShort, year };
}

function renderTimeline() {
    if (!timelineItemsContainer) return;
    timelineItemsContainer.innerHTML = '';

    if (timelineData.length === 0) {
        timelineItemsContainer.innerHTML = `
            <div class="timeline-empty-state">
                <i class="fa-solid fa-calendar-xmark"></i>
                <h3>No hay actividades misioneras registradas</h3>
                <p>No se encontraron datos en la línea de tiempo.</p>
            </div>
        `;
        return;
    }

    timelineData.forEach((saturday, satIndex) => {
        const cardWrapper = document.createElement('div');
        const isAbove = (satIndex % 2 === 0);
        cardWrapper.className = `timeline-card-wrapper ${isAbove ? 'card-above' : 'card-below'}`;
        cardWrapper.setAttribute('data-date', saturday.date);
        cardWrapper.setAttribute('data-id', saturday.id);

        const dateParts = parseDateParts(saturday.date);

        // Buscar si alguna actividad de este sábado tiene fotos para usar una foto representativa como Cover Banner
        let heroPhotoPath = '';
        for (let a of saturday.activities) {
            if (a.photos && a.photos.length > 0) {
                heroPhotoPath = a.photos[0];
                break;
            }
        }

        let heroCoverHtml = '';
        if (heroPhotoPath) {
            const normHero = normalizePhotoPath(heroPhotoPath);
            const encHero = encodeURI(normHero);
            heroCoverHtml = `
                <div class="card-hero-cover" onclick="openHeroPhoto('${saturday.id}')" title="Clic para ver en pantalla completa">
                    <img src="${encHero}" onerror="handleImageError(this, '${escapeHtml(heroPhotoPath)}')" alt="Portada Semana ${satIndex + 1}" loading="lazy">
                    <div class="card-hero-gradient-scrim"></div>
                    <div class="card-hero-floating-pill">
                        <i class="fa-solid fa-camera"></i>
                        <span>Registro Oficial</span>
                    </div>
                </div>
            `;
        }

        cardWrapper.innerHTML = `
            <div class="timeline-vertical-connector"></div>
            <div class="timeline-milestone-node" title="Sábado ${satIndex + 1}"></div>
            
            <article class="editorial-saturday-card" data-sat-id="${saturday.id}">
                ${heroCoverHtml}
                
                <header class="card-editorial-header">
                    <div class="calendar-capsule">
                        <span class="calendar-month-tab">${dateParts.monthShort}</span>
                        <span class="calendar-day-number">${dateParts.day}</span>
                    </div>
                    
                    <div class="header-date-details">
                        <span class="header-week-tag">Sábado ${satIndex + 1} • Ciclo 2026-II</span>
                        <h3 class="header-formatted-date">${saturday.formattedDate || formatSpanishDate(saturday.date)}</h3>
                    </div>
                </header>
                
                <div class="card-activities-body">
                    ${saturday.activities.map((activity, actIndex) => renderActivityEntry(activity, saturday.id, actIndex)).join('')}
                </div>
            </article>
        `;

        timelineItemsContainer.appendChild(cardWrapper);
    });

    setTimeout(updateTimelineLine, 60);
}

// Clic en la foto de portada para abrirla directamente en el lightbox
window.openHeroPhoto = function(saturdayId) {
    const saturday = timelineData.find(s => s.id === saturdayId);
    if (!saturday) return;
    for (let act of saturday.activities) {
        if (act.photos && act.photos.length > 0) {
            openLightboxMedia(act.id, 0, 'image');
            break;
        }
    }
};

function updateTimelineLine() {
    const line = document.querySelector('.timeline-track-line');
    const wrappers = document.querySelectorAll('.timeline-card-wrapper');
    if (!line || wrappers.length === 0) return;

    if (window.innerWidth <= 900) {
        line.style.left = '';
        line.style.width = '';
        line.style.right = '';
        return;
    }

    const visibleWrappers = Array.from(wrappers).filter(w => w.style.display !== 'none');
    if (visibleWrappers.length === 0) return;

    const firstWrapper = visibleWrappers[0];
    const lastWrapper = visibleWrappers[visibleWrappers.length - 1];

    const firstNodeX = firstWrapper.offsetLeft + (firstWrapper.offsetWidth / 2);
    const lastNodeX = lastWrapper.offsetLeft + (lastWrapper.offsetWidth / 2);

    line.style.left = `${firstNodeX}px`;
    line.style.width = `${Math.max(lastNodeX - firstNodeX, 0)}px`;
    line.style.right = 'auto';
}

function normalizePhotoPath(path) {
    if (!path) return '';
    return path.replace(/^\//, '');
}

window.handleImageError = function(imgElement, originalPath) {
    if (!imgElement || imgElement.getAttribute('data-tried-fallback')) return;
    imgElement.setAttribute('data-tried-fallback', 'true');
    
    let clean = normalizePhotoPath(originalPath);
    if (clean.includes('_')) {
        imgElement.src = encodeURI(clean.replace(/_/g, ' '));
    } else if (clean.includes(' ')) {
        imgElement.src = encodeURI(clean.replace(/ /g, '_'));
    } else {
        imgElement.src = './' + encodeURI(clean);
    }
};

function isVideoFile(path) {
    if (!path) return false;
    const clean = path.toLowerCase().split('?')[0];
    return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.endsWith('.ogg');
}

function getActivityMediaList(activity) {
    const media = [];

    if (activity.videos && Array.isArray(activity.videos)) {
        activity.videos.forEach(v => {
            if (v) media.push({ type: 'video', path: v });
        });
    }

    if (activity.photos && Array.isArray(activity.photos)) {
        activity.photos.forEach(p => {
            if (!p) return;
            if (isVideoFile(p)) {
                if (!media.some(m => m.path === p)) {
                    media.push({ type: 'video', path: p });
                }
            } else {
                media.push({ type: 'image', path: p });
            }
        });
    }

    return media;
}

// Renderizado de cada entrada de actividad en estilo editorial
function renderActivityEntry(activity, saturdayId, actIndex) {
    const allMedia = getActivityMediaList(activity);
    const videoItems = allMedia.filter(m => m.type === 'video');
    const photoItems = allMedia.filter(m => m.type === 'image');
    const iconClass = getProjectIconClass(activity.name);

    // Sección de Video Oficial
    let videoHtml = '';
    if (videoItems.length > 0) {
        const firstVideo = videoItems[0];
        const normVideoPath = normalizePhotoPath(firstVideo.path);
        const encodedVideoUrl = encodeURI(normVideoPath);

        videoHtml = `
            <div class="official-video-card" onclick="openLightboxMedia('${activity.id}', 0, 'video')" title="Reproducir Video Oficial en HD">
                <video src="${encodedVideoUrl}#t=0.5" preload="metadata" muted playsinline></video>
                <div class="video-cinema-scrim">
                    <div class="frosted-play-button">
                        <i class="fa-solid fa-play"></i>
                    </div>
                </div>
                <div class="video-label-badge">
                    <i class="fa-solid fa-sparkles"></i> Video Oficial HD
                </div>
            </div>
        `;
    }

    // Mosaico inteligente de fotos (Instagram / Revista Style)
    let photoMosaicHtml = '';
    if (photoItems.length > 0) {
        // Mostrar máximo 3 miniaturas en la tarjeta; la última tiene badge de "+N fotos" si hay más
        const displayLimit = 3;
        const displayPhotos = photoItems.slice(0, displayLimit);
        const remainingCount = photoItems.length - displayLimit;

        const thumbsHtml = displayPhotos.map((item, idx) => {
            const normPath = normalizePhotoPath(item.path);
            const encodedUrl = encodeURI(normPath);
            const safeOrig = escapeHtml(item.path);
            const isLast = (idx === displayLimit - 1 && remainingCount > 0);

            return `
                <div class="mosaic-thumb-slot" onclick="openLightboxMedia('${activity.id}', ${idx}, 'image')" title="Ampliar imagen ${idx + 1}">
                    <img src="${encodedUrl}" onerror="handleImageError(this, '${safeOrig}')" alt="Foto ${idx + 1}" loading="lazy">
                    ${isLast ? `
                        <div class="mosaic-more-badge">
                            <i class="fa-solid fa-images"></i>
                            <span>+${remainingCount + 1}</span>
                        </div>
                    ` : `
                        <div class="mosaic-thumb-overlay">
                            <button class="btn-mosaic-zoom" aria-label="Ampliar">
                                <i class="fa-solid fa-expand"></i>
                            </button>
                        </div>
                    `}
                </div>
            `;
        }).join('');

        photoMosaicHtml = `
            <div class="photo-mosaic-section">
                <div class="mosaic-header-row">
                    <span class="mosaic-title"><i class="fa-solid fa-camera"></i> Galería de Evidencias</span>
                    <span class="mosaic-count-chip">${photoItems.length} Fotos</span>
                </div>
                <div class="photo-mosaic-grid">
                    ${thumbsHtml}
                </div>
            </div>
        `;
    }

    return `
        <div class="editorial-activity-entry" data-act-id="${activity.id}">
            <div class="activity-meta-row">
                <span class="activity-project-badge">
                    <i class="fa-solid ${iconClass}"></i>
                    ${escapeHtml(activity.name)}
                </span>
                <span class="activity-order-tag">Misión ${actIndex + 1}</span>
            </div>
            
            ${activity.description ? `
                <p class="activity-narrative">${escapeHtml(activity.description)}</p>
            ` : ''}
            
            ${videoHtml}
            ${photoMosaicHtml}
        </div>
    `;
}

// ==========================================
// LIGHTBOX CINEMATOGRÁFICO
// ==========================================

function openLightboxMedia(actId, itemIndex = 0, preferredType = 'image') {
    let activity = null;
    for (let s of timelineData) {
        activity = s.activities.find(a => a.id === actId);
        if (activity) break;
    }

    if (!activity) return;

    const allMedia = getActivityMediaList(activity);
    if (allMedia.length === 0) return;

    currentLightboxMedia = allMedia;

    if (preferredType === 'video') {
        const videoIdx = allMedia.findIndex(m => m.type === 'video');
        currentLightboxIndex = videoIdx >= 0 ? videoIdx : 0;
    } else {
        const photoItems = allMedia.filter(m => m.type === 'image');
        const targetPhoto = photoItems[itemIndex];
        currentLightboxIndex = targetPhoto ? allMedia.indexOf(targetPhoto) : 0;
    }

    if (currentLightboxIndex < 0 || currentLightboxIndex >= allMedia.length) {
        currentLightboxIndex = 0;
    }

    updateLightboxContent(activity.name);

    lightbox.style.display = 'flex';
    lightbox.offsetWidth;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightboxContent(activityName) {
    if (!currentLightboxMedia || currentLightboxMedia.length === 0) return;

    const mediaItem = currentLightboxMedia[currentLightboxIndex];
    if (!mediaItem) return;

    const normPath = normalizePhotoPath(mediaItem.path);
    const encodedUrl = encodeURI(normPath);

    if (lightboxCounterText) {
        lightboxCounterText.innerText = `${mediaItem.type === 'video' ? 'Video' : 'Foto'} ${currentLightboxIndex + 1} de ${currentLightboxMedia.length}`;
    }

    if (mediaItem.type === 'video') {
        if (lightboxImg) {
            lightboxImg.style.display = 'none';
            lightboxImg.src = '';
        }
        if (lightboxVideo) {
            lightboxVideo.style.display = 'block';
            lightboxVideo.src = encodedUrl;
            lightboxVideo.currentTime = 0;
            lightboxVideo.play().catch(() => {});
        }

        if (lightboxCaption) {
            lightboxCaption.innerHTML = `<strong>${escapeHtml(activityName)}</strong> • Video de Actividad Oficial`;
        }
    } else {
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.style.display = 'none';
            lightboxVideo.src = '';
        }
        if (lightboxImg) {
            lightboxImg.style.display = 'block';
            lightboxImg.src = encodedUrl;
            lightboxImg.onerror = function() {
                if (!this.getAttribute('data-tried-fallback')) {
                    this.setAttribute('data-tried-fallback', 'true');
                    if (normPath.includes('_')) {
                        this.src = encodeURI(normPath.replace(/_/g, ' '));
                    } else if (normPath.includes(' ')) {
                        this.src = encodeURI(normPath.replace(/ /g, '_'));
                    }
                }
            };
        }

        if (lightboxCaption) {
            lightboxCaption.innerHTML = `<strong>${escapeHtml(activityName)}</strong> • Fotografía Oficial de Misión`;
        }
    }

    if (currentLightboxMedia.length <= 1) {
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    } else {
        if (lightboxPrev) lightboxPrev.style.display = 'flex';
        if (lightboxNext) lightboxNext.style.display = 'flex';
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }
    setTimeout(() => {
        lightbox.style.display = 'none';
        if (lightboxImg) lightboxImg.src = '';
        document.body.style.overflow = '';
    }, 280);
}

function prevLightboxImage(e) {
    if (e) e.stopPropagation();
    if (!currentLightboxMedia || currentLightboxMedia.length <= 1) return;

    if (lightboxVideo) lightboxVideo.pause();

    currentLightboxIndex--;
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentLightboxMedia.length - 1;
    }

    const activityName = getActivityNameByMedia(currentLightboxMedia[currentLightboxIndex]);
    updateLightboxContent(activityName);
}

function nextLightboxImage(e) {
    if (e) e.stopPropagation();
    if (!currentLightboxMedia || currentLightboxMedia.length <= 1) return;

    if (lightboxVideo) lightboxVideo.pause();

    currentLightboxIndex++;
    if (currentLightboxIndex >= currentLightboxMedia.length) {
        currentLightboxIndex = 0;
    }

    const activityName = getActivityNameByMedia(currentLightboxMedia[currentLightboxIndex]);
    updateLightboxContent(activityName);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (lightbox.requestFullscreen) {
            lightbox.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function getActivityNameByMedia(mediaItem) {
    if (!mediaItem) return 'Actividad';
    for (let s of timelineData) {
        for (let a of s.activities) {
            const allMedia = getActivityMediaList(a);
            if (allMedia.some(m => m.path === mediaItem.path)) {
                return a.name;
            }
        }
    }
    return 'Actividad';
}

// ==========================================
// FILTRADO DINÁMICO & BÚSQUEDA
// ==========================================

function filterTimeline() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const filter = activeFilter.toLowerCase().trim();
    const cardWrappers = document.querySelectorAll('.timeline-card-wrapper');

    let visibleCount = 0;

    cardWrappers.forEach(wrapper => {
        const satId = wrapper.getAttribute('data-id');
        const saturday = timelineData.find(s => s.id === satId);
        if (!saturday) return;

        // Filtro por chip
        let passesChipFilter = (filter === 'all');
        if (!passesChipFilter) {
            passesChipFilter = saturday.activities.some(act => {
                return act.name.toLowerCase().includes(filter) || (act.description && act.description.toLowerCase().includes(filter));
            });
        }

        // Filtro por texto de búsqueda
        let passesSearchQuery = (query === '');
        if (!passesSearchQuery) {
            const dateMatch = (saturday.formattedDate && saturday.formattedDate.toLowerCase().includes(query)) || saturday.date.includes(query);
            const actMatch = saturday.activities.some(act => {
                return act.name.toLowerCase().includes(query) || (act.description && act.description.toLowerCase().includes(query));
            });
            passesSearchQuery = dateMatch || actMatch;
        }

        if (passesChipFilter && passesSearchQuery) {
            wrapper.style.display = 'flex';
            visibleCount++;

            // Resaltar actividad coincidente
            const activityEntries = wrapper.querySelectorAll('.editorial-activity-entry');
            activityEntries.forEach(entry => {
                const actId = entry.getAttribute('data-act-id');
                const act = saturday.activities.find(a => a.id === actId);
                if (!act) return;

                const isTarget = (query !== '' && (act.name.toLowerCase().includes(query) || (act.description && act.description.toLowerCase().includes(query)))) ||
                                 (filter !== 'all' && (act.name.toLowerCase().includes(filter) || (act.description && act.description.toLowerCase().includes(filter))));

                if (isTarget) {
                    entry.style.borderColor = 'var(--gold-bright)';
                    entry.style.boxShadow = '0 0 24px rgba(245, 158, 11, 0.45)';
                } else {
                    entry.style.borderColor = '';
                    entry.style.boxShadow = '';
                }
            });
        } else {
            wrapper.style.display = 'none';
        }
    });

    // Manejar estado vacío
    const existingEmpty = document.querySelector('.timeline-empty-state');
    if (visibleCount === 0) {
        if (!existingEmpty && timelineItemsContainer) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'timeline-empty-state';
            emptyEl.innerHTML = `
                <i class="fa-solid fa-magnifying-glass"></i>
                <h3>No se encontraron actividades</h3>
                <p>No hay resultados para tu criterio de búsqueda o filtro actual.</p>
                <button class="btn-reset-timeline" onclick="resetAllFilters()">Mostrar todas las actividades</button>
            `;
            timelineItemsContainer.appendChild(emptyEl);
        }
    } else {
        if (existingEmpty) existingEmpty.remove();
    }

    setTimeout(updateTimelineLine, 50);
}

window.resetAllFilters = function() {
    if (searchInput) searchInput.value = '';
    if (searchClearBtn) searchClearBtn.style.display = 'none';
    activeFilter = 'all';

    document.querySelectorAll('.filter-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-filter') === 'all');
    });

    filterTimeline();
};

// ==========================================
// UTILIDADES DE FORMATO & FECHAS
// ==========================================

function formatSpanishDate(dateString) {
    const date = new Date(dateString + 'T12:00:00');
    const options = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };

    let formatted = date.toLocaleDateString('es-ES', options);
    formatted = formatted.replace(/^\w/, c => c.toUpperCase());
    formatted = formatted.replace(/,\s\w/, c => c.toUpperCase());
    return formatted;
}

function calculateNextSaturdayDate(lastDateString) {
    const date = new Date(lastDateString + 'T12:00:00');
    const nextDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);

    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDate.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
