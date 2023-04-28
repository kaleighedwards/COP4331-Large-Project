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
  function RenamedTable(data){
    var table = $('#dtBasicExample').DataTable();
    var imageList = ['/images/Desktop1.png', '/images/Desktop2.png', '/images/Desktop3.png', '/images/Desktop4.png', '/images/Desktop5.png', '/images/Desktop6.png', '/images/Desktop7.png', '/images/Desktop8.png', '/images/Desktop9.png']; // create an array of image file names
    var imageIndex = 0; // initialize the image index counter to 0
  
    for (var i = 0; i < data.length; i++){
      var imageSrc = imageList[imageIndex]; // get the image source for the current row
      var row = `<tr>
                    <td><img src="${imageSrc}" alt="${data[i].Name}" style="max-width: 300px;"></td>
                    <td>${data[i].Name}</td>
                    <td>${data[i].Amt}</td>
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
  let ItemAmt = 1;
    axios.get('https://questelectronics.store/api/reserve/' + "Ben10@alien.com", "")
    .then(response => {
      console.log(response.data);
      RenamedTable(response.data);
    })
    .catch(error => {
      console.log(error?.response?.data);
    });
    
    
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
