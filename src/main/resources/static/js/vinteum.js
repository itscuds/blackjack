// Mesa de 21 em 3D. Não precisa mexer neste arquivo:
// ele só conversa com o JogoApiController (/api/...).
// As cartas são desenhadas a partir do nome que a Carta devolve em getImagem(),
// por exemplo "AceHearts.png", "10Clubs.png" ou "KingSpades.png".

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const el = id => document.getElementById(id);

// ---------- cena, câmera e luz ----------

const container = document.getElementById('cena');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b2a24);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-1.2, 9, 7.5);

const controles = new OrbitControls(camera, renderer.domElement);
controles.target.set(-1.2, 0, 0.3);
controles.enablePan = false;
controles.minDistance = 5;
controles.maxDistance = 18;
controles.maxPolarAngle = Math.PI * 0.42;

scene.add(new THREE.HemisphereLight(0xfff4e0, 0x1b2a24, 1.0));
const luminaria = new THREE.SpotLight(0xfff1d6, 60, 30, Math.PI / 4, 0.5, 1.6);
luminaria.position.set(-1, 9, 1);
luminaria.target.position.set(-1, 0, 0);
luminaria.castShadow = true;
luminaria.shadow.mapSize.set(2048, 2048);
scene.add(luminaria, luminaria.target);

// ---------- mesa ----------

const feltro = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 0.2, 64, 1, false),
    new THREE.MeshStandardMaterial({ color: 0x1f6b45, roughness: 0.95 })
);
feltro.scale.set(1, 1, 0.62);
feltro.position.y = -0.1;
feltro.receiveShadow = true;
scene.add(feltro);

const borda = new THREE.Mesh(
    new THREE.TorusGeometry(6, 0.28, 16, 80),
    new THREE.MeshStandardMaterial({ color: 0x5a3216, roughness: 0.6 })
);
borda.rotation.x = Math.PI / 2;
borda.scale.set(1, 0.62, 1);
borda.castShadow = true;
scene.add(borda);

