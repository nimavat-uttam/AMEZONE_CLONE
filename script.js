

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
              //  flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADUSURBVHgB7ZQxCsJAEEDnChYWVhH8gL2FjV/wB4JFPmBjYSkIfkEsrCzEykYQxMJCBIuACBKl0EJFzE6yu8mRhNzC7MMls7tzO5uFEP8EfV6lBdAAGPl0juMYoih6qS3LEnzfF8MwFGyapgLzPGeapkLXdQXTNGV6jqJIaJqmYOQ4DpnjOCRs2xaapiHLskxwr9cTbBiGgmmaXg6SJGFxHAtZlgm2LEvB8zx/DofDcz6f0+VyeSzLki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3Lki3LkuEbfAHs1VZrZyaP3QAAAABJRU5ErkJggg==",
                message: "Language has been changed to English."
            },
            hi: { 
                name: "हिन्दी", 
             //   flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACzSURBVHgB7dRBCoJQFAXQgwcIa9OoRYsGQbtI2vQnLfqSRkGDRkGjBg2Cho0aN4jEwHUH74IzOHAHcjjvZds2fAJ9sAm6oAlqoADuwAU4AzlHhGEI0zRh2zY8z0OapsiyDGmawvM8OI6DKIoEm6YpwzRNAUmSgK7rMqyqCkVRYDAYII5j1HWNH8dxjLIs0TQNer0ewjDEaDSCruuCoygSrOu6DC3LkuF0OkW320WSJBiPxx/Xtm0H0+l01el0Xv1+X3C/3xdsGIYMLcuS4Ww2g67pOJ1OmM/n/7m2n/ANcMJWbUd3a7wAAAAASUVORK5CYII=",
                message: "भाषा हिन्दी में बदल गई है।"
            },
            es: { 
                name: "Español", 
              //  flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFkSURBVHgBpVWxTsJAFP5ut8qlS5kYfQJ9Ah2Y9AX0CRx9Amd8A0aewMEncGQ0Dt1IiAMxMSYG44BBAglw3fWuV7hC29DyJXe9vt/9+ndXAPhvUNJ6vR5kWQZFUUBrDd/3S7zZbFZAkiSw1mI4HL6kaSqurq6+4J9BSVdVVen3+1itVhiNRojjGNPpFLPZDDc3NxiPx6Xg4+NjITgYDEj0K7rd7kmapo/z+VxwkiTl1ul0sF6vy3wymRTK7u7u7l9xgaenJ/FZqKqKZrOJ5+dnTKdT3N7ewvM8OOeQ5znq9TparVbZQxZ4GjabzQqPRqOCmYiiqKp5Pp+j3W6Xgiz42S2hqsqrPGl2Oh3UajUYYxDHMdbr9ZsF5uf7jNw/Y4x7fX2tjkYjW6vVLH9S4XC46XQ6VlUVw8Tm8/mX9UAhLk69Xm/0+/1X/lyWy+V2sVgYz/O2jUZj22w2bbvd1lzner2mvDO3s9nsfLFY/L4l7gT8vX9s+RsF/7e48Ef7DOicwx+BoijwAe6D/QuwN1ZUAAAAAElFTkSuQmCC",
                message: "Idioma cambiado a Español."
            },
            fr: { 
                name: "Français", 
               // flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAC6SURBVHgB7ZWhDcIwFEW/TRCcgF3oAgzBCsAqwAZswAjsAiuwA7sBK3TCCfFz1FgpB2eQq75k+ct/4sSRgPNBQBfUQAHEwBXYACsgTZmWZYm6rmHbNrz3iOOIOI7w3qNpGnRdB2MMpJQpU0oppNYaQgjc73eUZZkz3W43eJ5nuK6bMyVJgq7r4JxDUfxcsWmaOEkwTRNFURSv2Hq91n3ff8VWq5UehsFcLpe3Tf4D/9HkDfgAkx9XVMbIuI4AAAAASUVORK5CYII=",
                message: "Langue changée en Français."
            },
            de: { 
                name: "Deutsch", 
              //  flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEdSURBVHgBrVWxbcJADPUuHaBD5g7ZgA3YgA3YgA3YgA1gAzZgA1iAARiADWAAhkhVpEqVqlTq4Nx7dpxzcEx+6eX+znfnO5/PcP4hjUYD2u02dLtd6PV60O/3YTgcwmQyKY7T6bQ4j0YjGA6H0Ov1oNvtwmAwKGpQ88NhTSaTMZlMYDqdwmw2K0KSJBuRZRmkaQpJkhQ1qEHN1sZ8Pi9CQhQhIQpIRJJqhRQFrtPpFIWEDgqFhEhEguqIqqJqqlZ1W6FqVbsy1G+lT5LqiJoFbNv+9n3/z3Gcf9d1C9i2XYTrun+WZRWha9D7LcuyX3zAQtd1/2ez2W8URX/4EwRBEaPR6AeDsc/n8x88Yi1q8Jq2bb8zxm5R9IZCiSK6RuGjEIKuWYu12I+9FEWPJHxF4TOJzCi8R9HlcvmNm1cU1mI/9uIafAvyfCbhBQkvKbpB0dvb2zeuX1FUi/1bFvIMZ7PZ/Xg8vh0Oh7f9fv+23W5vN5vN7Xq9vl2tVrfr9fp2s9ncNpvN7X6/v+12u9t+v79tt9vbxWKBmh+O7+vuOP4B7lNV1cHlUsUAAAAASUVORK5CYII=",
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