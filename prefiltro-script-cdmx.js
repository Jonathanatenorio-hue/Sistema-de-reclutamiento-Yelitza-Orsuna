// =====================================================
// PRE-FILTRO SCRIPT — OPERACIÓN CDMX
// ExpertCell - Renovaciones AT&T
// Sucursales: Neza | Atlixco (Iztapalapa)
// =====================================================

// ⚠️ IMPORTANTE: Reemplaza con la URL de tu Web App de CDMX
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfy0ZgzFKgPY6LDMn57jyGNHcgf7C1_kMhOXfPoaNqoNKKYDhQlCmo-yidnMItNyoM5A/exec';

let candidateData = {}, selectedTime = null, selectedSucursal = null, selectedDireccion = null, totalScore = 0;
let reclutadorInfo = { nombre: '', email: '', whatsapp: '', whatsappNumero: '' };
let horariosOcupados = [];
let selectedFuente = null;
let reclutadorAsignado = null;

// =====================================================
// CONFIGURACIÓN CDMX
// =====================================================
const RECLUTADORES_CDMX = {
    'Yelitza Jazmin Orsuna Sanchez': {
        email: 'yelitzaorsuna_att@outlook.com',
        whatsapp: '55 2106 5618',
        whatsappNumero: '5521065618'
    },
    'Perla García Mendez': {
        email: 'perlagarciam88@gmail.com',
        whatsapp: '56 5741 9923',
        whatsappNumero: '5657419923'
    },
    'Marco Antonio Becerra Olguin': {
        email: 'ji4668expercell@gmail.com',
        whatsapp: '56 1082 8443',
        whatsappNumero: '5610828443'
    }
};

// Línea principal visible para el candidato
const EQUIPO_CDMX = {
    nombre: 'Equipo de Reclutamiento CDMX',
    email: 'yelitzaorsuna_att@outlook.com',
    whatsapp: '55 2106 5618',
    whatsappNumero: '5521065618'
};

const mapsLinks = {
    'Sucursal Neza': 'https://maps.app.goo.gl/qMLmZUiE3g9ikA6X9?g_st=iw',
    'Sucursal Atlixco': 'https://maps.app.goo.gl/r57CwtnX9HAU4w7n8?g_st=iw'
};

// =====================================================
// VERIFICAR SI YA COMPLETÓ EL FORMULARIO
// =====================================================
function checkIfRejected() {
    const rejected = localStorage.getItem('att_rejected_cdmx');
    if (rejected === 'true') {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('rejected-screen').classList.add('active');
        document.querySelector('.rejected-screen h2').textContent = 'Ya completaste este formulario';
        document.querySelector('.rejected-screen p').textContent = 'Detectamos que ya enviaste tu información anteriormente.';
    }
}
window.onload = function() { checkIfRejected(); };

