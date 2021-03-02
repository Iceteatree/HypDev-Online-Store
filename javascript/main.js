// DISCLAIMER: I used this set of tutorials to teach me how to add the main functionality needed for the shopping cart. https://www.youtube.com/watch?v=B20Getj_Zk4&list=PLD9SRxG6ST3HignjcXUX6w8RcT0_b5ihV. However it was not all just me watching and copying code line for line. There are also a lot of custom things that took me hours upon hours of playing to figure out, some things I didn't figure out at all and some things where I simply didn't have time to do sad face. However I definitely put a lot of effort into this! This in addition to the work done before as well as a fudge ton of Googling is what you see before you. Enjoy.

// I didnt have time to add a clear button. So you'll have to manually clear your local storage if you want to play around and test things.

//This was created using Mozilla as a browser. I'm not sure how well this plays in others.

// Assigning the addCartBtn a variable so we can easilly use its location later.
let addCartBtn = document.querySelectorAll(".cataItemBtn");

//Creating an empty products array.
let products = [];

// Creating an empty coupon code array.
let couponCodes = [];

// Got lazy and just created a simple array to hold the delivery cost numbers.
let deliveryOptionCost = [0, 30, 100];

//Getting the Apply Coupon Button from the HTML and assigning it a variable.
let couponCodeBtn = document.getElementsByClassName("btnApplyCoupon");
// Using a standard for loop to create an event listener that when clicked targets the applyCoupon function.
    for (let i = 0; i <couponCodeBtn.length; i++) {
    let couponBtn = couponCodeBtn[i];
        couponBtn.addEventListener("click", applyCoupon);
}
//Getting the Purchase Button from the HTML and assigning it a variable.
let confirmOrderBtn = document.getElementsByClassName("btn-purchase");
for (let i = 0; i <confirmOrderBtn.length; i++) {
    let button = confirmOrderBtn[i];
    // Using a standard for loop to create an event listener that when clicked targets the confirmOrder function.
    button.addEventListener("click", confirmOrder);
}
//Getting the Delivery options radio input from the HTML and assigning it a variable.
let deliveryRadioButtons = document.getElementsByName("deliveryOptions");
for (let i = 0; i < deliveryRadioButtons.length; i++) {
    // Using a standard for loop to create an event listener that when clicked targets the deliveryCost function.
    let input = deliveryRadioButtons[i];
    input.addEventListener("click", deliveryCost);
}

// Creating a class constructor called Coupon Codes
class CouponCodes{
    constructor(couponTag, couponValue) {
        this.couponTag = couponTag;
        this.couponValue = couponValue;
    }
}

// Using the previously made class constructor to make some Coupon objects
let coup1 = new CouponCodes(
    "FREE60",
    60
);

let coup2 = new CouponCodes(
    "CATS30",
    30
);

let coup3 = new CouponCodes(
    "TEST100",
    100
);

// Adding said coupon objects to an array for easier targeting.
couponCodes.push(coup1, coup2, coup3);

// Creating a class constructor called Product
class Product{
    constructor(productName, productTag, productPrice, inCart) {
        this.productName = productName;
        this.productTag = productTag;
        this.productPrice = productPrice;
        this.inCart = inCart;
    }
}

// Creating objects from said class constructor
let foodItem1 = new Product (
    "Eggs and Avacado",
    "eggs",
    60,
    0
);
let foodItem2 = new Product (
    "Fruit Bowl",
    "fruit-bowl",
    45,
    0
);
let foodItem3 = new Product (
    "Oats",
    "oats",
    30,
    0
);
let foodItem4 = new Product (
    "Steak",
    "steak",
    130,
    0
);
let foodItem5 = new Product (
    "Salad",
    "salad",
    70,
    0
);
let foodItem6 = new Product (
    "Hamburger",
    "hamburger",
    90,
    0
);
let foodItem7 = new Product (
    "Chicken",
    "chicken",
    150,
    0
);
let foodItem8 = new Product (
    "Dumplings",
    "dimsum",
    55,
    0
);
let foodItem9 = new Product (
    "Pasta",
    "pasta",
    78,
    0
);

// Adding those objects to the empty array we created earlier
products.push(foodItem1, foodItem2, foodItem3, foodItem4, foodItem5, foodItem6, foodItem7, foodItem8, foodItem9);

// Creating a for loop that loops through the add cart buttons to create event functionality on click. It calls cartNumbers function and total Cost function and passes through products array as an input
for (let i = 0; i < addCartBtn.length; i++) {
    // Trying out arrow functions for the first time
    addCartBtn[i].addEventListener("click", () => {
        cartNumbers(products[i]);
        totalCost(products[i])
    })
} 

