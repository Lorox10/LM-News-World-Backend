# LM-News-World-Backend 
Backend para **LM News World**, una aplicación que proporciona noticias en tiempo real. Este servicio está diseñado con node y sigue una arquitectura RESTful. 

## Tabla de Contenidos 
- [Instalación](#instalación) 
- [Configuración](#configuración) 
- [Endpoints](#endpoints) 
- [Estructura del Proyecto](#estructura-del-proyecto) 
- [Manejo de Errores](#manejo-de-errores) 
 
## Instalación
    ```bash
   git clone https://github.com/Lorox10/LM-News-World-Backend.git
   cd LM-News-World-Backend

   npm install

    node Server.js
    ```


## Configuración
Agrega un archivo .env con las siguientes variables:

DATABASE_URL=tu_database_url
API_KEY=tu_api_key


## Endpoints

# Autenticación
POST /api/auth/register - Registro de usuario
POST /api/auth/login - Inicio de sesión

# Noticias
GET /api/news - Lista noticias recientes
GET /api/news/{id} - Detalles de una noticia específica

##Estructura del proyecto

├── src
│   ├── controllers    # Controladores de la API
│   ├── models         # Modelos de datos
│   ├── routes         # Rutas de la API
│   ├── services       # Servicios de negocio
│   └── utils          # Utilidades y helpers
└── tests              # Pruebas unitarias


## Manejo de errores

* 404 Not Found - Recurso no encontrado
* 401 Unauthorized - Acceso no autorizado