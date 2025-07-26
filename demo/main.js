import { Card } from '../src/Card.js';

const cardData1 = {
    rarity: 'Signed', // Wood, Iron, Diamond, Netherite, Signed
    backgroundImage: '/background/card1.png',
    skinImage: '/skins/skin.png',
    packLogoImage: '/logos/pack1.jpg',
    stickerUrl: '/stickers/signature-sticker.html' 
};
const cardContainer1 = document.getElementById('card-1');
if (cardContainer1) {
    new Card(cardContainer1, cardData1);
}