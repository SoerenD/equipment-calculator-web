import { Element } from './element';

const SK_FACTOR = 0.025;

export interface Equipment {
    name: string;
    weight: number;
    ranged: boolean;
    element: Element;
    ap: number;
    vp: number;
    hp: number;
    mp: number;
    requiredWaffenschmiede: number;
}

export function totalValue(value: number, schmiedekunst: number): number {
    if (value <= 0) return value;
    const skBonus = schmiedekunst * SK_FACTOR;
    return value + Math.round(skBonus * value);
}

export function ap(equipment: Equipment, schmiedekunst: number): number {
    return totalValue(equipment.ap, schmiedekunst);
}

export function vp(equipment: Equipment, schmiedekunst: number): number {
    return totalValue(equipment.vp, schmiedekunst);
}

export function hp(equipment: Equipment, schmiedekunst: number): number {
    return totalValue(equipment.hp, schmiedekunst);
}

export function mp(equipment: Equipment, schmiedekunst: number): number {
    return totalValue(equipment.mp, schmiedekunst);
}

export const ALL_HELMETS: Array<Equipment> = [
    equipment(0, 0, 0, 0, 0, false, Element.NONE, 0, 'besser nix'),
    equipment(0, 5, 5, 0, 2, false, Element.NONE, 1, 'Federkappe'),
    equipment(0, 5, 0, 4, 2, false, Element.NONE, 1, 'Zauberhut'),
    equipment(3, 16, 19, 0, 18, false, Element.NONE, 1, 'Eisenhelm'),
    equipment(13, 28, 25, 0, 30, false, Element.NONE, 1, 'Schädelplatte'),
    equipment(15, -8, -10, 0, 10, false, Element.NONE, 1, 'Spiegelhelm'),
    equipment(15, 55, 45, 0, 52, false, Element.EARTH, 3, 'Totenschädelhelm'),
    equipment(10, 60, 50, 0, 50, false, Element.NONE, 3, 'Normannenhelm'),
    equipment(35, 50, 30, 20, 75, false, Element.FIRE, 4, 'Gehörnter Helm'),
    equipment(0, 0, 0, 29, 13, false, Element.NONE, 4, 'Diadem der Toten'),
    equipment(-20, 50, 50, 0, 40, false, Element.NONE, 4, 'Wolfsmaske'),
    equipment(0, 15, 5, 20, 38, false, Element.AIR, 4, 'Diadem'),
    equipment(-135, 30, 150, 0, 95, false, Element.NONE, 5, 'Helm des Friedens'),
    equipment(10, 45, 95, 0, 60, false, Element.NONE, 5, 'Drachenhelm'),
    equipment(16, 46, 53, 0, 32, false, Element.FIRE, 5, 'Heiliger Helm des Drachentöters'),
    equipment(30, 30, 50, 0, 45, false, Element.ICE, 6, 'Kalte Maske'),
    equipment(0, 25, 5, 30, 9, false, Element.NONE, 7, 'Athenes Weisheit'),
    equipment(-30, 200, 0, 10, 98, false, Element.AIR, 7, 'Tarnkappe'),
    equipment(0, 0, 200, 0, 20, false, Element.NONE, 9, 'Kessel des Küchenmeisters'),
    equipment(95, 50, 80, 90, 140, false, Element.NONE, 9, 'Helm der Requisition'),
    equipment(110, 90, 120, 0, 90, false, Element.NONE, 10, 'Knochenhelm des Ketzers'),
    equipment(220, 90, 175, 30, 120, false, Element.NONE, 10, 'Verzierter Stahlhelm'),
];

