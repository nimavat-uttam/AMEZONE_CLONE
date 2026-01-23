

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
  
  document.getElementById("mySidebar").style.width = "75%";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
}

//search bar

// 1. Search bar aur saare boxes ko select karein
const searchInput = document.querySelector(".search-input"); 
const allBoxes = document.querySelectorAll(".box");

// 2. Event listener lagayein
if(searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase(); // Jo user type kar raha hai

        allBoxes.forEach(box => {
            // Box ke andar ka saara text check karein
            const text = box.innerText.toLowerCase(); 
            
            if (text.includes(query)) {
                box.style.display = "block"; // Match hone par dikhao
            } else {
                box.style.display = "none";  // Match na hone par chhupa do
            }
        });
    });
}

// 1. Sidebar Functionality
function openNav() {
    document.getElementById("mySidebar").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
}

// 2. Cart Logic
document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-items-list');
    const totalDisplayElements = document.querySelectorAll('.total-amount');
    const clearButton = document.getElementById('checkout');

    // Function to calculate and update totals
    const updateCartTotal = () => {
        let total = 0;
        let itemCount = 0;
        const items = document.querySelectorAll('.cart-item-card');

        items.forEach(item => {
            const priceText = item.querySelector('.item-price').innerText;
            // Remove '$' and ',' to convert to a number
            const price = parseFloat(priceText.replace(/[$,]/g, ''));
            const qty = parseInt(item.querySelector('.qty-select').value);
            
            total += price * qty;
            itemCount += qty;
        });

        // Update all total spans (Top and Sidebar)
        totalDisplayElements.forEach(el => {
            el.innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
        });

        // Update Subtotal text
        const subtotalText = document.querySelector('.subtotal-summary-bottom');
        if(subtotalText) {
            subtotalText.innerHTML = `Subtotal (${itemCount} items): <span class="total-amount">$${total.toLocaleString()}</span>`;
        }

        // Update Nav Cart Count
        document.querySelector('.cart-count').innerText = itemCount;
    };

    // Listen for Quantity Changes
    cartContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('qty-select')) {
            updateCartTotal();
        }
    });

    // Listen for Delete Buttons
    cartContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' && e.target.innerText === 'Delete') {
            const itemCard = e.target.closest('.cart-item-card');
            
            // Add a small fade-out effect before removing
            itemCard.style.opacity = '0';
            itemCard.style.transform = 'translateX(20px)';
            
            setTimeout(() => {
                itemCard.remove();
                updateCartTotal();
            }, 300);
        }
    });

    // Clear Cart Button
    clearButton.addEventListener('click', () => {
        if(confirm("Are you sure you want to clear your cart?")) {
            cartContainer.innerHTML = '<div style="padding: 20px; text-align: center;">Your cart is empty.</div>';
            updateCartTotal();
        }
    });

    // Initial Calculation
    updateCartTotal();
});

// 3. Language Selector placeholder
function changeLanguage() {
    const selected = document.querySelector('input[name="language"]:checked').value;
    console.log("Language changed to: " + selected);
    // Here you would typically redirect or trigger a translation function
}



const API_URL = "http://localhost:5000/api/cart";

// 1. Items ko screen par dikhana
async function fetchCart() {
    const res = await fetch(API_URL);
    const data = await res.json();
    
    const container = document.querySelector('.cart-items-list');
    container.innerHTML = ""; // Purana data saaf karein

    data.forEach(item => {
        container.innerHTML += `
            <div class="cart-item-card">
                <div class="item-details">
                    <img src="${item.img_url}" class="item-img">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <select class="qty-select" onchange="updateQty(${item.id}, this.value)">
                            <option value="1" ${item.qty == 1 ? 'selected' : ''}>1</option>
                            <option value="2" ${item.qty == 2 ? 'selected' : ''}>2</option>
                            <option value="3" ${item.qty == 3 ? 'selected' : ''}>3</option>
                        </select>
                        <button onclick="deleteItem(${item.id})">Delete</button>
                    </div>
                </div>
                <div class="item-price">$${item.price}</div>
            </div>
        `;
    });
}

// 2. Delete function
async function deleteItem(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchCart();
}

// 3. Update Quantity function
async function updateQty(id, newQty) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty: newQty })
    });
    fetchCart();
}

// Page load hote hi data mangwayein
fetchCart();

 const languages = {
            en: { 
                name: "English", 
                 message: "Language has been changed to English."
            },
            hi: { 
                name: "हिन्दी", 
               message: "भाषा हिन्दी में बदल गई है।"
            },
            es: { 
                name: "Español", 
                message: "Idioma cambiado a Español."
            },
            fr: { 
                name: "Français", 
                 message: "Langue changée en Français."
            },
            de: { 
                name: "Deutsch", 
               message: "Sprache auf Deutsch geändert."
            }
        };

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners to all radio buttons
            const radioButtons = document.querySelectorAll('input[name="language"]');
            radioButtons.forEach(radio => {
                radio.addEventListener('change', handleLanguageChange);
            });
            
            // Set initial language
            const initialLang = document.querySelector('input[name="language"]:checked').value;
            updateLanguageDisplay(initialLang);
        });

        // Handle language change
        function handleLanguageChange(event) {
            const selectedLang = event.target.value;
            updateLanguageDisplay(selectedLang);
            showLanguagePopup(selectedLang);
            
          
        }

        // Update the display
        function updateLanguageDisplay(langCode) {
            const langData = languages[langCode];
            document.getElementById('currentFlag').src = langData.flag;
            document.getElementById('currentLanguage').textContent = langData.name;
        }

        // Show popup notification
        function showLanguagePopup(langCode) {
            const langData = languages[langCode];
            const popup = document.getElementById('languagePopup');
            const popupContent = document.getElementById('popupContent');
            
            // Update popup content
            popupContent.textContent = langData.message;
            
            // Update time
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('popupTime').textContent = timeString;
            
            // Show popup
            popup.style.display = 'block';
            
            // Auto-hide after 4 seconds
            setTimeout(() => {
                if (popup.style.display === 'block') {
                    closeLanguagePopup();
                }
            }, 4000);
        }

        // Close popup
        function closeLanguagePopup() {
            const popup = document.getElementById('languagePopup');
            popup.style.display = 'none';
        }

        // If you want to get the current selected language programmatically
        function getCurrentLanguage() {
            const selectedLang = document.querySelector('input[name="language"]:checked').value;
            return {
                code: selectedLang,
                name: languages[selectedLang].name
            };
        }

        // If you want to set language programmatically (from other parts of your code)
        function setLanguage(langCode) {
            if (languages[langCode]) {
                const radioButton = document.querySelector(`input[name="language"][value="${langCode}"]`);
                if (radioButton) {
                    radioButton.checked = true;
                    updateLanguageDisplay(langCode);
                    showLanguagePopup(langCode);
                }
            }
        }

