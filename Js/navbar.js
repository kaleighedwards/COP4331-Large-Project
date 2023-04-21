const Reservations = document.getElementById("Reservations");
const Home = document.getElementById("Quest");
const Login = document.getElementById("Login");
const Signup = document.getElementById("Signup")
Reservations.addEventListener("click", () => {
    window.location.href = "reservations.html";
});

Home.addEventListener("click", () => {
    window.location.href = "index.html";
});

/* Old code for previous login page
Login.addEventListener("click", () => {
    window.location.href = "login.html";
});
*/
//Shows the login modal when pressed via JQuery 
$(document).ready(function() {
    $("#Login").click(function() {
      $("#loginModal").modal('show');
    });
  });

  $(document).ready(function() {
    $("#Signup").click(function() {
      $("#SignupModal").modal('show');
    });
  });


