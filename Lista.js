// ==========================================
// GOOUT LISTA
// Version 0.1
// ==========================================

// ---------------------------
// BASE DE DATOS LOCAL
// ---------------------------

import {

    db,

    collection,

    addDoc,

    updateDoc,

    deleteDoc,

    doc,

    onSnapshot,

    getDocs

} from "./firebase.js";

let escuelas = [];

let escuelaSeleccionada = null;

let egresadoEditando = null;

// ---------------------------
// ELEMENTOS
// ---------------------------

const listaEscuelas = document.getElementById("listaEscuelas");

const listaEgresados = document.getElementById("listaEgresados");

const nombreEscuela = document.getElementById("nombreEscuela");

const estadisticasEscuela = document.getElementById("estadisticasEscuela");

const buscarEscuela = document.getElementById("buscarEscuela");

const buscarEgresado = document.getElementById("buscarEgresado");

// botones

const btnNuevaEscuela = document.getElementById("btnNuevaEscuela");

const btnAgregarEgresado = document.getElementById("btnAgregarEgresado");

// modales

const modalEscuela = document.getElementById("modalEscuela");

const modalEgresado = document.getElementById("modalEgresado");

// inputs

const nombreNuevaEscuela = document.getElementById("nombreNuevaEscuela");

const nombreEgresado = document.getElementById("nombreEgresado");

const cantidadInvitados = document.getElementById("cantidadInvitados");

const observaciones = document.getElementById("observaciones");

// botones modal

const guardarEscuela = document.getElementById("guardarEscuela");

const guardarEgresado = document.getElementById("guardarEgresado");

const cerrarModalEscuela = document.getElementById("cerrarModalEscuela");

const cerrarModalEgresado = document.getElementById("cerrarModalEgresado");

// estadísticas

const totalInvitados = document.getElementById("totalInvitados");

const totalMesas = document.getElementById("totalMesas");

const lugaresLibres = document.getElementById("lugaresLibres");
// ==========================================
// GUARDAR
// ==========================================

async function guardarTodo(){

    if(!escuelaSeleccionada) return;

    try{

        await updateDoc(

            doc(db,"escuelas",escuelaSeleccionada.id),

{

    nombre: escuelaSeleccionada.nombre,

    egresados: escuelaSeleccionada.egresados,

    distribucionMesas: distribucionGuardada

}
        );

    }catch(error){

    console.error(error);

    alert(error.message);

}

}

function prepararDistribucionParaGuardar(){

    return mesas.map((mesa,index)=>({

        numero:index,

        grupos:mesa

    }));

}
// ==========================================
// MODALES
// ==========================================

function abrirModalEscuela(){

    modalEscuela.classList.remove("oculto");

}

function cerrarEscuela(){

    nombreNuevaEscuela.value="";

    modalEscuela.classList.add("oculto");

}

function abrirModalEgresado(){

    if(!escuelaSeleccionada){

        alert("Primero seleccioná una escuela.");

        return;

    }

    egresadoEditando = null;

    nombreEgresado.value = "";

    cantidadInvitados.value = "";

    observaciones.value = "";

    modalEgresado.classList.remove("oculto");

}
function cerrarEgresado(){

    nombreEgresado.value = "";

    cantidadInvitados.value = "";

    observaciones.value = "";

    egresadoEditando = null;

    modalEgresado.classList.add("oculto");

}
function crearEgresado(){

    if(!escuelaSeleccionada) return;

    const nombre = nombreEgresado.value.trim();

    const invitados = parseInt(cantidadInvitados.value);

    const obs = observaciones.value.trim();

    if(nombre==""){

        alert("Ingresá un nombre.");

        return;

    }

    if(isNaN(invitados)){

        alert("Cantidad inválida.");

        return;

    }

if(egresadoEditando){

    egresadoEditando.nombre = nombre;
    egresadoEditando.observaciones = obs;

    const cantidadActual = egresadoEditando.invitados.length;

    if(invitados > cantidadActual){

        for(let i = cantidadActual; i < invitados; i++){

            egresadoEditando.invitados.push({

                id: Date.now() + i,
                nombre: ""

            });

        }

    }

    if(invitados < cantidadActual){

        egresadoEditando.invitados.splice(invitados);

    }

}else{

const listaInvitados = [];

for(let i = 0; i < invitados; i++){

    listaInvitados.push({

        id: Date.now() + i,

        nombre: ""

    });

}

escuelaSeleccionada.egresados.push({

    id: Date.now(),

    nombre,

    invitados: listaInvitados,

    observaciones: obs,

    mostrarInvitados: false

});

    }

guardarTodo();

buscarEgresado.value = "";

actualizarVista();

cerrarEgresado();

}
// ==========================================
// CREAR ESCUELA
// ==========================================

