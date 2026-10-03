// ======================================================
// ORGANIZATEC
// ORGANIZADOR DE TAREAS ACCESIBLE
//
// POO:
// Usuario
// Materia
// Tarea
// Accesibilidad
//
// FUNCIONES:
// - Crear materias
// - Crear tareas
// - Editar tareas
// - Eliminar tareas
// - Cambiar estados
// - Buscar tareas
// - Filtrar tareas
// - Guardar información en localStorage
// - Lectura en voz alta
// - Alto contraste
// - Aumentar/disminuir texto
// ======================================================



// ======================================================
// CLASE USUARIO
// ======================================================

class Usuario {

    constructor(nombre, correo) {

        this.nombre = nombre;

        this.correo = correo;
    }

}



// ======================================================
// CLASE MATERIA
// ======================================================

class Materia {

    constructor(id, nombre, profesor = "") {

        this.id = id;

        this.nombre = nombre;

        this.profesor = profesor;
    }

}



// ======================================================
// CLASE TAREA
// ======================================================

class Tarea {

    constructor(
        id,
        nombre,
        materiaId,
        descripcion,
        fecha,
        estado = "Pendiente"
    ) {

        this.id = id;

        this.nombre = nombre;

        this.materiaId = materiaId;

        this.descripcion = descripcion;

        this.fecha = fecha;

        this.estado = estado;
    }

}



// ======================================================
// CLASE ACCESIBILIDAD
// ======================================================

class Accesibilidad {

    constructor() {

        this.tamanoTexto =
            Number(
                localStorage.getItem("ot_tamanoTexto")
            ) || 100;


        this.altoContraste =
            localStorage.getItem(
                "ot_altoContraste"
            ) === "true";
    }



    aplicar() {

        document.documentElement.style.setProperty(
            "--font-scale",
            this.tamanoTexto / 100
        );


        document.body.classList.toggle(
            "high-contrast",
            this.altoContraste
        );


        const boton =
            document.getElementById(
                "btnContraste"
            );


        if (boton) {

            boton.setAttribute(
                "aria-pressed",
                String(this.altoContraste)
            );


            boton.textContent =
                this.altoContraste
                    ? "◐ Contraste: activado"
                    : "◐ Contraste";
        }
    }



    aumentarTexto() {

        this.tamanoTexto =
            Math.min(
                this.tamanoTexto + 10,
                160
            );


        localStorage.setItem(
            "ot_tamanoTexto",
            this.tamanoTexto
        );


        this.aplicar();


        anunciar(
            `Tamaño de texto aumentado a ${this.tamanoTexto} por ciento.`
        );
    }



    disminuirTexto() {

        this.tamanoTexto =
            Math.max(
                this.tamanoTexto - 10,
                80
            );


        localStorage.setItem(
            "ot_tamanoTexto",
            this.tamanoTexto
        );


        this.aplicar();


        anunciar(
            `Tamaño de texto reducido a ${this.tamanoTexto} por ciento.`
        );
    }



    alternarContraste() {

        this.altoContraste =
            !this.altoContraste;


        localStorage.setItem(
            "ot_altoContraste",
            this.altoContraste
        );


        this.aplicar();


        anunciar(

            this.altoContraste

                ? "Modo de alto contraste activado."

                : "Modo de alto contraste desactivado."
        );
    }



    leerTexto(texto) {

        if (
            !(
                "speechSynthesis"
                in window
            )
        ) {

            anunciar(
                "Tu navegador no tiene disponible la lectura de texto."
            );

            return;
        }


        window.speechSynthesis.cancel();


        const mensaje =
            new SpeechSynthesisUtterance(
                texto
            );


        mensaje.lang =
            "es-MX";


        mensaje.rate =
            0.9;


        mensaje.pitch =
            1;


        window.speechSynthesis.speak(
            mensaje
        );
    }



    detenerLectura() {

        if (
            "speechSynthesis"
            in window
        ) {

            window.speechSynthesis.cancel();
        }
    }

}



// ======================================================
// VARIABLES
// ======================================================

let usuario =
    cargarUsuario();


let materias =
    cargarObjetos(
        "ot_materias"
    );


