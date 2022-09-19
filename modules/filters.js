var idFilterValue = '', nameFilterValue = '', minDirectionsFilterValue = 0, maxDirectionsFilterValue = 99;

const filters = customer => {
    return (customer.name.includes(nameFilterValue)) && 
        (customer.id.includes(idFilterValue)) &&
        (customer.directions.length>=minDirectionsFilterValue) &&
        (customer.directions.length<=maxDirectionsFilterValue)
}
function filterByMinDirections(e){
    minDirectionsFilterValue = e.target.value;
    window.filteredCustomers = window.customers.filter(filters)
    window.generateTable();
}
function filterByMaxDirections(e){
    maxDirectionsFilterValue = e.target.value;
    window.filteredCustomers = window.customers.filter(filters)
    window.generateTable();
}
function filterByName(e){
    nameFilterValue = e.target.value;
    window.filteredCustomers = window.customers.filter(filters)
    window.generateTable();
}
function filterByID(e){
    idFilterValue = e.target.value;
    window.filteredCustomers = window.customers.filter(filters)
    window.generateTable();
}
export {filterByMinDirections, filterByMaxDirections, filterByName, filterByID}