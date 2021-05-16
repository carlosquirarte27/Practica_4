let users = [];
let RF = document.querySelector("#FR");
let RB = document.querySelector("#RB");
let LF = document.querySelector("#Login");
let LB = document.querySelector("#LB")
getToken();

function getToken(){
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
   xhr.open('GET',"https://users-dasw.herokuapp.com/api/mytoken");    
    // 3. Enviar solicitud        
    xhr.setRequestHeader('x-email', 'is724644@iteso.mx');
    xhr.send();        
    // 4. Una vez recibida la respuesta del servidor        
    xhr.onload = function () {        
        if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        let token = JSON.parse(xhr.response);
        sessionStorage.token = token.token; //esta es la línea que hay que probar
        }
    }
}

RF.addEventListener("change",function (e){
    let checks = document.querySelectorAll("#Registro input:invalid");
    if (checks.length <=0 ){
        document.querySelector("#RB").removeAttribute("disabled");
    }
})

LF.addEventListener("change",function (e){
    let checks = document.querySelectorAll("#Login input:invalid");
    if (checks.length <=0 ){
        document.querySelector("#LB").removeAttribute("disabled");
    }
})

LB.addEventListener("click",function (e){
    e.preventDefault();
    let nodos = document.querySelectorAll("#Login input:valid");
    let values ={
        "correo":nodos[0].value,
        "password":nodos[1].value
    };
    $('#Login').modal('hide');

    LogIn(values,CBOK,CBErr)
});

function CBOK(datos){
    $('#allGoodH').modal('show');
    window.location.href = "consultas.html";
}

function CBErr(){
    $('#allBadH').modal('show');
}



function LogIn(datos,cbOK, cbErr) {
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
   xhr.open('POST',"https://users-dasw.herokuapp.com/api/login");     
    // 3. Enviar solicitud        
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);
    xhr.send(JSON.stringify(datos));        
    // 4. Una vez recibida la respuesta del servidor        
   xhr.onload = function () {        
       if (xhr.status == 200) { // analizar el estatus de la respuesta HTTP
        let token = JSON.parse(xhr.response);
        sessionStorage.usertoken = token.token; //esta es la línea que hay que probar
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


RB.addEventListener("click",function(e){
    e.preventDefault()
    let nodos = document.querySelectorAll("#Registro input:valid");
    let S = "";
    if(nodos[6].checked){
        S="M";
    }
    else if(nodos[7].checked){
        S="H";
    }
    $('#Registro').modal('hide');
    $("#Registro").on('hidden.bs.modal', function(){
        document.getElementById("Rp2").setAttribute("value",".");
        document.getElementById("Rp1").setAttribute("value",".");
        document.getElementById("Rnombre").setAttribute("value",".");
        document.getElementById("Rapellido").setAttribute("value",".");
        document.getElementById("Remail").setAttribute("value",".");
        document.getElementById("Rdate").setAttribute("value",".");
        document.getElementById("Rimage").setAttribute("value",".");
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
    guardarEnJSON(values,CBoktxt,CBErrtxt);
})

function CBoktxt(){
    $('#allGoodH').modal('show');
}

function CBErrtxt(){
    $('#allBadH').modal('show');
}

function guardarEnJSON(datos,CBoktxt,CBErrtxt) { //datos es un arreglo de objetos
    // 1. Crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configurar:  POST para actualizar archivo
    xhr.open('POST', "https://users-dasw.herokuapp.com/api/users");
    // 3. indicar tipo de datos JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('x-admin',sessionStorage.token);

    // 4. Enviar solicitud al servidor
    console.log(JSON.stringify(datos));
    xhr.send(JSON.stringify(datos));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
        if (xhr.status == 201) { // analizar el estatus de la respuesta HTTP
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

