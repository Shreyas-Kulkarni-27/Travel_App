document.getElementById('travel-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const form = new FormData(this);
    const resultDiv = document.getElementById('result');
    const itineraryDiv = document.getElementById('itinerary');
    const pdfButton = document.getElementById('pdf-button');
    const loader = document.getElementById('loader');

    resultDiv.style.display = 'none';
    itineraryDiv.style.display = 'none';
    pdfButton.style.display = 'none';
    loader.style.display = 'block';

    fetch('/buddy_go', {
        method: 'POST',
        body: form
    })
    .then(response => response.json())
    .then(data => {
        loader.style.display = 'none';
        if (data.error) {
            resultDiv.style.display = 'block';
            resultDiv.textContent = 'Error: ' + data.error;
        } else {
            itineraryDiv.style.display = 'block';
            itineraryDiv.innerHTML = `<h2>Your Personalized Itinerary</h2>${data.itinerary}`;
            pdfButton.style.display = 'block';
        }
    })
    .catch(error => {
        loader.style.display = 'none';
        resultDiv.style.display = 'block';
        resultDiv.textContent = 'An error occurred: ' + error;
    });
});

// PDF Generation Logic
document.getElementById('pdf-button').addEventListener('click', function() {
    const itineraryContent = document.getElementById('itinerary').textContent;

    fetch('/generate_pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itinerary: itineraryContent }),
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'travel_itinerary.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
    });
});
