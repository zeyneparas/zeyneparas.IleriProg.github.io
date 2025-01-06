// Global tanımlama için window'a fonksiyonu ekleyin
window.changeSlide = function (direction) {
    currentSlide += direction;

    // Kaydırmayı sınırlandırma
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    updateSlider();
};

function updateSlider() {
    const offset = -currentSlide * 100;
    document.querySelector('.slider').style.transform = `translateX(${offset}%)`;
}

let currentSlide = 0;
const slides = document.querySelectorAll('.slider-image');
const totalSlides = slides.length;

// Başlangıçta ilk görsel gösterilsin
updateSlider();

// Sepete Ekleme İşlemi
const basketCountElement = document.querySelector('.basket_count');
const addToBasketButtons = document.querySelectorAll('.add-to-basket');

// personIcon'a tıklama olayı ekleyelim
document.getElementById('personIcon').addEventListener('click', function () {
    // Sign In sayfasına yönlendirme yapalım
    window.location.href = 'signin-up.html';  // 'index.html' sayfasına yönlendirme
});

// personIcon'a tıklama olayı ekleyelim
document.getElementById('openBasket').addEventListener('click', function () {
    // Sign In sayfasına yönlendirme yapalım
    window.location.href = 'sepet.html';  // 'index.html' sayfasına yönlendirme
});


// Sepet ikonuna tıklanıldığında pop-up ekranını açma
const basketIcon = document.querySelector('.basket_icon'); // Sepet ikonunu seç
const basketPage = document.getElementById('basketPage'); // Sepet popup ekranı
const closeBtn = document.querySelector('.close-btn'); // Popup ekran kapama butonu


//------------------------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const addToBasketButtons = document.querySelectorAll(".add-to-basket");
    const basketList = document.getElementById("basket-list");
    const basketCount = document.getElementById("basket-count");
    const totalPriceElement = document.getElementById("total-price");

    let basket = JSON.parse(localStorage.getItem('basket')) || []; // Sepeti localStorage'dan al
    let totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0); // Sepetteki ürünlerin toplam fiyatını hesapla

    function updateBasketUI() {
        basketCount.textContent = basket.length;

        // Sepet listesini ve toplam fiyatı sıfırla
        basketList.innerHTML = "";
        totalPrice = 0;

        basket.forEach(item => {
            const listItem = document.createElement("li");
            listItem.classList.add("basket-item");

            // Ürünlerin toplam fiyatını hesapla
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            

            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="basket-item-image">
                <div class="basket-item-info">
                    <span class="basket-item-name">${item.name}</span>
                    <span class="basket-item-price">${item.price}₺</span>
                    <span class="basket-item-quantity">Adet: ${item.quantity}</span>
                    <span class="basket-item-total">Toplam: ${itemTotal}₺</span>
                </div>
            `;
            basketList.appendChild(listItem);
        });

        // Genel toplam fiyatı güncelle
        totalPriceElement.textContent = `${totalPrice}₺`;

        // Sepeti localStorage'a kaydet
        localStorage.setItem('basket', JSON.stringify(basket));
    }

    addToBasketButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const bookCard = event.target.closest(".book-card");
            const bookName = bookCard.querySelector("h3").textContent;
            const bookPrice = parseFloat(bookCard.querySelector(".new-price").textContent.replace("₺", ""));
            const bookImage = bookCard.querySelector("img").src;

            // Aynı kitap sepette zaten varsa, adedi artır
            const existingBook = basket.find(item => item.name === bookName);
            if (existingBook) {
                existingBook.quantity += 1;
            } else {
                basket.push({
                    name: bookName,
                    price: bookPrice,
                    quantity: 1,
                    image: bookImage
                });
            }

            totalPrice += bookPrice;
            updateBasketUI();
        });
    });

    updateBasketUI(); // Sepeti başlat
});


//---------------------------------------------------------------------------------------------

function cancelOrder() {
    basket = [];
    basketCount = 0;
    document.getElementById('basketPage').style.display = 'none';
}

function continueShopping() {
    document.getElementById('basketPage').style.display = 'none';
}

document.getElementById('search-button').addEventListener('click', function () {
    let query = document.getElementById('search-input').value;

    if (query) {
        fetchBooks(query);
    }
});

// Kategorilere Tıklama İşlemi
document.querySelectorAll(".category").forEach((btn) => {
    btn.addEventListener("click", () => fetchBooks(btn.dataset.category));
});

// Kitapları türüne göre filtreleyen fonksiyon
function filterBooks(category) {
    const allBooks = document.querySelectorAll('.book-card');
    allBooks.forEach(book => {
        const bookCategory = book.querySelector('.category').textContent;

        // Eğer kategori 'Tümü' (ya da 'all') ise tüm kitapları göster
        if (category === 'Tümü' || category === 'all' || bookCategory.includes(category)) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
}

// Sayfa yüklendiğinde tüm kitapları göstermek için
window.onload = function () {
    filterBooks('all');
}

//--------SİPARİŞ İPTAL-----------------------------
// Siparişi iptal et butonuna tıklanma olayını ekleyelim
document.getElementById("checkout-btn2").addEventListener("click", function () {
    // Sepet listesine erişim
    const basketList = document.getElementById("basket-list");
    const totalPrice = document.getElementById("total-price");

    // Sepet içeriğini temizleyelim
    basketList.innerHTML = ""; // Sepet öğelerini temizler

    // Toplam fiyatı sıfırlayalım
    totalPrice.textContent = "0₺"; // Fiyatı 0₺ olarak günceller

    // Sepet detaylarını gizleyelim
    document.getElementById("basket-details").classList.add("hidden");

    // Kullanıcıya sepetin iptal edildiğini bildirelim
    alert("Sipariş iptal edildi.");
});



