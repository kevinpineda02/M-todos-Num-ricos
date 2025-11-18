// Funciones para la calculadora del método de Jacobi

// Variable global para almacenar las iteraciones
let iteracionesGlobales = [];

// Analizador de expresiones algebraicas
class ExpresionAlgebraica {
    constructor() {
        this.variables = new Set();
    }

    // Parsear una ecuación completa y extraer coeficientes
    parsearEcuacionCompleta(ecuacion, dimension) {
        // Limpiar espacios pero mantener estructura
        ecuacion = ecuacion.replace(/\s+/g, '');
        
        if (!ecuacion.includes('=')) {
            throw new Error('La ecuación debe contener el signo "="');
        }
        
        const [ladoIzquierdo, ladoDerecho] = ecuacion.split('=');
        
        if (!ladoIzquierdo || !ladoDerecho) {
            throw new Error('Formato de ecuación inválido');
        }
        
        // Detectar variables automáticamente
        const variablesDetectadas = this.detectarVariables(ladoIzquierdo);
        console.log('Variables detectadas:', variablesDetectadas);
        
        // Crear array de variables ordenado
        let variables;
        if (variablesDetectadas.length === dimension) {
            variables = variablesDetectadas.sort();
        } else {
            // Usar variables por defecto
            variables = [];
            for (let i = 0; i < dimension; i++) {
                variables.push(`x${i + 1}`);
            }
        }
        
        console.log('Variables finales:', variables);
        
        // Extraer coeficientes
        const coeficientes = this.extraerCoeficientesCompleto(ladoIzquierdo, variables);
        console.log('Coeficientes extraídos:', coeficientes);
        
        // Parsear término independiente
        const terminoIndependiente = parseFloat(ladoDerecho);
        if (isNaN(terminoIndependiente)) {
            throw new Error('El término independiente debe ser un número');
        }
        
        return {
            coeficientes: coeficientes,
            terminoIndependiente: terminoIndependiente,
            variables: variables
        };
    }
    
    // Detectar todas las variables en una expresión
    detectarVariables(expresion) {
        const regex = /[a-zA-Z]+\d*/g;
        const matches = expresion.match(regex) || [];
        return [...new Set(matches)]; // Eliminar duplicados
    }
    
    // Extraer coeficientes de forma más robusta
    extraerCoeficientesCompleto(expresion, variables) {
        const coeficientes = new Array(variables.length).fill(0);
        
        // Normalizar la expresión agregando + al inicio si no hay signo
        if (!expresion.startsWith('+') && !expresion.startsWith('-')) {
            expresion = '+' + expresion;
        }
        
        // Usar regex para encontrar términos con su signo
        const regex = /([+-])\s*(\d*\.?\d*)\s*([a-zA-Z]+\d*)/g;
        let match;
        
        while ((match = regex.exec(expresion)) !== null) {
            const signo = match[1] === '-' ? -1 : 1;
            const coeficiente = match[2] === '' ? 1 : parseFloat(match[2]);
            const variable = match[3];
            
            const indice = variables.indexOf(variable);
            if (indice !== -1) {
                coeficientes[indice] += signo * coeficiente;
            }
        }
        
        return coeficientes;
    }
    
    separarTerminos(expresion) {
        const terminos = [];
        let terminoActual = '';
        let esNegativo = false;
        
        for (let i = 0; i < expresion.length; i++) {
            const char = expresion[i];
            
            if (char === '+' || char === '-') {
                if (terminoActual) {
                    terminos.push(esNegativo ? '-' + terminoActual : terminoActual);
                    terminoActual = '';
                }
                esNegativo = char === '-';
            } else {
                terminoActual += char;
            }
        }
        
        if (terminoActual) {
            terminos.push(esNegativo ? '-' + terminoActual : terminoActual);
        }
        
        return terminos;
    }
    