//This function gets the cartNumbers value from the local storage.
function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem("cartNumbers");
    // If product numbers exists then it will change the text content of the little shopping cart item targeted by the nav-cart and span classes to the product numbers that were pulled from the local storage.
    if (productNumbers) {
        document.querySelector(".nav-cart span").textContent = productNumbers;
    }
}
// This function makes sure that the numbers on our cart icon always appear correctly
function cartNumbers(product) {
    // gets the number of products from the local storage
    let productNumbers = localStorage.getItem("cartNumbers");
    productNumbers = Number(productNumbers);
    // If there is an item in our productNumbers then it will add 1 to our local storage else it will be set to 1
    if (productNumbers) {
        // set item sends back an updated version of the cartNumbers 
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector(".nav-cart span").textContent = productNumbers + 1;
    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector(".nav-cart span").textContent = 1;
    }
    // Calling the setItems function and passing through the product input to refresh the cart icon basically.
    setItems(product);
}

// This function sets the products added to a JSON ready value so that it can be used for displaying later.
function setItems(product) {
    // fetching existing productsinCart value from local storage and assigning it to cart items.
    let cartItems = localStorage.getItem("productsInCart");
    // converting JSON to a non string format
    cartItems = JSON.parse(cartItems);
    // if cartItems is not empty
    if (cartItems != null) {
        // if cartItems product tag gives back the value of undefined 
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                // Grab whatever was in the cartItems from before and represent it as an array
                ...cartItems,
                [product.productTag]: product
            }
        }
        // Increase inCart tag by 1
        cartItems[product.productTag].inCart += 1;
    } else {
        product.inCart = 1;
        // the format of the cartItems is {"productTag": product(which contains all the product keys and values)}
        cartItems = {
            [product.productTag]: product
        }
    }
    // Sends the updated version to the productsinCart in local storage and converts it to JSON readable format
    localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}

// This function calculates the total cost of all the cart items
function totalCost(product) {
    // getting total cost from local storage and assigning it to cartCost
    let cartCost = localStorage.getItem("totalCost");
    // if cartCost is not empty then do the following
    if (cartCost != null) {
        // Transform it to an integer
        cartCost = Number(cartCost);
        // Send it back to the local storage with an updated value
        localStorage.setItem("totalCost", cartCost + product.productPrice);
    } else {
        localStorage.setItem("totalCost", product.productPrice);
    }
}

// This function displays our final cart items
function displayCart() {
    // Calls the delivery cost function 
    deliveryCost();
    // gets the relevant info from the local storage and assigns them to appropriate local variables
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector(".cartItems");
    let cartCost = localStorage.getItem("totalCost");
    let discount = localStorage.getItem("Discount");
    let delivery = localStorage.getItem("Delivery");
    // converting these 3 to numbers because they just came back from local storage and I need them in integer format to do some math
    discount = Number(discount);
    cartCost = Number(cartCost);
    delivery = Number(delivery);
    let finalTotal = cartCost + delivery - discount;
    // if cartItems and productContainer exists then do the following
    if (cartItems && productContainer) {
        // Set the product container to an empty string
        productContainer.innerHTML = "";
        // Convert the values of cartItems into an array and then map them into an item function
        Object.values(cartItems).map(item => {
            // basically appending the innerHTML of the product container to hold the following HTML using a template literal
            productContainer.innerHTML += `
            <section class="container cart-section">
                <div class="product">
                    <i class="bi bi-x-circle btnDeleteItem col-md-2"></i>
                    <img class="col-2" src="./images/${item.productTag}.jpg">
                    <span class="col foodNameCart">${item.productName}</span>
                </div>
                <div class="price col-2">R${item.productPrice}.00</div>
                <div class="quantity col-2">
                    ${item.inCart}      
                </div>
                <div class="col-2 total">
                    R${item.inCart * item.productPrice}.00
                </div>
            </section>
            `
        });
        // The same is being done for the next section containing the final amounts
        productContainer.innerHTML += `
        <hr>
            <div class="basketTotalContainer">
                <h5 class="subTotalTitle"> Subtotal </h5>
                <h5 class="subTotal">
                    R${((cartCost / 115) * 100).toFixed(2)}
                </h5>
                <br>
                <h5 class="addVat"> Added VAT (15%) </h5>
                <h5 class="vatTotal">
                    R${((cartCost / 115) * 15).toFixed(2)}
                </h5>
                <br>
                <h5 class="discountTitle"> Discount Applied </h5>
                <h5 class="discountTotal">
                    R${discount}.00
                </h5>
                <br>
                <h5 class="deliveryTitle"> Delivery Cost </h5>
                <h5 class="deliveryTotal">
                    R${delivery}.00
                </h5>
                <br>
                <hr>
                <h4 class="basketTotalTitle"> Basket Total</h4>
                <h4 class="basketTotal">
                    R${finalTotal}.00
                </h4>
            </div>
        `
    }
}
// This function calculates the delivery cost and is linked to the click of the earlier button
function deliveryCost() {
    let deliveryValueStore = 0;
    // Basically if the first radio button is seleccted then set the value of the variable we created to the array item 0...etc...etc
        if (document.getElementById("deliveryInput1").checked) {
            deliveryValueStore = deliveryOptionCost[0];
        } else if (document.getElementById("deliveryInput2").checked) {
            deliveryValueStore = deliveryOptionCost[1];
        } else {
            deliveryValueStore = deliveryOptionCost[2];
        }
    //Send it to the local storage under the name delivery
    localStorage.setItem("Delivery", deliveryValueStore);
}
// This function calculates the coupon code discount and is linked to the click of the earlier button
function applyCoupon(couponcode) {
    // using the couponcode to store the location of the couponInput ID
    couponcode = document.getElementById("couponInput");
    // initialising the codeApplied variable
    let codeApplied = 0;
    // Using a for loop that gies through the array couponCodes
    for(let i = 0; i < couponCodes.length; i++)
        // If the value of the input is equal to the value of the array items coupon tag then apply the coupon value to the code Applied and send out an alert.
        if (couponcode.value == couponCodes[i].couponTag) {
            codeApplied = couponCodes[i].couponValue;
            alert("You've applied a code. You get R" + codeApplied + " off.");
            // Send the updated codeApplied to local storage under the name Discount
            localStorage.setItem("Discount", codeApplied);
            // return after running once so that it doesnt run multiple times.
            return;
        } 
    // If coupon code input is empty then display this message otherwise assume the code is expired or doesnt exist
    if (couponcode.value === "") {
        alert("There is no coupon code entererd")
    } else {
        alert("This code does not exist or is expired"); 
    }
}

