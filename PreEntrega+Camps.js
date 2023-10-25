
Swal.fire({
    title: 'Divisor de cuentas',
    text:"Agrega una Descripcion, el Numero de Personas y Despues ingresa El nombre de la Persona y el Importe",
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })

  //  VARIABLES y
let cantidad_gente=""
let No_tomoValores= false
let Gente_restante=""
let personas = []
let descripcion=""
let usuario=""
let contraseña=""
let Secion_iniciada= false
let Deudor_final={}
let PagoRealizadoFinal=[]
let datosdeSesionAlmacenados=[]
let Apagar_cada_uno=""
let Detalles= []
let logoTexto=""

const diccionario={}



//############################################################################         CLASE PERSONA       #############################################################################################################################################################################




class Persona{
  constructor(nombre,plata){
      this.nombre=nombre,
      this.plata=plata,
      this.Plata_inicial=plata
  }

  


EstadoFinanciero(ListaQueDebe,ListaQuePago){  // de aca devuelcvo el diccionario con todos los datos de la persona
  let valorespersona={"id":"",
                      "nombre":"",
                      "Puso":"",
                    "EstadoActual":"",
                    "Historial":""}
  let   historail= {}              
  
  if(this.plata<0){
            let PagosRealizados=[]
            for (let parametros of ListaQuePago){   // aca corroboro si pago las deudas (se fija si la persona debe plata( si esta en enegativo)) despues se fija si esta en el diccionario de los uqe ya devolvieron algo de guitra 
                    if(this.nombre==parametros["Debe"]){
                                let plataparaCuentas = parseFloat(parametros["Cuanto"])
                                PagosRealizados.push([parametros["A_Quien"], plataparaCuentas])
                                this.plata += plataparaCuentas   }}
                                if (PagosRealizados!= []){
                                historail["Pagos Realizados"]=PagosRealizados}}

  if (this.plata<0){  //falta pagar
              let FaltaPagar=[]
              for(let parametros of ListaQueDebe){
                    if(this.nombre==parametros["Debe"]){
                    let plataparaCuentas = parseFloat(parametros["Cuanto"])
                    FaltaPagar.push([parametros["A_Quien"], plataparaCuentas])           
    }}             if (FaltaPagar!= []){
                   historail["Falta Pagar"]=FaltaPagar}}

      //pago recibido
    if(this.plata>0){
                let PagoRecibido=[]
                for(let parametros of ListaQuePago){
                      if(this.nombre==parametros["A_Quien"]){
                            let plataparaCuentas = parseFloat(parametros["Cuanto"])
                            PagoRecibido.push([parametros["Debe"], plataparaCuentas])
                            this.plata-= plataparaCuentas    }}
                            if (PagoRecibido!= []){
                            historail["Pagos Recibidos"]=PagoRecibido}}



      //falta recibir
      if(this.plata>0){
        let FaltaRecibir=[]
        for(let parametros of ListaQueDebe){
          if(this.nombre==parametros["A_Quien"]){
            let plataparaCuentas = parseFloat(parametros["Cuanto"])
            FaltaRecibir.push(parametros["Debe"],plataparaCuentas)  }}
            if (FaltaRecibir!= []){
          historail["Faltas Recibir"]=FaltaRecibir}}
        

          valorespersona.nombre = this.nombre
          valorespersona.Puso = this.Plata_inicial
          valorespersona.EstadoActual = (this.plata).toFixed(1)
          valorespersona.Historial=historail
          
return valorespersona
}
}
 




//###############################                                                 FUNCIONES               ##########################################



//                     FUNCIONES DE lOGUEO Y CREACION DE USUARIOS


function crear_usuario() {   // creamos el usuario si no existe
    contraseña = document.getElementById("password").value;
    usuario = document.getElementById("username").value;
    const usuariosGuardados = localStorage.getItem("usuarios");
    if (usuariosGuardados) {
      const usuarios = JSON.parse(usuariosGuardados);
      const usuarioExistente = usuarios.find(u => u.usuario === usuario);
      if (usuarioExistente) {
        Swal.fire("El usuario ya existe. Por favor, elegi otro nombre de usuario.");
        return} 
      const ultimoID = (usuarios.reduce((maxID, user) => Math.max(maxID, user.id_usuario), 0)) + 1;
      const nuevosUsuarios = [...usuarios, { usuario, contraseña, id_usuario: ultimoID }];
      localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));
    } else {
      const id_usuario = 1;
      const usuarios = [{ usuario, contraseña, id_usuario }];
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
    Swal.fire("Cuenta creada con éxito. Ahora podes iniciar sesión.");
  }
  

