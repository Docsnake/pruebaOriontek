var customers;
var filteredCustomers;
var idFilterValue = '', nameFilterValue = '', minDirectionsFilterValue = 0, maxDirectionsFilterValue = 99;
var order = 'id';
var itemsPerPage = 10;
var page = 0;
const tableContainer = document.getElementById('tableContainer');
const modalContainer = document.getElementById('modalContainer');
const modalBackdrop = document.getElementById('modalBackdrop');
const filterName = document.getElementById('filterName');
const filterID = document.getElementById('filterID');
const filterDirectionsMin = document.getElementById('filterDirectionsMin');
const filterDirectionsMax = document.getElementById('filterDirectionsMax');
const pageInput = document.getElementById('pageInput');
pageInput.addEventListener('change', changePage);
filterDirectionsMax.addEventListener('change', filterByMaxDirections);
filterDirectionsMin.addEventListener('change', filterByMinDirections);
filterName.addEventListener('change', filterByName);
filterID.addEventListener('change', filterByID);
const filters = customer => {
    return (customer.name.includes(nameFilterValue)) && 
        (customer.id.includes(idFilterValue)) &&
        (customer.directions.length>minDirectionsFilterValue) &&
        (customer.directions.length<maxDirectionsFilterValue)
}
function filterByMinDirections(e){
    minDirectionsFilterValue = e.target.value;
    filteredCustomers = customers.filter(filters)
    generateTable();
}
function filterByMaxDirections(e){
    maxDirectionsFilterValue = e.target.value;
    filteredCustomers = customers.filter(filters)
    generateTable();
}
function filterByName(e){
    nameFilterValue = e.target.value;
    filteredCustomers = customers.filter(filters)
    generateTable();
}
function filterByID(e){
    idFilterValue = e.target.value;
    filteredCustomers = customers.filter(filters)
    generateTable();
}
function init(){
    fetch('/getCustomers')   
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}

function modifyCustomer(customerId){
    let newName = document.getElementById('newName').value;
    fetch('/modifyCustomer?customer='+customerId+'&newName='+newName) 
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}
function addDirection(customerId){
    let newName = document.getElementById('newDirection').value;
    fetch('/addDirection?customer='+customerId+'&newDirection='+newName) 
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}

function showModalModifyCustomer(customerId){
    let customer = customers.find(customer => customer.id === customerId)
    modalContainer.innerHTML = `
        <h3>modify customer ${customerId}</h3>
        <label>name: </label><input id="newName" type="text" value="${customer.name}"/>
        <input type="button" onclick="modifyCustomer('${customerId}')" value="Modify customer"/>
    `;
    modalBackdrop.classList.remove('hidden')
}
function showModalAddDirection(customerId){
    let customer = customers.find(customer => customer.id === customerId)
    modalContainer.innerHTML = `
        <h3>add direction to customer ${customerId}</h3>
        <label>new direction: </label><input id="newDirection" type="text"/>
        <input type="button" onclick="addDirection('${customerId}')" value="Add direction"/>
    `;
    modalBackdrop.classList.remove('hidden')
}

function deleteCustomer(customerId){
    console.log(customerId)
    fetch('/deleteCustomer?customer='+customerId) 
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}

function deleteDirection(customerId, direction){
    fetch('/deleteDirection?customer='+customerId+'&direction='+direction) 
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}

function orderBy(orderByPreference){
    if(order === orderByPreference){
        filteredCustomers = filteredCustomers.reverse();
    }else{
        order = orderByPreference;
        filteredCustomers.sort((a,b) => a[order] < b[order] ? -1 : 1 );
    }
    generateTable();
}

function previousPage(){
    if(page <= 0) return;
    page--;
    pageInput.value = page;
    generateTable();
}
function nextPage(){
    let maxPage = Math.ceil(filteredCustomers.length/10)
    if(page >= maxPage) return;
    page++;
    pageInput.value = page;
    generateTable();
}
function changePage(e){
    let newPage = e.target.value;
    let maxPage = Math.ceil(filteredCustomers.length/10)
    if(newPage >= maxPage || newPage < 0) return;
    page = newPage;
    generateTable();
}

function showModalAddCustomer(){
    modalContainer.innerHTML = `
        <h3>add customer</h3>
        <label>new customer name: </label><input id="newName" type="text"/>
        <input type="button" onclick="addCustomer()" value="Add customer"/>
    `;
    modalBackdrop.classList.remove('hidden')

}

function addCustomer(){
    let newName = document.getElementById('newName').value;
    fetch('/addCustomer?newName='+newName) 
    .then(response => response.json())
    .then(data => filteredCustomers=customers=data)
    .then(generateTable);
}

function generateTable() {
    let data = ``;
    const actions = (customer) => `
        <a href="#" onclick="showModalModifyCustomer('`+customer.id+`')">modify</a>
        <a href="#" onclick="deleteCustomer('`+customer.id+`')">delete</a>
    `;
    const directions = (customer) => {
        directionList = ``;
        customer.directions.forEach((direction)=>directionList+=`<li>${direction}<a href="#" onclick="deleteDirection('${customer.id}', '${direction}')">delete</a></li>`)
        return `
        <a href="#" onclick="showModalAddDirection('${customer.id}')">Add direction</a>
        <ol>
            `+directionList+`
        </ol>
    `};

    filteredCustomers.slice(page*10, (page*10)+10).forEach(customer => {
        data+= `
        <tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>`+directions(customer)+`</td>
            <td>`+actions(customer)+`</td>
       </tr>
       `}) ;

    tableContainer.innerHTML = `
        <table>
        <thead><tr>
            <th onclick="orderBy('id')">id</th>
            <th onclick="orderBy('name')">name</th>
            <th>directions</th>
            <th>actions</th>
        </tr></thead>
        <tbody>` + data + `</tbody> 
        </table>
    `;
    modalContainer.innerHTML = '';
    modalBackdrop.classList.add('hidden')
      
}
init();