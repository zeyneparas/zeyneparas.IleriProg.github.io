// Alışverişi Tamamla butonuna tıklanma işlemi
document.getElementById("checkout-btn").addEventListener("click", function () {
    // Kullanıcıya ödeme onayı sorulacak
    const totalPrice = document.getElementById("total-price").textContent; // Toplam tutarı al
    const confirmPayment = confirm(`Hesabınızdan ${totalPrice}₺ tutarında ödeme yapılmasını onaylıyor musunuz?`);

    if (confirmPayment) {
        // Kullanıcı onay verirse ödeme işlemi tamamlanır
        alert("Ödemeniz gerçekleştirildi. Sipariş durumunuzla ilgili SMS ve mail yoluyla bilgilendirileceksiniz.");

        // Sepeti sıfırlama ve ödeme işlemi sonrası sepetin temizlenmesi
        basket = []; // Sepeti sıfırla
        localStorage.setItem('basket', JSON.stringify(basket)); // LocalStorage'dan sepeti temizle
        updateBasketUI(); // Sepet görünümünü güncelle
        document.getElementById("basket-popup").classList.add("hidden"); // Sepet modalını kapat
    } else {
        // Kullanıcı ödeme işlemini iptal ederse
        alert("Ödeme işlemi iptal edildi.");
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // Siparişi iptal et butonuna tıklanma olayını ekleyelim
    document.getElementById("checkout-btn2").addEventListener("click", function() {
        // Kullanıcıya siparişi iptal etmek isteyip istemediğini soralım
        const userConfirmed = window.confirm("Siparişi iptal etmek istediğinizden emin misiniz?");

        // Eğer kullanıcı evet dediyse siparişi iptal edelim
        if (userConfirmed) {
            // Sepet içeriğini ve toplam fiyatı sıfırlayalım
            const basketList = document.getElementById("basket-list");
            const totalPrice = document.getElementById("total-price");
            const basketCount = document.getElementById("basket-count"); // Sepet sayısı göstergesinin elementini alıyoruz

            // Sepet öğelerini temizleyelim
            basketList.innerHTML = ""; // Sepet öğelerini temizler

            // Toplam fiyatı sıfırlayalım
            totalPrice.textContent = "0₺"; // Fiyatı 0₺ olarak günceller

            // Sepet sayısını sıfırlayalım
            if (basketCount) {
                basketCount.textContent = "0"; // Sepet sayısını 0 yapar
            }

            // Sepet detaylarını gizleyelim
            document.getElementById("basket-details").classList.add("hidden");

            // Kullanıcıya sepetin iptal edildiğini bildirelim
            alert("Sipariş iptal edildi.");
        } else {
            // Kullanıcı "Hayır" dediğinde hiçbir işlem yapılmaz
            alert("Sipariş iptal edilmedi.");
        }
    });
});


//-------sepet tasarım--------------------
document.addEventListener("DOMContentLoaded", function() {
    const basketPopup = document.getElementById("basket-popup");
    const basketList = document.getElementById("basket-list");
    const totalPriceElement = document.getElementById("total-price");
    const closeBtn = document.getElementById("close-btn");
    const cancelBtn = document.getElementById("cancel-btn");
    const checkoutBtn = document.getElementById("checkout-btn");

    let basket = [];

    // Sepete ürün ekleme fonksiyonu
    function addToBasket(productName, productPrice) {
        let existingProduct = basket.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            basket.push({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        }

        renderBasket();
    }

    // Sepet içeriğini render etme
    function renderBasket() {
        basketList.innerHTML = '';

        let totalPrice = 0;

        basket.forEach(item => {
            const row = document.createElement("tr");

            const productName = document.createElement("td");
            productName.textContent = item.name;
            row.appendChild(productName);

            const productPrice = document.createElement("td");
            productPrice.textContent = item.price + "₺";
            row.appendChild(productPrice);

            const productQuantity = document.createElement("td");
            productQuantity.textContent = item.quantity;
            row.appendChild(productQuantity);

            const total = document.createElement("td");
            total.textContent = (item.price * item.quantity) + "₺";
            row.appendChild(total);

            const actions = document.createElement("td");
            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Sil";
            removeBtn.addEventListener("click", function() {
                basket = basket.filter(i => i.name !== item.name);
                renderBasket();
            });
            actions.appendChild(removeBtn);
            row.appendChild(actions);

            basketList.appendChild(row);

            totalPrice += item.price * item.quantity;
        });

        totalPriceElement.textContent = totalPrice + "₺";
    }

    // Sepete ürün eklemek için butonlara tıklama olayları ekleyelim
    const addButtons = document.querySelectorAll(".add-to-basket");
    addButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productName = this.closest('.book-card').querySelector('h3').textContent;
            const productPrice = parseFloat(this.closest('.book-card').querySelector('.new-price').textContent.replace('₺', ''));
            addToBasket(productName, productPrice);
            basketPopup.classList.add("show"); // Sepet popup'ını göster
        });
    });

    // Sepet modal penceresini kapatma
    closeBtn.addEventListener("click", function() {
        basketPopup.classList.remove("show");
    });

    // Siparişi İptal Et butonuna tıklama
    cancelBtn.addEventListener("click", function() {
        basket = [];
        renderBasket();
        alert("Sipariş iptal edildi.");
    });

    // Alışverişi Tamamlama
    checkoutBtn.addEventListener("click", function() {
        basket = [];
        renderBasket();
        basketPopup.classList.remove("show");
    });

    // İlk sepeti render et
    renderBasket();
});