function iniciar_sesion(){   // INICIAMOS SESION 
    contraseña= document.getElementById("password").value
    usuario=document.getElementById("username").value
    const usuariosGuardados = localStorage.getItem("usuarios");
    if (usuariosGuardados) {
      const usuarios = JSON.parse(usuariosGuardados);
      const usuarioExistente = usuarios.find(u => u.usuario === usuario);
      if (usuarioExistente) {
        if (usuarioExistente.contraseña === contraseña) {

            const iniciado = document.getElementById("iniciado")
            iniciado.innerHTML = ""
            iniciado.innerHTML += `<p> Bienvenido <b>${usuario}</b></p>`
            Swal.fire("Inicio de sesión exitoso.")
            Secion_iniciada= true
            document.getElementById("password").value=""
            localStorage.getItem("usuarios").value=""
            
        } else {
          Swal.fire("Contraseña incorrecta. Por favor, intenta de nuevo.");
        }
      } else {
        Swal.fire("El usuario no existe. Por favor, verifica tu nombre de usuario.")
      }
    } else {  
      Swal.fire("No existen usuarios registrados. Tenes que crearte una cuenta primero.");
    } 
    if (Secion_iniciada) {
      
      var closeButton = document.querySelector('#loginModal .btn-close'); // selecciona el botón de cerrar
      closeButton.click(); // esto debería cerrar el modal
      
    }
  }

//##################################################################################################################################


// ###############################################################################################################################

function Agregar_personas() {    // AGREGA TANTO LA PERSONA COMO LA PLATA  Y LUEGO VA AGREGANDO A LA TABLA 
  
  let Nombre = document.getElementById("name").value;
  let Guitarra_puesta = parseFloat(document.getElementById("Guitarra_puesta").value)
  if (!Nombre || isNaN(Guitarra_puesta) || Guitarra_puesta < 0) {
      alert("Ingresa un nombre válido y una cantidad válida.")
      return
  } else {
      const existePersona = personas.filter(persona => persona.nombre === Nombre)
      if (existePersona.length > 0) {
          alert("Ya existe una persona con ese nombre.")
          return
      }
      let nuevaPersona = new Persona(Nombre, Guitarra_puesta)
      personas.push(nuevaPersona)
      document.getElementById("name").value = ""
      document.getElementById("Guitarra_puesta").value = ""
      renderizarTabla()
  }
  

}


function confirmarCambios() {     // se ejecuta con el nuevo boton al final al final de la tabla renderizada
IngresoMontoyPersonas() 
cantidad_gente=personas.length

Apagar_cada_uno = calcularCuantoGastoCadaUno(personas);
Apagar_cada_uno = (Apagar_cada_uno / cantidad_gente).toFixed(2);

document.getElementById("porPersona").innerHTML = `<p>Lo que cada uno tiene que pagar por <b> ${descripcion} </b> es: <b> ${Apagar_cada_uno}$ </b></p>`;
for (let persona of personas) {
    persona.plata -= Apagar_cada_uno;
}
Deudor_final = Correcta_distribucion(personas)

const tableRows = document.querySelectorAll('table tr')
for (let i = 0; i < tableRows.length; i++) {
    const cells = tableRows[i].querySelectorAll('td, th')
    if (cells.length >= 3) {
        tableRows[i].deleteCell(2); // Eliminar la tercera celda de la fila actual
    }
}
const boton = document.getElementById("boton_de_confirmacion")
const nodoPadre = boton.parentNode
nodoPadre.removeChild(boton)

return Deudor_final, Apagar_cada_uno;
}





