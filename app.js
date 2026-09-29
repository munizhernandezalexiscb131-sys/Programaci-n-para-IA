// ==========================================
// ORGANIZATEC - ORGANIZADOR DE TAREAS
// Aplicación web académica sin backend.
// ==========================================

// ---------- Clases del modelo (POO) ----------

class Usuario {
  constructor(id, nombre, correo) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
  }
}

class Materia {
  constructor(id, nombre, profesor = "") {
    this.id = id;
    this.nombre = nombre;
    this.profesor = profesor;
  }
}

class Tarea {
  constructor(id, nombre, materiaId, descripcion, fechaEntrega, estado = "Pendiente") {
    this.id = id;
    this.nombre = nombre;
    this.materiaId = materiaId;
    this.descripcion = descripcion;
    this.fechaEntrega = fechaEntrega;
    this.estado = estado;
  }
}

// ---------- Persistencia ----------

const STORAGE = {
  usuario: "organizatec_usuario",
  materias: "organizatec_materias",
  tareas: "organizatec_tareas"
};

let usuario = load(STORAGE.usuario);
let materias = load(STORAGE.materias);
let tareas = load(STORAGE.tareas);

if (!Array.isArray(materias)) materias = [];
if (!Array.isArray(tareas)) tareas = [];

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function saveAll() {
  localStorage.setItem(STORAGE.usuario, JSON.stringify(usuario));
  localStorage.setItem(STORAGE.materias, JSON.stringify(materias));
  localStorage.setItem(STORAGE.tareas, JSON.stringify(tareas));
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// ---------- Elementos ----------

const loginView = document.getElementById("loginView");
const mainView = document.getElementById("mainView");
const loginForm = document.getElementById("loginForm");
const loginName = document.getElementById("loginName");
const loginEmail = document.getElementById("loginEmail");
const logoutBtn = document.getElementById("logoutBtn");

const studentName = document.getElementById("studentName");
const welcomeUser = document.getElementById("welcomeUser");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const progressCount = document.getElementById("progressCount");
const doneCount = document.getElementById("doneCount");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const subjectList = document.getElementById("subjectList");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");

const taskModal = document.getElementById("taskModal");
const taskModalTitle = document.getElementById("taskModalTitle");
const taskForm = document.getElementById("taskForm");
const taskId = document.getElementById("taskId");
const taskName = document.getElementById("taskName");
const taskSubject = document.getElementById("taskSubject");
const taskDate = document.getElementById("taskDate");
const taskDescription = document.getElementById("taskDescription");
const taskStatus = document.getElementById("taskStatus");

const subjectModal = document.getElementById("subjectModal");
const subjectForm = document.getElementById("subjectForm");
const subjectName = document.getElementById("subjectName");
const subjectTeacher = document.getElementById("subjectTeacher");

const toast = document.getElementById("toast");

// ---------- Inicio ----------

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();

  if (usuario) {
    showApp();
  } else {
    showLogin();
  }
});

function bindEvents() {
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);

  document.getElementById("newTaskBtn").addEventListener("click", () => openTaskModal());
  document.getElementById("newTaskTopBtn").addEventListener("click", () => openTaskModal());
  document.getElementById("emptyNewBtn").addEventListener("click", () => openTaskModal());

  document.getElementById("newSubjectBtn").addEventListener("click", openSubjectModal);

  taskForm.addEventListener("submit", saveTask);
  subjectForm.addEventListener("submit", saveSubject);

  searchInput.addEventListener("input", renderTasks);
  statusFilter.addEventListener("change", renderTasks);
  sortFilter.addEventListener("change", renderTasks);

  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.close));
  });

  [taskModal, subjectModal].forEach(modal => {
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal(modal.id);
    });
  });
}

// ---------- Login ----------

function handleLogin(event) {
  event.preventDefault();

  const nombre = loginName.value.trim();
  const correo = loginEmail.value.trim();

  if (!nombre || !correo) return;

  usuario = new Usuario(newId("usr"), nombre, correo);

  // Datos iniciales para que la demo no aparezca vacía la primera vez.
  if (materias.length === 0) {
    materias = [
      new Materia(newId("mat"), "Programación para IA", "Profesor de ejemplo"),
      new Materia(newId("mat"), "Matemáticas para IA", "Profesor de ejemplo"),
      new Materia(newId("mat"), "Modelo de Aprendizaje Automático", "Profesor de ejemplo")
    ];
  }

  saveAll();
  showApp();
  showToast("Sesión iniciada correctamente.");
}

function handleLogout() {
  usuario = null;
  localStorage.removeItem(STORAGE.usuario);
  showLogin();
  loginForm.reset();
}

function showLogin() {
  loginView.classList.remove("hidden");
  mainView.classList.add("hidden");
}