    analizarTermino(termino) {
        // Eliminar espacios
        termino = termino.trim();
        
        // Si está vacío
        if (!termino) {
            return { coeficiente: 0, variable: null };
        }
        
        // Si es solo un número
        const numero = parseFloat(termino);
        if (!isNaN(numero)) {
            return { coeficiente: numero, variable: null };
        }
        
        // Buscar variables (letras)
        const variableMatch = termino.match(/[a-zA-Z]+\d*/);
        
        if (!variableMatch) {
            // No hay variables, intentar parsearlo como número
            const valor = parseFloat(termino);
            return { coeficiente: isNaN(valor) ? 0 : valor, variable: null };
        }
        
        const variable = variableMatch[0];
        let coeficiente = termino.replace(variable, '');
        
        // Casos especiales para coeficientes
        if (coeficiente === '' || coeficiente === '+') {
            coeficiente = 1;
        } else if (coeficiente === '-') {
            coeficiente = -1;
        } else {
            coeficiente = parseFloat(coeficiente);
            if (isNaN(coeficiente)) {
                coeficiente = 1; // Por defecto si no se puede parsear
            }
        }
        
        return { coeficiente, variable };
    }
    
    // Validar si una expresión es válida
    validarExpresion(expresion) {
        // Verificar caracteres válidos
        const caracteresValidos = /^[0-9+\-*/.()a-zA-Z\s]+$/;
        if (!caracteresValidos.test(expresion)) {
            return false;
        }
        
        // Verificar que no tenga caracteres inválidos consecutivos
        if (/[+\-*/.]{2,}/.test(expresion.replace(/\s/g, ''))) {
            return false;
        }
        
        return true;
    }
}

// Instancia global del analizador
const analizador = new ExpresionAlgebraica();