// This function just generates a random unique ID for our customer and is activated when the final purchase button is clicked
function confirmOrder() {
    // Was just playing around with all the ways you could randomize basically.
    let uniqueID = "#" + Math.random().toString(36).substring(7) + Math.floor((Math.random() * 10000) + 1);;
    alert("Thank you for your purchase. Your reference number for this order is " + uniqueID);
}


// JQuery Section - I don't like using JQuery at this stage. It is confusing the vanilla Javascript in my head. I'd rather get a solid foundation in that first then use shortcuts like these.

// You can the jquery stuff on the login page

// Drop down menubar. To see in action hover on top left icon
$(".header-logo ").hover(function () {
    // If the value of the currently selected elements property of visibility is equal to false. then the unordered list within the dropDownAccordion ID will slideUp within 800ms. 
    if (false === $(this).next().is(':visible')) {
        $('.dropdownMenu .subLinks').slideUp(800);
    }
    //The value of the current element is  first detected then the sibling of that element is targeted using the next() function and then the slideToggle function is called which will then slide the element within 800ms.
    $(this).next().slideToggle(800);
});

// Hide/Show can be clicked/toggled multiple times
$("#hideshowBtn").click(function(){
    $("aside h2").toggle();
});

// Animate changes opacity to be lighter increases the height and decreases the font size

$("#animateBtn").click(function(){
    $("aside h2").animate({
        opacity: 0.25,
        height: "5rem",
        fontSize: "20px"
    })
})
// Chain different effects. I just went wild.
$("#chainBtn").click(function(){
    $("aside h2").animate({opacity: 0.25,height: "5rem",fontSize: "20px"}).slideUp(1000).slideDown(1000).animate({opacity: 0.85,height: "10rem",fontSize: "80px"});
})

// Code is a bit messy here cause I was essentially just triggering the onloadCoartNumbers and displayCart functions when the page is loaded.
onLoadCartNumbers(); 
displayCart();

// creating a variable for the remove item button. I've moved it to the end because the HTML doesnt have a remove Item button. It is only triggered when the displayCart function is triggered and so you have to move it after that happens to get it to work correctly. Probably a better way to do this ... but I'm tired.
let removeCartItemBtn = document.getElementsByClassName("btnDeleteItem");
// again for loop for adding an event listener to the click which leads to the removeCart function.
for (let i = 0; i <removeCartItemBtn.length; i++) {
    let button = removeCartItemBtn[i];
    button.addEventListener("click", removeCartItems);
    }

// This function basically removes the item from the cart
function removeCartItems(e) {
    let buttonClicked = e.target;
    // targeting the buttonclicked's parent element parent element. Basically the section element that holds all the product info of that row.
    buttonClicked.parentElement.parentElement.remove();  
    // I didn't have the time to figure this out but here is my logic if I had more time. I would assign cartItems to the local storage.getItem. Convert it using a JSON.parse. Then I would take the cartItems and specifically target the value that is being deleted. I would then remove that value from the cartItems and then set it back to the productsinCart local storage.
    // The ending would probably involve something like this:
    // localStorage.setItem("productsInCart", JSON.stringify(cartItems));
}



/* Future updates for this.

    -I need to fix the catalogue pages so that they also update the checkout cart
    -Fix delete button functionality
    -Add quantity change buttons to the cart.
    -Make search button work
    -Make login/register page work.
    -More CSS styling */