function showApp() {
  loginView.classList.add("hidden");
  mainView.classList.remove("hidden");

  studentName.textContent = usuario.nombre;
  welcomeUser.textContent = usuario.correo;

  renderAll();
}

// ---------- Tareas ----------

function openTaskModal(id = null) {
  if (materias.length === 0) {
    showToast("Primero agrega al menos una materia.");
    openSubjectModal();
    return;
  }

  taskForm.reset();
  taskId.value = "";
  taskModalTitle.textContent = "Nueva tarea";
  taskStatus.value = "Pendiente";
  taskDate.value = todayISO();

  fillSubjectOptions();

  if (id) {
    const tarea = tareas.find(t => t.id === id);

    if (!tarea) return;

    taskModalTitle.textContent = "Editar tarea";
    taskId.value = tarea.id;
    taskName.value = tarea.nombre;
    taskSubject.value = tarea.materiaId;
    taskDate.value = tarea.fechaEntrega;
    taskDescription.value = tarea.descripcion || "";
    taskStatus.value = tarea.estado;
  }

  taskModal.classList.remove("hidden");
  setTimeout(() => taskName.focus(), 50);
}

function saveTask(event) {
  event.preventDefault();

  const id = taskId.value;
  const nombre = taskName.value.trim();
  const materiaId = taskSubject.value;
  const descripcion = taskDescription.value.trim();
  const fechaEntrega = taskDate.value;
  const estado = taskStatus.value;

  if (!nombre || !materiaId || !fechaEntrega) {
    showToast("Completa los campos obligatorios.");
    return;
  }

  if (id) {
    const tarea = tareas.find(t => t.id === id);

    if (tarea) {
      tarea.nombre = nombre;
      tarea.materiaId = materiaId;
      tarea.descripcion = descripcion;
      tarea.fechaEntrega = fechaEntrega;
      tarea.estado = estado;
    }

    showToast("Tarea actualizada.");
  } else {
    const nuevaTarea = new Tarea(
      newId("task"),
      nombre,
      materiaId,
      descripcion,
      fechaEntrega,
      estado
    );

    tareas.push(nuevaTarea);
    showToast("Tarea agregada.");
  }

  saveAll();
  closeModal("taskModal");
  renderAll();
}

function editTask(id) {
  openTaskModal(id);
}

function deleteTask(id) {
  const tarea = tareas.find(t => t.id === id);
  if (!tarea) return;

  const confirmar = confirm(`¿Quieres eliminar la tarea "${tarea.nombre}"?`);

  if (!confirmar) return;

  tareas = tareas.filter(t => t.id !== id);
  saveAll();
  renderAll();
  showToast("Tarea eliminada.");
}

function changeTaskStatus(id, estado) {
  const tarea = tareas.find(t => t.id === id);

  if (!tarea) return;

  tarea.estado = estado;
  saveAll();
  renderAll();
  showToast(`Estado cambiado a "${estado}".`);
}

// ---------- Materias ----------

function openSubjectModal() {
  subjectForm.reset();
  subjectModal.classList.remove("hidden");
  setTimeout(() => subjectName.focus(), 50);
}

