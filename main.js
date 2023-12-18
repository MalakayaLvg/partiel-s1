const content = document.querySelector(".content")
const routeUrl = "https://partiel-b1dev.imatrythis.com/"

let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3MDI4OTE4MDUsImV4cCI6MTcwMjg5OTAwNSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoib3NseW54In0.tQWL_-ECFIKlfZOL4DnkvoN1VEFXsZhjc7UwTmky3dn9hqd2S41d6V5TXOp_8hj0vw_4sLPPvM2IrDjqP8jwe50I2IYvOcY93RPIKCuiFk5FqqogUr2PbaNw6Zhga9c_LoRVqB1-gOxyh3LF8l_uF8AAhO5MEMWcqkKTXHqpmIYNrxilbrGg9b7gbgraM1yrRv-fSzKZlybvqZRLaKzoiZnmxEjVyp7GKKXQmqFQYUJUqiBCJETCBnNsb7wRlEIcWQffdzitSJuHzlvs1PzfE4R5B0a78AOM_PYFFbw3_5y3NkEgXQ237185OmBdnCVBa0jLADBAiPWVsnsH-no-fg"
let userData = null


// ------------------------- LOGIQUE -----------------------------

function run(){
    if (!token){
        loginForm()
    } else {
        console.log("connected")
        getUserObject().then((data)=>{
            fetchGetMyList().then((myList)=>{
                landingPage(myList)
            })
        })

    }
}

function render(pageContent){
    content.innerHTML = ""
    content.innerHTML = pageContent
}

run()


// ------------------------------ CONNEXION ----------------------------------

// ** user create :
// oslynx, motdepasse1
// oslynx3, motdepasse3



// LOGIN
function loginForm(){
    let template = `
      <div>
         <h2>Login Form</h2>
         <h4>Username</h4>
         <input class="inputUsername">
         <h4>Password</h4>
         <input class="inputPassword">
         <div class="my-3">
            <button class="btn btn-primary" id="buttonLogin">Login</button>
            <button class="btn btn-secondary" id="buttonGoRegister">GO Register</button>
         </div>
      </div>
   `
    render(template)

    const buttonLogin = document.querySelector("#buttonLogin")
    const buttonGoRegister = document.querySelector("#buttonGoRegister")
    const username = document.querySelector(".inputUsername")
    const password = document.querySelector(".inputPassword")

    buttonLogin.addEventListener("click",()=>{
        fetchLogin(username,password).then(data=>{
            token = data.token
            run()
        })

    })

    buttonGoRegister.addEventListener("click",()=>{
        registerForm()
    })


}
async function fetchLogin(username,password){
    let body= {
        username: username.value,
        password: password.value
    }
    let params = {
        method: "POST",
        headers : {"content-type":"application/json"},
        body : JSON.stringify(body)
    }
    return await fetch(`${routeUrl}api/login`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("response register",data)
            return data
        })
}

//REGISTER
function registerForm(){
    let template = `
      <div>
         <h2>Register Form</h2>
         <h4>Username</h4>
         <input class="inputUsername">
         <h4>Password</h4>
         <input class="inputPassword">
         <div class="my-3">
            <button class="btn btn-primary" id="buttonRegister">Register</button>
            <button class="btn btn-secondary" id="buttonGoLogin">GO Login</button>
         </div>
      </div>
   `
    render(template)

    const buttonRegister = document.querySelector("#buttonRegister")
    const buttonGoLogin = document.querySelector("#buttonGoLogin")
    const username = document.querySelector(".inputUsername")
    const password = document.querySelector(".inputPassword")

    buttonGoLogin.addEventListener("click",()=>{
        loginForm()
    })

    buttonRegister.addEventListener("click",()=>{
        console.log("click register")
        fetchRegister(username,password).then(data=>{
            token = data.token
        })
    })

}
async function fetchRegister (username,password){

    let body = {
        username: username.value,
        password: password.value
    }
    let params = {
        method: "POST",
        headers: {"content-type":"application/json"},
        body: JSON.stringify(body)
    }
    return await fetch(`${routeUrl}api/register`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("register response:",data)
            return data
        })
}

// PAGE PRINCIPALE