// =====================================================
// PREGUNTAS (IDÉNTICAS A PUEBLA)
// =====================================================
const questions = {
    q1: [
        { text: 'Tener un ingreso fijo y hacer amigos', score: 0, type: 'reject' },
        { text: 'Que sea un trabajo sencillo sin mucha presión', score: 0, type: 'reject' },
        { text: 'Aprender y generar ingresos adicionales con comisiones', score: 3, type: 'good' },
        { text: 'Ganar dinero a través de resultados y superar metas', score: 5, type: 'ideal' }
    ],
    q2: [
        { text: 'No tengo problema mientras haya una buena base de datos', score: 0, type: 'reject' },
        { text: 'Solo cumplo lo mínimo para no tener problemas', score: 0, type: 'reject' },
        { text: 'Me adapto y hago mi esfuerzo', score: 3, type: 'good' },
        { text: 'Me motiva competir conmigo mismo y con el equipo', score: 5, type: 'ideal' }
    ],
    q3: [
        { text: 'Si su tono no es amigable, prefiero colgar la llamada', score: 0, type: 'reject' },
        { text: 'Insisto sin escuchar al cliente', score: 1, type: 'warning' },
        { text: 'Intento explicar brevemente el beneficio', score: 3, type: 'good' },
        { text: 'Investigo el motivo, manejo la objeción y vuelvo a intentar el cierre', score: 5, type: 'ideal' }
    ],
    q4: [
        { text: 'No me interesa, prefiero sueldo fijo', score: 0, type: 'reject' },
        { text: 'Solo las veo como un extra ocasional', score: 1, type: 'warning' },
        { text: 'Son importantes, pero no mi prioridad', score: 3, type: 'good' },
        { text: 'Son una parte clave de mi ingreso', score: 5, type: 'ideal' }
    ],
    q5: [
        { text: 'Me desmotivo y bajo el ritmo', score: 0, type: 'reject' },
        { text: 'Normal, lo mas probable es que se deba a la base o al sistema', score: 0, type: 'reject' },
        { text: 'Pido retroalimentación y sigo intentando', score: 3, type: 'good' },
        { text: 'Ajusto mi estrategia, escucho mis llamadas y busco mejorar', score: 5, type: 'ideal' }
    ],
    q6: [
        { text: 'A veces llego tarde, depende del día', score: 0, type: 'reject' },
        { text: 'Cumplo mientras no haya problemas personales', score: 1, type: 'warning' },
        { text: 'Suelo ser puntual', score: 3, type: 'good' },
        { text: 'Soy muy puntual y responsable con mis horarios', score: 5, type: 'ideal' }
    ],
    q7: [
        { text: 'Que no me presione', score: 0, type: 'reject' },
        { text: 'Que me deje trabajar sin decirme nada', score: 0, type: 'reject' },
        { text: 'Que me apoye cuando lo necesito', score: 3, type: 'good' },
        { text: 'Que me exija, me rete y me ayude a mejorar resultados', score: 5, type: 'ideal' }
    ],
    q8: [
        { text: 'Me molesta y me pongo a la defensiva', score: 0, type: 'reject' },
        { text: 'Si no me gusta no lo aplico', score: 0, type: 'reject' },
        { text: 'La tomo en cuenta y trato de mejorar', score: 3, type: 'good' },
        { text: 'La agradezco y la uso para crecer', score: 5, type: 'ideal' }
    ],
    q9: [
        { text: 'Solo mientras encuentro otra cosa', score: 0, type: 'reject' },
        { text: 'Un par de meses', score: 0, type: 'reject' },
        { text: 'Al menos 6 meses', score: 3, type: 'good' },
        { text: 'Busco estabilidad y crecimiento a largo plazo', score: 5, type: 'ideal' }
    ]
};

// =====================================================
// UTILIDADES
// =====================================================
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderQuestion(questionKey, containerId) {
    const container = document.getElementById(containerId);
    const options = shuffleArray(questions[questionKey]);
    const letras = ['A)', 'B)', 'C)', 'D)'];
    container.innerHTML = '';
    options.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.textContent = letras[index] + ' ' + option.text;
        div.dataset.score = option.score;
        div.dataset.type = option.type;
        div.dataset.text = option.text;
        div.onclick = function() {
            document.querySelectorAll(`#${containerId} .option`).forEach(opt => { opt.classList.remove('selected'); });
            this.classList.add('selected');
        };
        container.appendChild(div);
    });
}

// =====================================================
// FUENTE DEL CANDIDATO
// =====================================================
function selectFuente(fuente) {
    document.querySelectorAll('.fuente-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.fuente-suboption').forEach(sub => sub.classList.remove('visible'));
    
    event.currentTarget.classList.add('selected');
    selectedFuente = fuente;
    
    const suboption = document.getElementById(`suboption-${fuente}`);
    if (suboption) {
        suboption.classList.add('visible');
    }
    
    if (fuente === 'reclutador') {
        reclutadorAsignado = null;
    }
}

