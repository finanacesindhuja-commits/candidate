async function testEmail() {
    try {
        const response = await fetch('https://candidate-phi.vercel.app/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: 'sindhujafinance7@gmail.com',
                subject: 'Test Vercel Email API',
                html: '<h2>Hello from Vercel!</h2>'
            })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

testEmail();