function saveSubject(event) {
  event.preventDefault();

  const nombre = subjectName.value.trim();
  const profesor = subjectTeacher.value.trim();

  if (!nombre) {
    showToast("Escribe el nombre de la materia.");
    return;
  }

  const existe = materias.some(
    materia => materia.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (existe) {
    showToast("Esa materia ya está registrada.");
    return;
  }

  materias.push(new Materia(newId("mat"), nombre, profesor));

  saveAll();
  closeModal("subjectModal");
  renderAll();
  showToast("Materia agregada.");
}

function deleteSubject(id) {
  const materia = materias.find(m => m.id === id);
  if (!materia) return;

  const tareasRelacionadas = tareas.filter(t => t.materiaId === id);

  if (tareasRelacionadas.length > 0) {
    showToast("No puedes eliminar una materia que tiene tareas.");
    return;
  }

  const confirmar = confirm(`¿Eliminar la materia "${materia.nombre}"?`);

  if (!confirmar) return;

  materias = materias.filter(m => m.id !== id);
  saveAll();
  renderAll();
  showToast("Materia eliminada.");
}

function fillSubjectOptions() {
  taskSubject.innerHTML = "";

  materias.forEach(materia => {
    const option = document.createElement("option");
    option.value = materia.id;
    option.textContent = materia.nombre;
    taskSubject.appendChild(option);
  });
}

// ---------- Render ----------

function renderAll() {
  updateStats();
  renderTasks();
  renderSubjects();
  fillSubjectOptions();
}

function updateStats() {
  totalCount.textContent = tareas.length;
  pendingCount.textContent = tareas.filter(t => t.estado === "Pendiente").length;
  progressCount.textContent = tareas.filter(t => t.estado === "En proceso").length;
  doneCount.textContent = tareas.filter(t => t.estado === "Terminada").length;
}

function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();
  const filterStatus = statusFilter.value;
  const sort = sortFilter.value;

  let lista = [...tareas];

  if (query) {
    lista = lista.filter(tarea => {
      const materia = getSubjectName(tarea.materiaId).toLowerCase();

      return (
        tarea.nombre.toLowerCase().includes(query) ||
        materia.includes(query) ||
        (tarea.descripcion || "").toLowerCase().includes(query)
      );
    });
  }

  if (filterStatus !== "todas") {
    lista = lista.filter(tarea => tarea.estado === filterStatus);
  }

  lista.sort((a, b) => {
    if (sort === "fechaAsc") {
      return a.fechaEntrega.localeCompare(b.fechaEntrega);
    }

    if (sort === "fechaDesc") {
      return b.fechaEntrega.localeCompare(a.fechaEntrega);
    }

    if (sort === "nombre") {
      return a.nombre.localeCompare(b.nombre);
    }

    if (sort === "estado") {
      return a.estado.localeCompare(b.estado);
    }

    return 0;
  });

  taskList.innerHTML = "";

  if (lista.length === 0) {
    taskList.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  taskList.classList.remove("hidden");
  emptyState.classList.add("hidden");

  lista.forEach(tarea => {
    taskList.appendChild(createTaskCard(tarea));
  });
}

function createTaskCard(tarea) {
  const article = document.createElement("article");
  article.className = "task-card";

  const main = document.createElement("div");
  main.className = "task-main";

  const title = document.createElement("h4");
  title.textContent = tarea.nombre;

  const description = document.createElement("p");
  description.className = "task-description";
  description.textContent = tarea.descripcion || "Sin descripción.";

  const meta = document.createElement("div");
  meta.className = "task-meta";

  const subjectTag = createTag(`📚 ${getSubjectName(tarea.materiaId)}`);
  const dateTag = createTag(`📅 ${formatDate(tarea.fechaEntrega)}`);
  const statusTag = createTag(tarea.estado);
  statusTag.classList.add("status", statusClass(tarea.estado));

  meta.append(subjectTag, dateTag, statusTag);
  main.append(title, description, meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.className = "action-btn";
  editButton.textContent = "Editar";
  editButton.addEventListener("click", () => editTask(tarea.id));

  const nextButton = document.createElement("button");
  nextButton.className = "action-btn";
  nextButton.textContent = nextStatusLabel(tarea.estado);
  nextButton.addEventListener("click", () => {
    changeTaskStatus(tarea.id, nextStatus(tarea.estado));
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "action-btn delete";
  deleteButton.textContent = "Eliminar";
  deleteButton.addEventListener("click", () => deleteTask(tarea.id));

  actions.append(editButton, nextButton, deleteButton);
  article.append(main, actions);

  return article;
}

function createTag(text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = text;
  return span;
}

function renderSubjects() {
  subjectList.innerHTML = "";

  if (materias.length === 0) {
    const p = document.createElement("p");
    p.textContent = "Todavía no tienes materias registradas.";
    p.style.color = "var(--muted)";
    subjectList.appendChild(p);
    return;
  }

  materias.forEach(materia => {
    const card = document.createElement("article");
    card.className = "subject-card";

    const info = document.createElement("div");

    const title = document.createElement("h4");
    title.textContent = materia.nombre;

    const teacher = document.createElement("p");
    teacher.textContent = materia.profesor
      ? `Profesor: ${materia.profesor}`
      : "Profesor no registrado";

    info.append(title, teacher);

    const button = document.createElement("button");
    button.className = "delete";
    button.textContent = "Eliminar";
    button.addEventListener("click", () => deleteSubject(materia.id));

    card.append(info, button);
    subjectList.appendChild(card);
  });
}

// ---------- Utilidades ----------

function getSubjectName(id) {
  const materia = materias.find(m => m.id === id);
  return materia ? materia.nombre : "Materia eliminada";
}

function statusClass(estado) {
  if (estado === "En proceso") return "proceso";
  if (estado === "Terminada") return "terminada";
  return "pendiente";
}

function nextStatus(estado) {
  if (estado === "Pendiente") return "En proceso";
  if (estado === "En proceso") return "Terminada";
  return "Pendiente";
}

function nextStatusLabel(estado) {
  if (estado === "Pendiente") return "Iniciar";
  if (estado === "En proceso") return "Terminar";
  return "Reabrir";
}

function todayISO() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().split("T")[0];
}

function formatDate(dateString) {
  if (!dateString) return "Sin fecha";

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