function IngresoMontoyPersonas()    //boton                     de CONFIRMAR VALORES                      para aplicar algoritm,o
{

descripcion=document.getElementById("Descripcion_lugar").value  // poner en otro lado

}
 function resetearValores() {                               //  RESETEAR VALORES
  
  document.getElementById("tablaContainer").innerHTML=""
    document.getElementById("columnaTabla").innerHTML=""
     document.getElementById("tablaP").innerHTML=""
    document.getElementById("porPersona").innerHTML =""
    document.getElementById("Descripcion_lugar").value=""
    document.getElementById("iconoSeleccionado").innerHTML=""
    Deudor_final=[]
    PagoRealizadoFinal=[]
    Detalles=[]
    const SvgClon=""
    personas=[]
    let deudores = {}
    let Pusieron_de_mas = {}
    const table=""}



function calcularCuantoGastoCadaUno(personas) {  // calcula cuanto debe poner cada persona
    let totalGastado = 0;
    for (let persona of personas) {
        totalGastado += persona.plata}
        
return totalGastado
}


function imprimirLogo(enlace) {  
  const Svg = enlace.querySelector('svg') 
  if(Svg){
    const svgClone = Svg.cloneNode(true)
    const iconoSeleccionadoDiv = document.getElementById('iconoSeleccionado')
    const iconoNuevo = document.createElement('div')
    iconoNuevo.innerHTML = `<strong>Categoría: ${enlace.text} </strong>`
    iconoNuevo.appendChild(svgClone)
    iconoSeleccionadoDiv.innerHTML = ''
    iconoSeleccionadoDiv.appendChild(iconoNuevo)
}
logoTexto = enlace.text


}



function  Correcta_distribucion(parametro){
    let deudores = {}
    let Pusieron_de_mas = {}
    for (let persona of parametro) {   
        (persona.plata >= 0) ? Pusieron_de_mas[persona.nombre] = persona.plata : deudores[persona.nombre] = persona.plata;}   
    Deudas_pasar=Muestra_Tabla(deudores,Pusieron_de_mas)
  return  Deudas_pasar
}




//########################################################################   TABLAS



function Muestra_Tabla(Deben,Reciben){    // crea la tabla con las personas que deben
  let retornar_valor=[]
  const titulo= document.getElementById("columnaTabla")
  const resultadosDiv = document.getElementById("tablaP")
  const columnaTabla = document.getElementById("columnaTabla")
  columnaTabla.className = "Tabla_redonda"
  titulo.innerHTML = ""
  titulo.innerHTML =`<tr > <th class="centered">Debe Pagar</th> <th class="centered"> Monto a Pagar </th>  <th class="centered">A Quien</th> <th class="centered">Estado del Pago</th>  </tr>`
  resultadosDiv.innerHTML = ""
  let indice=0
  for (let deudor in Deben) {
    for (let pagador in Reciben) {
        const deuda = Deben[deudor]
        const exceso = Reciben[pagador]
     if (deuda < 0 && exceso > 0) {
        const cantidad_a_transferir = Math.min(Math.abs(deuda), exceso)
        Deben[deudor] += cantidad_a_transferir
        indice++
        Reciben[pagador] -= cantidad_a_transferir
        retornar_valor.push({"Debe":deudor.toLocaleLowerCase(),"Cuanto":cantidad_a_transferir.toFixed(2),"A_Quien":pagador.toLocaleLowerCase()})

        //const resultado = `${deudor.toUpperCase()} Le tiene que Girar ${cantidad_a_transferir.toFixed(2)} $ a ${pagador.toUpperCase()}`
        resultadosDiv.innerHTML += `<tr> 
                                          <th id="deudor${indice}">${deudor.toUpperCase()}</th>
                                          <th id="Cantidad${indice}">${cantidad_a_transferir.toFixed(2)}</th>
                                          <th id="Acredor${indice}">${pagador.toUpperCase()}</th>
                                          <th><div class="form-check form-switch">
                                          <input class="form-check-input" type="checkbox" id="Boton${indice}">
                                          <label class="form-check-label" id="L-Boton${indice}">Pendiente</label>
                                        </div></th>
                                    </tr>
                                  
                                     `
}}}
resultadosDiv.innerHTML +=`                          <div class="gap-3 py-3">

<button type="button" class="btn btn-success " style="background-color: #28a745;"  onclick="ValidarPagos()">Confirmar Valores</button>

</div>`
return retornar_valor
}