export const ALL_ARMOUR: Array<Equipment> = [
    equipment(0, 0, 0, 0, 0, false, Element.NONE, 0, 'besser nix'),
    equipment(0, 3, 5, 0, 2, false, Element.NONE, 0, 'Flickenpanzer'),
    equipment(0, 5, 15, 0, 5, false, Element.NONE, 1, 'Lederrüstung'),
    equipment(5, 25, 25, 0, 12, false, Element.NONE, 1, 'Dornenweste'),
    equipment(10, 10, 10, 0, 8, false, Element.NONE, 1, 'Lederharnisch'),
    equipment(10, 50, 30, 0, 35, false, Element.NONE, 1, 'Kettenhemd'),
    equipment(10, 25, 25, 0, 20, false, Element.NONE, 1, 'Dunkle Rüstung'),
    equipment(10, 32, 31, 0, 20, false, Element.NONE, 2, 'Kriegsausrüstung'),
    equipment(0, 46, 39, 25, 34, false, Element.NONE, 3, 'Himmlischer Plattenpanzer'),
    equipment(0, 60, 0, 15, 20, false, Element.NONE, 3, 'Zakaras Verschwindibusrobe'),
    equipment(-10, 105, -30, 0, 75, false, Element.NONE, 3, 'Eiserne Jungfrau'),
    equipment(0, 35, 50, 0, 35, false, Element.EARTH, 3, 'Maulwurfsrüstung'),
    equipment(0, 50, 90, 0, 65, false, Element.NONE, 4, 'Titanpanzer'),
    equipment(50, 20, 0, 10, 20, false, Element.NONE, 4, 'Neptunsrobe'),
    equipment(55, 95, -50, 0, 80, false, Element.FIRE, 4, 'Lavarüstung'),
    equipment(-5, 50, 30, 0, 25, false, Element.ICE, 5, 'Morgenreif-Harnisch'),
    equipment(-190, 90, 230, 0, 115, false, Element.NONE, 5, 'Rüstung des Friedens'),
    equipment(0, 5, 0, 30, 15, false, Element.NONE, 5, 'Einhornfell'),
    equipment(0, 50, 50, 0, 20, false, Element.EARTH, 5, 'Erdenmantel'),
    equipment(0, 150, 150, 0, 150, false, Element.NONE, 5, 'Paladin-Rüstung'),
    equipment(10, 98, 98, 0, 45, false, Element.FIRE, 5, 'Heilige Rüstung des Drachentöters'),
    equipment(0, 70, 100, 0, 95, false, Element.EARTH, 5, 'Obsidianpanzer'),
    equipment(0, 140, 200, 0, 186, false, Element.AIR, 6, 'Windmacht'),
    equipment(10, 300, 225, 0, 100, false, Element.NONE, 7, 'Plattenpanzer'),
    equipment(75, 315, 320, 0, 120, false, Element.NONE, 8, 'Gigas Rüstung'),
    equipment(50, 150, 150, 5, 100, false, Element.AIR, 8, 'Gewitterrüstung'),
    equipment(0, 200, -25, 0, 15, false, Element.NONE, 9, 'Tückische Rüstung'),
    equipment(0, 1000, 0, 0, 300, false, Element.EARTH, 10, 'Trutzrüstung'),
    equipment(380, 600, 550, 0, 470, false, Element.FIRE, 10, 'Silberner Prunkharnisch'),
    equipment(200, 370, 410, 0, 320, false, Element.EARTH, 10, 'Rostfreie Rüstung eines toten Helden'),
    equipment(100, 200, 140, 0, 75, false, Element.NONE, 10, 'Geschenk des Himmels'),
    equipment(-70, 800, 600, 0, 290, false, Element.NONE, 10, 'Furcht'),
];

