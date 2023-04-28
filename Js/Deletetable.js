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
  function buildTable(data){
    var table = $('#dtBasicExample').DataTable();
    var imageIndex = 0; // initialize the image index counter to 0
  
    for (var i = 0; i < data.length; i++){
      var row = `<tr>
                    <td></td>
                    <td>${data[i].ItemName}</td>
                    <td>${data[i].ItemAmt}</td>
                    <td><button class="btn btn-success btn-sm"><i class="fas fa-check"></i></button></td>
                </tr>`;
      table.row.add($(row)).draw();
      imageIndex = (imageIndex + 1) % imageList.length; // increment the image index and cycle back to the start of the array if necessary
    }
    makeTableSortable();
}

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
      axios.delete('https://questelectronics.store/api/reserve/' + _Id, data)
      .then(response => {
        console.log(response.data);
        buildTable(response.data);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
    });
  }
  catch{
    console.log("me no exist")
  }

    axios.get('https://questelectronics.store/api/reserve/' + "Ben10@alien.com", "")
    .then(response => {
      console.log(response.data);
      buildTable(response.data);
    })
    .catch(error => {
      console.log(error?.response?.data);
    });
    
    let ItemAmt = 1;
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
