// main.js - The Soul of the Cosmos (Final Build)
document.addEventListener('DOMContentLoaded', () => {

    const AppState = {
        currentView: 'gate',
        currentLang: 'zh-TW',
        isTransitioning: false,
        planetsData: {
            terra:    { id: 'terra',    color: 0xffa07a, position: new THREE.Vector3(-60, 10, -50) },
            cybennah: { id: 'cybennah', color: 0xff4500, position: new THREE.Vector3(50, -20, -30) },
            aquatica: { id: 'aquatica', color: 0x1e90ff, position: new THREE.Vector3(0, 50, -10) },
            eclipsia: { id: 'eclipsia', color: 0x9370db, position: new THREE.Vector3(70, 20, -70) },
            ekeres:   { id: 'ekeres',   color: 0x32cd32, position: new THREE.Vector3(-40, -40, -60) }
        }
    };

    const ThreeModule = {
        scene: null, camera: null, renderer: null,
        rings: [], stars: null, planets: new THREE.Group(),
        raycaster: new THREE.Raycaster(), mouse: new THREE.Vector2(),
        intersected: null,

        init() {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
            this.camera.position.z = 15;

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0);
            document.getElementById('three-canvas-container').appendChild(this.renderer.domElement);
            
            this.createStarfield();
            this.createInitialRings();
            this.createPlanets();
            this.scene.add(this.planets);
            this.planets.visible = false;

            window.addEventListener('resize', this.onWindowResize.bind(this));
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
            window.addEventListener('click', this.onMouseClick.bind(this));
            this.animate();
        },

        createInitialRings() {
            const geometry = new THREE.TorusGeometry(10, 0.05, 32, 200);
            const material = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
            for (let i = 0; i < 4; i++) {
                const ring = new THREE.Mesh(geometry, material);
                ring.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                const scale = 1 + i * 0.3;
                ring.scale.set(scale, scale, scale);
                this.rings.push(ring);
                this.scene.add(ring);
            }
        },
        
        createStarfield() {
            const vertices = [];
            for (let i = 0; i < 15000; i++) {
                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const material = new THREE.PointsMaterial({ color: 0x888888, size: 0.7 });
            this.stars = new THREE.Points(geometry, material);
            this.scene.add(this.stars);
        },

        createPlanets() {
            Object.values(AppState.planetsData).forEach(p_data => {
                const geometry = new THREE.SphereGeometry(5, 32, 32);
                const material = new THREE.MeshBasicMaterial({ color: p_data.color });
                const planet = new THREE.Mesh(geometry, material);
                planet.position.copy(p_data.position);
                planet.userData = { id: p_data.id };
                this.planets.add(planet);
            });
        },
        
        animate() {
            requestAnimationFrame(this.animate.bind(this));
            const time = Date.now() * 0.0001;
            this.rings.forEach((ring, i) => {
                ring.rotation.x += 0.0005 * (i * 0.2 + 1);
                ring.rotation.y += 0.0002 * (i * 0.2 + 1);
            });
            this.stars.rotation.y = time * 0.1;

            if (AppState.currentView === 'starmap') {
                this.raycaster.setFromCamera(this.mouse, this.camera);
                const intersects = this.raycaster.intersectObjects(this.planets.children);

                if (intersects.length > 0) {
                    if (this.intersected != intersects[0].object) {
                        if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.currentHex);
                        this.intersected = intersects[0].object;
                        this.intersected.currentHex = this.intersected.material.emissive.getHex();
                        this.intersected.material.emissive.setHex(0x555555);
                        UIModule.showPlanetInfo(this.intersected.userData.id);
                    }
                } else {
                    if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.currentHex);
                    this.intersected = null;
                    UIModule.hidePlanetInfo();
                }
            } else {
                 if (this.intersected) this.intersected.material.emissive.setHex(this.intersected.currentHex);
                 this.intersected = null;
                 UIModule.hidePlanetInfo();
            }

            this.renderer.render(this.scene, this.camera);
        },
        
        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },

        onMouseMove(event) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        },

        onMouseClick() {
            if (AppState.currentView === 'starmap' && this.intersected && !AppState.isTransitioning) {
                App.navigateToPlanet(this.intersected.userData.id);
            }
        },

        transitionToStarmap(onComplete) {
            AppState.isTransitioning = true;
            gsap.to(this.camera.position, { z: 100, duration: 2.5, ease: "power2.inOut" });
            gsap.to(this.rings[0].rotation, { y: this.rings[0].rotation.y + 5, duration: 2.5, ease: "power2.inOut", onComplete });
            gsap.to(this.rings, {
                opacity: 0, duration: 1, delay: 1.5,
                onUpdate: function() { this.targets().forEach(ring => ring.material.opacity = this.ratio); },
                onComplete: () => this.rings.forEach(r => r.visible = false)
            });
            setTimeout(() => this.planets.visible = true, 2000);
        },

        focusOnPlanet(planetId, onComplete) {
            const planetData = AppState.planetsData[planetId];
            if (!planetData) return;
            AppState.isTransitioning = true;
            gsap.to(this.camera.position, {
                x: planetData.position.x, y: planetData.position.y, z: planetData.position.z + 15,
                duration: 2, ease: 'power3.inOut', onComplete
            });
        },

        returnToStarmap(onComplete) {
            AppState.isTransitioning = true;
            gsap.to(this.camera.position, { x: 0, y: 0, z: 100, duration: 2, ease: 'power3.inOut', onComplete });
        }
    };

    const I18nModule = {
        i18nextInstance: i18next.createInstance(),
        async init(lang) {
            const resources = await this.loadLanguages(['zh-TW', 'en', 'ja']);
            return new Promise(resolve => {
                this.i18nextInstance.init({ lng: lang, fallbackLng: 'en', resources }, () => {
                    UIModule.updateContent();
                    resolve();
                });
            });
        },
        async loadLanguages(langs) {
            const resources = {};
            for (const lang of langs) {
                const response = await fetch(`./locales/${lang}.json`);
                resources[lang] = await response.json();
            }
            return resources;
        },
        changeLanguage(lang) {
            AppState.currentLang = lang;
            this.i18nextInstance.changeLanguage(lang, UIModule.updateContent);
        }
    };

    const UIModule = {
        init() {
            this.bindEventListeners();
            this.updateActiveLangButton();
        },
        bindEventListeners() {
            document.querySelector('.journey-btn').addEventListener('click', App.startJourney);
            document.getElementById('lang-switcher').addEventListener('click', e => {
                if (e.target.tagName === 'BUTTON') {
                    const lang = e.target.dataset.lang;
                    if (lang) {
                        I18nModule.changeLanguage(lang);
                        this.updateActiveLangButton();
                    }
                }
            });
            document.getElementById('back-to-starmap').addEventListener('click', App.returnToStarmap);
        },
        updateContent() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                el.innerHTML = I18nModule.i18nextInstance.t(el.dataset.i18n);
            });
            document.title = I18nModule.i18nextInstance.t('site-title');
        },
        updateActiveLangButton() {
            document.querySelectorAll('#lang-switcher button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === AppState.currentLang);
            });
        },
        navigateTo(viewName) {
            const currentView = document.querySelector('.view.active');
            const nextView = document.getElementById(`${viewName}-view`);
            if(currentView) currentView.classList.remove('active');
            if(nextView) nextView.classList.add('active');
            AppState.currentView = viewName;
        },
        showPlanetInfo(planetId) {
            const infoBox = document.getElementById('planet-info');
            document.getElementById('planet-title').textContent = I18nModule.i18nextInstance.t(`planets.${planetId}.name`);
            document.getElementById('planet-subtitle').textContent = I18nModule.i18nextInstance.t(`planets.${planetId}.subtitle`);
            infoBox.classList.remove('hidden');
        },
        hidePlanetInfo() {
            document.getElementById('planet-info').classList.add('hidden');
        },
        loadPlanetContent(planetId) {
            const t = I18nModule.i18nextInstance.t;
            document.querySelector('.planet-image').style.backgroundImage = `url(./assets/${planetId}.jpg)`;
            document.querySelector('.planet-detail-title').textContent = t(`planets.${planetId}.title`);
            document.querySelector('.planet-detail-subtitle').textContent = t(`planets.${planetId}.subtitle`);
            document.querySelector('.planet-detail-description').innerHTML = t(`planets.${planetId}.description`);
        },
        toggleBackButton(show) {
             document.getElementById('back-to-starmap').classList.toggle('hidden', !show);
        }
    };

    const App = {
        async init() {
            ThreeModule.init();
            await I18nModule.init(AppState.currentLang);
            UIModule.init();
        },
        startJourney() {
            if(AppState.isTransitioning) return;
            UIModule.navigateTo('none'); // Hide all UI
            ThreeModule.transitionToStarmap(() => {
                UIModule.navigateTo('starmap');
                gsap.to('.starmap-title', { opacity: 1, duration: 1.5, delay: 0.5 });
                AppState.isTransitioning = false;
            });
        },
        navigateToPlanet(planetId) {
            if(AppState.isTransitioning) return;
            UIModule.hidePlanetInfo();
            UIModule.toggleBackButton(true);
            UIModule.navigateTo('none');
            ThreeModule.focusOnPlanet(planetId, () => {
                UIModule.loadPlanetContent(planetId);
                UIModule.navigateTo('planet');
                AppState.isTransitioning = false;
            });
        },
        returnToStarmap() {
            if(AppState.isTransitioning) return;
            UIModule.toggleBackButton(false);
            UIModule.navigateTo('none');
            ThreeModule.returnToStarmap(() => {
                UIModule.navigateTo('starmap');
                AppState.isTransitioning = false;
            });
        }
    };

    App.init();
});