import * as skin3d from 'skin3d';
import './card.css';

export class Card {
    constructor(container, data) {
        this.container = container;
        this.data = data;
        this.elements = {};
        
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
        const viewer = new skin3d.View({
            canvas: this.elements.skinCanvas,
            width: 360,
            height: 560,
            background: null,
        });

        viewer.controls.enableRotate = false;
        viewer.controls.enableZoom = false;

        viewer.camera.position.set(-25, 35, 50); 
        viewer.camera.lookAt(0,0,0);
        

        viewer.loadSkin(this.data.skinImage)
            .then(() => {
                const playerObject = viewer.playerObject;

                const skin = playerObject.skin;
                skin.leftArm.rotation.x = -Math.PI / 4;
                skin.rightArm.rotation.x = Math.PI / 4;
                skin.leftLeg.rotation.x = Math.PI / 5;
                skin.rightLeg.rotation.x = -Math.PI / 5;

                const rotationAngle = Math.PI / 6;
                const rotationSpeed = 0.5;

                function idleAnimation(time) {
                    const newRotation = rotationAngle * Math.sin(time / 1000 * rotationSpeed);
                    skin.rotation.y = newRotation;
                    requestAnimationFrame(idleAnimation);
                }

                requestAnimationFrame(idleAnimation);
            })
            .catch(err => {
                console.error("Failed to load skin:", err);
                console.error("Check the path to the skin image:", this.data.skinImage);
            });
    }

    setupInteractions() {
    this.container.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        this.elements.card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    this.container.addEventListener('mouseleave', () => {
        this.elements.card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}
}