async function crearEscuela(){

    const nombre = nombreNuevaEscuela.value.trim();

    if(nombre==="") return;

    await addDoc(

        collection(db,"escuelas"),

        {

            nombre: nombre,

            egresados: []

        }

    );

    cerrarEscuela();

}
async function eliminarEscuela(id){

    const escuela = escuelas.find(e=>e.id===id);

    if(!escuela) return;

    if(!confirm(`¿Eliminar "${escuela.nombre}"?`)) return;

    try{

        await deleteDoc(

            doc(db,"escuelas",id)

        );

        if(escuelaSeleccionada?.id===id){

            escuelaSeleccionada=null;

        }

    }catch(error){

        console.error(error);

        alert("No se pudo eliminar.");

    }

}
async function editarEscuela(id){

    const escuela = escuelas.find(e=>e.id===id);

    if(!escuela) return;

    const nuevoNombre = prompt(

        "Nuevo nombre de la escuela:",

        escuela.nombre

    );

    if(nuevoNombre === null) return;

    if(nuevoNombre.trim() === "") return;

    try{

        await updateDoc(

            doc(db,"escuelas",id),

            {

                nombre: nuevoNombre.trim()

            }

        );

    }catch(error){

        console.error(error);

        alert("No se pudo actualizar.");

    }

}
// ==========================================
// MOSTRAR ESCUELAS
// ==========================================

function mostrarEscuelas(){

    listaEscuelas.innerHTML="";

    const texto=buscarEscuela.value.toLowerCase();

    escuelas

    .filter(e=>e.nombre.toLowerCase().includes(texto))

    .forEach(escuela=>{

        const div=document.createElement("div");

        div.className="escuela";

div.innerHTML=`

<div style="display:flex;justify-content:space-between;align-items:center;">

    <div>

        <strong>${escuela.nombre}</strong><br>

        ${escuela.egresados.length} egresados

    </div>

    <div style="display:flex;gap:8px;">

        <button

            class="btnEditar"

            onclick="event.stopPropagation();editarEscuela('${escuela.id}')">

            ✏️

        </button>

        <button

            class="btnEliminar"

            onclick="event.stopPropagation();eliminarEscuela('${escuela.id}')">

            🗑️

        </button>

    </div>

</div>

`;
        div.onclick=()=>{

            seleccionarEscuela(escuela.id);

        };

        listaEscuelas.appendChild(div);

    });

}
// ==========================================
// SELECCIONAR ESCUELA
// ==========================================

function seleccionarEscuela(id){

    escuelaSeleccionada =
        escuelas.find(e=>e.id===id);

    nombreEscuela.textContent =
        escuelaSeleccionada.nombre;

    actualizarVista();

    if(
        escuelaSeleccionada.distribucionMesas &&
        escuelaSeleccionada.distribucionMesas.length > 0
    ){

        mesas = JSON.parse(
            JSON.stringify(
                escuelaSeleccionada.distribucionMesas
            )
        );

        mostrarMesas();

    }

}
// ==========================================
// ACTUALIZAR VISTA
// ==========================================

function actualizarVista(){

    mostrarEgresados();

    actualizarEstadisticas();

}
// ==========================================
// MOSTRAR EGRESADOS
// ==========================================

