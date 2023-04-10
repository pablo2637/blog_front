# Blog

En este blog hay 2 tipos de usuario:
- **User** *(usuario normal)*
- **Admin** *(usuario administrador)*

| Acción                    |            User           |   Admin  |
|---------------------------|:-------------------------:|:--------:|
| Login                     |             ✔             |     ✔    |
| Registrarse               |             ✔             |     ❌    |
| Cambiar contraseña        |             ✔             |     ✔    |
| Ver entradas              |             ✔             |     ✔    |
| Editar entradas           | ✔ \**Sólo las que ha creado* | ✔ \**Todas* |
| Eliminar entradas         |             ❌             |     ✔    |
| Crear entradas            |             ✔             |     ❌    |
| Acceder a vistas de user  |             ✔             |     ❌    |
| Acceder a vistas de admin |             ❌             |     ✔    |****

---
## Operativa:
Es necesario **registrarse** para poder acceder, o **logearse**, si el usuario ya se ha registrado con anterioridad.
Las rutas estan protegidas por tipo de usuario, es decir que el *admin* no puede acceder a las rutas del *user*, y viceversa.

Para el registro se pide:
* **nombre**: no hay restricciones.
* **email**: elemento único, no es posible repetirlo.
* **contraseña**: debe tener entre 5 y 10 caracteres.

\**Al registrarse se le asigna automáticamente el rol de **user**.*
  
Para el login se pide:
* **email**
* **contraseña**

*\*Tanto en el registro, como en el login, se muestran mensajes de **error** indicándole al usuario si ha cometido un fallo en alguno de los procesos.*

---
## Seguridad:
Las contraseñas de los usuarios están *encriptadas*, y al logearse se genera un *token*, el cúal tiene una caducidad de 1 hora. Este *token* se almacena en una cookie, y cada vez que se accede a una ruta es verificado. Si es correcto, se **renueva**, en caso contrario se redirige al usuario a la página de login.

Si un usuario normal intenta acceder a una ruta de administrador, es automáticamente redirigido a la pantalla principal de usuarios. Lo mismo pasa con el administrador, si intenta ingresar en una ruta de usuario, se lo devuelve a su página principal.

---
## Admin:
Este usuario administrador ya ha sido creado en la base de datos:
* **nombre**: Pepe
* **email**: pepe@correo.es
* **contraseña**: admin

En la vista principal hay una tabla con todas las entradas creadas por los diferentes usuarios, y en cada una de ellas, tenemos la posibilidad de *ver* la entrada al completo, *editarla* o *eliminarla* (se pide confirmación).
En esta vista, hay 2 listas desplegables en la parte superior de la tabla de entradas: una para elegir cuántas entradas por página quieres ver, y la otra para ir a la páginas deseada. Al final de la página hay 2 botones para avanzar o retroceder página.

#### Vista detalle:
* En esta vista tendremos también un botón para editar la entrada, para no tener que volver a la vista principal para hacerlo.

#### Vista editar:
* Aquí encontraremos un formulario para editar todos los campos de la entrada a excepción del autor y la fecha y hora de creación. En esta pantalla también se muestran mensajes de **error** indicando si hay algún campo vacío. *En ningún caso se perdería la información que ya hemos modificado aunque se cometa un error en algún campo*.

#### Eliminar entrada:
* En la vista principal, al darle al botón de eliminar, aparecerá una nueva fila en la tabla con una advertencia y 2 botones, uno para *confirmar* la eliminación y el otro para *cancelar* el proceso.

---
## User:
Aunque ya hay usuarios creados, para hacer pruebas, se pueden seguir registrando sin problema:
* Usuarios existentes, en todos ellos la contraseña es '**123456**':
    * ana@correo.es
    * pedro@correo.es
    * luis@correo.es

#### Vista principal:
En esta vista aparece en la parte superior, un botón para **crear nuevas entradas**, y un **buscador de entradas**, que busca tanto en el título de la entrada como en el contenido.

Aquí encontraremos las mismas opciones de paginación que en la vista de administrador.

* Cada entrada muestra:
    * El título
    * El autor *(que si hacemos click sobre él nos muestra todas las entradas que ha creado)*
    * La fecha y hora de cración
    * La imagen
    * El extracto
    * Un bóton de *'**Leer más...**'* que lleva a la vista detallada de la entrada.


#### Vista crear entrada:
* Igual que el la vista de editar del administador tenemos un formulario para completar todos los campos de la entrada (título, extracto, contenido, imagen). En esta pantalla también se muestran mensajes de **error** indicando si hay algún campo vacío. No se pierde la información si hay algún fallo en la validación del formulario.

#### Vista editar entrada:
* Igual que la anterior, pero con la información ya cargada en la página. 

#### Vista detalle:
* Se muestra la entrada al completo, pero si el usuario es el creador de la entrada, también aparece un botón para editarla.

---
## .env:
#### Requiere:
* El puerto del servidor: **PORT**=3005
* La ruta del back end: **URL_BASE_BACK**=https://blog-back-91me.onrender.com
*(esta subida a render, por lo que la primera conexión es un poco lenta, se puede utilizar la ruta alternativa: **URL_BASE_BACK**=http://localhost:3000)*
* La frase secreta: **JWT_SECRET_KEY**=frase_de_prueba    