// faixas pintadas no feltro
function texto(conteudo, tamanho, cor) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.font = `bold ${tamanho}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = cor;
    ctx.fillText(conteudo, 512, 64);
    const textura = new THREE.CanvasTexture(canvas);
    textura.colorSpace = THREE.SRGBColorSpace;
    const malha = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 1),
        new THREE.MeshBasicMaterial({ map: textura, transparent: true })
    );
    malha.rotation.x = -Math.PI / 2;
    return malha;
}

const faixa = texto('A MESA JOGA DEPOIS DE VOCÊ', 40, 'rgba(246,231,193,0.5)');
faixa.position.set(0, 0.01, 0.05);
scene.add(faixa);

// ---------- cartas desenhadas ----------

const NAIPES = {
    Hearts: { simbolo: '♥', cor: '#c62828' },
    Diamonds: { simbolo: '♦', cor: '#c62828' },
    Spades: { simbolo: '♠', cor: '#1a1a1a' },
    Clubs: { simbolo: '♣', cor: '#1a1a1a' },
};
const FIGURAS = { Ace: 'A', Jack: 'J', Queen: 'Q', King: 'K' };
const texturas = new Map();

function retangulo(ctx, x, y, l, a, r) {
    ctx.beginPath();
    ctx.roundRect(x, y, l, a, r);
}

function desenharVerso() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 356;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    retangulo(ctx, 0, 0, 256, 356, 18);
    ctx.fill();
    ctx.fillStyle = '#7b1e1e';
    retangulo(ctx, 12, 12, 232, 332, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(246,231,193,0.5)';
    ctx.lineWidth = 3;
    for (let i = -356; i < 256; i += 18) {
        ctx.beginPath();
        ctx.moveTo(i, 12);
        ctx.lineTo(i + 356, 344);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(i + 356, 12);
        ctx.lineTo(i, 344);
        ctx.stroke();
    }
    ctx.fillStyle = '#7b1e1e';
    ctx.beginPath();
    ctx.arc(128, 178, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f6e7c1';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('21', 128, 180);
    return canvas;
}

function desenharFrente(nome) {
    // "AceHearts.png" -> valor "A", naipe Hearts
    const partes = nome.replace('.png', '').match(/^(Ace|Jack|Queen|King|\d+)(Hearts|Diamonds|Spades|Clubs)$/);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 356;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fbfaf5';
    retangulo(ctx, 0, 0, 256, 356, 18);
    ctx.fill();
    ctx.strokeStyle = '#d6d0c0';
    ctx.lineWidth = 3;
    ctx.stroke();

    if (!partes) {
        // nome que a tela não reconhece: mostra o erro na própria carta
        ctx.fillStyle = '#c62828';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('imagem?', 128, 160);
        ctx.font = '18px monospace';
        ctx.fillText(String(nome).slice(0, 18), 128, 200);
        return canvas;
    }

    const valor = FIGURAS[partes[1]] ?? partes[1];
    const naipe = NAIPES[partes[2]];
    ctx.fillStyle = naipe.cor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // cantos
    ctx.font = 'bold 46px Georgia, serif';
    ctx.fillText(valor, 34, 40);
    ctx.font = '38px serif';
    ctx.fillText(naipe.simbolo, 34, 82);
    ctx.save();
    ctx.translate(222, 316);
    ctx.rotate(Math.PI);
    ctx.font = 'bold 46px Georgia, serif';
    ctx.fillText(valor, 0, 0);
    ctx.font = '38px serif';
    ctx.fillText(naipe.simbolo, 0, 42);
    ctx.restore();

    // centro
    if (FIGURAS[partes[1]] && valor !== 'A') {
        ctx.strokeStyle = naipe.cor;
        ctx.lineWidth = 4;
        retangulo(ctx, 62, 92, 132, 172, 10);
        ctx.stroke();
        ctx.font = 'bold 96px Georgia, serif';
        ctx.fillText(valor, 128, 162);
        ctx.font = '52px serif';
        ctx.fillText(naipe.simbolo, 128, 230);
    } else {
        ctx.font = valor === 'A' ? '150px serif' : '110px serif';
        ctx.fillText(naipe.simbolo, 128, 182);
    }
    return canvas;
}

function textura(nome) {
    if (!texturas.has(nome)) {
        const canvas = nome === 'verso' ? desenharVerso() : desenharFrente(nome);
        const t = new THREE.CanvasTexture(canvas);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texturas.set(nome, t);
    }
    return texturas.get(nome);
}

const ESCONDIDA = 'BlueBackVertical.png';
const LARGURA_CARTA = 0.9;
const ALTURA_CARTA = 1.25;
const geometriaCarta = new THREE.PlaneGeometry(LARGURA_CARTA, ALTURA_CARTA);

// uma carta é um grupo com a frente virada para cima (+y) e o verso para baixo
function criarCarta(nome) {
    const g = new THREE.Group();
    const frente = new THREE.Mesh(geometriaCarta, new THREE.MeshStandardMaterial({ map: textura(nome === ESCONDIDA ? 'verso' : nome), roughness: 0.5 }));
    frente.rotation.x = -Math.PI / 2;
    frente.position.y = 0.003;
    frente.castShadow = true;
    const verso = new THREE.Mesh(geometriaCarta, new THREE.MeshStandardMaterial({ map: textura('verso'), roughness: 0.5 }));
    verso.rotation.x = Math.PI / 2;
    verso.castShadow = true;
    g.add(frente, verso);
    g.userData = { nome, frente };
    return g;
}

// ---------- monte ----------

const MONTE = new THREE.Vector3(4.2, 0, -1.2);
const monte = new THREE.Group();
monte.position.copy(MONTE);
monte.rotation.y = -0.25;
scene.add(monte);
const camadaMonte = new THREE.MeshStandardMaterial({ color: 0xf2efe6 });
const topoMonte = new THREE.Mesh(geometriaCarta, new THREE.MeshStandardMaterial({ map: textura('verso') }));
topoMonte.rotation.x = -Math.PI / 2;
monte.add(topoMonte);
const blocoMonte = new THREE.Mesh(new THREE.BoxGeometry(LARGURA_CARTA, 1, ALTURA_CARTA), camadaMonte);
blocoMonte.castShadow = true;
monte.add(blocoMonte);

function alturaDoMonte(quantidade) {
    const h = Math.max(0.002, quantidade * 0.006);
    blocoMonte.scale.y = h;
    blocoMonte.position.y = h / 2;
    topoMonte.position.y = h + 0.002;
    monte.visible = quantidade > 0;
}

// ---------- animação ----------

const animacoes = [];

function animar(duracao, aoAtualizar) {
    return new Promise(resolve => animacoes.push({ tempo: 0, duracao, aoAtualizar, resolve }));
}

const suave = k => 1 - Math.pow(1 - k, 3);
const esperar = ms => new Promise(r => setTimeout(r, ms));

function lugar(lado, indice, total) {
    const espaco = 1.05;
    const z = lado === 'mesa' ? -1.55 : 1.75;
    return new THREE.Vector3((indice - (total - 1) / 2) * espaco - 0.6, 0.01 + indice * 0.004, z);
}

async function distribuir(carta, destino) {
    const inicio = MONTE.clone().setY(blocoMonte.scale.y + 0.02);
    const viradaParaCima = carta.userData.nome !== ESCONDIDA;
    carta.position.copy(inicio);
    carta.rotation.set(0, -0.25, Math.PI);
    scene.add(carta);
    await animar(0.45, k => {
        const s = suave(k);
        carta.position.lerpVectors(inicio, destino, s);
        carta.position.y += Math.sin(k * Math.PI) * 0.8;
        carta.rotation.y = -0.25 * (1 - s);
        carta.rotation.z = viradaParaCima ? Math.PI * (1 - s) : Math.PI;
    });
}

async function revelar(carta, nome) {
    carta.userData.frente.material.map = textura(nome);
    carta.userData.frente.material.needsUpdate = true;
    carta.userData.nome = nome;
    const y = carta.position.y;
    await animar(0.45, k => {
        carta.rotation.z = Math.PI * (1 - suave(k));
        carta.position.y = y + Math.sin(k * Math.PI) * 0.6;
    });
}

async function reorganizar(cartas, lado, total) {
    const inicios = cartas.map(c => c.position.clone());
    const destinos = cartas.map((_, i) => lugar(lado, i, total));
    await animar(0.25, k => cartas.forEach((c, i) => c.position.lerpVectors(inicios[i], destinos[i], suave(k))));
}

// ---------- estado do jogo na tela ----------

const naMesa = { jogador: [], mesa: [] };
let ocupado = false;

async function aplicar(estado, recolher = false) {
    if (recolher) {
        const todas = [...naMesa.jogador, ...naMesa.mesa];
        await animar(0.35, k => todas.forEach(c => {
            c.position.lerp(MONTE, k * 0.3);
            c.position.y += 0.03;
        }));
        todas.forEach(c => scene.remove(c));
        naMesa.jogador = [];
        naMesa.mesa = [];
        esconderResultado();
        el('pontosJogador').textContent = '…';
        el('pontosMesa').textContent = '…';
    }

    alturaDoMonte(estado.cartasNoMonte + 10);

    // cartas iniciais saem alternadas, como num cassino
    const filas = [
        ['jogador', estado.cartasJogador],
        ['mesa', estado.cartasMesa],
    ];
    const pendentes = [];
    const maior = Math.max(estado.cartasJogador.length, estado.cartasMesa.length);
    for (let i = 0; i < maior; i++) {
        for (const [lado, nomes] of filas) {
            if (i < nomes.length) pendentes.push([lado, i, nomes]);
        }
    }

    for (const [lado, i, nomes] of pendentes) {
        const lista = naMesa[lado];
        if (i < lista.length) {
            if (lista[i].userData.nome !== nomes[i]) await revelar(lista[i], nomes[i]);
            continue;
        }
        if (lista.length > 0 && i === lista.length) await reorganizar(lista, lado, nomes.length);
        const carta = criarCarta(nomes[i]);
        lista.push(carta);
        await distribuir(carta, lugar(lado, i, nomes.length));
        if (lado === 'mesa' && estado.acabou) await esperar(250);
    }

    alturaDoMonte(estado.cartasNoMonte);
    mostrar(estado);
}

// ---------- painel ----------

const placar = { vitorias: 0, derrotas: 0, empates: 0 };
let contado = true;

function mostrar(estado) {
    el('pontosJogador').textContent = estado.pontosJogador;
    el('pontosMesa').textContent = estado.pontosMesa ?? '?';
    el('pedir').disabled = estado.acabou || ocupado;
    el('parar').disabled = estado.acabou || ocupado;

    if ([...el('estilo').options].some(o => o.value === estado.estilo)) {
        el('estilo').value = estado.estilo;
    }

    if (estado.acabou && estado.resultado) {
        mostrarResultado(estado.resultado);
        if (!contado) {
            contado = true;
            if (estado.resultado.includes('ganhou')) placar.vitorias++;
            else if (estado.resultado.includes('perdeu')) placar.derrotas++;
            else placar.empates++;
            el('vitorias').textContent = placar.vitorias;
            el('derrotas').textContent = placar.derrotas;
            el('empates').textContent = placar.empates;
        }
    }
}

function mostrarResultado(texto) {
    el('resultado').textContent = texto;
    el('resultado').classList.add('visivel');
}

function esconderResultado() {
    el('resultado').classList.remove('visivel');
}

async function acao(caminho, recolher = false) {
    if (ocupado) return;
    ocupado = true;
    el('pedir').disabled = true;
    el('parar').disabled = true;
    try {
        const r = await fetch('/api/' + caminho, { method: 'POST' });
        if (!r.ok) throw new Error(r.status);
        const estado = await r.json();
        if (recolher) contado = false;
        await aplicar(estado, recolher);
        ocupado = false;
        mostrar(estado);
    } catch (erro) {
        ocupado = false;
        mostrarResultado('Erro no servidor (veja o console do Spring)');
    }
}

el('pedir').addEventListener('click', () => acao('pedir'));
el('parar').addEventListener('click', () => acao('parar'));
el('novo').addEventListener('click', () => acao('novo', true));
el('estilo').addEventListener('change', async () => {
    await fetch('/api/estilo/' + encodeURIComponent(el('estilo').value), { method: 'POST' });
});

async function iniciar() {
    const [rEstado, rEstilos] = await Promise.all([fetch('/api/estado'), fetch('/api/estilos')]);
    const estilos = await rEstilos.json();
    for (const nome of estilos) {
        const opcao = document.createElement('option');
        opcao.value = nome;
        opcao.textContent = nome;
        el('estilo').appendChild(opcao);
    }
    const estado = await rEstado.json();
    contado = estado.acabou;
    ocupado = true;
    await aplicar(estado);
    ocupado = false;
    mostrar(estado);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- laço principal ----------

const relogio = new THREE.Clock();

function quadro() {
    const dt = Math.min(relogio.getDelta(), 0.05);
    for (let i = animacoes.length - 1; i >= 0; i--) {
        const a = animacoes[i];
        a.tempo += dt;
        const k = Math.min(a.tempo / a.duracao, 1);
        a.aoAtualizar(k);
        if (k === 1) {
            animacoes.splice(i, 1);
            a.resolve();
        }
    }
    controles.update();
    renderer.render(scene, camera);
    requestAnimationFrame(quadro);
}

iniciar();
quadro();
