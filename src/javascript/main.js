

// na pagina login.html usar a função loginPage()
window.loginPage = function() {
  //display erro in login page
  document.addEventListener("DOMContentLoaded", function(event) {
    //console.log("DOM completamente carregado e analisado");
    if ( location.hash == "#erro") {
      document.getElementById("erro").style="display: block"
      document.getElementById("spinner").style="display: none"
    }



    document.getElementById("inputPassword").addEventListener("focus", function(){
      document.getElementById("erro").style="display: none"
    });
    document.getElementById("formL").addEventListener("submit", function(){
      document.getElementById("spinner").style="display: block"
    });
  });

}


window.registPage = function(){

  var p = document.getElementById("inputPasswordCheck");
  var pass = document.getElementById("inputPassword").value;
  var passc = document.getElementById("inputPasswordCheck").value;
  // When the user clicks in passwordChech field, hide the message box
  p.onkeyup = function() {
    pass = document.getElementById("inputPassword").value;
    passc = document.getElementById("inputPasswordCheck").value;
    if ( pass == passc ) {
      console.log("igual")
      document.getElementById("erro2").style="display: none"
      document.getElementById("botao").disabled = false;
    } else {
      document.getElementById("erro2").style="display: block"
      document.getElementById("botao").disabled = true;
      console.log("diferente")
    }
  }

  document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM completamente carregado e analisado");
    if ( location.hash == "#erro1")
    document.getElementById("erro1").style="display: block"

    if ( location.hash == "#erro3")
    document.getElementById("erro3").style="display: block"

    document.getElementById("inputPassword").addEventListener("focus", function(){
      document.getElementById("erro1").style="display: none"
      document.getElementById("erro3").style="display: none"
    });
  });

}
