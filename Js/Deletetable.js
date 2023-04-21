$(document).ready(function(){
    $('table').on('click', '.btn-danger', function(){
        $(this).closest('tr').remove();
    });
});
