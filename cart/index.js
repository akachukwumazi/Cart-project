// const { createElement } = require("react");

const container = document.getElementById("container");
const cartQ = document.getElementById("cartQ");
const cartSubCon = document.getElementById("cartSubCon");
const cartSubCons = document.getElementById("cartSubCons");
const confirmBtn = document.getElementById("confirmBtn");
const confirmOrder = document.getElementById("confirmOrder");
const displayOrderd = document.getElementById("displayOrderd");
const startAllBtn = document.getElementById("startAllBtn");
const totalPrice = document.getElementById("totalPrice");
const emptyCart = document.getElementById("emptyCart");

let myCart = JSON.parse(localStorage.getItem("cartStore")) || [];

let cartNumber = myCart.reduce((acc, item) => acc + item.quantity, 0);
// let cartNumber = 0;
let quantity = 0;
let idNumber = 0;
let count = 0; 
let id = 0;
cartQ.innerText = `(${cartNumber})`;

fetch("../jinsonFolder/index.json").then(Response => Response.json()).then(data => {
    data.forEach((itm, inx) => {
 
        const subDiv = document.createElement("div");
        subDiv.className = "flex flex-col gap-2 py-2 px-2" ; 
        // const uid = idNumber++;
        subDiv.id = idNumber++;
        
        subDiv.innerHTML = `
        <div class="flex flex-col w-[200px] h-[100px] items-center relative"> 
             <img src = "${itm.src}" class="w-[200px] h-[100px] object-cover rounded img">
             <button class="text-xs border-2 rounded-full w-[80px] h-[30px] font-bold absolute bottom-0 translate-y-[50%] bg-gray-300 hover:bg-gray-500 transition-all duration-300 add-to-cart"> add to cart</button>
             <div class="flex items-center space-x-1 border border-gray-300 bg-white px-3  rounded-2xl shadow-md absolute bottom-0 translate-y-[50%] hidden quantity-box">
                    <!-- Minus Button -->
                    <button
                    class="bg-red-500 text-white w-[20px] h-[20px] rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition minus">
                    –
                    </button>

                    <!-- Display -->
                    <div class="w-[20px] text-center font-semibold text-lg bg-gray-100 rounded py-1 count">
                    0
                    </div>

                    <!-- Plus Button -->
                    <button
                    class="bg-green-500 text-white w-[20px] h-[20px] rounded-full flex items-center justify-center text-sm hover:bg-green-600 transition plus">
                    +
                    </button>
             </div>
        </div>

        <h2 class="text-zinc-500 font-bold food">${itm.name}</h2>
        <p class="text-xs">${itm.description}</p>
        <h4 class="text-sm font-bold text-zinc-500 price">${itm.price}</h4>
        `

        const match = myCart.find(el => el.dishname === itm.name);
            if (match) {
                subDiv.querySelector(".add-to-cart").classList.remove("hidden");
                const qBox = subDiv.querySelector(".quantity-box");
                qBox.classList.add("hidden");
                qBox.querySelector(".count").textContent = match.quantity;
            }

        subDiv.addEventListener("click", (e) => {
            const addBtn = e.target.closest(".add-to-cart");
            const plusBtn = e.target.closest(".plus");
            const minusBtn = e.target.closest(".minus");
            const countDiv = subDiv.querySelector(".count");
            const  curentCount = parseInt(countDiv.textContent);
            const food = subDiv.querySelector(".food");
            const foodn = food.textContent;
            const price = subDiv.querySelector(".price");
            const pricen = parseInt(price.textContent);
            const img = subDiv.querySelector(".img");
            const image = img.src;
            const allAddBtn = container.querySelectorAll(".add-to-cart");
            const allQntBtn = container.querySelectorAll(".quantity-box");

            if (addBtn) {

                allAddBtn.forEach(btn => btn.classList.remove("hidden"));
                allQntBtn.forEach(box => box.classList.add("hidden"));

                subDiv.querySelector(".quantity-box").classList.remove("hidden");  
               
                if (curentCount === 0) {
                    countDiv.textContent = 1; 
                    quantity = 1;

                     const data = {
                        src: image,
                        dishname: foodn,
                        quantity: 1,
                        amount: pricen,
                        total:  pricen * quantity,
                        id: subDiv.id
                     } 

                     myCart.push(data),
                     localStorage.setItem("cartStore", JSON.stringify(myCart))
                   
                     
                     renderCart();
                     cartNumber++;
                     cartQ.innerText = `(${cartNumber})`;
                     
                    }
                    updateCartVisibility();

                

            }

            if (plusBtn) {
                 const countDiv = subDiv.querySelector(".count");
                let count = parseInt(countDiv.textContent);
                countDiv.textContent = ++count;
                quantity = count;
                cartNumber++;
                cartQ.innerText = `(${cartNumber})`;

                const item = myCart.find(el => el.id === subDiv.id);

                if (item) {
                    item.quantity = count;
                    item.total = count * item.amount;
                    renderCart();
                    localStorage.setItem("cartStore", JSON.stringify(myCart))
                }
                
                
                updateCartVisibility()
            }
            
            if (minusBtn) {
                const countDiv = subDiv.querySelector(".count");
                let count = parseInt(countDiv.textContent);
                if (count > 1) {
                    countDiv.textContent = --count;
                    
                    cartNumber--;
                    cartQ.innerText = `(${cartNumber})`;
                    
                    
                    const item = myCart.find(el => el.id === Number(subDiv.id));
                    if (item) {
                        item.quantity = count;
                        item.total = count * item.amount;
                        renderCart();
                        localStorage.setItem("cartStore", JSON.stringify(myCart))
                    }
                    updateCartVisibility();
                    // updateGrandTotal();
                } else {
                    
                    subDiv.querySelector(".quantity-box").classList.add("hidden");
                    subDiv.querySelector(".add-to-cart").classList.remove("hidden");
                    
                    count = 0;
                    countDiv.textContent = count;
                    
                    
                    renderCart();
                    const itemIndex = myCart.findIndex(el => el.id === Number(subDiv.id));
                    if (itemIndex !== -1) {
                        cartNumber -= 1;
                        myCart.splice(itemIndex, 1);
                        renderCart();
                        cartQ.innerText = `(${cartNumber})`;
                        localStorage.setItem("cartStore", JSON.stringify(myCart))
                    }
                    updateCartVisibility();
                    // updateGrandTotal();
                }
                
            }
        })
        
        
        container.appendChild(subDiv);
    });
});