function mostrarEgresados(){

    listaEgresados.innerHTML="";

    if(!escuelaSeleccionada){

        listaEgresados.innerHTML=`
        <div class="sinDatos">

            Seleccioná una escuela.

        </div>
        `;

        return;

    }

    const texto = buscarEgresado.value.toLowerCase();

    const lista = escuelaSeleccionada.egresados.filter(e=>{

        return e.nombre.toLowerCase().includes(texto);

    });

    if(lista.length===0){

        listaEgresados.innerHTML=`

        <div class="sinDatos">

            No hay egresados.

        </div>

        `;

        return;

    }

    lista.forEach(egresado=>{

        const card=document.createElement("div");

        card.className="egresadoCard";

        card.innerHTML=`

            <div class="egresadoHeader">

                <div>

                    <div class="egresadoNombre">

                        👤 ${egresado.nombre}

                    </div>

                    <div class="egresadoInvitados">

                        👥 ${egresado.invitados.length} invitados

                    </div>

                </div>

            </div>

            <div class="egresadoObs">

                ${egresado.observaciones || "Sin observaciones"}

            </div>

<div class="botonesCard">

    <button
        class="btnEditar"
        title="Editar"
        onclick="editarEgresado(${egresado.id})">

        ✏️

    </button>

    <button
        class="btnEliminar"
        title="Eliminar"
        onclick="eliminarEgresado(${egresado.id})">

        🗑️

    </button>

    <button
        class="btnMesa"
        title="Agregar invitados"
        onclick="agregarInvitado(${egresado.id})">

        ➕

    </button>

    <button
        class="btnMesa"
        title="Mostrar invitados"
        onclick="toggleInvitados(${egresado.id})">

        ${egresado.mostrarInvitados ? "▲" : "▼"}

    </button>

</div>
<div class="listaInvitados">

    ${
        egresado.mostrarInvitados

        ?

        egresado.invitados.map((invitado,index)=>`

            <div class="itemInvitado">

                <input

                    type="text"

                    placeholder="Nombre del invitado"

                    value="${invitado.nombre}"

                    onchange="guardarNombreInvitado(${egresado.id},${index},this.value)">

                <button

                    class="btnEliminar"

                    onclick="eliminarInvitado(${egresado.id},${index})">

                    🗑

                </button>

            </div>

        `).join("")

        :

        ""

    }

</div>

        `;

        listaEgresados.appendChild(card);

    });

}
// ==========================================
// EDITAR
// ==========================================

function editarEgresado(id){

    egresadoEditando = escuelaSeleccionada.egresados.find(e=>e.id===id);

    if(!egresadoEditando) return;

    nombreEgresado.value = egresadoEditando.nombre;

    cantidadInvitados.value = egresadoEditando.invitados.length;

    observaciones.value = egresadoEditando.observaciones;

    modalEgresado.classList.remove("oculto");

}
// ==========================================
// ELIMINAR
// ==========================================

function eliminarEgresado(id){

    if(!confirm("¿Eliminar egresado?")) return;

    escuelaSeleccionada.egresados =

        escuelaSeleccionada.egresados.filter(

            e=>e.id!==id

        );

    guardarTodo();

    actualizarVista();

}
// ==========================================
// ESTADÍSTICAS
// ==========================================

function actualizarEstadisticas(){

    if(!escuelaSeleccionada){

        totalInvitados.textContent=0;

        totalMesas.textContent=0;

        lugaresLibres.textContent=0;

        estadisticasEscuela.textContent="";

        return;

    }

    let invitados=0;

    escuelaSeleccionada.egresados.forEach(e=>{

invitados += e.invitados.length;

    });

    totalInvitados.textContent=invitados;

    const personasMesa=

        parseInt(document.getElementById("personasMesa").value);

    const mesas=Math.ceil(invitados/personasMesa);

    totalMesas.textContent=mesas;

    lugaresLibres.textContent=

        mesas*personasMesa-invitados;

    estadisticasEscuela.textContent=

        `${escuelaSeleccionada.egresados.length} egresados · ${invitados} invitados`;

}
// ==========================================
// EVENTOS
// ==========================================

btnNuevaEscuela.onclick = abrirModalEscuela;

btnAgregarEgresado.onclick = abrirModalEgresado;

guardarEscuela.onclick = crearEscuela;

guardarEgresado.onclick = crearEgresado;

document.getElementById("btnGenerar").onclick = generarMesas;

document.getElementById("btnPDF").onclick = generarPDF;
cerrarModalEscuela.onclick = cerrarEscuela;

cerrarModalEgresado.onclick = cerrarEgresado;

buscarEscuela.oninput = mostrarEscuelas;

buscarEgresado.oninput = mostrarEgresados;

document.getElementById("personasMesa").oninput = atualizarMesa;

function atualizarMesa(){

    actualizarEstadisticas();

}
let mesas = [];

let distribucionGuardada = [];

let invitadoArrastrando = null;
// ==========================================
// INICIO
// ==========================================

