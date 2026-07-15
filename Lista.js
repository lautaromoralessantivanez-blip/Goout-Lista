// ==========================================
// GOOUT LISTA
// Version 0.1
// ==========================================

// ---------------------------
// BASE DE DATOS LOCAL
// ---------------------------

let escuelas = JSON.parse(localStorage.getItem("goout_escuelas")) || [];

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

function guardarTodo(){

    localStorage.setItem(

        "goout_escuelas",

        JSON.stringify(escuelas)

    );

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

function crearEscuela(){

    const nombre = nombreNuevaEscuela.value.trim();

    if(nombre==="") return;

    const nuevaEscuela = {

        id: Date.now(),

        nombre,

        egresados:[]

    };

    escuelas.push(nuevaEscuela);

    guardarTodo();

    mostrarEscuelas();

    seleccionarEscuela(nuevaEscuela.id);

    cerrarEscuela();

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

            <strong>${escuela.nombre}</strong><br>

            ${escuela.egresados.length} egresados

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

    escuelaSeleccionada=

        escuelas.find(e=>e.id===id);

    nombreEscuela.textContent=

        escuelaSeleccionada.nombre;

    actualizarVista();

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
        class="btnMesa"
        onclick="toggleInvitados(${egresado.id})">

        ${egresado.mostrarInvitados ? "▲ Ocultar invitados" : "▼ Ver invitados"}

    </button>

    <button
        class="btnEditar"
        onclick="editarEgresado(${egresado.id})">

        Editar

    </button>

    <button
        class="btnMesa"
        onclick="agregarInvitado(${egresado.id})">

        ➕ Agregar invitado

    </button>

    <button
        class="btnEliminar"
        onclick="eliminarEgresado(${egresado.id})">

        Eliminar

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
// ==========================================
// INICIO
// ==========================================

mostrarEscuelas();

actualizarVista();
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

        e=>e.id===id

    );

    egresado.invitados.push({

        id:Date.now(),

        nombre:""

    });

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

    mesas=[];

    if(!escuelaSeleccionada){

        alert("Seleccioná una escuela.");

        return;

    }

    const capacidad = parseInt(

        document.getElementById("personasMesa").value

    );

    const grupos=[

        ...escuelaSeleccionada.egresados

    ];

    grupos.sort(

        (a,b)=>b.invitados.length-a.invitados.length

    );

    grupos.forEach(grupo=>{

        let agregado=false;

        for(const mesa of mesas){

            const ocupados=mesa.reduce(

                (t,g)=>t+g.invitados.length,

                0

            );

            if(

                ocupados+grupo.invitados.length<=capacidad

            ){

                mesa.push(grupo);

                agregado=true;

                break;

            }

        }

        if(!agregado){

            mesas.push([grupo]);

        }

    });

    mostrarMesas();

}
function mostrarMesas(){

    const contenedor=

        document.getElementById("contenedorMesas");

    contenedor.innerHTML="";

    mesas.forEach((mesa,index)=>{

        const card=document.createElement("div");

        card.className="mesa";

        let html=`

        <h3>

        Mesa ${index+1}

        </h3>

        `;

        mesa.forEach(grupo=>{

            grupo.invitados.forEach(invitado=>{

                html+=`

                <div class="invitadoMesa">

                    ${invitado.nombre || "Sin nombre"}

                </div>

                `;

            });

        });

        card.innerHTML=html;

        contenedor.appendChild(card);

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