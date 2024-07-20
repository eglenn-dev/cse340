'use strict'
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () {
    let classification_id = classificationList.value
    let classIdURL = "/inv/getInventory/" + classification_id
    fetch(classIdURL)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            throw Error("Network response was not OK");
        })
        .then(function (data) {
            buildInventoryList(data);
        })
        .catch(function (error) {
            console.error('There was a problem: ', error.message)
        })
})

function buildInventoryList(data) {
    let inventoryDisplay = document.getElementById("inventoryDisplay");
    let dataTable = '<thead>';
    dataTable += '<tr><th>Vehicle Name</th><td>View Page</td><td>Modify</td><td>Delete</td></tr>';
    dataTable += '</thead>';
    dataTable += '<tbody>';
    data.forEach(function (element) {
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`;
        dataTable += `<td><a target="_blank" class="crud-button" href='/inv/detail/${element.inv_id}' title='Click to view'>View</a></td>`;
        dataTable += `<td><a class="crud-button" href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
        dataTable += `<td><a class="crud-button" href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    })
    dataTable += '</tbody>';
    inventoryDisplay.innerHTML = dataTable;
}