let tareas =
    cargarObjetos(
        "ot_tareas"
    );


let accesibilidad =
    new Accesibilidad();



// ======================================================
// FUNCIÓN PARA OBTENER ELEMENTOS
// ======================================================

const $ =
    (id) =>
        document.getElementById(id);



// ======================================================
// INICIO
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        accesibilidad.aplicar();

        configurarEventos();

        actualizarVista();

    }
);



// ======================================================
// EVENTOS
// ======================================================

function configurarEventos() {


    // LOGIN

    $("loginForm")
        .addEventListener(
            "submit",
            iniciarSesion
        );


    // CERRAR SESIÓN

    $("btnCerrarSesion")
        .addEventListener(
            "click",
            cerrarSesion
        );


    // NUEVA MATERIA

    $("btnNuevaMateria")
        .addEventListener(
            "click",
            () => {

                $("materiaForm").hidden =
                    false;

                $("materiaNombre").focus();
            }
        );


    // CANCELAR MATERIA

    $("btnCancelarMateria")
        .addEventListener(
            "click",
            cerrarFormularioMateria
        );


    // GUARDAR MATERIA

    $("materiaForm")
        .addEventListener(
            "submit",
            guardarMateria
        );


    // NUEVA TAREA

    $("btnNuevaTarea")
        .addEventListener(
            "click",
            () =>
                abrirFormularioTarea()
        );


    // CANCELAR TAREA

    $("btnCancelarTarea")
        .addEventListener(
            "click",
            cerrarFormularioTarea
        );


    // GUARDAR TAREA

    $("tareaForm")
        .addEventListener(
            "submit",
            guardarTarea
        );


    // BUSCAR

    $("buscarTarea")
        .addEventListener(
            "input",
            renderTareas
        );


    // FILTRO

    $("filtroEstado")
        .addEventListener(
            "change",
            renderTareas
        );


    // AUMENTAR TEXTO

    $("btnAumentarTexto")
        .addEventListener(
            "click",
            () =>
                accesibilidad.aumentarTexto()
        );


    // DISMINUIR TEXTO

    $("btnDisminuirTexto")
        .addEventListener(
            "click",
            () =>
                accesibilidad.disminuirTexto()
        );


    // CONTRASTE

    $("btnContraste")
        .addEventListener(
            "click",
            () =>
                accesibilidad.alternarContraste()
        );


    // LEER PÁGINA

    $("btnLeerPagina")
        .addEventListener(
            "click",
            leerPagina
        );
}



// ======================================================
// SESIÓN
// ======================================================

function iniciarSesion(evento) {

    evento.preventDefault();


    usuario =
        new Usuario(

            $("loginNombre")
                .value
                .trim(),

            $("loginCorreo")
                .value
                .trim()

        );


    localStorage.setItem(
        "ot_usuario",
        JSON.stringify(usuario)
    );


    actualizarVista();


    anunciar(
        `Bienvenido a OrganizaTec, ${usuario.nombre}.`
    );
}



function cerrarSesion() {

    accesibilidad.detenerLectura();


    localStorage.removeItem(
        "ot_usuario"
    );


    usuario = null;


    actualizarVista();


    anunciar(
        "Sesión cerrada."
    );
}



function cargarUsuario() {

    const dato =
        localStorage.getItem(
            "ot_usuario"
        );


    if (!dato) {

        return null;
    }


    try {

        return JSON.parse(dato);

    } catch {

        return null;
    }
}



// ======================================================
// MATERIAS
// ======================================================

function guardarMateria(evento) {

    evento.preventDefault();


    const nombre =
        $("materiaNombre")
            .value
            .trim();


    const profesor =
        $("materiaProfesor")
            .value
            .trim();


    if (!nombre) {

        return;
    }


    const materia =
        new Materia(

            generarId(),

            nombre,

            profesor
        );


    materias.push(
        materia
    );


    guardarObjetos(
        "ot_materias",
        materias
    );


    $("materiaForm")
        .reset();


    cerrarFormularioMateria();


    renderTodo();


    anunciar(
        `Materia ${nombre} agregada correctamente.`
    );
}