function nextStepFuente() {
    if (!selectedFuente) {
        alert('Por favor selecciona cómo te enteraste de esta vacante.');
        return;
    }
    
    if (selectedFuente === 'recomendacion') {
        const nombreRecomendador = document.getElementById('nombre-recomendador').value.trim();
        if (!nombreRecomendador) {
            alert('Por favor escribe el nombre de quien te recomendó.');
            return;
        }
        candidateData.fuente = 'Recomendación';
        candidateData.fuenteDetalle = nombreRecomendador;
    } else if (selectedFuente === 'internet') {
        const pagina = document.getElementById('pagina-internet').value;
        if (!pagina) {
            alert('Por favor selecciona en qué página de internet viste la vacante.');
            return;
        }
        candidateData.fuente = 'Internet';
        candidateData.fuenteDetalle = pagina;
    } else if (selectedFuente === 'reclutador') {
        const reclutador = document.getElementById('reclutador-especifico').value;
        if (!reclutador) {
            alert('Por favor selecciona qué reclutador(a) te contactó.');
            return;
        }
        candidateData.fuente = 'Reclutador(a)';
        candidateData.fuenteDetalle = reclutador;
        reclutadorAsignado = reclutador;
        // En CDMX NO auto-asignamos sucursal — los 3 reclutadores manejan ambas sucursales
    } else if (selectedFuente === 'otro') {
        const otroMedio = document.getElementById('otro-medio').value.trim();
        if (!otroMedio) {
            alert('Por favor especifica cómo te enteraste de la vacante.');
            return;
        }
        candidateData.fuente = 'Otro';
        candidateData.fuenteDetalle = otroMedio;
    }
    
    // Siempre mostrar selección de sucursal (los 3 reclutadores cubren ambas)
    document.getElementById('step-fuente').classList.remove('active');
    document.getElementById('step0').classList.add('active');
}

// =====================================================
// SELECCIÓN DE SUCURSAL
// =====================================================
function selectSucursal(sucursal, direccion) {
    document.querySelectorAll('#options-sucursal .option').forEach(opt => { opt.classList.remove('selected'); });
    event.target.closest('.option').classList.add('selected');
    selectedSucursal = sucursal;
    selectedDireccion = direccion;
}

function abrirMaps() {
    if (selectedSucursal && mapsLinks[selectedSucursal]) {
        window.open(mapsLinks[selectedSucursal], '_blank');
    } else {
        alert('Por favor selecciona primero una sucursal.');
    }
}

// =====================================================
// INICIO Y PRIVACIDAD
// =====================================================
function startForm() {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('step-privacidad').classList.add('active');
}

function aceptarPrivacidad(acepta) {
    document.getElementById('step-privacidad').classList.remove('active');
    if (acepta) {
        candidateData.aceptoPrivacidad = 'Sí';
        candidateData.fechaAceptacionPrivacidad = new Date().toLocaleString('es-MX');
        document.getElementById('step-fuente').classList.add('active');
    } else {
        candidateData.aceptoPrivacidad = 'No';
        document.getElementById('rejected-privacidad').classList.add('active');
    }
}

// =====================================================
// VALIDACIÓN Y GUARDADO POR PASO
// =====================================================
function validateStep(step) {
    if (step === 0) {
        if (!selectedSucursal) return { valid: false, message: 'Por favor selecciona una sucursal.' };
        candidateData.sucursal = selectedSucursal;
        candidateData.direccionSucursal = selectedDireccion;
        return { valid: true };
    }
    if (step === 1) {
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const edad = document.getElementById('edad').value;
        const ubicacion = document.getElementById('ubicacion').value;
        const colonia = document.getElementById('colonia').value.trim();
        if (!nombre || !telefono || !edad || !ubicacion || !colonia) return { valid: false, message: 'Por favor completa todos los campos obligatorios.' };
        if (telefono.length < 10) return { valid: false, message: 'El teléfono debe tener al menos 10 dígitos.' };
        return { valid: true };
    }
    if (step === 2) {
        const tiempo = document.getElementById('tiempo-traslado').value;
        if (!tiempo) return { valid: false, message: 'Por favor selecciona el tiempo de traslado.' };
        return { valid: true };
    }
    if (step === 3) {
        const ingreso = document.getElementById('ingreso-esperado').value;
        if (!ingreso) return { valid: false, message: 'Por favor selecciona tu expectativa de ingreso.' };
        return { valid: true };
    }
    if (step >= 4 && step <= 12) {
        const questionKey = `q${step - 3}`;
        const containerId = `options-${questionKey}`;
        const selectedOption = document.querySelector(`#${containerId} .option.selected`);
        if (!selectedOption) return { valid: false, message: 'Por favor selecciona una opción.' };
        if (selectedOption.dataset.type === 'reject') return { valid: true, reject: true };
        return { valid: true };
    }
    return { valid: true };
}

