//sessionStorage.usertoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiaXM3MjQ2NDRAaXRlc28ubXgiLCJjb3JyZW8iOiJjcUBnbWFpbC5jb20iLCJpaWQiOjIsImlhdCI6MTYxODE5Mzg4NCwiZXhwIjoxNjE4MTk3NDg0fQ.W_csEKF6_fIUd5E-ZBlNuIqTPLI9psfPUeeGOISPdJY";
let users =[];
let user = [];
let EB = document.querySelector("#EB");
let AF;
let DB = document.querySelector("#DB");
let SB = document.querySelector("#SB");

function loadUsers(cbErr){
    console.log("Cargando usuarios");
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
   xhr.open('GET', "https://users-dasw.herokuapp.com/api/users");     
    // 3. Enviar solicitud        
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.setRequestHeader('x-auth',sessionStorage.usertoken);    
   xhr.send();        
    // 4. Una vez recibida la respuesta del servidor        
   xhr.onload = function () {        
       if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        let datos = JSON.parse(xhr.response); //esta es la línea que hay que probar
        clear_div();
        users.push(... datos);
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
let html=
`<div class="media border shadow-sm rounded-lg m-2">
<div class="media-left m-2">
  <img src= "${user.url}" class="align-self-center rounded-circle">
</div>
<div class="media-body">
<h5>  ${user.nombre}  ${user.apellido} </h5>
<p>Correo: ${user.correo} </p>
</div>
<div class="media-right">
<button class="btn btn-primary m-2" onclick = "details('${user.correo}')">
    <i class="fas fa-search"></i>
</button>
<br>
<button class="btn btn-primary m-2" onclick ="edituser('${user.correo}')">
    <i class="fas fa-pencil-alt"></i>
</button>
<br>
<button class="btn btn-primary m-2" onclick ="deleteuser('${user.correo}')">
    <i class="fas fa-trash-alt"></i>
</button>
</div>
</div>`
return html;
}

function details (email){
    sessionStorage.userdetail = email;
    window.location.href = "details.html";
};

function edituser(email){
    sessionStorage.userdetail = email;
    loadSpecificUser(email,editModal,cbErr);
}

function editModal(){
    document.getElementById("edit_nombre").setAttribute("value",user[0].nombre);
    document.getElementById("edit_apellido").setAttribute("value",user[0].apellido);
    document.getElementById("edit_email").setAttribute("value",user[0].correo);
    document.getElementById("edit_date").setAttribute("value",user[0].fecha);
    document.getElementById("edit_image").setAttribute("value",user[0].url);
    $('#edit-2').modal('show');
    AF = document.querySelector("#EF");
    AF.addEventListener("change",function (e){
        let checks = document.querySelectorAll("#edit-2 input:invalid");
        if (checks.length <=0 ){
            document.querySelector("#EB").removeAttribute("disabled");
        }
    })
};

function deleteuser(email){
    sessionStorage.userdetail = email;
    loadSpecificUser(email,deleteModal,cbErr);
}

function deleteModal(){
    document.getElementById("Dnombre").innerHTML= user[0].nombre+" "+user[0].apellido;
    document.getElementById("Dcorreo").innerHTML= user[0].correo;
    document.getElementById("Dfecha").innerHTML= user[0].fecha;
    document.getElementById("Dimage").setAttribute("src",user[0].url);
    $('#delete-user').modal('show');
    $("#delete-user").on('hidden.bs.modal', function(){
        document.getElementById("Dnombre").removeAttribute("value");
        document.getElementById("Dcorreo").removeAttribute("value");
        document.getElementById("Dfecha").removeAttribute("value");
        document.getElementById("Dimage").removeAttribute("src");
    });
};

DB.addEventListener("click",function(e){
    deleteJSON(CBoktxt,CBErrtxt);
})

EB.addEventListener("click",function(e){
    e.preventDefault()
    let nodos = document.querySelectorAll("#edit-2 input:valid");
    let S = "";
    if(nodos[6].checked){
        S="M";
    }
    else if(nodos[7].checked){
        S="H";
    }
    $('#edit-2').modal('hide');
    $("#edit-2").on('hidden.bs.modal', function(){
        document.getElementById("p2").setAttribute("value","");
        document.getElementById("p1").setAttribute("value","");
        document.getElementById("edit_nombre").setAttribute("value","");
        document.getElementById("edit_apellido").setAttribute("value","");
        document.getElementById("edit_email").setAttribute("value","");
        document.getElementById("edit_date").setAttribute("value","");
        document.getElementById("edit_image").setAttribute("value","");
    });
    let values = 
    {
        "nombre":nodos[0].value,
        "apellido":nodos[1].value,
        "correo":nodos[2].value,
        "url":nodos[8].value,
        "sexo":S,
        "fecha":nodos[5].value,
        "password":nodos[3].value
    }
    updateEnJSON(values,CBoktxt,CBErrtxt)
})

function deleteJSON(cbOK,cbErr){
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('DELETE', "https://users-dasw.herokuapp.com/api/users/"+sessionStorage.userdetail);     
    // 3. Enviar solicitud        
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.setRequestHeader('x-auth',sessionStorage.usertoken);    
    xhr.send();        
    
    // 4. Una vez recibida la respuesta del servidor        
    xhr.onload = function () {        
       if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        cbOK();
        // Ejecutar algo si todo está correcto
       } else {
           // Ocurrió un error     
           alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
           cbErr();
           // ejecutar algo si error 
       }
   }
}

