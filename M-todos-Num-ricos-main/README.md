# 📊 Métodos Numéricos - Sistema de Ecuaciones con Jacobi

Una aplicación web interactiva para aprender y aplicar el **Método de Jacobi** en la resolución de sistemas de ecuaciones lineales.

![Proyecto Preview](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 🎯 Descripción

Este proyecto educativo presenta una implementación visual e interactiva del **Método de Jacobi**, un algoritmo iterativo fundamental en métodos numéricos para resolver sistemas de ecuaciones lineales del tipo **Ax = b**.

### ¿Qué es el Método de Jacobi?

El método de Jacobi es un método iterativo usado para resolver sistemas de ecuaciones lineales donde:
- **A** es una matriz cuadrada de coeficientes
- **x** es el vector columna de las incógnitas  
- **b** es el vector columna de términos independientes

El algoritmo toma su nombre del matemático alemán **Carl Gustav Jakob Jacobi** y consiste en usar fórmulas como iteración de punto fijo.

## ✨ Características

- 🎨 **Interfaz Moderna**: Diseño responsivo con gradientes dorados y efectos visuales
- 📱 **Responsive Design**: Optimizado para dispositivos móviles, tablets y desktop
- 🧮 **Calculadora Integrada**: Herramienta para resolver sistemas de ecuaciones
- 📊 **Visualización**: Explicación gráfica del método con ejemplos prácticos
- 🎥 **Fondo Dinámico**: Video de fondo con efectos matemáticos
- ⚡ **Navegación Suave**: Scroll suave entre secciones

## 🚀 Demo

[🔗 Ver Demo en Vivo](#) *(Próximamente)*

## 📁 Estructura del Proyecto

```
Metodos Numericos/
│
├── 📄 index.html          # Página principal
├── 🎨 styles.css          # Estilos y diseño responsivo
├── ⚙️ script.js           # Lógica de la aplicación
├── 🐍 ytdeploy.py         # Script de despliegue
├── 📖 README.md           # Documentación del proyecto
│
├── 📁 elementos/
│   └── elemento.jpg       # Imagen explicativa del método
│
└── 📁 fondos/
    ├── 117606-712421887_small.mp4  # Video de fondo
    └── fondo2.jpg                   # Imagen de fondo alternativa
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| HTML5 | Latest | Estructura y contenido |
| CSS3 | Latest | Estilos y animaciones |
| JavaScript | ES6+ | Interactividad y lógica |
| Python | 3.x | Scripts de despliegue |

### Características CSS Destacadas:
- ✅ **Flexbox** para layouts responsivos
- ✅ **CSS Grid** para organización de contenido
- ✅ **Gradientes** y efectos visuales
- ✅ **Media Queries** para responsividad
- ✅ **Animaciones** suaves con transforms
- ✅ **Variables CSS** para consistencia de colores

## 🎮 Instalación y Uso

### Prerrequisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   git clone [URL-del-repositorio]
   cd "Metodos Numericos"
   ```

2. **Abrir en navegador**
   ```bash
   # Opción 1: Abrir directamente
   open index.html
   
   # Opción 2: Servidor local con Python
   python -m http.server 8000
   # Luego visitar: http://localhost:8000
   ```

3. **¡Listo!** 🎉
   La aplicación estará funcionando en tu navegador.

## 📱 Responsividad

El proyecto está optimizado para múltiples dispositivos:

| Dispositivo | Breakpoint | Características |
|-------------|------------|-----------------|
| 📱 Móviles | ≤ 480px | Layout vertical, botones adaptados |
| 📱 Móviles L | ≤ 768px | Tipografía ajustada, imágenes responsivas |
| 💻 Tablets | ≤ 1024px | Contenido en columnas, navegación optimizada |
| 🖥️ Desktop | > 1024px | Layout completo, efectos visuales completos |

## 🎨 Paleta de Colores

```css
:root {
    --color-fondo: #1a1a1a;     /* Fondo principal */
    --color-texto: #ffffff;      /* Texto principal */
    --color-primario: #FFDA61;   /* Dorado principal */
    --color-secundario: #FFCB05; /* Dorado secundario */
    --color-acento: #FF6B35;     /* Color de acento */
}
```

## 🔧 Funcionalidades

### 🏠 Página Principal
- Hero section con título animado
- Botones de call-to-action
- Video de fondo matemático

### 📚 Sección Educativa
- Explicación del método de Jacobi
- Ejemplo visual paso a paso
- Fórmulas matemáticas renderizadas

### 🧮 Calculadora (En desarrollo)
- Input para matrices y vectores
- Cálculo iterativo en tiempo real
- Visualización de convergencia

### 📱 Navegación
- Header fijo responsivo
- Scroll suave entre secciones
- Botón flotante para calculadora

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Áreas de Mejora
- [ ] Implementar calculadora completa
- [ ] Agregar más métodos numéricos
- [ ] Mejorar animaciones
- [ ] Agregar tests unitarios
- [ ] Documentación de API

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Kevin** - *Desarrollador Principal* - [@tu-usuario](#)

## 🙏 Agradecimientos

- **Carl Gustav Jakob Jacobi** - Por el método matemático
- Comunidad de desarrolladores web
- Recursos educativos de métodos numéricos

## 📞 Contacto

¿Tienes preguntas o sugerencias?

- 📧 Email: [tu-email@example.com](#)
- 💼 LinkedIn: [Tu perfil](#)
- 🐱 GitHub: [@tu-usuario](#)

---

### 📊 Estadísticas del Proyecto

![Líneas de código](https://img.shields.io/badge/Líneas%20de%20código-1000+-blue)
![Archivos](https://img.shields.io/badge/Archivos-6-green)
![Commits](https://img.shields.io/badge/Commits-20+-orange)

---

**⭐ Si te gusta este proyecto, ¡dale una estrella!**

*Hecho con ❤️ para la educación en métodos numéricos*