function saveStepData(step) {
    if (step === 1) {
        candidateData.nombre = document.getElementById('nombre').value;
        candidateData.telefono = document.getElementById('telefono').value;
        candidateData.edad = document.getElementById('edad').value;
        candidateData.ubicacion = document.getElementById('ubicacion').value;
        candidateData.colonia = document.getElementById('colonia').value;
    } else if (step === 2) {
        candidateData.tiempoTraslado = document.getElementById('tiempo-traslado').value;
    } else if (step === 3) {
        candidateData.ingresoEsperado = document.getElementById('ingreso-esperado').value;
    } else if (step >= 4 && step <= 12) {
        const questionKey = `q${step - 3}`;
        const containerId = `options-${questionKey}`;
        const selectedOption = document.querySelector(`#${containerId} .option.selected`);
        if (selectedOption) {
            const score = parseInt(selectedOption.dataset.score);
            const text = selectedOption.dataset.text;
            candidateData[`pregunta${step - 3}`] = text;
            candidateData[`puntaje${step - 3}`] = score;
            totalScore += score;
        }
    }
}

// =====================================================
// GUARDAR RECHAZOS EN ESTADÍSTICAS
// =====================================================
async function guardarRechazoEstadisticas(motivo) {
    const data = {
        tipo: 'rechazo_pf',
        nombre: candidateData.nombre || document.getElementById('nombre')?.value || '',
        telefono: candidateData.telefono || document.getElementById('telefono')?.value || '',
        sucursal: candidateData.sucursal || selectedSucursal || 'No especificada',
        puntaje: totalScore,
        motivo: motivo,
        fuente: candidateData.fuente || 'No especificada',
        reclutadora: candidateData.reclutadora || '',
        puntaje1: candidateData.puntaje1 || 0, puntaje2: candidateData.puntaje2 || 0,
        puntaje3: candidateData.puntaje3 || 0, puntaje4: candidateData.puntaje4 || 0,
        puntaje5: candidateData.puntaje5 || 0, puntaje6: candidateData.puntaje6 || 0,
        puntaje7: candidateData.puntaje7 || 0, puntaje8: candidateData.puntaje8 || 0,
        puntaje9: candidateData.puntaje9 || 0
    };
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error guardando rechazo:', error);
    }
}

async function guardarRechazoDuplicado() {
    const data = {
        tipo: 'rechazo_pf',
        nombre: candidateData.nombre || '',
        telefono: candidateData.telefono || '',
        sucursal: candidateData.sucursal || selectedSucursal || 'No especificada',
        puntaje: candidateData.puntajeTotal || totalScore || 0,
        motivo: 'Teléfono duplicado - Ya aplicó anteriormente',
        fuente: candidateData.fuente || 'No especificada',
        reclutadora: candidateData.reclutadora || reclutadorAsignado || '',
        puntaje1: candidateData.puntaje1 || 0, puntaje2: candidateData.puntaje2 || 0,
        puntaje3: candidateData.puntaje3 || 0, puntaje4: candidateData.puntaje4 || 0,
        puntaje5: candidateData.puntaje5 || 0, puntaje6: candidateData.puntaje6 || 0,
        puntaje7: candidateData.puntaje7 || 0, puntaje8: candidateData.puntaje8 || 0,
        puntaje9: candidateData.puntaje9 || 0
    };
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST', mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('Error guardando rechazo duplicado:', error);
    }
}

