const kilosInput = document.getElementById('kilosInput');
const buttonAgregar = document.getElementById('buttonAgregar');
const buttonCalcular = document.getElementById('buttonCalcular');
const listaProduccion = document.getElementById('listaProduccion');
const listaIngredientes = document.getElementById('listaIngredientes');
const zonaResultados = document.getElementById('zonaResultados');
const radioBatches = document.getElementById('modoBatches');
const labelInput = document.getElementById('labelInput');
const selectorProducto = document.getElementById('selectorProducto');

// ESTADO DEL SISTEMA
let colaDeProduccion = []; 
let ajustesPedido = {}; // Guarda los ajustes manuales (+/-)

// --- DEFINICIÓN DE IMÁGENES PNG ---
const iconBolson     = `<img src="img/bolson.png" class="icono-bolson" alt="Bolsón">`;
const iconBolsa      = `<img src="img/bolsa.png" class="icono-prod" alt="Bolsa">`;
const iconPallet     = `<img src="img/pallet.png" class="icono-prod" alt="Pallet">`;
const iconBalanza    = `<img src="img/balanza.png" class="icono-balanza" alt="Balanza">`; 
const iconPrepesada  = `<img src="img/prepesada.png" class="icono-prod" alt="Prepesada">`;

// --- BASE DE DATOS DE RECETAS ---
const todasLasRecetas = {
    "pastelera60": {
        nombre: "Pastelera Código 60",
        batchTotal: 1547,
        premezclas: ["Bolsa Polvo 1 (4kg)", "Bolsa Polvo 2 (4kg)"],
        ingredientes: {
            "Azúcar Impalpable": { base: 1123, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Almidón Paselli / Emjel": { base: 250, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Entera en Polvo": { base: 125, pesoBolsa: 25, bolsasPallet: 40 },
            "Alginato de Sodio": { base: 33.75, pesoBolsa: 25, bolsasPallet: 40 },
            "Goma Guar": { base: 8.25, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "pasteleraFacturera": {
        nombre: "Pastelera Facturera 4 kg",
        batchTotal: 1547,
        premezclas: ["Bolsa Polvo 1 (Facturera)", "Bolsa Polvo 2 (Facturera)"],
        ingredientes: {
            "Azúcar Impalpable": { base: 827, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Azúcar Refinada": { base: 250, pesoBolsa: 25, bolsasPallet: 40 },
            "Almidón Glutagel": { base: 250, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Entera en Polvo": { base: 175, pesoBolsa: 25, bolsasPallet: 40 },
            "Goma Guar": { base: 8.25, pesoBolsa: 25, bolsasPallet: 40 },
            "Alginato de Sod

    





