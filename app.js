function uploadImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image file to upload.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const base64Image = event.target.result.split(',')[1];

        // Make a POST request to your API endpoint
        fetch('https://prod-84.eastus.logic.azure.com:443/workflows/e286b9ba4f3d415eb79b0e3f51239bbd/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=vOsLvLPNZ7W6NsCQWudgLrxqQ9Uno5pjuPXd7BAy12s', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: base64Image
            })
        })
        .then(response => response.json())
        .then(data => {
            displayResult(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing your request.');
        });
    };

    reader.readAsDataURL(file);
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    if (data.predictions && data.predictions.length > 0) {
        resultDiv.innerHTML = '<h2>Prediction Results:</h2>';
        data.predictions.forEach(prediction => {
            const name = prediction.name;
            const confidence = (prediction.confidence * 100).toFixed(2) + '%';
            resultDiv.innerHTML += `<p>${name}: ${confidence}</p>`;
        });
    } else {
        resultDiv.innerHTML = '<p>No objects detected.</p>';
    }
}