// =====================================================
// NAVEGACIÓN ENTRE PASOS
// =====================================================
function nextStep(currentStep) {
    const validation = validateStep(currentStep);
    if (!validation.valid) { alert(validation.message); return; }
    saveStepData(currentStep);
    
    if (validation.reject) {
        guardarRechazoEstadisticas('Respuesta incompatible en pregunta ' + (currentStep - 3));
        localStorage.setItem('att_rejected_cdmx', 'true');
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById('rejected-screen').classList.add('active');
        return;
    }
    
    if (currentStep === 1) {
        document.getElementById('centro-nombre').textContent = selectedSucursal;
        document.getElementById('centro-direccion').textContent = selectedDireccion;
    }
    
    if (currentStep === 3) renderQuestion('q1', 'options-q1');
    else if (currentStep === 4) renderQuestion('q2', 'options-q2');
    else if (currentStep === 5) renderQuestion('q3', 'options-q3');
    else if (currentStep === 6) renderQuestion('q4', 'options-q4');
    else if (currentStep === 7) renderQuestion('q5', 'options-q5');
    else if (currentStep === 8) renderQuestion('q6', 'options-q6');
    else if (currentStep === 9) renderQuestion('q7', 'options-q7');
    else if (currentStep === 10) renderQuestion('q8', 'options-q8');
    else if (currentStep === 11) renderQuestion('q9', 'options-q9');
    
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
}

// =====================================================
// ENVIAR FORMULARIO COMPLETO
// =====================================================
function submitForm() {
    const validation = validateStep(12);
    if (!validation.valid) { alert(validation.message); return; }
    saveStepData(12);
    
    if (validation.reject) {
        guardarRechazoEstadisticas('Respuesta incompatible en pregunta 9');
        localStorage.setItem('att_rejected_cdmx', 'true');
        document.getElementById('step12').classList.remove('active');
        document.getElementById('rejected-screen').classList.add('active');
        return;
    }
    
    if (totalScore < 28) {
        guardarRechazoEstadisticas('Puntaje insuficiente: ' + totalScore + '/45');
        localStorage.setItem('att_rejected_cdmx', 'true');
        document.getElementById('step12').classList.remove('active');
        document.getElementById('rejected-screen').classList.add('active');
        return;
    }
    
    let clasificacion = '';
    if (totalScore >= 41) clasificacion = '🌟 SOBRESALIENTE';
    else if (totalScore >= 35) clasificacion = '⭐ EXCELENTE';
    else if (totalScore >= 28) clasificacion = '✅ MUY BUENO';
    else clasificacion = '⚠️ ACEPTABLE';
    
    candidateData.puntajeTotal = totalScore;
    candidateData.clasificacion = clasificacion;
    
    document.getElementById('step12').classList.remove('active');
    document.getElementById('approved-screen').classList.add('active');
    document.getElementById('score-number').textContent = `${totalScore}/45`;
    document.getElementById('score-label').textContent = clasificacion;
    
    setupDatePicker();
}

