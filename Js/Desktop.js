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
                        <td></td>
                        <td>${data[i].Name}</td>
                        <td>${data[i].Amt}</td>
                        <td><button class="btn btn-success btn-sm"><i class="fas fa-check"></i></button></td>                  
                  </tr>`
        table.innerHTML += row


    }
}
/*
$(document).ready(function(){
    axios.get('https://questelectronics.store/api/search', "?Cat=Desktop")
    .then(response => {
      console.log(response.data);
      buildTable(response.data);
    })
    .catch(error => {
      console.log(error?.response?.data);
    });
    
});
*/