export const ALL_SHIELDS: Array<Equipment> = [
    equipment(0, 0, 0, 0, 0, false, Element.NONE, 0, 'besser nix'),
    equipment(0, 15, 5, 0, 5, false, Element.NONE, 1, 'Holzschild'),
    equipment(0, 18, 23, 0, 14, false, Element.NONE, 1, 'Rundschild'),
    equipment(25, -13, -15, 0, 20, false, Element.NONE, 1, 'Schild des Perseus'),
    equipment(10, 35, 20, 0, 20, false, Element.NONE, 1, 'Dornenschild'),
    equipment(15, 10, 9, 0, 13, false, Element.ICE, 3, 'Armschienen'),
    equipment(0, 25, 40, 10, 20, false, Element.ICE, 3, 'Wappenschild'),
    equipment(-10, 18, 11, 15, 9, false, Element.ICE, 3, 'Polarkristall'),
    equipment(5, 34, 23, 45, 32, false, Element.FIRE, 3, 'Brennender Schild'),
    equipment(15, 20, 20, 0, 24, false, Element.EARTH, 3, 'Stachelschild'),
    equipment(10, 55, 55, 0, 33, false, Element.NONE, 3, 'Turmschild'),
    equipment(0, 30, -10, 0, 25, false, Element.AIR, 3, 'Sturmschild'),
    equipment(34, 23, 5, 0, 18, false, Element.AIR, 4, 'Tornadoschild'),
    equipment(5, 60, 190, 0, 85, false, Element.NONE, 5, 'Drachenschild'),
    equipment(15, 65, 75, 0, 48, false, Element.AIR, 6, 'Sturmblocker'),
    equipment(0, 5, 5, 20, 10, false, Element.AIR, 6, 'Federschild'),
    equipment(20, 98, 98, 0, 55, false, Element.FIRE, 6, 'Heiliger Schild des Drachentöters'),
    equipment(15, 70, 110, 0, 75, false, Element.EARTH, 7, 'Knochenschild'),
    equipment(50, 150, 0, 0, 15, false, Element.NONE, 7, 'Orkenschild'),
    equipment(-180, 255, 120, 0, 120, false, Element.NONE, 8, 'Schild des Friedens'),
    equipment(-135, 250, 230, 0, 140, false, Element.ICE, 8, 'Frostwurmschuppen'),
    equipment(60, 200, 105, 30, 40, false, Element.NONE, 10, 'Gewebter Harnisch des Ketzers'),
    equipment(30, 70, 110, 0, 20, false, Element.ICE, 10, 'Panzer der Schildkrötenprinzessin'),
    equipment(50, 160, 110, 0, 30, false, Element.FIRE, 10, 'Brustkorb eines Erzfeindes'),
    equipment(50, 160, 110, 0, 30, false, Element.ICE, 10, 'Brustkorb eines kalten Erzfeindes'),
];

export const ALL_ACCESSORIES: Array<Equipment> = [
    equipment(0, 0, 0, 0, 0, false, Element.NONE, 0, 'besser nix'),
    equipment(0, 3, 2, 0, 0, false, Element.NONE, 1, 'Ranzige Stiefel'),
    equipment(0, 5, 5, 0, 1, false, Element.NONE, 1, 'Bronzering'),
    equipment(0, 0, 0, 8, 1, false, Element.NONE, 1, 'geflügelte Sandalen'),
    equipment(5, 15, 10, 0, 5, false, Element.NONE, 1, 'Falkenring'),
    equipment(0, 0, 0, 0, -1, false, Element.NONE, 1, 'Blindenhund'),
    equipment(0, 0, 15, 10, 15, false, Element.NONE, 2, 'Voodoopuppe'),
    equipment(0, 12, 12, 5, 10, false, Element.NONE, 2, 'Tarot Karten'),
    equipment(0, 0, 0, 15, 20, false, Element.NONE, 2, 'Feenamulett'),
    equipment(0, 25, 40, 0, 14, false, Element.NONE, 3, 'Schutzring'),
    equipment(0, 25, 50, 0, 22, false, Element.FIRE, 3, 'Höllenauge'),
    equipment(45, -30, -35, 0, 28, false, Element.NONE, 3, 'Glorienring'),
    equipment(0, 30, 90, 0, 36, false, Element.NONE, 4, 'Elfenbeinamulett'),
    equipment(45, 35, 15, 0, 28, false, Element.EARTH, 4, 'Knochenring'),
    equipment(-70, 50, 115, 0, 30, false, Element.NONE, 4, 'Amulett des Friedens'),
    equipment(0, 110, 0, 0, 42, false, Element.NONE, 4, 'Harnischamulett'),
    equipment(-12, 12, 115, 0, 58, false, Element.NONE, 4, 'Lindwurmamulett'),
    equipment(0, 0, 0, 0, -20, false, Element.NONE, 4, 'Amulett der Kraft'),
    equipment(0, 80, 0, 0, 15, false, Element.FIRE, 5, 'Feuerring'),
    equipment(0, 0, 0, 0, -30, false, Element.NONE, 5, 'Kraftring'),
    equipment(0, 0, 0, 0, -30, false, Element.NONE, 5, 'Ogerkraft-Amulett'),
    equipment(0, 0, 0, 30, 50, false, Element.NONE, 5, 'Ring des Geistes'),
    equipment(0, 0, 0, 45, 25, false, Element.NONE, 6, 'Sonnenring'),
    equipment(-800, -400, 0, 0, 450, false, Element.NONE, 7, 'Riesiger ausgehölter Baumstumpf'),
    equipment(173, 97, 224, 5, 100, false, Element.FIRE, 8, 'Phönixfederschmuck'),
    equipment(50, 60, 45, 20, 240, false, Element.NONE, 8, 'Aldeas Halskette'),
    equipment(110, 150, 225, 0, 45, false, Element.NONE, 9, 'Heiliger Wikingerring'),
    equipment(0, 100, 50, 0, -50, false, Element.AIR, 9, 'Eiserne Krafthandschuhe'),
    equipment(0, 0, 0, 100, 5, false, Element.NONE, 10, 'Auge der Seherin'),
    equipment(140, 220, 310, 0, 60, false, Element.FIRE, 10, 'Ring des Spatzenkönigs'),
    equipment(140, 220, 310, 0, 60, false, Element.ICE, 10, 'Ring der Mäusekönigin'),
    equipment(0, 0, 0, 0, -57, false, Element.NONE, 10, 'Ring der 1000 Möglichkeiten'),
];