// =====================================================
// ASIGNACIÓN DE RECLUTADOR(A) — ROUND ROBIN CDMX
// =====================================================
function setupDatePicker() {
    const dateInput = document.getElementById('fecha-cita');
    const ahora = new Date();
    
    // Fecha mínima: próximo día hábil (L-V)
    let fechaMinima = new Date(ahora);
    if (ahora.getHours() >= 18) {
        fechaMinima.setDate(fechaMinima.getDate() + 1);
    }
    // Si cae en sábado o domingo, avanzar a lunes
    while (fechaMinima.getDay() === 0 || fechaMinima.getDay() === 6) {
        fechaMinima.setDate(fechaMinima.getDate() + 1);
    }
    dateInput.min = fechaMinima.toISOString().split('T')[0];
    
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    dateInput.addEventListener('change', function() {
        const selected = new Date(this.value + 'T12:00:00');
        const dia = selected.getDay();
        if (dia === 0 || dia === 6) {
            alert('Solo puedes agendar citas de lunes a viernes.');
            this.value = '';
            return;
        }
        cargarHorariosDisponibles(this.value);
    });
    
    // ─── ASIGNACIÓN INTERNA DE RECLUTADOR(A) ───
    // Internamente se asigna por round-robin para el backend/email
    // Pero al candidato siempre le mostramos "Equipo de Reclutamiento CDMX"
    if (reclutadorAsignado && RECLUTADORES_CDMX[reclutadorAsignado]) {
        candidateData.reclutadora = reclutadorAsignado;
    } else {
        const nombres = Object.keys(RECLUTADORES_CDMX);
        const index = Date.now() % nombres.length;
        candidateData.reclutadora = nombres[index];
    }
    
    // Al candidato siempre le mostramos el equipo genérico
    reclutadorInfo.nombre = EQUIPO_CDMX.nombre;
    reclutadorInfo.email = EQUIPO_CDMX.email;
    reclutadorInfo.whatsapp = EQUIPO_CDMX.whatsapp;
    reclutadorInfo.whatsappNumero = EQUIPO_CDMX.whatsappNumero;
    
    document.getElementById('reclutador-nombre').textContent = reclutadorInfo.nombre;
    document.getElementById('reclutador-sucursal').textContent = candidateData.sucursal;
    document.getElementById('reclutador-email').textContent = reclutadorInfo.email;
    document.getElementById('reclutador-email').href = 'mailto:' + reclutadorInfo.email;
    
    // Mostrar WhatsApp
    if (reclutadorInfo.whatsappNumero && reclutadorInfo.whatsappNumero !== '') {
        document.getElementById('reclutador-whatsapp').textContent = reclutadorInfo.whatsapp;
    } else {
        document.getElementById('reclutador-whatsapp').textContent = reclutadorInfo.email + ' (email)';
        const btnCV = document.getElementById('btn-enviar-cv');
        if (btnCV) {
            btnCV.textContent = '📧 Enviar CV por Email →';
            btnCV.style.background = 'linear-gradient(135deg, #0066CC 0%, #0057B8 100%)';
        }
    }
}