function renderCart() {
    cartSubCon.innerHTML = ""; 
    
    
    
    myCart.forEach(it => {
        const cartDiv = document.createElement("div");
        cartDiv.className = "flex flex-col px-2 py-3 border-b w-full gap-1 scale-75 opacity-0 transition-all duration-300";
        
        cartDiv.innerHTML = `
        <h3 class="text-sm font-bold">${it.dishname}</h3>
        <div class="flex w-full justify-between text-xs">
        <p>Qty: ${it.quantity}</p>
        <p>₦${it.amount}</p>
        <p>Total: ₦${it.total}</p>
        <button delete class="text-xl text-[red] h-5 pb-1 w-5 rounded-full border border-red-300 flex items-center justify-center">×</button>
        </div>
        `;
        
        cartSubCon.appendChild(cartDiv);


        requestAnimationFrame(() => {
            cartDiv.classList.remove("scale-75", "opacity-0");
            cartDiv.classList.add("scale-100", "opacity-100");
        }); 
        
        
        const deleteBtn = cartDiv.querySelector("[delete]");

        deleteBtn.addEventListener("click", () => {
            const itemIndex = myCart.findIndex(el => el.dishname === it.dishname);
            if (itemIndex !== -1) {
                myCart.splice(itemIndex, 1);
                localStorage.setItem("cartStore", JSON.stringify(myCart));
                renderCart();
                cartNumber -= it.quantity;
                cartQ.innerText = `(${cartNumber})`;
                updateCartVisibility();
                


                const allAddBtn = container.querySelectorAll(".add-to-cart");
                const allQntBtn = container.querySelectorAll(".quantity-box");
                allAddBtn.forEach(btn => btn.classList.remove("hidden"));
                allQntBtn.forEach(box => box.classList.add("hidden"));

                const countDisplays = container.querySelectorAll(".count");
                countDisplays.forEach(countDiv => countDiv.textContent = "0");
            }
        });
    });
    updateGrandTotal();

}


renderCart();

function updateCartVisibility() {
    if (myCart.length > 0) {
        cartSubCons.classList.remove("scale-0");
        emptyCart.classList.add("scale-100", "hidden");
    } else {
        cartSubCons.classList.add("scale-0");
        emptyCart.classList.remove("scale-100", "hidden");
    }
}





updateCartVisibility();



confirmOrder.addEventListener("click", (e) => {
    
    if (!e.target.closest(".nwa")) {
        confirmOrder.classList.remove("scale-100");
        confirmOrder.classList.add("scale-0");
    } 
});



confirmBtn.addEventListener("click", () => {
    
    confirmOrder.classList.remove("scale-0");
    confirmOrder.classList.add("scale-100");
    displayOrderd.innerHTML = ""; 
    
    myCart.forEach(item => {

            const cartItem = document.createElement("div");
            cartItem.className = "flex px-2 py-3 border-b w-full justify-between items-center gap-2 scale-75 opacity-0 transition-all duration-300 bg-gray-100 rounded-lg";
            cartItem.innerHTML = `
            <div class="flex w-max text-xs">
            <img src="${item.src}" class="w-[50px] h-[50px] object-cover rounded mr-2"> 
            <div class="flex flex-col justify-between ">
            <h3 class="text-sm font-bold">${item.dishname}</h3>
            <div class="flex text-xs items-center">
            <p class="ml-2 font-bold">Qty: ${item.quantity}</p>
            <p class="ml-2  font-bold">₦${item.amount}</p>
            </div>
            </div>
            </div>
            <p class="text-xs font-bold">Total: ₦${item.total}</p>       
            `;
            requestAnimationFrame(() => {
                cartItem.classList.remove("scale-75", "opacity-0");
                cartItem.classList.add("scale-100", "opacity-100");
            }); 
            displayOrderd.appendChild(cartItem);
        });
})


startAllBtn.addEventListener("click", () => {
    confirmOrder.classList.remove("scale-100");
    confirmOrder.classList.add("scale-0");
    localStorage.removeItem("cartStore");
    myCart = [];
    
    
    cartSubCon.innerHTML = "";
    cartQ.innerText = `(${0})`;
    updateCartVisibility();
    
    quantity = 0;
    cartNumber = 0;
    count = 0;
    

    const allAddBtn = container.querySelectorAll(".add-to-cart");
    const allQntBtn = container.querySelectorAll(".quantity-box");
    allAddBtn.forEach(btn => btn.classList.remove("hidden"));
    allQntBtn.forEach(box => box.classList.add("hidden"));
    const countDisplays = container.querySelectorAll(".count");
    countDisplays.forEach(countDiv => countDiv.textContent = "0");
});
    


    function updateGrandTotal() {
    const total = myCart.reduce((sum, item) => sum + item.total, 0);
    totalPrice.textContent = `Total: ₦${total}`;
}

    