export const ALL_WEAPONS: Array<Equipment> = [
    equipment(0, 0, 0, 0, 0, false, Element.NONE, 0, 'besser nix'),
    equipment(3, 0, 0, 0, 2, false, Element.NONE, 0, 'Angespitzer Holzstock'),
    equipment(35, 10, 10, 0, 9, false, Element.NONE, 1, 'Kurzschwert'),
    equipment(45, 0, 0, 0, 25, true, Element.NONE, 1, 'Leichte Armbrust'),
    equipment(10, 0, 0, 0, 3, true, Element.NONE, 1, 'Wurfpfeile'),
    equipment(18, 0, 0, 0, 5, true, Element.NONE, 1, 'Kurzbogen'),
    equipment(-10, 0, 0, 5, 8, true, Element.ICE, 1, 'Harfe der Banshee'),
    equipment(15, 0, 0, 10, 15, false, Element.NONE, 1, 'Langdolch der Geister'),
    equipment(25, 15, 0, 0, 10, true, Element.NONE, 1, 'Stabschleuder'),
    equipment(10, -5, 0, 0, 10, false, Element.AIR, 1, 'Federschwert'),
    equipment(61, -45, -49, 0, 51, false, Element.FIRE, 1, 'Magmaaxt'),
    equipment(20, 5, 5, 0, 12, false, Element.AIR, 1, 'Wirbelwindfaust'),
    equipment(10, 5, 3, 0, 10, false, Element.ICE, 1, 'Eisdolch'),
    equipment(-40, -20, 0, 15, 7, false, Element.FIRE, 2, 'Novizenstab'),
    equipment(30, 30, 0, 0, 35, false, Element.AIR, 2, 'Tanzender Krummsäbel'),
    equipment(37, 9, 35, 0, 33, false, Element.NONE, 2, 'Krummsäbel'),
    equipment(40, 20, 20, 0, 50, false, Element.ICE, 3, 'Froststab'),
    equipment(75, 0, 0, 0, 30, true, Element.NONE, 3, 'Schwere Armbrust'),
    equipment(60, -12, 0, 0, 40, false, Element.ICE, 3, 'Frostbrand'),
    equipment(20, 0, 5, 10, 20, true, Element.AIR, 3, 'Lichtbogen'),
    equipment(90, 50, -90, -50, 75, false, Element.NONE, 3, 'Chronitonklingen'),
    equipment(45, 38, 23, 0, 39, false, Element.FIRE, 3, 'Feuerhellebarde'),
    equipment(25, 0, 0, 0, 8, true, Element.EARTH, 3, 'Dreckschleuder'),
    equipment(95, 0, 0, 0, 75, false, Element.EARTH, 4, 'Erdvernichter'),
    equipment(45, 0, 0, 0, 20, true, Element.AIR, 4, 'Bogen des Windes'),
    equipment(100, 50, 30, -100, 120, false, Element.EARTH, 4, 'Zwergischer Schmiedehammer'),
    equipment(40, 0, 0, 0, 25, true, Element.FIRE, 4, 'Feuerbogen'),
    equipment(44, 20, 0, 0, 20, false, Element.NONE, 5, 'Bo'),
    equipment(95, -15, 5, 0, 60, false, Element.EARTH, 5, 'Zwergenaxt'),
    equipment(145, -55, 0, 0, 75, true, Element.NONE, 5, 'Elfischer Jagdbogen'),
    equipment(-200, -150, 0, 40, 30, false, Element.FIRE, 5, 'Flammenstab'),
    equipment(50, 0, 0, 0, 20, true, Element.ICE, 5, 'Eisbogen'),
    equipment(250, -45, -5, 0, 100, false, Element.NONE, 5, 'Heliosklinge'),
    equipment(128, -16, 0, 0, 67, true, Element.FIRE, 5, 'Schwere Balliste des Drachentöters'),
    equipment(80, 0, 30, 10, 100, false, Element.ICE, 5, 'Eislanze'),
    equipment(140, 60, 45, 0, 132, false, Element.FIRE, 5, 'Feuerkrallen'),
    equipment(170, -170, 120, 0, 112, false, Element.NONE, 5, 'Große Spaltaxt'),
    equipment(175, -40, 0, 0, 78, true, Element.FIRE, 6, 'Dämonenarmbrust'),
    equipment(85, -5, -5, 0, 33, true, Element.AIR, 6, 'Sturmbogen'),
    equipment(155, -30, -10, 0, 60, true, Element.EARTH, 6, 'Knochenarmbrust'),
    equipment(110, -25, 0, 0, 40, true, Element.ICE, 7, 'Splitterbogen'),
    equipment(250, 25, 25, 0, 225, false, Element.EARTH, 7, 'Titanengladius'),
    equipment(100, 30, 5, 0, 40, false, Element.ICE, 7, 'Eissäbel'),
    equipment(200, 50, 0, 0, 50, false, Element.FIRE, 8, 'Blutbeflecktes Schwert des Zorns'),
    equipment(400, 120, 120, 0, 155, false, Element.NONE, 8, 'Götterzucht'),
    equipment(400, 0, 0, 50, 65, false, Element.ICE, 9, 'Hammer des Gletscherkönigs'),
    equipment(410, -10, -10, 0, 235, false, Element.FIRE, 9, 'Höllenschwert'),
    equipment(510, 60, 15, 0, 400, false, Element.ICE, 9, 'Dimensionenklingen'),
    equipment(100, 0, 0, 0, 40, true, Element.FIRE, 9, 'Karmesinroter Bogen'),
    equipment(100, 0, 0, 200, 35, false, Element.NONE, 9, 'Stab der Erleuchtung'),
    equipment(600, 200, 200, 20, 500, false, Element.AIR, 10, 'Mjölnir'),
    equipment(400, 200, 200, 0, 103, false, Element.NONE, 10, 'Verzauberte Knochenaxt'),
    equipment(130, 0, 0, 0, 35, true, Element.NONE, 10, 'Uralter Sauwerfer'),
    equipment(180, 60, 20, 0, 55, false, Element.ICE, 10, 'Tödlicher Splitter'),
];

function equipment(
    ap: number,
    vp: number,
    hp: number,
    mp: number,
    weight: number,
    ranged: boolean,
    element: Element,
    requiredWaffenschmiede: number,
    name: string,
) {
    return {
        name,
        weight,
        ranged,
        element,
        ap,
        vp,
        hp,
        mp,
        requiredWaffenschmiede,
    };
}
