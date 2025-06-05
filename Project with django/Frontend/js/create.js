function createProd(){
    prodName = document.getElementById("prodName").value
    category = document.getElementById("category").value
    price = document.getElementById('price').value

    fetch("http://127.0.01:8000/myapp/create",{
        method: "POST",
        body: JSON.stringify({ prodName, category, price })
    })
    .then (res=>res.json())
    .then(res=>{if(res.error){console.log(res.error)}
            else{window.open("productList.html")}})
    .catch(err=>console.log(err))
}