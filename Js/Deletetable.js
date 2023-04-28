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
  const _Id = getCookie("_Id");
  let data = {
    _Id: _Id
  }
$(document).ready(function(){
    axios.post('https://questelectronics.store/api/reserve/:_Id', data)
    .then(response => {
      console.log(response.data);
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