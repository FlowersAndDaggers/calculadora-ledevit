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
            "Alginato de Sodio": { base: 30, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "brownie63": {
        nombre: "Brownie (63P-00)",
        batchTotal: 866.6,
        premezclas: ["Bolsa de Arranque (Polvos 1 - 3 bolsas int)", "Bolsa de Arranque (Polvos 2)"],
        ingredientes: {
            "Azúcar Refinada": { base: 600, pesoBolsa: 25, bolsasPallet: 40 },
            "Almidón de Maíz": { base: 80, pesoBolsa: 25, bolsasPallet: 40 },
            "Harina de Arroz Tahin/Padoan": { base: 92, pesoBolsa: 25, bolsasPallet: 40 },
            "Cacao Rojo Alcalino": { base: 83, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "doradura97": {
        nombre: "Doradura (97P-01)",
        batchTotal: 508.61,
        premezclas: ["JULIANO+DORADURA (Polvos 1)"],
        ingredientes: {
            "Lacprodan 80 instant / Sooro": { base: 390, pesoBolsa: 20, bolsasPallet: 40 },
            "Dextrosa": { base: 78, pesoBolsa: 25, bolsasPallet: 40 },
            "Mirathick 603": { base: 29.5, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "merengue06": {
        nombre: "Merengue 1200 kg (06P-04)",
        batchTotal: 1287.8,
        premezclas: ["Bolsa Arranque MERENGUE+JULIANO (1,5 kg)"],
        ingredientes: {
            "Azúcar Impalpable KEUKEN": { base: 1150, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Albúmina de Huevo": { base: 75, pesoBolsa: 20, bolsasPallet: 40 },
            "Paselli BC / Emjel EP 820 C": { base: 50, pesoBolsa: 25, bolsasPallet: 40 },
            "Alginato de Sodio": { base: 8.3, pesoBolsa: 25, bolsasPallet: 40 },
            "Goma Guar": { base: 3, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "mousseChocoKilo": {
        nombre: "Mousse Chocolate Kilo (75P-01)",
        batchTotal: 853,
        premezclas: ["Polvos 1 (MUS K)", "Polvos 2 (MUS K)"],
        ingredientes: {
            "Azúcar Refinada": { base: 300, pesoBolsa: 25, bolsasPallet: 40 },
            "Agente de batido Lamequick": { base: 300, pesoBolsa: 20, bolsasPallet: 40 },
            "Cacao Rojo MONER CORONA": { base: 200, pesoBolsa: 25, bolsasPallet: 40 },
            "Almidón Modificado": { base: 25, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Descremada": { base: 25, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "mousseChoco250": {
        nombre: "Mousse Chocolate 250 (73P-01)",
        batchTotal: 867,
        premezclas: ["Polvos 1 (MUS)", "Polvos 2 (Balde 4L)", "Colorante Caramelo (Frasco 100ml)"],
        ingredientes: {
            "Azúcar Refinada": { base: 400, pesoBolsa: 25, bolsasPallet: 40 },
            "Agente de batido Lamequick": { base: 250, pesoBolsa: 20, bolsasPallet: 40 },
            "Cacao Rojo": { base: 100, pesoBolsa: 25, bolsasPallet: 40 },
            "Almidón Modificado": { base: 50, pesoBolsa: 25, bolsasPallet: 40 },
            "Cacao Negro": { base: 12, pesoBolsa: 25, bolsasPallet: 40 },
            "Colorante Caramelo en Polvo": { base: 12, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Descremada": { base: 25, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "mousseFrutilla": {
        nombre: "Mousse Frutilla (81P-00)",
        batchTotal: 608.27,
        premezclas: ["Polvos 1 Color (M FRU+JULIANO)", "Polvos 2 Sabor (M FRU+JULIANO)", "Polvos 3 (M FRU+JULIANO)"],
        ingredientes: {
            "Agente de batido Lamequick": { base: 300, pesoBolsa: 20, bolsasPallet: 40 },
            "Azúcar Impalpable LODISER": { base: 243, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Entera Corlasa": { base: 60, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "pastelera250": {
        nombre: "Pastelera 250/Kilo (34P-04)",
        batchTotal: 1500.6,
        premezclas: ["Polvos 1", "Polvos 2"],
        ingredientes: {
            "Azúcar Impalpable": { base: 952, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Emjel EP / Paselli BC": { base: 250, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Entera": { base: 250, pesoBolsa: 25, bolsasPallet: 40 },
            "Alginato de Sodio": { base: 31.25, pesoBolsa: 25, bolsasPallet: 40 },
            "Goma Guar": { base: 9, pesoBolsa: 25, bolsasPallet: 40 }
        }
        },    
    "mousseChantilly250": {
        nombre: "Mousse Chantilly 250 (53P:01)",
        batchTotal: 805.6,
        premezclas: ["Polvo 1 beige (CHANTILLY+JULIANO)", "Polvo 2 blanco (CHANTILLY+JULIANO)", "Polvo 3 amarillo (CHANTILLY+JULIANO)"],
        ingredientes: {
            "Azúcar Impalpable": { base: 400, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Agente de batido": { base: 300, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Descremada": { base: 50, pesoBolsa: 25, bolsasPallet: 40 },
            "Paselli BC / Emjel EP 820 C": { base: 50, pesoBolsa: 25, bolsasPallet: 40 },
            "Alginato de Sodio": { base: 4, pesoBolsa: 25, bolsasPallet: 40 }
        }
    },
    "mousseChantillyKilo": {
        nombre: "Mousse Chantilly Kilo (57P:01)",
        batchTotal: 751.88,
        premezclas: ["Polvos 1 Color (MUS K + JULIANO)", "Polvos 2 Sabor (MUS K + JULIANO)"],
        ingredientes: {
            "Agente de batido Lamequick": { base: 375, pesoBolsa: 25, bolsasPallet: 40 },
            "Azúcar Impalpable": { base: 300, usaBigBag: true, pesoBigBag: 1000, pesoBolsa: 25, bolsasPallet: 40 },
            "Leche Entera Corlasa": { base: 75, pesoBolsa: 25, bolsasPallet: 40 }
        }
        
    }
};

// --- LÓGICA DE INTERFAZ Y AJUSTES MANUALES ---

window.cambiarAjuste = function(nombreIngrediente, tipo, cantidad) {
    if (!ajustesPedido[nombreIngrediente]) {
        ajustesPedido[nombreIngrediente] = { bolsones: 0, pallets: 0, bolsas: 0 };
    }
    ajustesPedido[nombreIngrediente][tipo] += cantidad;
    calcularTotales(); 
};

window.borrarItem = function(index) {
    colaDeProduccion.splice(index, 1);
    actualizarListaVisual();
    zonaResultados.style.display = 'none'; 
};

function actualizarLabel() {
    if (radioBatches.checked) {
        labelInput.innerText = "Inserte cantidad de BATCHES:";
        kilosInput.placeholder = "Ej: 1, 2, 0.5";
    } else {
        labelInput.innerText = "Inserte KILOS a producir:";
        const recetaActual = todasLasRecetas[selectorProducto.value];
        kilosInput.placeholder = `Ej: ${recetaActual.batchTotal}`;
    }
}

document.querySelectorAll('input[name="modoCalculo"]').forEach(el => {
    el.addEventListener('change', actualizarLabel);
});
selectorProducto.addEventListener('change', actualizarLabel);

buttonAgregar.addEventListener('click', () => {
    const valor = parseFloat(kilosInput.value);
    if (!valor || valor <= 0) { alert("Ingresá un número válido"); return; }

    const codigo = selectorProducto.value;
    const esPorBatches = radioBatches.checked;
    const receta = todasLasRecetas[codigo];

    colaDeProduccion.push({
        nombreProducto: receta.nombre,
        codigoProducto: codigo,
        cantidad: valor,
        modo: esPorBatches ? "Batches" : "Kilos"
    });
    
    kilosInput.value = "";
    kilosInput.focus();
    actualizarListaVisual();
    zonaResultados.style.display = 'none'; 
});

function actualizarListaVisual() {
    listaProduccion.innerHTML = "";
    if (colaDeProduccion.length === 0) {
        listaProduccion.innerHTML = '<li style="text-align:center; color:#999; border: 2px dashed #ddd;">(Lista vacía)</li>';
        return;
    }

    colaDeProduccion.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.cantidad} ${item.modo} - ${item.nombreProducto}</span>
            <button class="btn-borrar" onclick="borrarItem(${index})">❌</button>
        `;
        listaProduccion.appendChild(li);
    });
}

function calcularTotales() {
    if (colaDeProduccion.length === 0) { alert("¡Agregá algo a la lista primero!"); return; }

    let totalIngredientes = {}; 
    let totalPremezclas = {};   

    colaDeProduccion.forEach(pedido => {
        const receta = todasLasRecetas[pedido.codigoProducto];
        let kilosRealesPedido = pedido.modo === "Batches" ? (pedido.cantidad * receta.batchTotal) : pedido.cantidad;
        const ratioBatches = kilosRealesPedido / receta.batchTotal;

        for (let nombre in receta.ingredientes) {
            const datosIng = receta.ingredientes[nombre];
            const kilosNecesarios = (datosIng.base / receta.batchTotal) * kilosRealesPedido;

            if (!totalIngredientes[nombre]) totalIngredientes[nombre] = { kilos: 0, datos: datosIng };
            totalIngredientes[nombre].kilos += kilosNecesarios;
        }

        for (let nombrePre of receta.premezclas) {
            if (!totalPremezclas[nombrePre]) totalPremezclas[nombrePre] = 0;
            totalPremezclas[nombrePre] += ratioBatches;
        }
    });

    listaIngredientes.innerHTML = "";
    zonaResultados.style.display = 'block';

    const tituloMat = document.createElement('h3');
    tituloMat.innerText = "🏭 Materias Primas Consolidadas:";
    listaIngredientes.appendChild(tituloMat);

    for (let nombre in totalIngredientes) {
        const kilosTotales = totalIngredientes[nombre].kilos;
        const datos = totalIngredientes[nombre].datos;
        const adj = ajustesPedido[nombre] || { bolsones: 0, pallets: 0, bolsas: 0 };
        let partes = [];

if (datos.usaBigBag) {
            let cantBigBags = Math.ceil(kilosTotales / datos.pesoBigBag);
            
            let bolsonesFinal = cantBigBags + (adj.bolsones || 0);
            if (bolsonesFinal < 0) bolsonesFinal = 0;
            let bolsasFinal = 0 + (adj.bolsas || 0);
            if (bolsasFinal < 0) bolsasFinal = 0;

            let textoBolsones = `<strong>${bolsonesFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsones', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsones', 1)">+</button> Bolsones`;
            if (adj.bolsones !== 0) textoBolsones += `<span class="texto-ajuste ${adj.bolsones > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsones > 0 ? '+' : ''}${adj.bolsones})</span>`;

            let textoBolsas = `<strong>${bolsasFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', 1)">+</button> Bolsas`;
            if (adj.bolsas !== 0) textoBolsas += `<span class="texto-ajuste ${adj.bolsas > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsas > 0 ? '+' : ''}${adj.bolsas})</span>`;

            partes.push(`${iconBolson} ${textoBolsones}`);
            partes.push(`${iconBolsa} ${textoBolsas}`);

            // Lógica para el botón de conversión a bolsas
            let bolsonesEnterosRequeridos = Math.floor(kilosTotales / datos.pesoBigBag);
            
            // Si el sistema está pidiendo un bolsón que no se va a llenar completo
            if (bolsonesFinal > bolsonesEnterosRequeridos) {
                let kilosSueltos = kilosTotales - (bolsonesEnterosRequeridos * datos.pesoBigBag);
                let espacioSobrante = datos.pesoBigBag - kilosSueltos;
                let bolsasParaReemplazar = Math.ceil(kilosSueltos / datos.pesoBolsa);

                // Mostramos el botón solo si todavía no pasamos esa cantidad a bolsas manualmente
                if (bolsasFinal < bolsasParaReemplazar) {
                    partes.push(`<br><span style="color:#e74c3c; font-size:13px; margin-left: 45px;">⚠️ Sobran ${espacioSobrante.toFixed(1)}kg en el último bolsón. <button class="btn-alerta" onclick="convertirSobranteABolsas('${nombre}', ${bolsasParaReemplazar})">Pasar a ${bolsasParaReemplazar} bolsas</button></span>`);
                }
            }

        } else {
            // Acá está el cambio: Math.ceil redondea hacia arriba para pedir siempre la bolsa entera
            let totalBolsasCalc = Math.ceil(kilosTotales / datos.pesoBolsa);
            let kilosSueltos = kilosTotales % datos.pesoBolsa; 
            
            let palletsBase = Math.floor(totalBolsasCalc / datos.bolsasPallet);
            let bolsasSueltasBase = totalBolsasCalc % datos.bolsasPallet;

            let palletsFinal = palletsBase + (adj.pallets || 0);
            if (palletsFinal < 0) palletsFinal = 0;
            let bolsasFinal = bolsasSueltasBase + (adj.bolsas || 0);
            if (bolsasFinal < 0) bolsasFinal = 0;

            let textoPallets = `<strong>${palletsFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'pallets', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'pallets', 1)">+</button> Pallets`;
            if (adj.pallets !== 0) textoPallets += `<span class="texto-ajuste ${adj.pallets > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.pallets > 0 ? '+' : ''}${adj.pallets})</span>`;

            let textoBolsas = `<strong>${bolsasFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', 1)">+</button> Bolsas`;
            if (adj.bolsas !== 0) textoBolsas += `<span class="texto-ajuste ${adj.bolsas > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsas > 0 ? '+' : ''}${adj.bolsas})</span>`;

            partes.push(`${iconPallet} ${textoPallets}`);
            partes.push(`${iconBolsa} ${textoBolsas}`);
            
            // Seguimos mostrando los kilos sueltos para que el operario sepa cuánto consumir realmente
            if (kilosSueltos > 0.01) {
                partes.push(`${iconBalanza} <strong>${kilosSueltos.toFixed(2)} kg</strong> (Consumo real a pesar)`);
            }
        }

        let textoFinal = partes.join(" <br> ");
        textoFinal += ` <br><span style="color:gray; font-size:14px; margin-left: 45px;">(Total requerido: ${kilosTotales.toFixed(2)} kg)</span>`;

        const renglon = document.createElement('li');
        renglon.innerHTML = `<strong>${nombre}:</strong><br> ${textoFinal}`;
        listaIngredientes.appendChild(renglon);
    }

    const tituloPre = document.createElement('h3');
    tituloPre.innerText = "📦 Pre-Pesadas Totales:";
function calcularTotales() {
    if (colaDeProduccion.length === 0) { alert("¡Agregá algo a la lista primero!"); return; }

    let totalIngredientes = {}; 
    let totalPremezclas = {};   

    colaDeProduccion.forEach(pedido => {
        const receta = todasLasRecetas[pedido.codigoProducto];
        let kilosRealesPedido = pedido.modo === "Batches" ? (pedido.cantidad * receta.batchTotal) : pedido.cantidad;
        const ratioBatches = kilosRealesPedido / receta.batchTotal;

        for (let nombre in receta.ingredientes) {
            const datosIng = receta.ingredientes[nombre];
            const kilosNecesarios = (datosIng.base / receta.batchTotal) * kilosRealesPedido;

            if (!totalIngredientes[nombre]) totalIngredientes[nombre] = { kilos: 0, datos: datosIng };
            totalIngredientes[nombre].kilos += kilosNecesarios;
        }

        for (let nombrePre of receta.premezclas) {
            if (!totalPremezclas[nombrePre]) totalPremezclas[nombrePre] = 0;
            totalPremezclas[nombrePre] += ratioBatches;
        }
    });

    listaIngredientes.innerHTML = "";
    zonaResultados.style.display = 'block';

    const tituloMat = document.createElement('h3');
    tituloMat.innerText = "🏭 Materias Primas Consolidadas:";
    listaIngredientes.appendChild(tituloMat);

    for (let nombre in totalIngredientes) {
        const kilosTotales = totalIngredientes[nombre].kilos;
        const datos = totalIngredientes[nombre].datos;
        const adj = ajustesPedido[nombre] || { bolsones: 0, pallets: 0, bolsas: 0 };
        let partes = [];
        let bultosTotales = 0; // NUEVA VARIABLE PARA LOS BULTOS

        if (datos.usaBigBag) {
            let cantBigBags = Math.ceil(kilosTotales / datos.pesoBigBag);
            
            let bolsonesFinal = cantBigBags + (adj.bolsones || 0);
            if (bolsonesFinal < 0) bolsonesFinal = 0;
            let bolsasFinal = 0 + (adj.bolsas || 0);
            if (bolsasFinal < 0) bolsasFinal = 0;

            // En los productos con bolsones, sumamos los bolsones y las bolsas
            bultosTotales = bolsonesFinal + bolsasFinal; 

            let textoBolsones = `<strong>${bolsonesFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsones', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsones', 1)">+</button> Bolsones`;
            if (adj.bolsones !== 0) textoBolsones += `<span class="texto-ajuste ${adj.bolsones > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsones > 0 ? '+' : ''}${adj.bolsones})</span>`;

            let textoBolsas = `<strong>${bolsasFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', 1)">+</button> Bolsas`;
            if (adj.bolsas !== 0) textoBolsas += `<span class="texto-ajuste ${adj.bolsas > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsas > 0 ? '+' : ''}${adj.bolsas})</span>`;

            partes.push(`${iconBolson} ${textoBolsones}`);
            partes.push(`${iconBolsa} ${textoBolsas}`);

            let bolsonesEnterosRequeridos = Math.floor(kilosTotales / datos.pesoBigBag);
            
            if (bolsonesFinal > bolsonesEnterosRequeridos) {
                let kilosSueltos = kilosTotales - (bolsonesEnterosRequeridos * datos.pesoBigBag);
                let espacioSobrante = datos.pesoBigBag - kilosSueltos;
                let bolsasParaReemplazar = Math.ceil(kilosSueltos / datos.pesoBolsa);

                if (bolsasFinal < bolsasParaReemplazar) {
                    partes.push(`<br><span style="color:#e74c3c; font-size:13px; margin-left: 45px;">⚠️ Sobran ${espacioSobrante.toFixed(1)}kg en el último bolsón. <button class="btn-alerta" onclick="convertirSobranteABolsas('${nombre}', ${bolsasParaReemplazar})">Pasar a ${bolsasParaReemplazar} bolsas</button></span>`);
                }
            }

        } else {
            let totalBolsasCalc = Math.ceil(kilosTotales / datos.pesoBolsa);
            let kilosSueltos = kilosTotales % datos.pesoBolsa; 
            
            let palletsBase = Math.floor(totalBolsasCalc / datos.bolsasPallet);
            let bolsasSueltasBase = totalBolsasCalc % datos.bolsasPallet;

            let palletsFinal = palletsBase + (adj.pallets || 0);
            if (palletsFinal < 0) palletsFinal = 0;
            let bolsasFinal = bolsasSueltasBase + (adj.bolsas || 0);
            if (bolsasFinal < 0) bolsasFinal = 0;

            // Multiplicamos la cantidad de pallets por su capacidad y le sumamos las bolsas sueltas
            bultosTotales = (palletsFinal * datos.bolsasPallet) + bolsasFinal; 

            let textoPallets = `<strong>${palletsFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'pallets', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'pallets', 1)">+</button> Pallets`;
            if (adj.pallets !== 0) textoPallets += `<span class="texto-ajuste ${adj.pallets > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.pallets > 0 ? '+' : ''}${adj.pallets})</span>`;

            let textoBolsas = `<strong>${bolsasFinal}</strong> <button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', -1)">-</button><button class="btn-ajuste" onclick="cambiarAjuste('${nombre}', 'bolsas', 1)">+</button> Bolsas`;
            if (adj.bolsas !== 0) textoBolsas += `<span class="texto-ajuste ${adj.bolsas > 0 ? 'texto-suma' : 'texto-resta'}">(${adj.bolsas > 0 ? '+' : ''}${adj.bolsas})</span>`;

            partes.push(`${iconPallet} ${textoPallets}`);
            partes.push(`${iconBolsa} ${textoBolsas}`);
            
            if (kilosSueltos > 0.01) {
                partes.push(`${iconBalanza} <strong>${kilosSueltos.toFixed(2)} kg</strong> (Consumo real a pesar)`);
            }
        }

        let textoFinal = partes.join(" <br> ");
        textoFinal += ` <br><span style="color:gray; font-size:14px; margin-left: 45px;">(Total requerido: ${kilosTotales.toFixed(2)} kg)</span>`;

        const renglon = document.createElement('li');
        // ACÁ AGREGAMOS EL TOTAL DE BULTOS AL TÍTULO
        renglon.innerHTML = `<strong>${nombre} <span style="color:#666; font-size:0.95rem;">(${bultosTotales} bultos totales)</span>:</strong><br> ${textoFinal}`;
        listaIngredientes.appendChild(renglon);
    }

    const tituloPre = document.createElement('h3');
    tituloPre.innerText = "📦 Pre-Pesadas Totales:";
    listaIngredientes.appendChild(tituloPre);

    for (let nombre in totalPremezclas) {
        const item = document.createElement("li");
        const cantidad = parseFloat(totalPremezclas[nombre].toFixed(2));
        item.innerHTML = `${iconPrepesada} <strong>${nombre}:</strong> ${cantidad} ${(cantidad === 1) ? "bolsa/unidad" : "bolsas/unidades"}`;
        listaIngredientes.appendChild(item);
    }
}

// Al presionar Calcular Totales, limpiamos los ajustes manuales para empezar de cero el cálculo nuevo
buttonCalcular.addEventListener('click', () => {
    ajustesPedido = {}; 
    calcularTotales();
});

window.convertirSobranteABolsas = function(nombreIngrediente, bolsasNecesarias) {
    if (!ajustesPedido[nombreIngrediente]) {
        ajustesPedido[nombreIngrediente] = { bolsones: 0, pallets: 0, bolsas: 0 };
    }
    // Restamos el bolsón extra y sumamos las bolsas que lo reemplazan
    ajustesPedido[nombreIngrediente].bolsones -= 1;
    ajustesPedido[nombreIngrediente].bolsas += bolsasNecesarias;
    calcularTotales();
};



