const Reservations = document.getElementById("Reservations");
const Home = document.getElementById("Quest");
const Login = document.getElementById("Login");
const Signup = document.getElementById("Signup")
const RegisterForm = document.getElementById("RegisterForm");





//buttons to other pages
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
//shows signup modal
  $(document).ready(function() {
    $("#Signup").click(function() {
      $("#SignupModal").modal('show');
    });
  });

  //function for API calls
  function callEndpoint(endpoint, data) {
    axios.post(endpoint, data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }
  

  document.addEventListener('DOMContentLoaded', function() {
    const LoginForm = document.querySelector('#LoginForm')
    const Signupform = document.querySelector('#RegisterForm');

    //call to signup API
    Signupform.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(Signupform);
      let email = formData.get('email');
      let signupPass = formData.get('signupPass');
      let confirmPass = formData.get('confirmPass');
      //checks if passwords entered are the same
      if(signupPass == confirmPass)
      {
        let data = {
          Username: email,
          Password: signupPass,
          PermLvl: 2
        }
        console.log(data);
        callEndpoint('localhost:5500/Js/signup', data)
      }
      else 
      {
        console.log("Passwords dont match");
      }
    });

    //call to login API
    LoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(LoginForm);
      let email = formData.get('email');
      let password = formData.get('password');
      let data = {
        Username: email,
        Password: password
      }
      console.log(data);
      callEndpoint('localhost:5500/Js/signin', data);

    });

  });
  
  
  

  