function renderizarTabla() {                            // creamos la tabla en el momento que vmaos poniendo cada persona
  const tablaContainer = document.getElementById('tablaContainer')
  tablaContainer.innerHTML = ''

  const table = document.createElement('table')
  table.className = 'table table-striped'

  const header = table.createTHead()
  const row = header.insertRow(0)

  const cell1 = row.insertCell(0)
  cell1.className = 'centered'
  cell1.innerHTML = '<b>Nombre</b>'
  cell1.style.backgroundColor = 'rgb(150, 135, 135)'

  const cell2 = row.insertCell(1)
  cell2.className = 'centered'
  cell2.innerHTML = '<b>Plata Puesta</b>'
  cell2.style.backgroundColor = 'rgb(150, 135, 135)'

  const cell3 = row.insertCell(2)
  cell3.className = 'centered'
  cell3.innerHTML = '<b>Edicion</b>'
  cell3.style.backgroundColor = 'rgb(150, 135, 135)'

  const body = table.createTBody(); // cuerpo de la tabla
  personas.forEach((persona, index) => {
      const row = body.insertRow(-1)
      const cell1 = row.insertCell(0)
      cell1.innerHTML = `<input type="text" value="${persona.nombre}" id="nombre-${index}" class="form-control transparent-input"/>`

      const cell2 = row.insertCell(1)
      cell2.innerHTML = `<input type="text" value="${persona.plata}" id="plata-${index}" class="form-control transparent-input"/>`

      const cell3 = row.insertCell(2)
      cell3.innerHTML = `
          <button class="btn btn-primary" id="editar(${index})" onclick="editar(this,personas)">Editar</button>
          <button class="btn btn-danger" id="borrar(${index})" onclick="borrar(this,personas)">Borrar</button>
      `
  });

  const confirmButton = document.createElement('button')
  confirmButton.id=`boton_de_confirmacion`
  confirmButton.innerHTML = 'Confirmar'
  confirmButton.className = 'btn btn-success'
  confirmButton.type="button"
  confirmButton.onclick = confirmarCambios
  tablaContainer.appendChild(table)
  tablaContainer.appendChild(confirmButton)
}


function renderizarTablaModificada(personas, listaDeudas) {   //tabla al finalizar
  const tablaContainer = document.getElementById('tablaContainer')
  tablaContainer.innerHTML = ''

  const table = document.createElement('table')
  table.className = 'table table-striped'

  const header = table.createTHead()
  const row = header.insertRow(0)

  const cell1 = row.insertCell(0)
  cell1.className = 'centered'
  cell1.innerHTML = '<b>Nombre</b>'
  cell1.style.backgroundColor = 'rgb(150, 135, 135)'

  const cell2 = row.insertCell(1)
  cell2.className = 'centered'
  cell2.innerHTML = '<b>Deuda</b>'
  cell2.style.backgroundColor = 'rgb(150, 135, 135)'

  const cell3 = row.insertCell(2)
  cell3.className = 'centered'
  cell3.innerHTML = '<b>A Quien Debe</b>'
  cell3.style.backgroundColor = 'rgb(150, 135, 135)'

  const body = table.createTBody(); // cuerpo de la tabla
  personas.forEach((persona, index) => {
    let deudas = listaDeudas.filter(item => item.Debe === persona.nombre);
    if (deudas.length > 0) {
      deudas.forEach((deuda) => {
        const row = body.insertRow(-1)
        const cell1 = row.insertCell(0)
        cell1.innerHTML = `<input type="text" value="${persona.nombre}" id="nombre-${index}" class="form-control transparent-input"/>`;

        const cell2 = row.insertCell(1);
        cell2.innerHTML = `<b>${deuda.Cuanto}</b>`

        const cell3 = row.insertCell(2);
        cell3.innerHTML = `<b>${deuda.A_Quien}</b>`
      });
    } else {
      const row = body.insertRow(-1)
      const cell1 = row.insertCell(0)
      cell1.innerHTML = `<input type="text" value="${persona.nombre}" id="nombre-${index}" class="form-control transparent-input"/>`;

      const cell2 = row.insertCell(1)
      cell2.innerHTML = 'Saldado'

      const cell3 = row.insertCell(2)
      cell3.innerHTML = 'Sin Deuda'
    
}});

  tablaContainer.appendChild(table)
}