onSnapshot(

    collection(db,"escuelas"),

    (snapshot)=>{

        escuelas=[];

        snapshot.forEach(docu=>{

         escuelas.push({

    id:docu.id,

    distribucionMesas: [],

    ...docu.data()

});

        });

        mostrarEscuelas();

        if(escuelaSeleccionada){

            const encontrada = escuelas.find(

                e=>e.id===escuelaSeleccionada.id

            );

            escuelaSeleccionada = encontrada || null;

        }

        actualizarVista();

    }

);
function toggleInvitados(id){

    const egresado = escuelaSeleccionada.egresados.find(

        e=>e.id===id

    );

    egresado.mostrarInvitados = !egresado.mostrarInvitados;

    guardarTodo();

    mostrarEgresados();

}

function agregarInvitado(id){

    const egresado = escuelaSeleccionada.egresados.find(
        e => e.id === id
    );

    if(!egresado) return;

    const cantidad = parseInt(

        prompt("¿Cuántos invitados querés agregar?")

    );

    if(isNaN(cantidad) || cantidad <= 0){

        return;

    }

    for(let i=0;i<cantidad;i++){

        egresado.invitados.push({

            id: Date.now()+i,

            nombre:""

        });

    }

    guardarTodo();

    actualizarVista();

}

function guardarNombreInvitado(id,index,nombre){

    const egresado = escuelaSeleccionada.egresados.find(

        e=>e.id===id

    );

    egresado.invitados[index].nombre = nombre;

    guardarTodo();

}

function eliminarInvitado(id,index){

    const egresado = escuelaSeleccionada.egresados.find(

        e=>e.id===id

    );

    egresado.invitados.splice(index,1);

    guardarTodo();

    actualizarVista();

}
function generarMesas(){

    if(!escuelaSeleccionada){

        alert("Seleccioná una escuela.");

        return;

    }

    if(

        escuelaSeleccionada.distribucionMesas &&

        escuelaSeleccionada.distribucionMesas.length > 0

    ){

mesas = escuelaSeleccionada.distribucionMesas.map(

    mesa => mesa.grupos

);

        mostrarMesas();

        actualizarEstadisticas();

        return;

    }

    mesas = [];

    const capacidad = parseInt(
        document.getElementById("personasMesa").value
    );

    const grupos = [...escuelaSeleccionada.egresados];

    grupos.sort(
        (a,b)=>b.invitados.length-a.invitados.length
    );

    grupos.forEach(grupo=>{

        let invitadosPendientes=[...grupo.invitados];

        while(invitadosPendientes.length){

            let mejorMesa=null;

            let mejorEspacio=-1;

            mesas.forEach(mesa=>{

                const ocupados = mesa.reduce(

                    (t,g)=>t+g.invitados.length,

                    0

                );

                const libres = capacidad-ocupados;

                if(

                    libres>mejorEspacio &&
                    libres>=1

                ){

                    mejorMesa=mesa;

                    mejorEspacio=libres;

                }

            });

            if(!mejorMesa){

                mejorMesa=[];

                mesas.push(mejorMesa);

                mejorEspacio=capacidad;

            }

            const cantidad = Math.min(

                mejorEspacio,

                invitadosPendientes.length

            );

            mejorMesa.push({

                nombre: grupo.nombre,

                invitados: invitadosPendientes.splice(0,cantidad)

            });

        }

    });

    mostrarMesas();

    actualizarEstadisticas();

}
function mostrarMesas(){

    const contenedor=

        document.getElementById("contenedorMesas");

    contenedor.innerHTML="";

    mesas.forEach((mesa,index)=>{

const card = document.createElement("div");

card.className = "mesa";

card.dataset.mesa = index;

card.addEventListener("dragover",(e)=>{

    e.preventDefault();

    card.classList.add("mesaActiva");

});

card.addEventListener("dragleave",()=>{

    card.classList.remove("mesaActiva");

});

card.addEventListener("drop",(e)=>{

    e.preventDefault();

    card.classList.remove("mesaActiva");

    const datos = JSON.parse(

        e.dataTransfer.getData("text/plain")

    );

    if(datos.mesa == index){

        alert("El invitado ya está en esta mesa.");

        return;

    }

    const confirmar = confirm(

        `¿Mover este invitado a la Mesa ${index+1}?`

    );

    if(!confirmar) return;

const grupoOrigen = mesas[datos.mesa].find(

    g => g.nombre === datos.grupo

);

if(!grupoOrigen) return;

const invitado = grupoOrigen.invitados.splice(

    datos.invitado,

    1

)[0];

if(!invitado) return;

// Si el grupo quedó vacío, lo eliminamos de la mesa
if(grupoOrigen.invitados.length === 0){

    mesas[datos.mesa] = mesas[datos.mesa].filter(

        g => g !== grupoOrigen

    );

}

const capacidad = parseInt(

    document.getElementById("personasMesa").value

);

const ocupados = mesas[index].reduce(

    (total, grupo) => total + grupo.invitados.length,

    0

);

if(ocupados >= capacidad){

    alert("Esta mesa ya está completa.");

    grupoOrigen.invitados.push(invitado);

    mostrarMesas();

    return;

}

// Buscar si el grupo ya existe en la mesa destino
let grupoDestino = mesas[index].find(

    g => g.nombre === datos.grupo

);

// Si no existe, lo creamos
if(!grupoDestino){

    grupoDestino = {

        nombre: datos.grupo,

        invitados: []

    };

    mesas[index].push(grupoDestino);

}

// Agregamos el invitado al grupo destino
grupoDestino.invitados.push(invitado);

// Eliminar mesas vacías
mesas = mesas.filter(

    mesa => mesa.length > 0

);

// Guardar la distribución actual
distribucionGuardada = prepararDistribucionParaGuardar();

escuelaSeleccionada.distribucionMesas = distribucionGuardada;

guardarTodo();

// Redibujar
mostrarMesas();

});

        let html=`

        <h3>

🪑 Mesa ${index+1}

</h3>
<p style="padding:15px;font-weight:600;color:#666;">

${mesa.reduce((t,g)=>t+g.invitados.length,0)} invitados
<br>
${parseInt(document.getElementById("personasMesa").value)-mesa.reduce((t,g)=>t+g.invitados.length,0)} lugares libres

</p>

        `;

        mesa.forEach(grupo=>{

grupo.invitados.forEach((invitado, indice)=>{

    html += `

  <div
    class="invitadoMesa"
    draggable="true"
    data-mesa="${index}"
    data-grupo="${grupo.nombre}"
    data-invitado="${indice}">

    ${invitado.nombre || "Sin nombre"}

</div>

    `;

});

        });

        card.innerHTML=html;

   contenedor.appendChild(card);

});

activarDrag();

}

