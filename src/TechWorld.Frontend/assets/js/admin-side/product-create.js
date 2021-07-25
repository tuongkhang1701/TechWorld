function getDataFormCreate() {
    let formData = document.querySelectorAll('#formData-create input');
    let data = Array.from(formData).reduce((acc, input) => ({
        ...acc,
        [input.id]: input.value
    }), {});
    return data;
}


function createData() {
    fetch('https://localhost:44345/api/Products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(getDataFormCreate())
        })
        .then(function(res) {
            if (!res.ok)
                throw Error("Has an error!");
            return res.json();
        })
        .then(function(data) {
            let strHtml = '';
            let Items = data.Items;
            if (Items != null) {
                // ADD JSON DATA TO THE TABLE AS ROWS.
                for (var i = 0; i < Items.length; i++) {
                    strHtml += `<tr>`;
                    strHtml += `<td>${Items[i].Id}</td>`;
                    strHtml += `<td>${Items[i].Name}</td>`;
                    strHtml += `<td>${Items[i].Category}</td>`;
                    strHtml += `<td>${Items[i].OriginalPrice}</td>`;
                    strHtml += `<td>${Items[i].Price}</td>`;
                    strHtml += `<td>${Items[i].PromotionPrice}</td>`;
                    strHtml += `<td>${Items[i].Image}</td>`;
                    strHtml += `<td>${Items[i].Quantity}</td>`;
                    strHtml += `<td><a href="" ><i class="fas fa-edit"></i></i></a><a href="" ><i class="fas fa-trash-alt"></i></a></td>`;
                    strHtml += `</tr>`;
                }

                // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
                var divContainer = document.querySelector("#content tbody");
                divContainer.innerHTML = strHtml;

            }
        })
        .catch(error => console.log("Lỗi: " + error));
}



// document.getElementById('btnCreate').addEventListener("click", function(e) {
//     e.preventDefault();
//     createData();
//     window.location.href = "product-create.html";
// });