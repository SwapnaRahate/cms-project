//pagination state

let filteredPage = 1
let page = 1
let prodUpdate
let allProd

// to show data on webpage
function showData(data){
    
    const tbody = document.getElementById('product-table').getElementsByTagName("tbody")[0];
    tbody.innerHTML = '';

    console.log("API Response :", data)

    data = data.data

    data.forEach(el=>{
        const row = document.createElement('tr');
        const imageUrl = el.link || el[12]
        const prodName = el.productDisplayName || el[9]
        const category = el.subCategory || el[3]
        const price = el.price || el[10]
        const articletype = el .articleType || el[4]
        const id = el.id || el[0]

        row.innerHTML = `
        <td><input type="checkbox"></td>
        <td><img src= "${imageUrl}" alt="${articletype}" style= "width:50px; height:50px" /> </td>
        <td>${prodName}</td>
        <td>${category}</td>
        <td>${price}</td>
        <td>
            <select onchange="handleSelectChange(this, '${prodName}', ${id})">
                <option value=''>Select</option>
        
                <option value='Remove'>Remove</option>
                <option value='Modify'>Modify</option>          
            </select>
        </td> 
        `;
        tbody.appendChild(row);

    });
    showQty()
}
function handleSelectChange(selectElement, prodName, id ){
    const selectedValue = selectElement.value;
    console.log(`Selected: ${selectedValue} for product ${prodName}`)

    switch(selectedValue){
    
        case 'Remove':
            removeProd(id);
            break
        case 'Modify':
            modifyProd(id);
            console.log("modify working!")
            break
    }

}
function openCreate(){
    window.open('createProd.html')
}
//to get data from API
function getData(){
    fetch(`http://127.0.0.1:8000/myapp/read?page=${page}`)
    .then(res=>res.json())
    .then(res => {allProd = res.data; showData(res)})
    .catch(err=>console.log(err))
}
getData()



//functionality to filter


function getfilterProduct(name, cat){
   
    
    fetch(`http://127.0.0.1:8000/myapp/read/filter?filterProductName=${name}&filterCategory=${cat}&page=${filteredPage}`)
    .then(res=>res.json())
    .then(res=>showData(res))
    .catch(err=>console.log(err))
    
}


function filterProduct(){

    let name = document.getElementById('filterProductName').value
    let cat = document.getElementById("filterCategory").value

  if (!name && !cat){
    getData();
    return
  }
  
  getfilterProduct(name, cat);
  showQty('filtered')
  
}



//add event listener for filter button
document.getElementById("applyFilter").addEventListener('click', filterProduct)



//function for page
function showFilterPage(action){
    if (action =='minus' && filteredPage == 1) return
    filteredPage = action === 'minus'? filteredPage - 1: filteredPage + 1
    
    filterProduct()
}


// functionality for showPage (previous and next button)

function showPage(action){
    let name = document.getElementById('filterProductName').value
    let cat = document.getElementById('filterCategory').value

    if (name.length > 0 || cat.length > 0){
        showFilterPage(action); return
    }
    if (action === 'minus' && (page == 1 && filteredPage == 1)) return

    page = action === 'minus'? page - 1 : page + 1

    getData()
    showQty('data')

}

// functionality to show quantity of products 0-10, 10-20......
function showQty(datatype){
    if(datatype==='filtered') {document.getElementById('qty').innerHTML = `${(filteredPage*20)-20} to ${(filteredPage*20)}`}
    else {document.getElementById('qty').innerHTML = `${(page * 20) -20} to ${(page * 20)}`}
}

//functionality for remove product
function removeProd(prodId){
    fetch(`http://127.0.0.1:8000/myapp/delete?id=${Number(prodId)}`,{
        method: 'DELETE'
    })
    .then(res=>res.json())
    .then(res=> getData())
    .catch(err=>console.log(err))

}

//to open product update function
function  modifyProd(prodId){console.log(allProd)
    prodUpdate = allProd.filter(prod => prod.id === prodId || prod[0] === prodId)
    if(!prodUpdate)return
   
    localStorage.setItem('productToUpdate', JSON.stringify(prodUpdate[0])) 
    window.open('modifyProd.html')
}



 