// Función para crear la matriz de entrada (solo sistemas 3x3)
function crearMatriz() {
    const dimension = 3; // Fijo en 3x3
    const container = document.getElementById('matriz-container');
    
    // Limpiar container
    container.innerHTML = '';
    
    // Asegurar que el container sea visible
    container.style.display = 'block';
    container.style.width = '100%';
    container.style.marginBottom = '20px';
    
    // Crear encabezado más prominente
    const encabezado = document.createElement('div');
    encabezado.className = 'matriz-encabezado';
    encabezado.style.marginBottom = '25px';
    encabezado.innerHTML = `
        <h4 style="color: #FFD700; text-align: center; margin-bottom: 15px; font-size: 1.3rem; font-weight: bold;">Sistema de Ecuaciones 3x3</h4>
        <p style="color: #ffeb3b; text-align: center; margin-bottom: 15px; font-size: 1rem;  padding: 10px; border-radius: 8px;">
            <strong>Formato:</strong> Escriba cada ecuación completa como: <strong>x - 2y - 3z = -1</strong>
        </p>
    `;
    container.appendChild(encabezado);
    
    // Crear container principal para las ecuaciones
    const ecuacionesContainer = document.createElement('div');
    ecuacionesContainer.style.background = 'rgba(255, 255, 255, 0.05)';
    ecuacionesContainer.style.padding = '20px';
    ecuacionesContainer.style.borderRadius = '12px';
    ecuacionesContainer.style.border = '2px solid rgba(255, 215, 0, 0.3)';
    ecuacionesContainer.style.marginBottom = '20px';
    
    // Placeholders específicos para 3x3
    const placeholders = [
        'x - 2y - 3z = -1',
        '2x + y + z = 6',
        'x + 3y - 2z = 13'
    ];
    
    // Crear inputs para las 3 ecuaciones
    for (let i = 0; i < 3; i++) {
        const filaContainer = document.createElement('div');
        filaContainer.style.marginBottom = '20px';
        filaContainer.style.display = 'flex';
        filaContainer.style.alignItems = 'center';
        filaContainer.style.gap = '15px';
        filaContainer.style.background = 'rgba(255, 255, 255, 0.08)';
        filaContainer.style.padding = '15px';
        filaContainer.style.borderRadius = '8px';
        filaContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        
        // Etiqueta de ecuación
        const etiqueta = document.createElement('span');
        etiqueta.textContent = `Ecuación ${i + 1}:`;
        etiqueta.style.color = '#FFD700';
        etiqueta.style.fontWeight = 'bold';
        etiqueta.style.minWidth = '120px';
        etiqueta.style.fontSize = '1.1rem';
        
        // Input principal para la ecuación
        const inputEcuacion = document.createElement('input');
        inputEcuacion.type = 'text';
        inputEcuacion.className = 'ecuacion-input-principal';
        inputEcuacion.id = `ecuacion_completa_${i}`;
        inputEcuacion.style.flex = '1';
        inputEcuacion.style.padding = '15px 18px';
        inputEcuacion.style.fontSize = '1.1rem';
        inputEcuacion.style.borderRadius = '8px';
        inputEcuacion.style.border = '2px solid #4CAF50';
        inputEcuacion.style.backgroundColor = 'white';
        inputEcuacion.style.color = '#333';
        inputEcuacion.style.transition = 'all 0.3s ease';
        inputEcuacion.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        
        inputEcuacion.placeholder = placeholders[i];
        
        // Eventos para mejorar UX
        inputEcuacion.addEventListener('focus', function() {
            this.style.borderColor = '#2196F3';
            this.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.4)';
            this.style.transform = 'scale(1.02)';
        });
        
        inputEcuacion.addEventListener('blur', function() {
            this.style.borderColor = '#4CAF50';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            this.style.transform = 'scale(1)';
        });
        
        // Validación en tiempo real
        inputEcuacion.addEventListener('input', function() {
            const valor = this.value.trim();
            if (valor && !valor.includes('=')) {
                this.style.borderColor = '#ff9800';
                this.style.backgroundColor = '#fff3e0';
            } else if (valor && valor.includes('=')) {
                this.style.borderColor = '#4CAF50';
                this.style.backgroundColor = '#e8f5e8';
            } else {
                this.style.borderColor = '#4CAF50';
                this.style.backgroundColor = 'white';
            }
        });
        
        filaContainer.appendChild(etiqueta);
        filaContainer.appendChild(inputEcuacion);
        ecuacionesContainer.appendChild(filaContainer);
    }
    
    container.appendChild(ecuacionesContainer);
    
    // Agregar ejemplos y ayuda más prominente
    const ayudaContainer = document.createElement('div');
    ayudaContainer.style.marginTop = '20px';
    ayudaContainer.style.padding = '20px';
    ayudaContainer.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    ayudaContainer.style.borderRadius = '12px';
    ayudaContainer.style.border = '2px solid rgba(76, 175, 80, 0.3)';
    ayudaContainer.innerHTML = `
        <h4 style="color: #4CAF50; margin-bottom: 15px; font-size: 1.1rem;">Ejemplo del sistema 3x3:</h4>
        <div style="color: #e0e0e0; font-size: 1rem; line-height: 1.8;">
            <p style="margin: 8px 0;"><span style="color: #4CAF50;">✓</span> <strong>x - 2y - 3z = -1</strong></p>
            <p style="margin: 8px 0;"><span style="color: #4CAF50;">✓</span> <strong>2x + y + z = 6</strong></p>
            <p style="margin: 8px 0;"><span style="color: #4CAF50;">✓</span> <strong>x + 3y - 2z = 13</strong></p>
        </div>
        <button onclick="cargarEjemploSistema()" style="
            margin-top: 15px;
            padding: 12px 20px;
            background: linear-gradient(45deg, #2196F3, #1976D2);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Cargar Ejemplo
        </button>
    `;
    container.appendChild(ayudaContainer);
    
    // Limpiar resultados
    document.getElementById('resultados-container').innerHTML = '<p>Ingrese un sistema de ecuaciones para ver los resultados.</p>';
    document.getElementById('iteraciones-detalle').style.display = 'none';
    
    console.log('Matriz 3x3 creada con 3 inputs de ecuación');
}

