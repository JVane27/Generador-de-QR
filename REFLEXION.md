# Reflexión sobre el Proyecto Generador de QR

A continuación se responden las preguntas planteadas para la Opción C del taller:

### 1. ¿Qué diferencia hay entre el método GET y POST en un formulario HTML? ¿Por qué usamos POST aquí?

*   **Diferencias principales:**
    *   **GET:** Envía los datos del formulario anexados a la URL como parámetros (query string). Es ideal para solicitudes que no cambian el estado del servidor (como búsquedas o filtros). Tiene un límite de longitud (dependiendo del navegador) y los datos son visibles en el historial, cachés y marcadores.
    *   **POST:** Envía los datos en el cuerpo (body) de la petición HTTP, ocultos de la URL. No tiene un límite estricto de tamaño y es el método semánticamente correcto cuando se envía información sensible o cuando la acción implica crear o modificar recursos en el servidor.
*   **¿Por qué usamos POST aquí?:** Lo usamos principalmente porque estamos enviando un texto que podría ser largo (superando los límites amigables de una URL) y estamos realizando una acción concreta: "generar" algo nuevo y guardar el historial en nuestro backend. Además, mantiene la URL limpia y evita que el texto ingresado quede guardado accidentalmente en el historial del navegador del usuario de forma explícita en la barra de direcciones.

### 2. La URL del QR generado es predecible: cualquiera puede construirla. ¿Es eso un problema de seguridad? ¿En qué caso sí y en qué caso no?

Sí, puede ser un problema de seguridad, pero depende completamente del tipo de datos que el usuario esté convirtiendo en QR.

*   **¿En qué caso NO es un problema?**
    Si el usuario genera un QR para un sitio web público (ej. su portafolio, el menú de un restaurante público, o un canal de YouTube). Como la información ya es pública, no importa si la URL de la API es predecible o interceptable.
*   **¿En qué caso SÍ es un problema?**
    Si el usuario genera QRs con **información sensible**, personal o confidencial (ej. contraseñas de WiFi, enlaces internos de una empresa, datos de contacto privados o tokens de acceso). Al ser una URL de API construida mediante GET (`.../?data=SECRETO`), cualquier persona que intercepte el tráfico web, o incluso la misma API de terceros (`goqr.me`), podría leer y registrar esta información confidencial en sus logs.

### 3. ¿Cómo guardarías el historial de QR generados entre sesiones del usuario? (Sin implementarlo, solo explicación)

Para guardar el historial de forma que persista incluso si el usuario cierra el navegador o apaga la computadora, existen dos enfoques principales:

*   **Enfoque del lado del Cliente (Frontend):**
    Utilizaría la **Web Storage API**, específicamente `localStorage`. Al generar un QR, guardaría un objeto JSON con el texto y la fecha en el `localStorage` del navegador. Al cargar la página de historial, leería ese `localStorage` y pintaría los QRs. Esta es la forma más rápida y sin backend, pero el historial solo vivirá en ese navegador específico de ese dispositivo.
*   **Enfoque del lado del Servidor (Backend con Autenticación):**
    Si quiero que el usuario vea su historial en su celular y en su computadora, necesitaría implementar un sistema de **autenticación** (usuarios y contraseñas o login con Google). Guardaría cada generación de QR en una **Base de Datos** real (como PostgreSQL, MongoDB o MySQL) asociada al ID de ese usuario. Al iniciar sesión en cualquier dispositivo, el servidor consultaría la base de datos y le enviaría su historial completo.
