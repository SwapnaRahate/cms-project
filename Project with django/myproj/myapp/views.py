from django.shortcuts import render
import sqlite3
from django.http import HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt
import random
import pdb



# Create your views here.

#initialize DB connection
def initiateDB():
    connexion = sqlite3.connect('boozt.db')
    cur = connexion.cursor()
    return connexion, cur


    
#filtering products based on user input
def filterProduct(req):
    productname = req.GET.get('filterProductName')
    cat = req.GET.get('filterCategory')
    page = int(req.GET.get('page'))
   
    connexion, cur = initiateDB()

    lowLimit = 0 if page == 1 else (page*20) - 20 
    query = ""

    column = {'productDisplayName':productname,'subCategory': cat}

    query = "SELECT * FROM boozt2 WHERE "

    emptyColslen = len([val for val in column.values() if val == " "])
    fullCols = 0

    for column, val in column.items():
        if val== " ":
            continue;
        else:
            if column == 'productDisplayName':
                query +=f"productDisplayName LIKE '%{val}%'"
            else:
                query += f"subCategory LIKE '%{val}%'"
            fullCols += 1
            if fullCols + emptyColslen == 2:
                break
            else:
                query +=" AND "


      
    try:
    
        res = cur.execute(query)
        res = res.fetchall()
        filterProduct = res[lowLimit : 20*page]
        connexion.close()
        return HttpResponse(json.dumps({'data': filterProduct}))
       
    except:
        return HttpResponse(json.dumps({'error':'Filter Product not found'}))
    
#Get data of all products   
def getProduct(req):
    page = int(req.GET.get('page'))
    lowLimit = 0 if page == 1 else (page * 20) -20
    connexion, cur = initiateDB()
    

    try:

        res = cur.execute(f'SELECT * FROM boozt2')
        res = res.fetchall()
        res = res[lowLimit:20*page]
        connexion.close()
        return HttpResponse(json.dumps({'data':res}))
    except:
        return HttpResponse(json.dumps({'error':'Something is wrong!'}))
    
#create/add new product
@csrf_exempt
def createProd(req):
    body = json.loads(req.body)
    name = body['prodName']
    category = body['category']
    price = body['price']
    id = random.randint(1, 1000)

    connexion, cur = initiateDB()

    new_prod = f'({id}, "{category}", "{name}", {price})'
    query = 'INSERT INTO boozt2(id, subCategory, productDisplayName, price) VALUES' + new_prod

    try:
       
        cur.execute(query)
        connexion.commit()
        connexion.close()
        return  HttpResponse(json.dumps({'msg': 'Successfully created product!'}))
    except Exception as e:
        return HttpResponse(json.dumps({'error': f'{e}'}))
    
#remove product
@csrf_exempt
def removeProd(req):
    id = req.GET.get('id')
    connexion, cur = initiateDB()

    query = f"DELETE FROM boozt2 WHERE id ={id}"

    try:
        cur.execute(query)
        connexion.commit()
        connexion.close()
        return HttpResponse(json.dumps({'msg':'Sucessfully deleted product '}))
    except Exception as e:
        connexion.close()
        return HttpResponse(json.dumps({'msg': f'{e}'}))
    
#to update product
@csrf_exempt
def updateProd(req):
    id = req.GET.get('id')
    
    body = json.loads(req.body)
    prodName = body['prodName']
    category = body['category']
    price = float(body['price'])

    connexion, cur = initiateDB()

    try:
        query = cur.execute(f"SELECT * FROM boozt2 WHERE id=?", (id,))
        query = query.fetchone()
     
        if query:
            query = f"UPDATE boozt2 SET subCategory='{category}', productDisplayName='{prodName}', price={price} WHERE id={id}"
            
            cur.execute(query)
            connexion.commit()
            connexion.close()
            return HttpResponse(json.dumps({'msg':'Sucessfully updated product!'}))
        else:
            raise Exception('Product not found')

    except Exception as e:
        connexion.close()
        return HttpResponse(json.dumps({'error': f'{e}'}))
    