// Función para cargar el ejemplo del sistema 3x3
function cargarEjemploSistema() {
    const ecuacionesEjemplo = [
        'x - 2y - 3z = -1',
        '2x + y + z = 6',
        'x + 3y - 2z = 13'
    ];
    
    // Rellenar los 3 inputs con el ejemplo
    for (let i = 0; i < 3; i++) {
        const input = document.getElementById(`ecuacion_completa_${i}`);
        if (input) {
            input.value = ecuacionesEjemplo[i];
            // Activar validación visual
            input.style.borderColor = '#4CAF50';
            input.style.backgroundColor = '#e8f5e8';
            // Disparar evento para activar validación
            input.dispatchEvent(new Event('input'));
        }
    }
    
    // Mostrar mensaje de confirmación
    const mensaje = document.createElement('div');
    mensaje.style.position = 'fixed';
    mensaje.style.top = '50%';
    mensaje.style.left = '50%';
    mensaje.style.transform = 'translate(-50%, -50%)';
    mensaje.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    mensaje.style.color = 'white';
    mensaje.style.padding = '15px 25px';
    mensaje.style.borderRadius = '8px';
    mensaje.style.fontSize = '1.1rem';
    mensaje.style.fontWeight = 'bold';
    mensaje.style.zIndex = '10000';
    mensaje.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    mensaje.innerHTML = 'Ejemplo 3x3 cargado correctamente';
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        document.body.removeChild(mensaje);
    }, 2000);
    
    console.log('Ejemplo 3x3 cargado correctamente');
}

// Función para verificar si la matriz es diagonalmente dominante
function esDiagonalmenteDominante(matriz) {
    const n = matriz.length;
    
    for (let i = 0; i < n; i++) {
        let sumaFila = 0;
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                sumaFila += Math.abs(matriz[i][j]);
            }
        }
        if (Math.abs(matriz[i][i]) < sumaFila) {
            return false;
        }
    }
    return true;
}

// Función para generar todas las permutaciones de un array
function permutaciones(arr) {
    if (arr.length <= 1) return [arr];
    
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        const perms = permutaciones(rest);
        for (let perm of perms) {
            result.push([arr[i]].concat(perm));
        }
    }
    return result;
}

// Función para reordenar filas si es posible
function intentarReordenar(A, b) {
    const n = A.length;
    const indices = Array.from({length: n}, (_, i) => i);
    const perms = permutaciones(indices);
    
    for (let perm of perms) {
        // Crear matriz reordenada
        const A_reordenada = perm.map(i => [...A[i]]);
        const b_reordenado = perm.map(i => b[i]);
        
        if (esDiagonalmenteDominante(A_reordenada)) {
            return {
                matriz: A_reordenada,
                vector: b_reordenado,
                reordenado: true,
                permutacion: perm
            };
        }
    }
    
    return {
        matriz: A,
        vector: b,
        reordenado: false,
        permutacion: null
    };
}

// Función principal para resolver el sistema usando el método de Jacobi
function resolverJacobi() {
    try {
        const dimension = 3; // Fijo en 3x3
        const tolerancia = parseFloat(document.getElementById('tolerancia').value);
        const maxIteraciones = parseInt(document.getElementById('iteraciones-max').value);
        
        // Obtener y procesar las 3 ecuaciones
        const A = [];
        const b = [];
        let variables = [];
        
        console.log('Iniciando procesamiento de 3 ecuaciones...');
        
        for (let i = 0; i < 3; i++) {
            const ecuacionCompleta = document.getElementById(`ecuacion_completa_${i}`).value.trim();
            
            if (!ecuacionCompleta) {
                throw new Error(`Por favor, ingrese la ecuación ${i + 1}`);
            }
            
            console.log(`Procesando ecuación ${i + 1}: ${ecuacionCompleta}`);
            
            try {
                const resultado = analizador.parsearEcuacionCompleta(ecuacionCompleta, 3);
                
                // Usar las variables de la primera ecuación como referencia
                if (i === 0) {
                    variables = resultado.variables;
                    console.log('Variables establecidas:', variables);
                }
                
                A.push(resultado.coeficientes);
                b.push(resultado.terminoIndependiente);
                
                console.log(`Ecuación ${i + 1} - Coeficientes:`, resultado.coeficientes, 'Término:', resultado.terminoIndependiente);
                
            } catch (error) {
                console.error(`Error en ecuación ${i + 1}:`, error);
                throw new Error(`Error en ecuación ${i + 1}: ${error.message}`);
            }
        }
        
        console.log('Matriz A completa:', A);
        console.log('Vector b completo:', b);
        console.log('Variables finales:', variables);
        
        // Verificar que tenemos una matriz 3x3 válida
        if (A.length !== 3 || A.some(fila => fila.length !== 3)) {
            throw new Error('Error interno: la matriz no tiene las dimensiones 3x3 correctas');
        }
        
        // Verificar que la diagonal no tenga ceros
        for (let i = 0; i < 3; i++) {
            if (Math.abs(A[i][i]) < 1e-10) {
                throw new Error(`El coeficiente de ${variables[i]} en la ecuación ${i + 1} es cero. El método de Jacobi requiere elementos diagonales no nulos.`);
            }
        }
        
        // Verificar convergencia (diagonal dominante) y reordenar si es necesario
        let matrizFinal = A;
        let vectorFinal = b;
        
        if (!esDiagonalmenteDominante(A)) {
            const resultadoReordenamiento = intentarReordenar(A, b);
            
            if (resultadoReordenamiento.reordenado) {
                matrizFinal = resultadoReordenamiento.matriz;
                vectorFinal = resultadoReordenamiento.vector;
            }
        }
        
        const esDominante = esDiagonalmenteDominante(matrizFinal);
        
        // Resolver usando el método de Jacobi
        const resultado = metodosJacobi(matrizFinal, vectorFinal, tolerancia, maxIteraciones);
        
        // Mostrar resultados con nombres de variables reales
        mostrarResultados(resultado, esDominante, variables);
        
    } catch (error) {
        console.error('Error en resolverJacobi:', error);
        document.getElementById('resultados-container').innerHTML = 
            `<div style="color: #ff6b6b; background: rgba(255,107,107,0.1); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                <strong> Error:</strong> ${error.message}
            </div>
            <div style="color: #ffeb3b; background: rgba(255, 235, 59, 0.1); padding: 15px; border-radius: 8px; font-size: 0.9rem;">
                <strong> Ayuda:</strong> Verifique que cada ecuación tenga el formato correcto:
                <br>• Use el signo = para separar lados
                <br>• Ejemplo: x + 2y - 3z = 1
                <br>• Los coeficientes diagonales no pueden ser cero
                <br>• Asegúrese de que cada variable aparezca en cada ecuación
            </div>`;
        document.getElementById('iteraciones-detalle').style.display = 'none';
    }
}

