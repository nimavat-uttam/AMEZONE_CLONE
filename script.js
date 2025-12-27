

/*scrolll bar*/



   const scrollContainers = document.querySelectorAll(".products, .uttam");

for (const item of scrollContainers) {
    item.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        // 'container' की जगह 'item' का उपयोग करें
        item.scrollLeft += evt.deltaY;
    });
};

 // Cart functionality
  // ===== Cart Elements =====
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.btn');

// ===== Initialize Cart Count =====
let cartCount = localStorage.getItem('cartCount')
  ? parseInt(localStorage.getItem('cartCount'))
  : 0;

// Show initial count
if (cartCountElement) {
  cartCountElement.textContent = cartCount;
}

// ===== Add to Cart Button =====
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    cartCount++;
    localStorage.setItem('cartCount', cartCount);

    // Update display
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }

    // Button feedback
    button.textContent = "Added to Cart";
    button.style.backgroundColor = "#FFA41C";

    setTimeout(() => {
      button.textContent = "Add to Cart";
      button.style.backgroundColor = "#FFD814";
    }, 2000);
  });
});

// ===== Listen for storage changes (sync across tabs/pages) =====
window.addEventListener('storage', (event) => {
  if (event.key === 'cartCount') {
    cartCount = parseInt(event.newValue);
    if (cartCountElement) {
      cartCountElement.textContent = cartCount;
    }
  }
});


 /* Sidebar control with JavaScript */
        function openNav() {
            // मोबाइल पर 75% चौड़ाई
            document.getElementById("mySidebar").style.width = "75%"; 
        }

        function closeNav() {
            document.getElementById("mySidebar").style.width = "0";
        }


/* see more toggle*/
function toggleItems(elem) {
    const moreItems = document.querySelector('.more-items');
    if (moreItems.style.display === 'none' || moreItems.style.display === '') {
        moreItems.style.display = 'grid'; // grid layout maintain
        elem.textContent = 'See Less';
    } else {
        moreItems.style.display = 'none';
        elem.textContent = 'See More';
    }
}

const checkoutBtn = document.getElementById('checkout');
  const cartCountElement1 = document.querySelector('.cart-count');

  checkoutBtn.addEventListener('click', () => {
    localStorage.removeItem('cartCount'); // 👈 Cart reset karo
    cartCountElement1.textContent = 0; // Display pan 0 karo
    alert("Thank you! Your cart has been cleared.");
  });
   function openNav() {
            // मोबाइल पर 75% चौड़ाई
            document.getElementById("mySidebar").style.width = "75%"; 
        }

        function closeNav() {
            document.getElementById("mySidebar").style.width = "0";
        }

