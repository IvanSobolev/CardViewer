import { Card } from '../src/Card.js';

const BASE_URL = import.meta.env.BASE_URL;

const cardData1 = {
    rarity: 'Signed',
    backgroundImage: `${BASE_URL}background/card1.png`,
    skinImage: `${BASE_URL}skins/skin.png`,
    packLogoImage: `${BASE_URL}logos/pack1.jpg`,
    stickerUrl: `${BASE_URL}stickers/signature-sticker.html`
};
const cardContainer1 = document.getElementById('card-1');
if (cardContainer1) {
    new Card(cardContainer1, cardData1);
}