let product = JSON.parse(localStorage.getItem('productToUpdate'))

window.onload = function(){
    if(product){
        document.getElementById('prodName').value = product.productDisplayName || product[9]
        document.getElementById('category').value = product.subCategory || product[3]
        document.getElementById('price').value = product.price || product[10];
    }
};

function updateProd(){
    let prodName = document.getElementById("prodName").value;
    let category = document.getElementById("category").value 
    let price = document.getElementById("price").value
    
    
    if(!prodName || !category || !price){
        alert("Please fill all fields!"); return
    }
    const prodId = product.id || product[0]
    console.log({ prodName,category,price })
    fetch(`http://127.0.0.1:8000/myapp/update?id=${prodId}`,
        {
            method: 'PUT',
            body: JSON.stringify({ prodName,category,price })
            
        }
        
    )
    .then(res => res.json())
    .then(res =>{
        if(res.error){console.log(res.error)}
        else{
            localStorage.removeItem('productToUpdate') 
            window.open('productList.html')}
    })
    .catch(err => console.log(err))
}