function eliminarMateria(id) {

    const materia =
        materias.find(
            m =>
                m.id === id
        );


    if (!materia) {

        return;
    }


    const tieneTareas =
        tareas.some(
            t =>
                t.materiaId === id
        );


    if (tieneTareas) {

        anunciar(
            "No se puede eliminar la materia porque tiene tareas asociadas."
        );


        mostrarMensaje(
            "No se puede eliminar una materia que tiene tareas asociadas."
        );


        return;
    }


    materias =
        materias.filter(
            m =>
                m.id !== id
        );


    guardarObjetos(
        "ot_materias",
        materias
    );


    renderTodo();


    anunciar(
        `Materia ${materia.nombre} eliminada.`
    );
}



// ======================================================
// TAREAS
// ======================================================

function abrirFormularioTarea(
    id = ""
) {

    if (
        materias.length === 0
    ) {

        mostrarMensaje(
            "Primero debes crear al menos una materia."
        );


        anunciar(
            "Primero debes crear al menos una materia."
        );


        $("btnNuevaMateria")
            .focus();


        return;
    }


    $("tareaPanel").hidden =
        false;


    llenarSelectMaterias();


    if (id) {

        const tarea =
            tareas.find(
                t =>
                    t.id === id
            );


        if (!tarea) {

            return;
        }


        $("formTareaTitle")
            .textContent =
            "Editar tarea";


        $("tareaId")
            .value =
            tarea.id;


        $("tareaNombre")
            .value =
            tarea.nombre;


        $("tareaMateria")
            .value =
            tarea.materiaId;


        $("tareaFecha")
            .value =
            tarea.fecha;


        $("tareaEstado")
            .value =
            tarea.estado;


        $("tareaDescripcion")
            .value =
            tarea.descripcion;

    } else {

        $("formTareaTitle")
            .textContent =
            "Nueva tarea";


        $("tareaForm")
            .reset();


        $("tareaId")
            .value =
            "";


        $("tareaEstado")
            .value =
            "Pendiente";


        llenarSelectMaterias();
    }


    $("tareaPanel")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    $("tareaNombre")
        .focus();
}



function guardarTarea(evento) {

    evento.preventDefault();


    const id =
        $("tareaId")
            .value;


    const datos = {

        nombre:
            $("tareaNombre")
                .value
                .trim(),

        materiaId:
            $("tareaMateria")
                .value,

        fecha:
            $("tareaFecha")
                .value,

        estado:
            $("tareaEstado")
                .value,

        descripcion:
            $("tareaDescripcion")
                .value
                .trim()
    };


    if (
        !datos.nombre ||
        !datos.materiaId ||
        !datos.fecha
    ) {

        return;
    }


    // EDITAR

    if (id) {

        const tarea =
            tareas.find(
                t =>
                    t.id === id
            );


        if (tarea) {

            Object.assign(
                tarea,
                datos
            );


            anunciar(
                `Tarea ${datos.nombre} actualizada.`
            );


            mostrarMensaje(
                "Tarea actualizada correctamente."
            );
        }


    }

    // CREAR

    else {

        const nuevaTarea =
            new Tarea(

                generarId(),

                datos.nombre,

                datos.materiaId,

                datos.descripcion,

                datos.fecha,

                datos.estado
            );


        tareas.push(
            nuevaTarea
        );


        anunciar(
            `Tarea ${datos.nombre} agregada correctamente.`
        );


        mostrarMensaje(
            "Tarea agregada correctamente."
        );
    }


    guardarObjetos(
        "ot_tareas",
        tareas
    );


    cerrarFormularioTarea();


    renderTodo();
}



function eliminarTarea(id) {

    const tarea =
        tareas.find(
            t =>
                t.id === id
        );


    if (!tarea) {

        return;
    }


    tareas =
        tareas.filter(
            t =>
                t.id !== id
        );


    guardarObjetos(
        "ot_tareas",
        tareas
    );


    renderTodo();


    anunciar(
        `Tarea ${tarea.nombre} eliminada.`
    );


    mostrarMensaje(
        "Tarea eliminada correctamente."
    );
}



