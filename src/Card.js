import * as skin3d from 'skin3d';
import './card.css';

export class Card {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.elements = {};
        this.skinViewer = null;
        this.animationFrameId = null;
        
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.container.style.perspective = '1500px';

        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        
        this.init(); 
    }

    async init() {
        this.createDOM();
        await this.applyData();
        this.setupSkinViewer();
        this.setupInteractions();
    }

    createDOM() {
        this.container.innerHTML = `
            <div class="card">
                <div class="glare"></div>
                <canvas class="card-skin-viewer"></canvas>
                <img class="card-pack-logo" alt="Pack Logo">
                <div class="card-sticker-layer"></div>
            </div>
        `;
        
        this.elements.card = this.container.querySelector('.card');
        this.elements.skinCanvas = this.container.querySelector('.card-skin-viewer');
        this.elements.packLogo = this.container.querySelector('.card-pack-logo');
        this.elements.stickerLayer = this.container.querySelector('.card-sticker-layer');
    }

    async applyData() {
        this.elements.card.classList.add(`rarity-${this.data.rarity}`);
        this.elements.card.style.backgroundImage = `url('${this.data.backgroundImage}')`;
        this.elements.packLogo.src = this.data.packLogoImage;

        if (this.data.stickerUrl) {
            try {
                const response = await fetch(this.data.stickerUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const stickerHTML = await response.text();
                this.elements.stickerLayer.innerHTML = stickerHTML; 
            } catch (error) {
                console.error(`Could not load sticker from ${this.data.stickerUrl}:`, error);
            }
        }
    }
    
    setupSkinViewer() {
        this.skinViewer = new skin3d.View({
            canvas: this.elements.skinCanvas,
            width: this.width,
            height: this.height,
            background: null,
        });

        this.skinViewer.controls.enableRotate = false;
        this.skinViewer.controls.enableZoom = false;

        const scaleFactor = this.height / 560;
        
        this.skinViewer.camera.fov = 75 - (this.width / this.height) * 10;
        this.skinViewer.camera.updateProjectionMatrix();

        this.skinViewer.camera.position.set(-25 * scaleFactor, 35 * scaleFactor, 50 * scaleFactor);
        this.skinViewer.camera.lookAt(0,0,0);
        
        this.skinViewer.loadSkin(this.data.skinImage)
            .then(() => {
                const playerObject = this.skinViewer.playerObject;
                
                playerObject.scale.set(scaleFactor, scaleFactor, scaleFactor);

                const skin = playerObject.skin;
                
                skin.leftArm.rotation.x = -Math.PI / 4;
                skin.rightArm.rotation.x = Math.PI / 4;
                skin.leftLeg.rotation.x = Math.PI / 5;
                skin.rightLeg.rotation.x = -Math.PI / 5;

                const rotationAngle = Math.PI / 6;
                const rotationSpeed = 0.5;
                
                const idleAnimation = (time) => {
                    if (!this.skinViewer) return; 
                    const newRotation = rotationAngle * Math.sin(time / 1000 * rotationSpeed);
                    skin.rotation.y = newRotation;
                    
                    this.animationFrameId = requestAnimationFrame(idleAnimation);
                };

                this.animationFrameId = requestAnimationFrame(idleAnimation);
            })
            .catch(err => {
                console.error("Failed to load skin:", err);
            });
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        this.elements.card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    handleMouseLeave() {
        this.elements.card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }

    setupInteractions() {
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);
    }
    
    destroy() {
        console.log("Destroying card instance...");

        this.container.removeEventListener('mousemove', this.handleMouseMove);
        this.container.removeEventListener('mouseleave', this.handleMouseLeave);

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        if (this.skinViewer && typeof this.skinViewer.dispose === 'function') {
            this.skinViewer.dispose();
        }
        this.skinViewer = null;

        this.container.innerHTML = '';
        
        this.elements = {};
    }
}