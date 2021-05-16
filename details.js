sessionStorage.userdetail   
users = []; 
function loadSpecificUser(cbErr){
    console.log("Cargando usuario");
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
   xhr.open('GET', "https://users-dasw.herokuapp.com/api/users/"+sessionStorage.userdetail);     
    // 3. Enviar solicitud        
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.setRequestHeader('x-auth',sessionStorage.usertoken);    
   xhr.send();        
    // 4. Una vez recibida la respuesta del servidor        
   xhr.onload = function () {        
       if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        console.log("entré")
        let datos = JSON.parse(xhr.response); //esta es la línea que hay que probar
        users.push(datos);
        userListToHTML(users);
        // Ejecutar algo si todo está correcto
       } else {
           // Ocurrió un error     
           alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
           cbErr();
           // ejecutar algo si error 
       }
   }
}

function  userToHTML(user){
    let S;
    if(user.sexo.toUpperCase() == "M")
        S="Mujer";
    else S = "Hombre";
    console.log(user);
    let html=
    `<div class="media-center m-2">
      <img src= "${user.url}" class="align-self-center rounded-square">
    </div>
    <div class="media-body">
    <h2>  ${user.nombre}  ${user.apellido} </h2>
    <h2>Correo: ${user.correo} </h2>
    <h2>Sexo: ${S} </h2>
    <h2>Fecha de nacimiento: ${user.fecha} </h2>
    </div>
    <div class="media-right">

    </div>`;
    return html;
}

function userListToHTML(listaUsuarios){
    let list = listaUsuarios.map(userToHTML).join('');
    document.getElementById("user_info").innerHTML=list;
}
function CBErr(){
    $('#allBadH').modal('show');
}

    
    loadSpecificUser(CBErr);