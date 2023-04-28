//cookie decoder
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  //function that takes the users reservations and builds a table


  //gets the users reservation table
$(document).ready(function(){
  const _Id = getCookie("_Id");
  let data = {
    Username: "Ben10@alien.com"
  }
  try{
    let pickup = document.getElementById("pickedUp");
    pickup.addEventListener("click", e => {
      e.preventDefault();
      console.log("I am being pressed");
      axios.delete('https://questelectronics.store/api/reserve/' + Username, data)
      .then(response => {
        console.log(response.data);
        RenamedTable(response.data);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
    });
  }
  catch{
    console.log("me no exist")
  }
    
    
    //removes an item
    $('table').on('click', '.btn-danger', function(){
        let name = $(this).closest('tr').children('td').eq(1).text();
        let data = {
            ItemName: name,
            Username: "Ben10@alien.com",
            ItemAmt: ItemAmt
        }
        console.log(data);
        $(this).closest('tr').remove();
        axios.put('https://questelectronics.store/api/reserveedit', data)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error?.response?.data);
        });
    });
});
