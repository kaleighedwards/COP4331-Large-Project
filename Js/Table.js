function makeTableSortable() {
    $('#myTable').DataTable({
      "paging": true,
      "ordering": true,
      "info": true
    });
  }
  
  function ReserveTable(data){
    var table = $('#dtBasicExample').DataTable();
  
    for (var i = 0; i < data.length; i++){
      var row = `<tr>
                  
                    <td>${data[i].ItemName}</td>
                    <td>${data[i].ItemAmt}</td>
                    <td><button id = "delete" class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button></td>
                </tr>`;
      table.row.add($(row)).draw();
    }
    makeTableSortable();
}
$(document).ready(function(){

axios.get('https://questelectronics.store/api/reserve/' + "Ben10@alien.com", "")
.then(response => {
  console.log(response.data);
  ReserveTable(response.data);
})
.catch(error => {
  console.log(error?.response?.data);
});
});