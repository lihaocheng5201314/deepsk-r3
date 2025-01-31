const API_KEY = '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';
const API_URL = 'https://api.groq.com/openai/v1';

let isProcessing = false;

async function sendMessage() {
    if (isProcessing) return;

    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    if (!message) return;

    isProcessing = true;
    userInput.value = '';
    document.getElementById('loading').style.display = 'block';

    try {
        const response = await fetch(`${API_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "deepseek-r1-distill-llama-70b",
                messages: [{
                    role: "user",
                    content: message
                }],
                temperature: 0.6,
                max_tokens: 4096,
                top_p: 0.95,
                stream: false
            })
        });

        const data = await response.json();
        if (response.ok) {
            displayMessage(message, 'user');
            displayMessage(data.choices[0].message.content, 'assistant');
        } else {
            let errorMessage = data.error || '未知错误';
            if (typeof errorMessage === 'object') {
                errorMessage = JSON.stringify(errorMessage);
            }
            displayStatus(`错误：${errorMessage}`);
        }
    } catch (error) {
        let errorMessage = error.message;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = '未知错误';
        }
        displayStatus(`错误：${errorMessage}`);
    } finally {
        isProcessing = false;
        document.getElementById('loading').style.display = 'none';
    }
}

function displayMessage(content, role) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function displayStatus(status) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = status;
}

// 输入框回车发送
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});