// =====================================================
// CARGAR HORARIOS DISPONIBLES
// =====================================================
async function cargarHorariosDisponibles(fecha) {
    const timeSlotsContainer = document.querySelector('.time-slots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '<p style="text-align: center; color: #64748B; padding: 20px;">⏳ Cargando horarios disponibles...</p>';
    selectedTime = null;
    
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getHorariosOcupadosPF&fecha=${fecha}&sucursal=${encodeURIComponent(candidateData.sucursal)}`);
        const data = await response.json();
        const conteoHorarios = data.conteo || {};
        
        // En CDMX: 1 espacio por horario por sucursal (3 reclutadores comparten agenda)
        const espaciosPorHorario = 1;
        
        const todosLosHorarios = [
            '9:00', '9:15', '9:30', '9:45',
            '10:00', '10:15', '10:30', '10:45',
            '11:00', '11:15', '11:30', '11:45',
            '12:00', '12:15', '12:30', '12:45',
            '13:00', '13:15', '13:30', '13:45',
            '14:00', '14:15', '14:30', '14:45',
            '15:00', '15:15', '15:30', '15:45',
            '16:00', '16:15', '16:30', '16:45',
            '17:00', '17:15', '17:30', '17:45',
            '18:00'
        ];
        
        const ahora = new Date();
        const hoy = ahora.toISOString().split('T')[0];
        const horaActual = ahora.getHours();
        const minutosActuales = ahora.getMinutes();
        
        timeSlotsContainer.innerHTML = '';
        let horariosDisponibles = 0;
        
        todosLosHorarios.forEach(horario => {
            const [hora, minutos] = horario.split(':').map(Number);
            
            if (fecha === hoy) {
                const horarioEnMinutos = hora * 60 + minutos;
                const actualEnMinutos = horaActual * 60 + minutosActuales + 30;
                if (horarioEnMinutos <= actualEnMinutos) return;
            }
            
            const ocupados = conteoHorarios[horario] || 0;
            const estaLleno = ocupados >= espaciosPorHorario;
            
            const slot = document.createElement('div');
            slot.className = 'time-slot' + (estaLleno ? ' ocupado' : '');
            slot.textContent = horario;
            
            if (estaLleno) {
                slot.style.background = '#FEE2E2';
                slot.style.color = '#9CA3AF';
                slot.style.cursor = 'not-allowed';
                slot.style.textDecoration = 'line-through';
                slot.title = 'Horario no disponible';
            } else {
                slot.onclick = function() { selectTime(horario); };
                horariosDisponibles++;
            }
            
            timeSlotsContainer.appendChild(slot);
        });
        
        if (horariosDisponibles === 0) {
            timeSlotsContainer.innerHTML = '<p style="text-align: center; color: #EF4444; padding: 20px;">❌ No hay horarios disponibles para esta fecha. Por favor selecciona otro día.</p>';
        }
        
    } catch (error) {
        console.error('Error cargando horarios:', error);
        // Fallback: mostrar todos los horarios sin restricción
        const todosLosHorarios = [
            '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45',
            '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45',
            '13:00', '13:15', '13:30', '13:45', '14:00', '14:15', '14:30', '14:45',
            '15:00', '15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45',
            '17:00', '17:15', '17:30', '17:45', '18:00'
        ];
        timeSlotsContainer.innerHTML = '';
        todosLosHorarios.forEach(horario => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = horario;
            slot.onclick = function() { selectTime(horario); };
            timeSlotsContainer.appendChild(slot);
        });
    }
}

// =====================================================
// SELECCIONAR HORARIO Y CONFIRMAR CITA
// =====================================================
function selectTime(time) {
    document.querySelectorAll('.time-slot').forEach(slot => {
        if (!slot.classList.contains('ocupado')) {
            slot.classList.remove('selected');
        }
    });
    event.target.classList.add('selected');
    selectedTime = time;
}

function confirmAppointment() {
    const fecha = document.getElementById('fecha-cita').value;
    if (!fecha) { alert('Por favor selecciona una fecha.'); return; }
    if (!selectedTime) { alert('Por favor selecciona un horario.'); return; }
    
    candidateData.citaFecha = fecha;
    candidateData.citaHora = selectedTime;
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Procesando...';
    
    sendToGoogleSheets(candidateData).then(() => {
        document.querySelector('.calendar-section').style.display = 'none';
        const fechaObj = new Date(fecha + 'T12:00:00');
        const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fechaObj.toLocaleDateString('es-MX', opcionesFecha);
        document.getElementById('seccion-post-cita').style.display = 'block';
        document.getElementById('cita-confirmada-fecha').textContent = fechaFormateada;
        document.getElementById('cita-confirmada-hora').textContent = selectedTime;
        document.getElementById('email-link-final').textContent = reclutadorInfo.email;
        document.getElementById('email-link-final').href = 'mailto:' + reclutadorInfo.email;
        document.getElementById('seccion-post-cita').scrollIntoView({ behavior: 'smooth' });
    }).catch(async error => {
        if (error.message === 'DUPLICADO') {
            await guardarRechazoDuplicado();
            document.getElementById('approved-screen').classList.remove('active');
            document.getElementById('duplicado-screen').classList.add('active');
        } else {
            alert('⚠️ Hubo un problema. Intenta de nuevo.');
            btn.disabled = false;
            btn.textContent = 'Confirmar Cita →';
        }
    });
}

// =====================================================
// ENVIAR DATOS A GOOGLE SHEETS
// =====================================================
async function sendToGoogleSheets(data) {
    const formData = {
        tipo: 'pre_filtro',
        timestamp: new Date().toLocaleString('es-MX'),
        nombre: data.nombre,
        telefono: data.telefono,
        edad: data.edad,
        ubicacion: data.ubicacion,
        colonia: data.colonia,
        sucursal: data.sucursal,
        reclutadora: data.reclutadora,
        tiempoTraslado: data.tiempoTraslado,
        ingresoEsperado: data.ingresoEsperado,
        fuente: data.fuente || '',
        fuenteDetalle: data.fuenteDetalle || '',
        pregunta1: data.pregunta1, puntaje1: data.puntaje1,
        pregunta2: data.pregunta2, puntaje2: data.puntaje2,
        pregunta3: data.pregunta3, puntaje3: data.puntaje3,
        pregunta4: data.pregunta4, puntaje4: data.puntaje4,
        pregunta5: data.pregunta5, puntaje5: data.puntaje5,
        pregunta6: data.pregunta6, puntaje6: data.puntaje6,
        pregunta7: data.pregunta7, puntaje7: data.puntaje7,
        pregunta8: data.pregunta8, puntaje8: data.puntaje8,
        pregunta9: data.pregunta9, puntaje9: data.puntaje9,
        puntajeTotal: data.puntajeTotal,
        clasificacion: data.clasificacion,
        citaFecha: data.citaFecha,
        citaHora: data.citaHora,
        estado: 'Nuevo',
        cvUrl: data.cvUrl || ''
    };
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(formData),
            redirect: 'follow'
        });
        
        const result = await response.json();
        
        if (result.status === 'duplicado') {
            throw new Error('DUPLICADO');
        }
        
        return result;
    } catch (error) {
        if (error.message === 'DUPLICADO') throw error;
        
        console.log('Reintentando con no-cors...');
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        return { status: 'success' };
    }
}

// =====================================================
// ENVIAR CV POR WHATSAPP
// =====================================================
function sendCVWhatsApp() {
    const fechaObj = new Date(candidateData.citaFecha + 'T12:00:00');
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fechaObj.toLocaleDateString('es-MX', opcionesFecha);
    
    const mensaje = `Hola, buen día. Soy ${candidateData.nombre}.\n\nAcabo de completar el pre-filtro para el puesto de Agente Telefónico AT&T.\n\n📋 *Datos de mi cita:*\n📅 Fecha: ${fechaFormateada}\n🕐 Hora: ${candidateData.citaHora}\n🏢 Sucursal: ${candidateData.sucursal}\n\nAdjunto mi CV para su revisión.\n\n¡Saludos!`;
    
    if (reclutadorInfo.whatsappNumero && reclutadorInfo.whatsappNumero !== '') {
        const whatsappURL = `https://wa.me/52${reclutadorInfo.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappURL, '_blank');
    } else {
        // Sin WhatsApp configurado — abrir email con el mensaje
        const subject = encodeURIComponent(`CV - ${candidateData.nombre} - Pre-Filtro AT&T CDMX`);
        const body = encodeURIComponent(mensaje);
        window.open(`mailto:${reclutadorInfo.email}?subject=${subject}&body=${body}`, '_blank');
    }
}