// Implementación del método de Jacobi (precisión: 4 decimales)
function metodosJacobi(A, b, tolerancia, maxIteraciones) {
    const n = A.length;
    let x = new Array(n).fill(0); // Valores iniciales
    let iteraciones = [];
    let haConvergido = false;
    
    console.log('=== MÉTODO DE JACOBI ===');
    console.log('Sistema: ', A, 'b:', b);
    console.log('Tolerancia:', tolerancia, 'Max iteraciones:', maxIteraciones);
    
    for (let k = 0; k < maxIteraciones; k++) {
        let xNuevo = new Array(n).fill(0);
        
        // Calcular nueva aproximación usando el método de Jacobi
        for (let i = 0; i < n; i++) {
            let suma = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    suma += A[i][j] * x[j]; // Usar valores de iteración anterior
                }
            }
            xNuevo[i] = (b[i] - suma) / A[i][i];
        }
        
        // Mostrar iteración actual
        console.log(`Iteración ${k + 1}: x=${xNuevo[0].toFixed(4)}, y=${xNuevo[1].toFixed(4)}, z=${xNuevo[2].toFixed(4)}`);
        
        // Guardar iteración
        iteraciones.push({
            iteracion: k + 1,
            x: [...xNuevo]
        });
        
        // Verificar criterio de convergencia: 4 decimales iguales consecutivos
        let convergioEstaIteracion = false;
        
        if (k >= 3) { // Necesitamos al menos 4 iteraciones para comparar
            // Verificar que los últimos 4 valores sean exactamente iguales en 4 decimales
            let ultimaIteracion = iteraciones[iteraciones.length - 1];      // k+1
            let penultimaIteracion = iteraciones[iteraciones.length - 2];   // k
            let antepenultimaIteracion = iteraciones[iteraciones.length - 3]; // k-1
            let cuartaIteracion = iteraciones[iteraciones.length - 4];      // k-2
            
            let todosIguales = true;
            for (let i = 0; i < n; i++) {
                const val1 = ultimaIteracion.x[i].toFixed(4);
                const val2 = penultimaIteracion.x[i].toFixed(4);
                const val3 = antepenultimaIteracion.x[i].toFixed(4);
                const val4 = cuartaIteracion.x[i].toFixed(4);
                
                if (val1 !== val2 || val2 !== val3 || val3 !== val4) {
                    todosIguales = false;
                    break;
                }
            }
            
            convergioEstaIteracion = todosIguales;
            console.log(`Iteración ${k + 1}: Verificando convergencia (4 decimales iguales): ${convergioEstaIteracion}`);
        }
        
        // Si converge, hacer 3 iteraciones adicionales y terminar
        if (convergioEstaIteracion) {
            console.log(`¡CONVERGENCIA DETECTADA en iteración ${k + 1}!`);
            haConvergido = true;
            
            // Realizar 3 iteraciones adicionales
            let xConvergencia = [...xNuevo];
            const iteracionesExtras = 3;
            
            for (let extra = 1; extra <= iteracionesExtras; extra++) {
                if ((k + 1 + extra) > maxIteraciones) break;
                
                let xExtra = new Array(n).fill(0);
                
                // Calcular iteración adicional
                for (let i = 0; i < n; i++) {
                    let suma = 0;
                    for (let j = 0; j < n; j++) {
                        if (i !== j) {
                            suma += A[i][j] * xConvergencia[j];
                        }
                    }
                    xExtra[i] = (b[i] - suma) / A[i][i];
                }
                
                console.log(`Iteración ${k + 1 + extra}: x=${xExtra[0].toFixed(4)}, y=${xExtra[1].toFixed(4)}, z=${xExtra[2].toFixed(4)} - Extra ${extra}/3`);
                
                // Guardar iteración extra
                iteraciones.push({
                    iteracion: k + 1 + extra,
                    x: [...xExtra]
                });
                
                xConvergencia = [...xExtra];
            }
            
            // Retornar con convergencia
            iteracionesGlobales = iteraciones;
            return {
                solucion: xNuevo, // Usar la solución donde se detectó convergencia
                iteraciones: iteraciones,
                convergio: true
            };
        }
        
        // Actualizar x para la siguiente iteración
        x = [...xNuevo];
    }
    
    // Si llegamos aquí, no converge
    console.log(`NO CONVERGIÓ después de ${maxIteraciones} iteraciones`);
    iteracionesGlobales = iteraciones;
    
    return {
        solucion: x,
        iteraciones: iteraciones,
        convergio: false
    };
}