function activarDrag(){

    const invitados = document.querySelectorAll(".invitadoMesa");

    invitados.forEach(invitado=>{

        invitado.addEventListener("dragstart",(e)=>{

      const datos = {

    mesa: Number(invitado.dataset.mesa),

    grupo: invitado.dataset.grupo,

    invitado: Number(invitado.dataset.invitado)

};

invitadoArrastrando = datos;

e.dataTransfer.setData(

    "text/plain",

    JSON.stringify(datos)

);

        });

    });

}

function generarPDF(){

    if(mesas.length === 0){

        alert("Primero generá las mesas.");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(20);
    doc.text("GOOUT Lista", 15, y);

    y += 10;

    doc.setFontSize(13);
    doc.text(nombreEscuela.textContent, 15, y);

    y += 15;

    mesas.forEach((mesa, indice)=>{

        doc.setFontSize(16);

        doc.text(`Mesa ${indice+1}`,15,y);

        y += 10;

        mesa.forEach(grupo=>{

            grupo.invitados.forEach(invitado=>{

                if(invitado.nombre.trim() !== ""){

                    doc.setFontSize(12);

                    doc.text("• " + invitado.nombre,20,y);

                    y += 7;

                    if(y > 270){

                        doc.addPage();

                        y = 20;

                    }

                }

            });

        });

        y += 10;

    });

    doc.save("GOOUT Lista.pdf");

}
window.editarEgresado = editarEgresado;

window.eliminarEgresado = eliminarEgresado;

window.agregarInvitado = agregarInvitado;

window.toggleInvitados = toggleInvitados;

window.guardarNombreInvitado = guardarNombreInvitado;

window.eliminarInvitado = eliminarInvitado;

window.eliminarEscuela = eliminarEscuela;

window.editarEscuela = editarEscuela;
