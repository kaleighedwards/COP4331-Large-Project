const Reservations = document.getElementById("Reservations");
const Home = document.getElementById("Quest");
const Login = document.getElementById("Login");
const Signup = document.getElementById("Signup")
const RegisterForm = document.getElementById("RegisterForm");






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

  document.addEventListener('DOMContentLoaded', function() {
    const LoginForm = document.querySelector('#LoginForm')
    const Signupform = document.querySelector('#RegisterForm');


    Signupform.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(Signupform);
      let email = formData.get('email');
      let signupPass = formData.get('signupPass');
      let confirmPass = formData.get('confirmPass');
      console.log("Email: ", email);
      console.log("Password1: ", signupPass);
      console.log("Password2: ", confirmPass);


      axios.post('http://127.0.0.1:5500/Large%20project/Js/auth', {
        Username: email,
        Password: signupPass,
        PermLvl: 2,
        

    },{withCreditentials: true})
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error.response.data);
    });
    });


    LoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(LoginForm);
      let email = formData.get('email');
      let password = formData.get('password');
      console.log("Email: ", email);
      console.log("Password1: ", password);



      axios.post('http://localhost:5500/signin', {
        Username: email,
        Password: password,
    })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error(error.response.data);
    });
    });

  });
  
  
  

  