function  RemoverTablas_Alfinal(){
  document.getElementById("columnaTabla").innerHTML=""
 document.getElementById("tablaP").innerHTML=""
document.getElementById("porPersona").innerHTML =""
document.getElementById("Descripcion_lugar").value=""
document.getElementById("iconoSeleccionado").innerHTML=""
}





function HistorialGuardado() {
  if (Secion_iniciada==false){

    Swal.fire("Inicia Sesión para poder ver tu Historial")
  }
  console.log("funciona")
  if (Secion_iniciada == true) {
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"))
    for (let cuenta of usuariosGuardados) {
      if (cuenta.usuario == usuario) {
        id_obtenido = parseInt(cuenta.id_usuario)
        
      }
    }

    datosTotales = JSON.parse(localStorage.getItem("almacenaje"))

    // Limpia el contenido anterior
    const tablaContainer = document.getElementById('tablaContainer')
    tablaContainer.innerHTML = ''

    // Crear la tabla
    const table = document.createElement('table')
    table.className = 'table table-striped'

    const thead = document.createElement('thead')
    const headerRow = thead.insertRow(0)

    const cell1 = headerRow.insertCell(0)
    cell1.className = 'centered'
    cell1.innerHTML = '<b>Fecha</b>'
    cell1.style.backgroundColor = 'rgb(150, 135, 135)'

    const cell2 = headerRow.insertCell(1)
    cell2.className = 'centered'
    cell2.innerHTML = '<b>Descripcion</b>'
    cell2.style.backgroundColor = 'rgb(150, 135, 135)'

    const cell3 = headerRow.insertCell(2)
    cell3.className = 'centered'
    cell3.innerHTML = '<b>Categoria</b>'
    cell3.style.backgroundColor = 'rgb(150, 135, 135)'

    const cell4 = headerRow.insertCell(3)
    cell4.className = 'centered'
    cell4.innerHTML = '<b>Estado Actual</b>'
    cell4.style.backgroundColor = 'rgb(150, 135, 135)'

    const cell5 = headerRow.insertCell(4)
    cell5.className = 'centered'
    cell5.innerHTML = '<b>Historial</b>'
    cell5.style.backgroundColor = 'rgb(150, 135, 135)'

    const tbody = document.createElement('tbody')
    
    // Agregar filas a la tabla
    for (Datos_Almacenados of datosTotales) {
      let EstadoDelosPagosPaaHistorial = true
      if (Datos_Almacenados["id"] == id_obtenido) {
        datosdeSesionAlmacenados.push(Datos_Almacenados)
        const bodyRow = tbody.insertRow()
        const bodyCell1 = bodyRow.insertCell(0)
        bodyCell1.innerHTML = Datos_Almacenados.fecha
        if(Datos_Almacenados.descripcion!= ""){
        const bodyCell2 = bodyRow.insertCell(1)
        bodyCell2.innerHTML = Datos_Almacenados.descripcion
         }else {
          const bodyCell2 = bodyRow.insertCell(1)
        bodyCell2.innerHTML = "-"
         }


        const bodyCell3 = bodyRow.insertCell(2)
        if (Datos_Almacenados.Categoria!=""){
        bodyCell3.innerHTML = Datos_Almacenados.Categoria}else{
          bodyCell3.innerHTML = "Otros" 
        }        
        for(let estadodelospagos of Datos_Almacenados.Detalles){
          let ToFloat_EstadoPagos = parseFloat(estadodelospagos["EstadoActual"])
          
          if (ToFloat_EstadoPagos!== 0.0){
                EstadoDelosPagosPaaHistorial = false
                
            break
          }}

          const bodyCell4 = bodyRow.insertCell(3)
         if (EstadoDelosPagosPaaHistorial){
         
         bodyCell4.innerHTML = "Completado"}else 
         {
         bodyCell4.innerHTML = `<b>Incompleto</b>`
         }

         
        const bodyCell5 = bodyRow.insertCell(4)
        //const button = createDetailButton(Datos_Almacenados.Historial);
        bodyCell5.innerHTML = `
        <button class="btn btn-success" id="Numero-${datosdeSesionAlmacenados.length-1}" onclick="DetallesDeudas(this)">Detalles</button>
    `
    
      
      }
    }

    // Añadir la tabla al contenedor
    table.appendChild(thead)
    table.appendChild(tbody)
    tablaContainer.appendChild(table)
  }
}

