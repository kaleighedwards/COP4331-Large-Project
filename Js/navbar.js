const Reservations = document.getElementById("Reservations");
const Home = document.getElementById("Quest");
const Login = document.getElementById("Login");
const Signup = document.getElementById("Signup")
const RegisterForm = document.getElementById("RegisterForm");

function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove("form__message--success", "form__message--error");
  messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}




//buttons to other pages
Reservations.addEventListener("click", e => {
    e.preventDefault();
    window.location.href = "reservations.html";
});

Home.addEventListener("click", e => {
    e.preventDefault();
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
        let parsedData = JSON.parse(response.responseText);
        console.log(response.data);
        console.log(parsedData.data);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
  }
  //sets form messages
  
  

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
        axios.post('https://questelectronics.store/api/signup', data)
        .then(response => {
          console.log(response?.data);
        })
        .catch(error => {
          console.log(error?.response?.message);
        });
      }
      else 
      {
        alert("Passwords dont match");
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
      axios.post('https://questelectronics.store/api/signin', data)
      .then(response => {
       
        console.log(response.data);
        const Username = email;
        const _Id = response._Id;
        document.cookie(Username);
        document.cookie(_Id);
        localStorage.setItem("userId", _Id);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
    });

  });
  
  
  

  