// Función para mostrar los resultados
function mostrarResultados(resultado, esDominante, variables = null) {
    const container = document.getElementById('resultados-container');
    
    // Si no se proporcionan variables, usar nombres por defecto
    if (!variables) {
        variables = [];
        for (let i = 0; i < resultado.solucion.length; i++) {
            variables.push(`x${i + 1}`);
        }
    }
    
    // Mostrar información de la matriz del sistema
    let html = '';
    
    // Mostrar resultados en un panel neutral
    html += `
        <div style="background: rgba(76, 175, 80, 0.1); padding: 20px; border-radius: 10px; margin-bottom: 15px; border-left: 4px solid #4CAF50;">
            <div style="color: white; font-size: 16px; text-align: center; margin-bottom: 15px;">
                <strong>Resultado final aproximado:</strong>
            </div>
            <div style="margin-top: 10px;">
    `;
    
    resultado.solucion.forEach((valor, i) => {
        html += `
            <div style="color: #E8F5E8; padding: 12px; margin: 8px 0; background: rgba(76, 175, 80, 0.2); border-radius: 8px; font-family: 'Courier New', monospace; font-size: 1.1rem; text-align: center;">
                ${variables[i]} ≈ ${valor.toFixed(4)}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    container.style.display = 'block';
    
    // Mostrar tabla de iteraciones (primeras 20 como en Python)
    mostrarTablaIteraciones(variables);
}

// Función para mostrar la tabla detallada de iteraciones (sistemas 3x3)
function mostrarTablaIteraciones(variables = null) {
    const detalleContainer = document.getElementById('iteraciones-detalle');
    const tablaContainer = document.getElementById('tabla-iteraciones');
    
    if (iteracionesGlobales.length === 0) {
        detalleContainer.style.display = 'none';
        return;
    }
    
    const dimension = 3; // Fijo en 3x3
    
    // Si no se proporcionan variables, usar nombres por defecto
    if (!variables) {
        variables = ['x', 'y', 'z'];
    }
    
    let html = '<table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;">' +
               '<thead>' +
               '<tr style="background: rgba(255,255,255,0.2);">' +
               '<th style="padding: 10px; color: white; border: 1px solid rgba(255,255,255,0.3);">Iteración</th>';
    
    for (let i = 0; i < 3; i++) {
        html += '<th style="padding: 10px; color: white; border: 1px solid rgba(255,255,255,0.3);">' + variables[i] + '</th>';
    }
    
    html += '</tr></thead><tbody>';
    
    // Agregar fila inicial (valores iniciales)
    html += '<tr>' +
            '<td style="padding: 8px; color: white; border: 1px solid rgba(255,255,255,0.3); text-align: center;">0</td>';
    
    for (let i = 0; i < 3; i++) {
        html += '<td style="padding: 8px; color: white; border: 1px solid rgba(255,255,255,0.3); text-align: center;">0.0000</td>';
    }
    html += '</tr>';
    
    // Agregar todas las iteraciones hasta convergencia (o máximo 50)
    const maxIteracionesAMostrar = 50;
    const iteracionesAMostrar = iteracionesGlobales.slice(0, maxIteracionesAMostrar);
    
    iteracionesAMostrar.forEach(iter => {
        html += '<tr>' +
                '<td style="padding: 8px; color: white; border: 1px solid rgba(255,255,255,0.3); text-align: center;">' + iter.iteracion + '</td>';
        
        iter.x.forEach(valor => {
            html += '<td style="padding: 8px; color: white; border: 1px solid rgba(255,255,255,0.3); text-align: center;">' + valor.toFixed(4) + '</td>';
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    
    // Agregar información sobre las iteraciones mostradas
    const totalIteraciones = iteracionesGlobales.length;
    const iteracionesMostradas = Math.min(totalIteraciones, maxIteracionesAMostrar);
    
    if (totalIteraciones <= maxIteracionesAMostrar) {
        html += `<p style="color: #4CAF50; text-align: center; margin-top: 10px; font-size: 0.9rem;">
                    Mostrando todas las ${totalIteraciones} iteraciones realizadas
                 </p>`;
    } else {
        html += `<p style="color: #ff9800; text-align: center; margin-top: 10px; font-size: 0.9rem;">
                    Mostrando las primeras ${iteracionesMostradas} de ${totalIteraciones} iteraciones
                 </p>`;
    }
    
    // *** CAMBIO: Agregar botón de descarga Excel ***
    html += `
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="descargarExcel()" style="
                padding: 12px 30px;
                background: linear-gradient(45deg, #4CAF50, #45a049);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.5)';" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)';">
                Descargar Tabla
            </button>
        </div>
    `;

    tablaContainer.innerHTML = html;
    detalleContainer.style.display = 'block';
}

// *** NUEVA FUNCIÓN: Descargar tabla como Excel ***
function descargarExcel() {
    try {
        // Verificar que SheetJS esté cargado
        if (typeof XLSX === 'undefined') {
            alert('Error: La biblioteca SheetJS no está cargada. Por favor, recargue la página.');
            return;
        }
        
        if (iteracionesGlobales.length === 0) {
            alert('No hay datos de iteraciones para exportar.');
            return;
        }
        
        // Obtener variables (x, y, z por defecto)
        const variables = ['x', 'y', 'z'];
        
        // Crear datos para Excel
        const datosExcel = [];
        
        // Agregar encabezados
        const encabezados = ['Iteración', ...variables];
        datosExcel.push(encabezados);
        
        // Agregar fila inicial (iteración 0)
        datosExcel.push([0, 0.0000, 0.0000, 0.0000]);
        
        // Agregar todas las iteraciones
        iteracionesGlobales.forEach(iter => {
            const fila = [iter.iteracion];
            iter.x.forEach(valor => {
                fila.push(parseFloat(valor.toFixed(4)));
            });
            datosExcel.push(fila);
        });
        
        // Crear libro de trabajo (workbook)
        const wb = XLSX.utils.book_new();
        
        // Crear hoja de trabajo (worksheet) desde los datos
        const ws = XLSX.utils.aoa_to_sheet(datosExcel);
        
        // Configurar ancho de columnas
        ws['!cols'] = [
            { wch: 12 },  // Iteración
            { wch: 12 },  // x
            { wch: 12 },  // y
            { wch: 12 }   // z
        ];
        
        // Agregar la hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Iteraciones Jacobi');
        
        // Generar nombre de archivo con fecha y hora
        const fecha = new Date();
        const nombreArchivo = `jacobi_iteraciones_${fecha.getFullYear()}${(fecha.getMonth()+1).toString().padStart(2,'0')}${fecha.getDate().toString().padStart(2,'0')}_${fecha.getHours()}${fecha.getMinutes()}${fecha.getSeconds()}.xlsx`;
        
        // Descargar el archivo
        XLSX.writeFile(wb, nombreArchivo);
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito('✅ Archivo Excel descargado correctamente');
        
        console.log('Archivo Excel generado:', nombreArchivo);
        console.log('Total de filas exportadas:', datosExcel.length - 1); // -1 por los encabezados
        
    } catch (error) {
        console.error('Error al generar archivo Excel:', error);
        alert('Error al generar el archivo Excel: ' + error.message);
    }
}

// Función auxiliar para mostrar mensajes de éxito
function mostrarMensajeExito(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.style.position = 'fixed';
    mensajeDiv.style.top = '50%';
    mensajeDiv.style.left = '50%';
    mensajeDiv.style.transform = 'translate(-50%, -50%)';
    mensajeDiv.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
    mensajeDiv.style.color = 'white';
    mensajeDiv.style.padding = '20px 30px';
    mensajeDiv.style.borderRadius = '10px';
    mensajeDiv.style.fontSize = '1.2rem';
    mensajeDiv.style.fontWeight = 'bold';
    mensajeDiv.style.zIndex = '10000';
    mensajeDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    mensajeDiv.innerHTML = mensaje;
    
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.style.opacity = '0';
        mensajeDiv.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(mensajeDiv);
        }, 500);
    }, 2000);
}

// Navegación suave
function navegacionSuave() {
    const enlaces = document.querySelectorAll('nav a');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else if (href === '#calculadora') {
                e.preventDefault();
                const calculadora = document.getElementById('calculadora');
                if (calculadora) {
                    calculadora.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Crear matriz inicial
    crearMatriz();
    
    // Configurar navegación
    navegacionSuave();
    
    // Agregar solo el botón de resolver
    const inputSistema = document.querySelector('.input-sistema');
    if (inputSistema) {
        // Verificar que el botón de resolver ya existe
        const btnCalcular = inputSistema.querySelector('.btn-calcular');
        if (btnCalcular) {
            btnCalcular.textContent = 'Resolver Sistema';
        }
    }
    
    // Actualizar enlaces de navegación
    const enlaces = document.querySelectorAll('nav a');
    if (enlaces.length >= 3) {
        enlaces[1].href = '#';
        enlaces[1].textContent = '¿Qué es Jacobi?';
        enlaces[1].onclick = function(e) {
            e.preventDefault();
            document.querySelector('.contenedor-secundario').scrollIntoView({
                behavior: 'smooth'
            });
        };
        
        enlaces[2].href = '#calculadora';
        enlaces[2].textContent = 'Calculadora';
    }
    
    // Intersection Observer para controlar la reproducción del video
    const videoFondo = document.querySelector('.video-fondo');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    
    if (videoFondo && contenedorPrincipal) {
        // Crear el observer
        const observerOptions = {
            root: null, // Usar el viewport como root
            threshold: 0.3, // Activar cuando el 30% del contenedor sea visible
            rootMargin: '0px'
        };
        
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // El contenedor principal es visible, reproducir video
                    videoFondo.play().catch(error => {
                        console.log('No se pudo reproducir el video automáticamente:', error);
                    });
                } else {
                    // El contenedor principal no es visible, pausar video
                    videoFondo.pause();
                }
            });
        }, observerOptions);
        
        // Observar el contenedor principal
        videoObserver.observe(contenedorPrincipal);
        
        console.log('Observer de video configurado correctamente');
    } else {
        console.log('No se encontró el video o el contenedor principal');
    }
});