// =====================================================
// SUBIDA DE CV A GOOGLE DRIVE
// =====================================================
async function handleCVUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('El archivo es demasiado grande. Máximo 5MB.');
        input.value = '';
        return;
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        alert('Formato no válido. Solo se aceptan PDF, DOC y DOCX.');
        input.value = '';
        return;
    }
    
    const label = document.getElementById('cv-file-label');
    const status = document.getElementById('cv-status');
    
    label.textContent = '⏳ Subiendo CV...';
    label.classList.remove('has-file');
    status.className = 'cv-status uploading';
    status.textContent = 'Subiendo archivo, por favor espera...';
    
    try {
        const base64 = await fileToBase64(file);
        
        const payload = {
            tipo: 'subir_cv',
            telefono: candidateData.telefono,
            nombre: candidateData.nombre,
            fileName: file.name,
            fileType: file.type,
            fileData: base64
        };
        
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload),
            redirect: 'follow'
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            label.textContent = '✅ ' + file.name;
            label.classList.add('has-file');
            status.className = 'cv-status success';
            status.textContent = '¡CV subido exitosamente!';
            candidateData.cvUrl = result.url;
            
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    tipo: 'actualizar_cv_prefiltro',
                    telefono: candidateData.telefono,
                    cvUrl: result.url
                }),
                redirect: 'follow'
            });
        } else {
            throw new Error(result.message || 'Error al subir');
        }
    } catch (error) {
        console.error('Error subiendo CV:', error);
        label.textContent = '📎 Seleccionar archivo de CV';
        label.classList.remove('has-file');
        status.className = 'cv-status error';
        status.textContent = 'Error al subir el CV. Intenta de nuevo o envíalo por WhatsApp.';
        input.value = '';
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}
