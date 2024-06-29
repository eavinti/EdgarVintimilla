# Banco

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.6.

## Servidor de desarrollo

Ejecuta `ng serve` para un servidor de desarrollo. ir a `http://localhost:4200/`.

## Ejecución de pruebas unitarias

Ejecuta `ng test` para ejecutar las pruebas unitarias a través de [Karma](https://karma-runner.github.io).

## RUTAS
- [Lista de productos](http://localhost:4200/dashboard/list)
- [Formulario de Registro](http://localhost:4200/dashboard/form)


### Hice cambios en el archivo backend main.ts para permitir cors
```
import express from 'express';
import { useExpressServer } from 'routing-controllers';
const cors = require('cors');
import 'dotenv/config';

let PORT = 3002;

// Crea una instancia de la aplicación Express
const app = express();

// Aplica el middleware CORS antes de registrar las rutas
app.use(cors({
origin: 'http://localhost:4200', // Permitir solicitudes desde Angular dev server
methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
credentials: true // Permitir envío de credenciales
}));

// Registra los controladores después de aplicar CORS
useExpressServer(app, {
routePrefix: "/bp",
controllers: [
__dirname + "/controllers/*{.js,.ts}",
],
});

// run express application on port 3002
app.listen(PORT, () => {
console.log(`Servidor Iniciado`);
console.log(`Host: http://localhost:${PORT}`);
console.log(`Fecha/Hora: ${new Date().toLocaleString()}`);
});
```
