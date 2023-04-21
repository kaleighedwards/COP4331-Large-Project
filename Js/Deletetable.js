DeleteBtn = document.getElementById("delete")

DeleteBtn.on('click', function() {
    DeleteRow(DeleteBtn);
});

function DeleteRow(btndel) {
    if (typeof(btndel) == "object") {
        $(btndel).closest("tr").remove();
    } else {
        return false;
    }
}