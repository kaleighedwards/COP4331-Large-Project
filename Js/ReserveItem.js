  //function for API calls
  function callEndpoint(endpoint, data) {
    axios.post(endpoint, data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
  } 

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

  $(document).ready(function(){
    //Gets the Name of the item  and the amt
    let amt = 1;
    const _Id = getCookie("_Id");
  
    let table_amt = $(this).closest('tr').children('td').eq(2).text();
    let stock_checker = 0;
    $('table').on('click', '.btn-success', function(){
      let name = $(this).closest('tr').children('td').eq(1).text();
      let table_amt = $(this).closest('tr').children('td').eq(2).text();
      table_amt = table_amt -1;
      $(this).closest('tr').children('td').eq(2).text(table_amt); //sets the table to table_amt
      //checks if the cells value is less than 1. If so it displays out of stock.
      if(stock_checker >= $(this).closest('tr').children('td').eq(2).text())
      {
          stock_checker = "Out of stock";
          $(this).closest('tr').children('td').eq(2).text(stock_checker); 
          stock_checker = 0; //reinitilize it

      }
      //stops error of cell displaying NaN
      if($(this).closest('tr').children('td').eq(2).text() == "NaN")
        $(this).closest('tr').children('td').eq(2).text("Out of stock");
      console.log(table_amt);
      //data for API call
      let data = {
        Name: name,
        ItemAmt: amt,
        UserID: _Id
      }
      console.log(data);
      axios.post('https://questelectronics.store/api/reserve', data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error?.response?.data);
      });
    });

});
  
  