async function loadSpecificUser(email,cbOK,cbErr){
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('GET', "https://users-dasw.herokuapp.com/api/users/"+email);     
    // 3. Enviar solicitud        
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.setRequestHeader('x-auth',sessionStorage.usertoken);    
    xhr.send();        
    
    // 4. Una vez recibida la respuesta del servidor        
    xhr.onload = function () {        
       if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        let datos = JSON.parse(xhr.response); //esta es la línea que hay que probar
        user [0] = (datos);
        cbOK();
        // Ejecutar algo si todo está correcto
       } else {
           // Ocurrió un error     
           alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
           cbErr();
           // ejecutar algo si error 
       }
   }
}

function CBoktxt(){
    $('#allGood').modal('show');
    clear_div();
    users = [];
    loadUsers(cbErr);
}
function CBErrtxt(){
    $('#allBad').modal('show');
}


function updateEnJSON(datos,CBoktxt,CBErrtxt) { //datos es un arreglo de objetos
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  POST para actualizar archivo
    xhr.open('PUT', "https://users-dasw.herokuapp.com/api/users/"+sessionStorage.userdetail);
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.setRequestHeader('x-auth',sessionStorage.usertoken);
    console.log(sessionStorage.token);
    console.log(sessionStorage.usertoken);    

    console.log("https://users-dasw.herokuapp.com/api/users/"+sessionStorage.userdetail);
    // 4. Enviar solicitud al servidor
    console.log(JSON.stringify(datos));
    xhr.send(JSON.stringify(datos));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        console.log(xhr.status);
        if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
            console.log(xhr.responseText); // Significa que fue exitoso
            CBoktxt();
            // todo fue exitoso hacer algo
        } else {
             // Ocurrió un error
            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
            CBErrtxt();
            // error, no se pudo guardar, hacer algo
        }
    };
}

SB.addEventListener("click",function(e){
    e.preventDefault();
    let info = document.querySelector("#search").value;
    let filtered_list = users;
    filtered_list = filtered_list.filter(function(element){
        return element.nombre.toUpperCase().includes(info.toUpperCase()) ||
         element.apellido.toUpperCase().includes(info.toUpperCase())
        })
    clear_div();
    userListToHTML(filtered_list);
})

function userListToHTML(listaUsuarios){
let list = listaUsuarios.map(userToHTML).join('');
document.getElementById("info").innerHTML=list;
}

function cbErr(){
    $('#allBad').modal('show');
}

function clear_div(){
    document.getElementById("info").innerHTML = '';
    }

loadUsers(cbErr);