//-----------search işlemleri -------------------------------

function searchBooks() {
    // Kullanıcının girdiği arama terimini al
    var searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    // Arama sonuçlarını ekranda göstereceğimiz alana referans
    var searchResults = document.getElementById('searchResultsContainer');
    
    // Eğer arama terimi boşsa, arama sonuçlarını gizle
    if (searchTerm === '') {
        searchResults.style.display = 'none'; // Gizle
        return; // Hiçbir işlem yapma
    }
    
    // Kitap kartlarını al
    var books = document.querySelectorAll('.book-card');
    
    // Ekrandaki mevcut arama sonuçlarını temizle
    searchResults.innerHTML = `
        <h2 class="search-title">Aranan Ürün</h2>
    `;
    
    // Kitapları kontrol et
    var foundBooks = 0;
    var displayedBooks = []; // Görüntülenen kitapların ID'lerini tutacağız

    books.forEach(function(book) {
        // Kitap ismi ve yazar adı
        var bookName = book.querySelector('h3').textContent.toLowerCase();
        var bookAuthor = book.querySelector('p').textContent.toLowerCase();
        var bookId = book.getAttribute('id'); // Kitap kartının benzersiz kimliğini al
        
        // Arama terimi kitap ismi veya yazar adıyla eşleşiyorsa ve kitap daha önce eklenmediyse
        if ((bookName.includes(searchTerm) || bookAuthor.includes(searchTerm)) && !displayedBooks.includes(bookId)) {
            // Eşleşen kitabı arama sonuçlarına ekle
            searchResults.innerHTML += `
                <div class="book-card">
                    <span class="category">${book.querySelector('.category').textContent}</span>
                    <img src="${book.querySelector('img').src}" alt="${bookName}">
                    <h3>${bookName}</h3>
                    <p>Yazar: ${book.querySelector('p').textContent.replace("Yazar: ", "")}</p>
                    <p>Tür: ${book.querySelector('.category').textContent}</p>
                    <span class="old-price">${book.querySelector('.old-price').textContent}</span>
                    <span class="new-price">${book.querySelector('.new-price').textContent}</span>
                </div>
            `;
            displayedBooks.push(bookId); // Bu kitabı gösterilenler listesine ekle
            foundBooks++;
        }
    });

    // Eğer kitap bulunamadıysa, arama sonuçları mesajını göster
    if (foundBooks === 0) {
        searchResults.innerHTML = '<p>Aradığınız kitaba uygun sonuç bulunamadı.</p>';
    }

    // Arama sonuçları varsa, görünür yap
    searchResults.style.display = foundBooks > 0 ? 'block' : 'none';
}




// //----------------------sepet.html----------------------------------
// Sepete eklenen ürünler
let basket = [];

// Sepete ürün ekleme fonksiyonu
function addToBasket(title, price, image) {
    const item = {
        name: title,
        price: price,
        quantity: 1,
        totalPrice: price,
        image: image // Ürün görselini de ekliyoruz
    };
    basket.push(item);
    localStorage.setItem('basket', JSON.stringify(basket)); // Sepeti localStorage'a kaydet
}

// Sepet sayfasını açtığınızda sepetteki ürünleri göster
document.addEventListener("DOMContentLoaded", function () {
    const basketList = document.getElementById("basket-list");
    const totalPriceElement = document.getElementById("total-price");

    // Sepet verilerini localStorage'dan al
    basket = JSON.parse(localStorage.getItem('basket')) || [];

    // Sepeti güncelle
    updateBasket();

    function updateBasket() {
        basketList.innerHTML = ""; // Sepet listesini temizle
        let totalPrice = 0; // Toplam fiyatı sıfırla

        // Sepetteki her bir öğeyi ekle
        basket.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${item.image}" alt="${item.name}" class="basket-item-image" /></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}₺</td>
            `;
            basketList.appendChild(row);

            totalPrice += item.totalPrice; // Toplam fiyatı hesapla
        });

        // Toplam fiyatı ekranda göster
        totalPriceElement.textContent = `${totalPrice}₺`;
    }

    // Sepeti temizleme fonksiyonu
    document.getElementById("cancel-btn").addEventListener("click", function () {
        basket = []; // Sepeti boşalt
        localStorage.setItem('basket', JSON.stringify(basket)); // Sepeti güncelle
        updateBasket(); // Sepeti güncelle
    });
});