function landingPage(myList){

    let actionOnListContent = `
    <div id="divActionOnList" class="d-flex">
        <button class="btn btn-success mx-2" id="buttonAddNewProduct">Add New Product</button>
        <button class="btn btn-danger mx-2" id="buttonDeleteAllProduct">Delete All Product</button>
        <button class="btn btn-primary mx-2" id="buttonRefresh">Refresh</button>
    </div>
    `



    let listContent = ""
    myList.forEach((product)=>{
        listContent += `
        <div class="form-control my-2 px-4 d-flex justify-content-between">
            <div class="divProduct${product.id}">
                <h5>${product.name}</h5>
                <h6>${product.description}</h6>
                <h6>status: ${product.status}</h6>
            </div>
            <div>
                <button class="btn btn-danger buttonDeleteProduct" id="${product.id}">DELETE</button>
                <button class="btn btn-secondary buttonSwitchStatusProduct" id="${product.id}">Swicth status</button>
                <button class="btn btn-warning buttonEditProduct" id="${product.id}">EDIT</button>                
            </div>
        </div>
        `
    })

    // -------------------------- RENDER -----------------------------

    let contentToRender = profileTemplate() + actionOnListContent + listContent
    render(contentToRender)


    // 1.1 -------------------- ADD PRODUCT ---------------------------
    const buttonAddNewProduct = document.querySelector("#buttonAddNewProduct")
    buttonAddNewProduct.addEventListener("click",()=>{
        console.log("click on add product")
        // From rendering
        addNewProductOnListForm()

        // When confirm button is clicked
        const buttonConfirmAddNewProduct = document.querySelector("#buttonConfirmAddNewProduct")
        const inputNameNewProduct = document.querySelector("#inputNameNewProduct")
        const inputDescriptionNewProduct = document.querySelector("#inputDescriptionNewProduct")

        buttonConfirmAddNewProduct.addEventListener("click",()=>{
            console.log("click on confirm add product")
            fetchAddNewProduct(inputNameNewProduct.value,inputDescriptionNewProduct.value).then((data)=>{
                console.log("add product done")
                run()
            })
        })

    })


    // 1.2 ------------------- DELETE PRODUCT -------------------------
    const buttonDeleteProduct = document.querySelectorAll(".buttonDeleteProduct")
    buttonDeleteProduct.forEach((button)=>{
        button.addEventListener("click",()=>{
            console.log("click on delete button id:",button.id)
            fetchDeleteProduct(button.id).then((data)=>{
                console.log("delete done")
                run()
            })
        })
    })


    // 1.3 -------------------- SWITCH STATUS ----------------------------
    const buttonSwitchStatusProduct = document.querySelectorAll(".buttonSwitchStatusProduct")
    buttonSwitchStatusProduct.forEach((button)=>{
        button.addEventListener("click",()=>{
            console.log("click on switch status button id:",button.id)
            fetchSwitchStatusProduct(button.id).then((data)=>{
                console.log("switch status done")
                run()
            })
        })
    })


    // 1.4 --------------------- REFRESH ----------------------------------
    const buttonRefresh = document.querySelector("#buttonRefresh")
    buttonRefresh.addEventListener("click",()=>{
        console.log("click on refresh button")
        run()
    })


    // 1.5 ______________________ DELETE ALL PRODUCT ------------------------
    const buttonDeleteAllProduct = document.querySelector("#buttonDeleteAllProduct")
    buttonDeleteAllProduct.addEventListener("click",()=>{
        console.log("click on delete all product")
        alert("your are going to delete all your product")
        fetchDeleteAllProduct().then(()=>{
            console.log("delete all product done")
            run()
        })
    })


    // 1.6 ---------------------- EDIT PRODUCT ------------------------------
    const buttonEditProduct = document.querySelectorAll(".buttonEditProduct")
    buttonEditProduct.forEach((button)=>{
        button.addEventListener("click",()=>{
            console.log("click on button edit on product id:",button.id)
            // editProductForm(button.id)
            getProductObjectById(button.id,myList)
        })
    })











}

async function fetchGetMyList(){
    let params = {
        method: "GET",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
    }
    return await fetch(`${routeUrl}api/mylist`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("response getMylist",data)
            return data
        })

}

async function fetchDeleteProduct(productId){
    let params = {
        method: "DELETE",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
    }
    await fetch(`${routeUrl}api/mylist/delete/${productId}`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("delete response:",data)
        })
}

function addNewProductOnListForm(){
    let template = `
    <div class="form-control">
        <h5>Complete information for your new product</h5>
        <h6>Product Name</h6>
        <input type="text" id="inputNameNewProduct">
        <h6>Product Description</h6>
        <input type="text" id="inputDescriptionNewProduct">
        <button class="btn btn-success" id="buttonConfirmAddNewProduct">Confirm</button>
    </div>
    `
    const divActionOnList = document.querySelector("#divActionOnList")
    divActionOnList.innerHTML = template
}
async function fetchAddNewProduct(productName,productDescription){
    let body = {
        name: productName,
        description: productDescription
    }
    let params = {
        method: "POST",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`},
        body: JSON.stringify(body)
    }
    await fetch(`${routeUrl}api/mylist/new`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("product add response:",data)
        })
}

async function fetchSwitchStatusProduct(productId){
    let params = {
        method: "PATCH",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
    }
    await fetch(`${routeUrl}api/mylist/switchstatus/${productId}`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("switchstatus response:",data)
        })
}

async function fetchDeleteAllProduct(){
    let params = {
        method: "DELETE",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
    }
    await fetch(`${routeUrl}api/mylist/clear`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("clear response:",data)
        })
}

function editProductForm(productId){
    const divProductSelect = document.querySelector(`.divProduct${productId}`)
    divProductSelect.innerHTML = `
    <input type="text" value="${product.name}" id="productSelectName">
    <input type="text" value="${product.description}" id="productSelectName">
    <h6>status: ${product.status}</h6>
    <button id="confirmEditSelectProduct">Confirm</button>
    `
}

function getProductObjectById(productId,products){
    let productObject = null
    products.forEach((product)=>{
        if (product.id == productId){
            console.log(productId,product.id)
        }
        productObject = product
    })
    console.log(productObject)
    return productObject
}




// PROFILE
async function getUserObject(){
    let params = {
        method: "GET",
        headers: {"content-type":"application/json","authorization":`Bearer ${token}`}
    }
    await fetch(`${routeUrl}api/whoami`,params)
        .then(response=>response.json())
        .then(data=>{
            console.log("userObject:",data)
            userData = data
        })
}

function profileTemplate(){
    let template = `
    <div class="my-4">
        <h5>Liste de course de ${userData.username}</h5>
    </div>
    `
    return template
}