function cambiarEstado(
    id,
    estado
) {

    const tarea =
        tareas.find(
            t =>
                t.id === id
        );


    if (!tarea) {

        return;
    }


    tarea.estado =
        estado;


    guardarObjetos(
        "ot_tareas",
        tareas
    );


    renderTodo();


    anunciar(
        `La tarea ${tarea.nombre} ahora está ${estado}.`
    );
}



// ======================================================
// RENDERIZADO
// ======================================================

function actualizarVista() {

    const conectado =
        Boolean(usuario);


    $("loginView").hidden =
        conectado;


    $("appView").hidden =
        !conectado;


    if (!conectado) {

        return;
    }


    $("saludo")
        .textContent =
        `Hola, ${usuario.nombre}`;


    renderTodo();
}



function renderTodo() {

    renderMaterias();

    llenarSelectMaterias();

    renderTareas();

    actualizarEstadisticas();
}



// ======================================================
// MOSTRAR MATERIAS
// ======================================================

function renderMaterias() {

    const contenedor =
        $("materiasLista");


    contenedor.innerHTML =
        "";


    if (
        materias.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="empty">

                <strong>
                    No tienes materias todavía.
                </strong>

                <p>
                    Agrega una materia para comenzar.
                </p>

            </div>

        `;


        return;
    }


    materias.forEach(
        materia => {

            const elemento =
                document.createElement(
                    "article"
                );


            elemento.className =
                "list-item";


            elemento.innerHTML = `

                <h3>
                    ${escapeHTML(
                        materia.nombre
                    )}
                </h3>


                <p>

                    ${
                        materia.profesor

                        ? `Profesor:
                           ${escapeHTML(
                               materia.profesor
                           )}`

                        : "Sin profesor registrado."
                    }

                </p>


                <div class="item-actions">


                    <button

                        class="small-btn"

                        type="button"

                        data-action="leer-materia"

                        data-id="${materia.id}"

                    >

                        🔊 Escuchar

                    </button>


                    <button

                        class="danger-btn"

                        type="button"

                        data-action="eliminar-materia"

                        data-id="${materia.id}"

                    >

                        🗑️ Eliminar

                    </button>


                </div>

            `;


            contenedor.appendChild(
                elemento
            );
        }
    );


    contenedor
        .querySelectorAll(
            "[data-action='leer-materia']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const materia =
                            materias.find(
                                m =>
                                    m.id ===
                                    boton.dataset.id
                            );


                        if (!materia) {

                            return;
                        }


                        accesibilidad.leerTexto(

                            `Materia:
                             ${materia.nombre}.

                             ${
                                materia.profesor
                                ? `Profesor:
                                   ${materia.profesor}.`
                                : ""
                             }`

                        );
                    }
                );
            }
        );


    contenedor
        .querySelectorAll(
            "[data-action='eliminar-materia']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () =>
                        eliminarMateria(
                            boton.dataset.id
                        )
                );
            }
        );
}



// ======================================================
// MOSTRAR TAREAS
// ======================================================

function renderTareas() {

    const contenedor =
        $("tareasLista");


    contenedor.innerHTML =
        "";


    const busqueda =
        $("buscarTarea")
            .value
            .toLowerCase()
            .trim();


    const filtro =
        $("filtroEstado")
            .value;


    const filtradas =

        tareas

            .filter(
                tarea => {

                    const materia =
                        buscarMateria(
                            tarea.materiaId
                        );


                    const texto = [

                        tarea.nombre,

                        tarea.descripcion,

                        materia
                            ? materia.nombre
                            : ""

                    ]
                    .join(" ")
                    .toLowerCase();


                    const coincideBusqueda =
                        texto.includes(
                            busqueda
                        );


                    const coincideEstado =

                        filtro === "todas"

                        ||

                        tarea.estado ===
                        filtro;


                    return (

                        coincideBusqueda
                        &&
                        coincideEstado

                    );
                }
            )


            .sort(
                (a, b) =>
                    a.fecha.localeCompare(
                        b.fecha
                    )
            );


    if (
        filtradas.length === 0
    ) {

        contenedor.innerHTML = `

            <div class="empty">

                <strong>
                    No se encontraron tareas.
                </strong>

                <p>
                    Prueba con otro filtro
                    o agrega una nueva tarea.
                </p>

            </div>

        `;


        return;
    }


    filtradas.forEach(
        tarea => {

            const materia =
                buscarMateria(
                    tarea.materiaId
                );


            const elemento =
                document.createElement(
                    "article"
                );


            elemento.className =
                "list-item";


            const claseEstado =

                tarea.estado ===
                "Pendiente"

                ? "status-pendiente"

                :

                tarea.estado ===
                "En proceso"

                ? "status-proceso"

                :

                "status-terminada";


            elemento.innerHTML = `

                <h3>
                    ${escapeHTML(
                        tarea.nombre
                    )}
                </h3>


                <p>

                    <strong>
                        Materia:
                    </strong>

                    ${
                        materia

                        ? escapeHTML(
                            materia.nombre
                        )

                        : "Sin materia"
                    }

                </p>


                <p>

                    <strong>
                        Fecha:
                    </strong>

                    ${formatearFecha(
                        tarea.fecha
                    )}

                </p>


                <p>

                    <strong>
                        Estado:
                    </strong>


                    <span
                        class="status ${claseEstado}"
                    >

                        ${escapeHTML(
                            tarea.estado
                        )}

                    </span>

                </p>


                <p>

                    ${
                        tarea.descripcion

                        ? escapeHTML(
                            tarea.descripcion
                        )

                        : "Sin descripción."
                    }

                </p>


                <div class="item-actions">


                    <button

                        class="small-btn"

                        type="button"

                        data-action="leer-tarea"

                        data-id="${tarea.id}"

                    >

                        🔊 Escuchar tarea

                    </button>


                    <button

                        class="small-btn"

                        type="button"

                        data-action="editar-tarea"

                        data-id="${tarea.id}"

                    >

                        ✏️ Editar

                    </button>


                    <button

                        class="small-btn"

                        type="button"

                        data-action="estado-tarea"

                        data-id="${tarea.id}"

                    >

                        🔄 Cambiar estado

                    </button>


                    <button

                        class="danger-btn"

                        type="button"

                        data-action="eliminar-tarea"

                        data-id="${tarea.id}"

                    >

                        🗑️ Eliminar

                    </button>


                </div>

            `;


            contenedor.appendChild(
                elemento
            );
        }
    );


    conectarBotonesTareas();
}



// ======================================================
// BOTONES DE LAS TAREAS
// ======================================================

function conectarBotonesTareas() {


    // LEER TAREA

    document
        .querySelectorAll(
            "[data-action='leer-tarea']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const tarea =
                            tareas.find(
                                t =>
                                    t.id ===
                                    boton.dataset.id
                            );


                        if (!tarea) {

                            return;
                        }


                        const materia =
                            buscarMateria(
                                tarea.materiaId
                            );


                        accesibilidad.leerTexto(

                            `Tarea:
                             ${tarea.nombre}.

                             Materia:
                             ${
                                materia
                                ? materia.nombre
                                : "sin materia"
                             }.

                             Fecha de entrega:
                             ${
                                formatearFecha(
                                    tarea.fecha
                                )
                             }.

                             Estado:
                             ${tarea.estado}.

                             ${
                                tarea.descripcion
                                ? `Descripción:
                                   ${tarea.descripcion}.`
                                : ""
                             }`

                        );
                    }
                );
            }
        );


    // EDITAR TAREA

    document
        .querySelectorAll(
            "[data-action='editar-tarea']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () =>
                        abrirFormularioTarea(
                            boton.dataset.id
                        )
                );
            }
        );


    // CAMBIAR ESTADO

    document
        .querySelectorAll(
            "[data-action='estado-tarea']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const tarea =
                            tareas.find(
                                t =>
                                    t.id ===
                                    boton.dataset.id
                            );


                        if (!tarea) {

                            return;
                        }


                        const siguiente = {

                            "Pendiente":
                                "En proceso",

                            "En proceso":
                                "Terminada",

                            "Terminada":
                                "Pendiente"
                        };


                        cambiarEstado(

                            tarea.id,

                            siguiente[
                                tarea.estado
                            ]

                        );
                    }
                );
            }
        );


    // ELIMINAR

    document
        .querySelectorAll(
            "[data-action='eliminar-tarea']"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () =>
                        eliminarTarea(
                            boton.dataset.id
                        )
                );
            }
        );
}



// ======================================================
// SELECT DE MATERIAS
// ======================================================

function llenarSelectMaterias() {

    const select =
        $("tareaMateria");


    if (!select) {

        return;
    }


    select.innerHTML =
        "";


    materias.forEach(
        materia => {

            const opcion =
                document.createElement(
                    "option"
                );


            opcion.value =
                materia.id;


            opcion.textContent =
                materia.nombre;


            select.appendChild(
                opcion
            );
        }
    );
}



// ======================================================
// ESTADÍSTICAS
// ======================================================

function actualizarEstadisticas() {

    $("statTotal")
        .textContent =
        tareas.length;


    $("statPendientes")
        .textContent =

        tareas.filter(
            t =>
                t.estado ===
                "Pendiente"
        ).length;


    $("statProceso")
        .textContent =

        tareas.filter(
            t =>
                t.estado ===
                "En proceso"
        ).length;


    $("statTerminadas")
        .textContent =

        tareas.filter(
            t =>
                t.estado ===
                "Terminada"
        ).length;
}



// ======================================================
// LECTURA EN VOZ ALTA
// ======================================================

function leerPagina() {

    if (!usuario) {

        accesibilidad.leerTexto(

            "OrganizaTec. Página de inicio de sesión. Ingresa tu nombre y correo para comenzar."

        );


        return;
    }


    const texto = [

        `OrganizaTec.
         Hola ${usuario.nombre}.`,

        `Tienes
         ${tareas.length}
         tareas en total.`,

        `${
            tareas.filter(
                t =>
                    t.estado ===
                    "Pendiente"
            ).length
        }
        pendientes.`,

        `${
            tareas.filter(
                t =>
                    t.estado ===
                    "En proceso"
            ).length
        }
        en proceso.`,

        `${
            tareas.filter(
                t =>
                    t.estado ===
                    "Terminada"
            ).length
        }
        terminadas.`,

        `Tienes
         ${materias.length}
         materias registradas.`

    ].join(" ");


    accesibilidad.leerTexto(
        texto
    );
}



// ======================================================
// MENSAJES
// ======================================================

function anunciar(texto) {

    mostrarMensaje(
        texto
    );
}



function mostrarMensaje(texto) {

    $("mensaje")
        .textContent =
        texto;


    window.clearTimeout(
        mostrarMensaje.temporizador
    );


    mostrarMensaje.temporizador =
        window.setTimeout(
            () => {

                $("mensaje")
                    .textContent =
                    "";

            },
            5000
        );
}



// ======================================================
// CERRAR FORMULARIOS
// ======================================================

function cerrarFormularioMateria() {

    $("materiaForm")
        .hidden =
        true;


    $("materiaForm")
        .reset();
}



function cerrarFormularioTarea() {

    $("tareaPanel")
        .hidden =
        true;


    $("tareaForm")
        .reset();


    $("tareaId")
        .value =
        "";
}



// ======================================================
// UTILIDADES
// ======================================================

function generarId() {

    return (

        Date.now()
            .toString(36)

        +

        Math.random()
            .toString(36)
            .slice(2, 8)

    );
}



function buscarMateria(id) {

    return materias.find(
        materia =>
            materia.id === id
    );
}



function formatearFecha(fecha) {

    if (!fecha) {

        return "Sin fecha";
    }


    const partes =
        fecha.split("-");


    if (
        partes.length !== 3
    ) {

        return fecha;
    }


    return (

        `${partes[2]}/
         ${partes[1]}/
         ${partes[0]}`

    );
}



function guardarObjetos(
    clave,
    datos
) {

    localStorage.setItem(

        clave,

        JSON.stringify(
            datos
        )

    );
}



function cargarObjetos(
    clave
) {

    const dato =
        localStorage.getItem(
            clave
        );


    if (!dato) {

        return [];
    }


    try {

        return JSON.parse(
            dato
        );

    } catch {

        return [];
    }
}



function escapeHTML(
    texto
) {

    return String(texto)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}