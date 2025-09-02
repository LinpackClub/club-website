import * as THREE from "three";
import imagesLoaded from "imagesloaded";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";
import gsap from "gsap";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default class Three {
    constructor(options) {
        this.scene = new THREE.Scene();
        this.container = options.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.cameraDistance = 5;
        this.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera = new THREE.PerspectiveCamera(
            this.fov,
            this.width / this.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, this.cameraDistance);

        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        this.time = 0;
        this.currentScroll = 0;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(0, 0);

        this.currentHovered = null;

        this.clock = new THREE.Clock();

        this.images = [...document.querySelectorAll("img[data-webgl-media]")];
        this.videos = [...document.querySelectorAll("video.project_video")];

        // Preloader elements
        this.workElement = document.querySelector('.work p');
        this.projectsElement = document.querySelector('.projects');
        this.infoH1s = document.querySelectorAll('.info h1');

        // Validate DOM elements
        if (!this.workElement || !this.projectsElement || this.infoH1s.length < 2) {
            console.error('Required elements (.work, .projects, or .info h1) not found in DOM');
            this.startApp();
            return;
        }

        // Set initial font size to 200vw
        // gsap.set(this.workElement, { fontSize: '200vw' });

        // Hide WebGL content during preloader
        this.scene.visible = false;
        this.renderer.domElement.style.opacity = '0';

        // Initialize .info h1 elements
        this.breakTheTextGsap(this.infoH1s[0]); // First h1
        this.breakTheTextGsap(this.infoH1s[1]); // Second h1
        gsap.set(this.infoH1s[0], { opacity: 0 }); // Hide first h1 initially
        gsap.set(this.infoH1s[1], { opacity: 0 }); // Hide second h1 initially

        const preloadAssets = new Promise((resolve) => {
            const startTime = performance.now();
            let loadedAssets = 0;
            const totalAssets = this.images.length + this.videos.length || 1;

            if (totalAssets === 1) {
                resolve(0);
                return;
            }

            const updateProgress = () => {
                loadedAssets++;
                if (loadedAssets >= totalAssets) {
                    const endTime = performance.now();
                    const loadDuration = (endTime - startTime) / 1000;
                    resolve(loadDuration);
                }
            };

            const imagesPromise = new Promise((res) => {
                if (this.images.length === 0) {
                    res();
                    return;
                }
                imagesLoaded(
                    document.querySelectorAll('img[data-webgl-media]'),
                    { background: true },
                    () => {
                        console.log('All images loaded');
                        this.images.forEach(() => updateProgress());
                        res();
                    }
                );
            });

            const videosPromise = new Promise((res) => {
                if (this.videos.length === 0) {
                    res();
                    return;
                }
                let loadedVideos = 0;
                this.videos.forEach((video) => {
                    video.load();
                    video.onloadeddata = () => {
                        loadedVideos++;
                        updateProgress();
                        if (loadedVideos === this.videos.length) {
                            console.log('All videos loaded');
                            res();
                        }
                    };
                    video.onerror = () => {
                        console.error(`Failed to load video: ${video.src}`);
                        loadedVideos++;
                        updateProgress();
                        if (loadedVideos === this.videos.length) {
                            res();
                        }
                    };
                });
            });

            Promise.all([imagesPromise, videosPromise]).then(() => {
                const endTime = performance.now();
                const loadDuration = (endTime - startTime) / 1000;
                resolve(loadDuration);
            });
        });

        preloadAssets.then((loadDuration) => {
            // Ensure minimum duration for visibility
            const minDuration = 2;
            const finalDuration = Math.max(loadDuration, minDuration);

            gsap.timeline({
                onComplete: () => {
                    // Animate first h1
                    gsap.set(this.infoH1s[0], { opacity: 1 });
                    gsap.from(this.infoH1s[0].querySelectorAll('.element'), {
                        y: this.infoH1s[0].offsetHeight,
                        duration: 0.8,
                        stagger: 0.02,
                        ease: "expoScale(0.5,7,none)",
                    });

                    // Re-enable scroll, show WebGL, and fix .projects positioning
                    document.documentElement.style.overflow = 'auto';
                    window.scrollTo(0, 0);
                    this.projectsElement.style.position = 'relative';
                    this.scene.visible = true;
                    this.renderer.domElement.style.pointerEvents = 'auto';
                    gsap.to(this.renderer.domElement, {
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.in",
                    });
                    this.startApp();
                }
            })
            .from(this.workElement, {
                fontSize: '200vw',
                duration: finalDuration,
                ease: "power2.out",
            }, 0)
            .to(this.projectsElement, {
                top: 0,
                duration: 1,
                ease: "power2.inOut",
            }, finalDuration - 0.6);
        });
    }


    breakTheTextGsap(domElem) {
        let domElemVar = domElem.textContent;
        let domElemHeight = domElem.offsetHeight;
        let splittedText = domElemVar.split("");
        let clutter = "";
        splittedText.forEach(function(element, index) {
            clutter += `<span class="element">${element}</span>`;

        });
        domElem.innerHTML = clutter;
    }

    startApp() {
        this.scroll = new Lenis({
            smoothWheel: true,
            autoRaf: false,
            duration: 1.2,
        });

        this.scroll.scrollTo(0, { immediate: true });

        this.addImages();
        this.setPosition();
        this.mouseMovement();
        this.addClickEvents();
        this.resize();
        this.setupResize();
        this.render();
    }

    mouseMovement() {
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);

            const isMobile = window.innerWidth <= 768;

            if (intersects.length > 0) {
                let obj = intersects[0].object;
                if (!obj.userData.isFullScreen) {
                    obj.material.uniforms.uHover.value = intersects[0].uv;

                    if (this.currentHovered !== obj) {
                        if (this.currentHovered) {
                            const prevStoreItem = this.imageStore.find(s => s.mesh === this.currentHovered);
                            gsap.to(this.currentHovered.material.uniforms.uHoverState, {
                                duration: 0.5,
                                value: 0,
                                ease: "circ.inOut",
                            });
                            // gsap.to(this.currentHovered.scale, {
                            //     x: prevStoreItem.width,
                            //     y: prevStoreItem.height,
                            //     duration: 0.5,
                            // });
                            if (prevStoreItem && !isMobile) {
                                const projectContainer = prevStoreItem.img.closest('.project_container');
                                const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                                const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                                if (listNum) {
                                    gsap.to(listNum, {
                                        y: 0,
                                        duration: 0.5,
                                        ease: "circ.inOut",
                                    });
                                }
                                if (listTitle) {
                                    gsap.to(listTitle, {
                                        y: 0,
                                        duration: 0.5,
                                        ease: "circ.inOut",
                                    });
                                }
                            }
                            this.currentHovered.userData.hovered = false;
                        }

                        obj.userData.hovered = true;
                        const storeItem = this.imageStore.find(s => s.mesh === obj);
                        gsap.to(obj.material.uniforms.uHoverState, {
                            duration: 0.5,
                            value: 1,
                            ease: "circ.inOut",
                        });
                        // gsap.to(obj.scale, {
                        //     x: storeItem.width * 1.25,
                        //     y: storeItem.height * 1.25,
                        //     duration: 0.5,
                        // });
                        if (storeItem && !isMobile) {
                            const projectContainer = storeItem.img.closest('.project_container');
                            const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                            const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                            const listNumHeight = listNum ? listNum.offsetHeight : 0;
                            const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
                            if (listNum) {
                                gsap.to(listNum, {
                                    y: listNumHeight / 2,
                                    duration: 0.5,
                                    ease: "circ.inOut",
                                });
                            }
                            if (listTitle) {
                                gsap.to(listTitle, {
                                    y: -listTitleHeight / 2,
                                    duration: 0.5,
                                    ease: "circ.inOut",
                                });
                            }
                        }
                        this.currentHovered = obj;
                    }
                }
            } else {
                if (this.currentHovered) {
                    const prevStoreItem = this.imageStore.find(s => s.mesh === this.currentHovered);
                    gsap.to(this.currentHovered.material.uniforms.uHoverState, {
                        duration: 0.5,
                        value: 0,
                        ease: "circ.inOut",
                    });
                    // gsap.to(this.currentHovered.scale, {
                    //     x: prevStoreItem.width,
                    //     y: prevStoreItem.height,
                    //     duration: 0.5,
                    // });
                    if (prevStoreItem && !isMobile) {
                        const projectContainer = prevStoreItem.img.closest('.project_container');
                        const listNum = projectContainer ? projectContainer.querySelector('.list_num') : null;
                        const listTitle = projectContainer ? projectContainer.querySelector('.list_title') : null;
                        const listNumHeight = listNum ? listNum.offsetHeight : 0;
                        const listTitleHeight = listTitle ? listTitle.offsetHeight : 0;
                        if (listNum) {
                            gsap.to(listNum, {
                                y: 0,
                                duration: 0.5,
                                ease: "circ.inOut",
                            });
                        }
                        if (listTitle) {
                            gsap.to(listTitle, {
                                y: 0,
                                duration: 0.5,
                                ease: "circ.inOut",
                            });
                        }
                    }
                    this.currentHovered.userData.hovered = false;
                    this.currentHovered = null;
                }
            }
        });
    }

    addClickEvents() {
        this.container.addEventListener('click', (event) => {
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.scene.children);
            const anyFullScreen = this.imageStore.some(i => i.mesh.userData.isFullScreen);

            if (anyFullScreen) {
                const fullScreenMesh = this.imageStore.find(i => i.mesh.userData.isFullScreen);
                if (fullScreenMesh) {
                    let tl = gsap.timeline();

                    // Animate mesh out of fullscreen
                    tl.to(fullScreenMesh.mesh.material.uniforms.uCorners.value, { x: 0, duration: 0.4 })
                      .to(fullScreenMesh.mesh.material.uniforms.uCorners.value, { z: 0, duration: 0.4 }, 0.1)
                      .to(fullScreenMesh.mesh.material.uniforms.uCorners.value, { y: 0, duration: 0.4 }, 0.2)
                      .to(fullScreenMesh.mesh.material.uniforms.uCorners.value, { w: 0, duration: 0.4 }, 0.3)
                      .to(fullScreenMesh.mesh.material.uniforms.uIsFullScreen, { value: 0, duration: 0 }, 0)
                      .to(fullScreenMesh.mesh.material.uniforms.uProgress, { value: 0, duration: 0.7, ease: "linear" }, 0);

                    // Animate second h1 to bottom
                    tl.to(this.infoH1s[1].querySelectorAll('.element'), {
                        y: this.infoH1s[1].offsetHeight,
                        duration: 0.8,
                        stagger: 0.015,
                        ease: "expoScale(0.5,7,none)",
                    }, 0)
                    .to(this.infoH1s[1], {
                        opacity: 0,
                        duration: 0.8,
                    }, 0);

                    // Instantly set first h1 visible and move its elements above view
                    tl.set(this.infoH1s[0], { opacity: 1 }, 0)
                      .set(this.infoH1s[0].querySelectorAll('.element'), {
                          y: -this.infoH1s[0].offsetHeight
                      }, 0);

                    // Animate first h1 elements from top to center
                    tl.to(this.infoH1s[0].querySelectorAll('.element'), {
                        y: 0,
                        duration: 0.8,
                        stagger: 0.015,
                        ease: "expoScale(0.5,7,none)",
                    }, 0.2);

                    fullScreenMesh.mesh.userData.isFullScreen = false;
                    this.scroll.start();
                }
            } else if (intersects.length > 0) {
                let obj = intersects[0].object;
                if (!obj.userData.isFullScreen) {
                    let tl = gsap.timeline();
                    tl.to(obj.material.uniforms.uCorners.value, { w: 1, duration: 0.4 })
                      .to(obj.material.uniforms.uCorners.value, { y: 1, duration: 0.4 }, 0.1)
                      .to(obj.material.uniforms.uCorners.value, { z: 1, duration: 0.4 }, 0.2)
                      .to(obj.material.uniforms.uCorners.value, { x: 1, duration: 0.4 }, 0.3)
                      .to(obj.material.uniforms.uIsFullScreen, { value: 1, duration: 0 }, 0)
                      .to(obj.material.uniforms.uProgress, { value: 1, duration: 0.7, ease: "linear" }, 0)
                      // Animate first h1 to top, second h1 from bottom to center
                      .to(this.infoH1s[0].querySelectorAll('.element'), {
                          y: -this.infoH1s[0].offsetHeight,
                          duration: 0.8,
                          stagger: 0.015,
                          ease: "expoScale(0.5,7,none)",
                      }, 0)
                      .to(this.infoH1s[0], {
                          opacity: 0,
                          duration: 0.8,
                      }, 0)
                      .set(this.infoH1s[1], { opacity: 1 }, 0)
                      .set(this.infoH1s[1].querySelectorAll('.element'), {
                          y: this.infoH1s[1].offsetHeight
                      }, 0)
                      .to(this.infoH1s[1].querySelectorAll('.element'), {
                          y: 0,
                          duration: 0.8,
                          stagger: 0.015,
                          ease: "expoScale(0.5,7,none)",
                      }, 0.2);
                    obj.userData.isFullScreen = true;
                    this.scroll.stop();
                }
            }
        });
    }

    setupResize() {
        window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.fov = 2 * Math.atan((this.height / 2) / this.cameraDistance) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.setPosition();
        this.materialArr.forEach(material => {
            material.uniforms.uResolution.value.set(this.width, this.height);
        });
    }

    addImages() {
        this.material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: null },
                uImage1: { value: null },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                uIsFullScreen: { value: 0 },
                aspect: { value: new THREE.Vector2(1, 1) },
                uProgress: { value: 0 },
                uCorners: { value: new THREE.Vector4(0, 0, 0, 0) },
                uTextureSize: { value: new THREE.Vector2(1, 1) },
                uResolution: { value: new THREE.Vector2(this.width, this.height) },
                uQuadSize: { value: new THREE.Vector2(1, 1) },
                uIsMobile: { value: window.innerWidth <= 768 ? 1.0 : 0.0 }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.materialArr = [];

        this.imageStore = this.images.map((img, index) => {
            let imgBounds = img.getBoundingClientRect();

            const video = this.videos[index];
            if (!video) {
                console.error(`No video found for image index ${index}`);
                return null;
            }

            video.play().catch(error => console.error(`Video playback failed for ${video.src}:`, error));

            const videoTexture = new THREE.VideoTexture(video);
            videoTexture.minFilter = THREE.LinearFilter;
            videoTexture.magFilter = THREE.LinearFilter;

            let texture = new THREE.Texture(img);
            texture.needsUpdate = true;

            let imgGeo = new THREE.PlaneGeometry(1, 1, 50, 50);

            let imgMat = this.material.clone();
            imgMat.uniforms.uImage.value = texture;
            imgMat.uniforms.uImage1.value = videoTexture;
            imgMat.uniforms.aspect.value = new THREE.Vector2(imgBounds.width / imgBounds.height, 1);
            imgMat.uniforms.uTextureSize.value = new THREE.Vector2(imgBounds.width, imgBounds.height);
            imgMat.uniforms.uQuadSize.value = new THREE.Vector2(imgBounds.width, imgBounds.height);

            this.materialArr.push(imgMat);

            let imgMesh = new THREE.Mesh(imgGeo, imgMat);
            imgMesh.scale.set(imgBounds.width, imgBounds.height, 1);
            imgMesh.userData = { isFullScreen: false, hovered: false };
            this.scene.add(imgMesh);

            return {
                img: img,
                mesh: imgMesh,
                top: imgBounds.top,
                left: imgBounds.left,
                width: imgBounds.width,
                height: imgBounds.height,
            };
        }).filter(item => item !== null);
    }

    setPosition() {
        this.imageStore.forEach(img => {
            const bounds = img.img.getBoundingClientRect();
            img.top = bounds.top + window.scrollY;
            img.left = bounds.left;
            img.width = bounds.width;
            img.height = bounds.height;

            img.mesh.position.x = img.left - this.width / 2 + img.width / 2;
            img.mesh.position.y = this.currentScroll - img.top + this.height / 2 - img.height / 2;
            img.mesh.material.uniforms.uQuadSize.value.set(img.width, img.height);
        });
    }

    render() {
        this.time = this.clock.getElapsedTime();
        this.scroll.raf(performance.now());
        this.currentScroll = this.scroll.scroll;
        this.setPosition();
        this.materialArr.forEach(material => {
            material.uniforms.uTime.value = this.time;
        });
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}