//################################################    CARTEL CON LOS DETALLES 


function mostrarInformacion(data) {
  const dolar = data.PrecioDolar
  
  let contenido = `<p><strong>Descripción:</strong> ${data.descripcion}</p>
                  <p><strong>Categoría:</strong> ${data.Categoria}</p>
                  <p><strong>Fecha:</strong> ${data.fecha}</p>
                  <p><strong>Por Persona:</strong> ${data.por_Persona}</p>`

  contenido += "<h3>Deudas Pendientes:</h3><hr>";
  
  for (let detalle of data.Detalles) {
    const estadoActual = parseFloat(detalle.EstadoActual);

    if (estadoActual < 0) {


      if((detalle.Historial["Falta Pagar"]).length>1){
          for(let MostrarDeuda of detalle.Historial["Falta Pagar"]){//for para imprimir deudas si tiene mas de una

            const deudaEnPesos = MostrarDeuda[1]
            const deudaEnDolares = (deudaEnPesos / dolar).toFixed(1)
            const MostrarAquienDebe =MostrarDeuda[0]
          
          
                contenido += `<div class="card border-secondary mb-3" style="max-width: 18rem;">
                <div class="card-body">
                  <h5 class="card-title text-muted">Detalles de la Deuda</h5>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">Nombre: ${detalle.nombre}</li>
                    <li class="list-group-item">Debe a: ${MostrarAquienDebe}</li>
                    <li class="list-group-item">Deuda en Pesos: ${deudaEnPesos} $</li>
                    <li class="list-group-item">Deuda en Dólares: ${deudaEnDolares} $</li>
                  </ul>
                </div>
              </div>`
            
          } //  fin de   for para imprimir deudas si tiene mas de una
      }  // fin del if hisstorial[falta pagar]
      else{
      const deudaEnPesos = -estadoActual
      const deudaEnDolares = (deudaEnPesos / dolar).toFixed(1)
      const MostrarAquienDebe =detalle.Historial["Falta Pagar"][0]
      contenido += `<div class="card border-secondary mb-3" style="max-width: 18rem;">
      <div class="card-body">
        <h5 class="card-title text-muted">Detalles de la Deuda</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Nombre: ${detalle.nombre}</li>
          <li class="list-group-item">Debe a: ${MostrarAquienDebe}</li>
          <li class="list-group-item">Deuda en Pesos: ${deudaEnPesos} $</li>
          <li class="list-group-item">Deuda en Dólares: ${deudaEnDolares} $</li>
        </ul>
      </div>
    </div>
    `
                    }// cierre del if estadoactuual<0esto es del else
                  }// cierre del if estadoactuual<0
  }  // fin del for

  
  const modalBody = document.querySelector('#DetallesModal .modal-body');
  modalBody.innerHTML = contenido;

  
  const myModal = new bootstrap.Modal(document.getElementById('DetallesModal'));
  myModal.show();
}


//#######################################################################################################################################################################################################################################

function createDetailButton(details) {      //######    CREAMOS BOTON DE DETALLES
  const button = document.createElement('button')
  button.innerHTML = 'Ver Detalles'

  button.onclick = function () {
      alert(JSON.stringify(details, null, 2)) 
  };

  return button.outerHTML
}
//////////////////////////////////

// ##############################   Funciones de borrar y editar de la tabla



function borrar(parametro, listadeObjetos) {                        //boton de borrar el dato seleccionado
  let row = parametro.parentNode.parentNode
  let index = row.rowIndex - 1

  if (index >= 0 && index < listadeObjetos.length) {
      let nombrePersona = listadeObjetos[index].nombre
      listadeObjetos.splice(index, 1)

      renderizarTabla()
  }
}





function editar(parametro, listadeObjetos) {                            // boton para editar el dato seleccionado
  let row = parametro.parentNode.parentNode;
  let index = row.rowIndex - 1; // Restar 1 para ajustar el encabezado

  if (index >= 0 && index < listadeObjetos.length) {
      let nombreInput = row.querySelector(`#nombre-${index}`)
      let plataInput = row.querySelector(`#plata-${index}`)
      let nombrePersona = nombreInput.value
      let plataPersona = plataInput.value

      listadeObjetos[index].nombre = nombrePersona
      listadeObjetos[index].plata = parseFloat(plataPersona)
      renderizarTabla() // Volver a renderizar la tabla después de editar los valores
  }
}



