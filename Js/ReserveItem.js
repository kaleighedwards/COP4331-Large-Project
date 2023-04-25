function callEndpoint(endpoint, data) {
    axios.post(endpoint, data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error.response.data);
      });
  }  

  $(document).ready(function(){
    //Gets the Name of the item  and the amt
    let amt = 1;
    let userID  = 1;   
    $('table').on('click', '.btn-success', function(){
      let name = $(this).closest('tr').children('td').eq(1).text();
      let data = {
        ItemID: name,
        ItemAmt: amt,
        userID: userID
      }
      console.log(data);
    });

});
  
  