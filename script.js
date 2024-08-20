// Show/Hide chatbox
const chatIcon = document.getElementById('chat-icon');
const chatbox = document.getElementById('chatbox');
const closeChat = document.getElementById('close-chat');

// Function to toggle chatbox visibility
function toggleChatbox() {
    if (chatbox.style.display === 'flex') {
        chatbox.style.display = 'none';
    } else {
        chatbox.style.display = 'flex';
    }
}

// Add event listeners
chatIcon.addEventListener('click', toggleChatbox);
closeChat.addEventListener('click', toggleChatbox);

// Handling user input and sending message
const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const messagesContainer = document.getElementById('messages');

// Function to append messages to the chat
function appendMessage(content, className) {
    const message = document.createElement('div');
    message.className = `message ${className}`;
    message.textContent = content;
    messagesContainer.appendChild(message);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Function to call GPT API
async function fetchGPTResponse(userInput) {
    const apiKey = "sk-QuBYZggoTQJUwvIhf0q7xLEM_hhR4SnfhVXCefs6lIT3BlbkFJaPZ84IxeSxzqsCcFpS52OaWQQ7HvRzwZ4Ipc-h06gA";
    const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            prompt: userInput,
            max_tokens: 150,
            temperature: 0.7
        })
    });

    const data = await response.json();
    return data.choices[0].text.trim();
}

// Event listener for sending message
sendBtn.addEventListener('click', async () => {
    const userInput = chatInput.value.trim();
    if (userInput === "") return;

    appendMessage(userInput, 'user');
    chatInput.value = '';

    appendMessage("Thinking...", 'bot');

    try {
        const botResponse = await fetchGPTResponse(userInput);
        document.querySelector('.message.bot').textContent = botResponse;
    } catch (error) {
        document.querySelector('.message.bot').textContent = "Error: Unable to connect to GPT.";
        console.error("Error fetching GPT response:", error);
    }
});

// Allow sending message with Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Function to create suggestion buttons
function createSuggestion(text) {
    const suggestion = document.createElement('div');
    suggestion.className = 'suggestion';
    suggestion.textContent = text;
    suggestion.addEventListener('click', () => {
        chatInput.value = text;
        sendBtn.click();
    });
    return suggestion;
}

// Add suggestions to the suggestions container
const suggestionsContainer = document.getElementById('suggestions');
const suggestions = [
    "Hello!",
    "How are you?",
    "Tell me a joke.",
    "dwdw",
    "dw"
];

suggestions.forEach(suggestionText => {
    const suggestionElement = createSuggestion(suggestionText);
    suggestionsContainer.appendChild(suggestionElement);
});
