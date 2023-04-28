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
    var table = document.getElementById('myTable')

    for (var i = 0; i < data.length; i++){
        var row = `<tr>
                        <td>${data[i].image}</td>
                        <td>${data[i].name}</td>
                        <td>${data[i].instock}</td>
                        <td><button id = "delete" class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button></td>
                  </tr>`
        table.innerHTML += row


    }
}
  const _Id = getCookie("_Id");
  let data = {
    _Id: _Id
  }
$(document).ready(function(){
    axios.post('https://questelectronics.store/api/reserve/:_Id', data)
    .then(response => {
      console.log(response.data);
      buildTable(reponse.data);
    })
    .catch(error => {
      console.log(error?.response?.data);
    });
    
    let ItemAmt = 1;

    $('table').on('click', '.btn-danger', function(){
        let name = $(this).closest('tr').children('td').eq(1).text();
        let data = {
            ItemID: name,
            _Id: _Id,
            ItemAmt: ItemAmt
        }
        console.log(data);
        $(this).closest('tr').remove();
        axios.post('https://questelectronics.store/api/reserveedit', data)
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error?.response?.data);
        });
    });
});
//API call needs: ItemID, UserID, ItemAmt