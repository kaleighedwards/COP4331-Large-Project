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


function buildTable(data){
    var table = document.getElementById('dtBasicExample')

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i].Name}</td>
                        <td>${data[i].Amt}</td>
                        <td><button class="btn btn-success btn-sm"><i class="fas fa-check"></i></button></td>                  
                  </tr>`
        table.innerHTML += row


    }
}


$(document).ready(function(){
    let _Id = getCookie("_Id");
    let Username = getCookie("Username")

    //displays everything in the table for the employee
    axios.get('https://questelectronics.store/api/search', "")
    .then(response => {
      console.log(response.data);
      buildTable(response.data);
    })
    .catch(error => {
      console.log(error?.response?.data);
    });

    $('table').on('click', '.btn-success', function(){
        let stock = $(this).closest('tr').children('td').eq(1).text();
        let name = $(this).closest('tr').children('td').eq(0).text();
        console.log(name);
        stock = parseInt(stock) + 1;
        $(this).closest('tr').children('td').eq(1).text(stock); //sets the table to table_amt
        
        
        let data = {
            Username: Username,
            Name: name,
            Amt: stock
        }
        console.log(data);
        axios.post('https://questelectronics.store/api/addstock', data) //data = _Id + itemID +  stock
        .then(response => {
          console.log(response.data);
          buildTable(response.data);
        })
        .catch(error => {
          console.log(error?.response?.data);
        });
    });



});