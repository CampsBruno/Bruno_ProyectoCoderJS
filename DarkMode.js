
let boton_Darck = document.getElementById("BotonDark")




if (localStorage.getItem("Modo_Oscuro")){
    
} else{
   
    localStorage.setItem("Modo_Oscuro", false)
    boton_Darck.innerText = "LigthMode"
    document.body.classList.remove("darkmode")
}


if (JSON.parse(localStorage.getItem("Modo_Oscuro"))== true){
    document.body.classList.toggle("darkmode")
    boton_Darck.innerText= "LigthMode"
}


boton_Darck.addEventListener("click", () => {
    

if(JSON.parse(localStorage.getItem("Modo_Oscuro"))== false){
    
    localStorage.setItem("Modo_Oscuro", true)
    boton_Darck.innerText = "LigthMode"
    document.body.classList.add("darkmode")
    

} else if(JSON.parse(localStorage.getItem("Modo_Oscuro"))== true) {
    
    localStorage.setItem("Modo_Oscuro", false)
    boton_Darck.innerText= "DarkMode"
    document.body.classList.remove("darkmode")
}

})