function DetallesDeudas(elemento) {            // OBTENGO LOS DETALLES DEL GASTO SELECCIONADO
  const id = elemento.id.split("-")[1]
  console.log(datosdeSesionAlmacenados[id]) //" con esto trabajo"
  mostrarInformacion(datosdeSesionAlmacenados[id])
  
}








// ###########################################################################################       FUNCIONES ASINCRONICAS 

async function consultar_precio(){      // consulta el precio del dolar blue al momento de almacenar los datos

  try{
   let respuesta = await fetch('https://api.bluelytics.com.ar/v2/latest')
    let json= await respuesta.json()
    return json["blue"]["value_avg"]

  } catch(error){
    return null
  } }

  

  async function obtenerPrecio(diccionario1,lista2) {             // espera el precio y almacena los valores 
    let respuesta_final = await consultar_precio()
    diccionario1.PrecioDolar = respuesta_final
    lista2.push(diccionario1)
    localStorage.setItem("almacenaje",JSON.stringify(lista2))
    
  } 



// ###############                                  EVENTOS



document.addEventListener("click", (chequeo)=> {                     // cambia el estado de Pendiente a Pago
  if(chequeo.target.classList.contains("form-check-input")){
      const botonn = chequeo.target
      const labelBoton = document.getElementById(`L-${botonn.id}`)
      
      
      if(labelBoton.innerHTML == "Pendiente") { 
        (labelBoton.innerHTML="Pago")} 
      else if (labelBoton.innerHTML == "Pago"){
        labelBoton.innerHTML = "Pendiente"
      }}})


function ExportarDatos(lista, ID_Usuario,descripcion,Gasto_Cada_Persona,logoGuardar){
  //crear la variable local si no existe
  if(!localStorage.getItem("almacenaje")){
    localStorage.setItem("almacenaje",JSON.stringify(lista))
  } else { 
    const fechaActual = new Date();
    const dia = fechaActual.getDate()
    const mes = fechaActual.getMonth() + 1
    const año = fechaActual.getFullYear()
    const fechaFormateada = `${dia}/${mes}/${año}`
    const agregar= JSON.parse(localStorage.getItem("almacenaje"))
    let datos = {"id":ID_Usuario,
                  "descripcion":descripcion,
                  "Categoria": logoGuardar,   // esta poniendo cosas raras, ver como cambiar eso
                "fecha":fechaFormateada,
                "por_Persona":Gasto_Cada_Persona,
                "Detalles":lista}

    // envio Los datos de mis diccionarios para que almacene los valores, junto con el precio del dolar del momento
    obtenerPrecio(datos,agregar)}

}





function ValidarPagos(){    //Hace efectivos los pagos y luego almacena lso valores (por ahora) en variable local

  
  let Deuda_copia = [...Deudor_final]
  Deudor_final=[]
  let tabla22=document.getElementById("tablaP")
  let fff= tabla22.getElementsByTagName("tr").length
 
  for(let i=0 ;i<fff;i++){
    let checkbox = document.getElementById(`Boton${i+1}`)
    if (checkbox.checked) {
      PagoRealizadoFinal.push(Deuda_copia[i])
    } else {
      Deudor_final.push(Deuda_copia[i])
    }}

  
    
for(let personaii of personas ){
 let ddetalle =personaii.EstadoFinanciero(Deudor_final,PagoRealizadoFinal)   //almacena el estado funanciero de cada sujeto

 Detalles.push(ddetalle)}
if (usuario){
  const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios"))  // busco id si esta asocicado
  for (let cuenta of usuariosGuardados ){
    if(cuenta.usuario == usuario){
  id_obtenido = parseInt(cuenta.id_usuario)
  ExportarDatos(Detalles,id_obtenido,descripcion,Apagar_cada_uno,logoTexto)
  
  
  }}}

  renderizarTablaModificada(personas,Deudor_final)
  RemoverTablas_Alfinal()
}
  



