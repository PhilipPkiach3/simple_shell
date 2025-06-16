// App State
let currentChat = null;
let messages = {};
let contacts = [];
let isTyping = false;

// Sample Data
const sampleContacts = [
    {
        id: 1,
        name: "Sarah Johnson",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "online",
        lastSeen: "online",
        unreadCount: 3,
        lastMessage: "Hey! How are you doing?",
        lastMessageTime: "2:30 PM",
        isGroup: false
    },
    {
        id: 2,
        name: "Mike Chen",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "away",
        lastSeen: "last seen 5 minutes ago",
        unreadCount: 0,
        lastMessage: "Thanks for the help!",
        lastMessageTime: "1:45 PM",
        isGroup: false
    },
    {
        id: 3,
        name: "Family Group",
        avatar: "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "online",
        lastSeen: "online",
        unreadCount: 1,
        lastMessage: "Mom: Don't forget dinner tonight",
        lastMessageTime: "12:30 PM",
        isGroup: true
    },
    {
        id: 4,
        name: "Emma Wilson",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "offline",
        lastSeen: "last seen 2 hours ago",
        unreadCount: 0,
        lastMessage: "See you tomorrow!",
        lastMessageTime: "11:15 AM",
        isGroup: false
    },
    {
        id: 5,
        name: "Work Team",
        avatar: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "online",
        lastSeen: "online",
        unreadCount: 5,
        lastMessage: "Alex: Meeting at 3 PM",
        lastMessageTime: "10:45 AM",
        isGroup: true
    },
    {
        id: 6,
        name: "David Rodriguez",
        avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
        status: "online",
        lastSeen: "online",
        unreadCount: 0,
        lastMessage: "Great job on the project!",
        lastMessageTime: "Yesterday",
        isGroup: false
    }
];

// Sample Messages
const sampleMessages = {
    1: [
        {
            id: 1,
            content: "Hey! How are you doing?",
            timestamp: new Date(Date.now() - 300000),
            sent: false,
            status: "read"
        },
        {
            id: 2,
            content: "I'm doing great! Just finished a big project at work.",
            timestamp: new Date(Date.now() - 240000),
            sent: true,
            status: "read"
        },
        {
            id: 3,
            content: "That's awesome! What kind of project was it?",
            timestamp: new Date(Date.now() - 180000),
            sent: false,
            status: "read"
        },
        {
            id: 4,
            content: "It was a new messaging app with real-time features. Really challenging but fun!",
            timestamp: new Date(Date.now() - 120000),
            sent: true,
            status: "delivered"
        }
    ],
    2: [
        {
            id: 1,
            content: "Thanks for helping me with the code review!",
            timestamp: new Date(Date.now() - 3600000),
            sent: false,
            status: "read"
        },
        {
            id: 2,
            content: "No problem! Happy to help anytime.",
            timestamp: new Date(Date.now() - 3540000),
            sent: true,
            status: "read"
        }
    ]
};

// Emojis
const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
    '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜',
    '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
    '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
    '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨',
    '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥'
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        initializeApp();
    }, 2000);
});

function initializeApp() {
    contacts = [...sampleContacts];
    messages = {...sampleMessages};
    
    renderChatList();
    setupEventListeners();
    generateEmojiGrid();
}

function setupEventListeners() {
    // Search functionality
    document.getElementById('search-input').addEventListener('input', handleSearch);
    
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', handleFilterChange);
    });
    
    // Message input
    const messageInput = document.getElementById('message-input');
    messageInput.addEventListener('keypress', handleMessageKeyPress);
    messageInput.addEventListener('input', handleTyping);
    
    // Send button
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    
    // Emoji button
    document.querySelector('.emoji-btn').addEventListener('click', toggleEmojiModal);
    document.getElementById('close-emoji').addEventListener('click', closeEmojiModal);
    
    // Voice button
    document.getElementById('voice-btn').addEventListener('click', handleVoiceMessage);
    
    // Context menu
    document.addEventListener('click', hideContextMenu);
    document.addEventListener('contextmenu', handleRightClick);
    
    // Close modals on outside click
    document.getElementById('emoji-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEmojiModal();
        }
    });
}

function renderChatList() {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';
    
    contacts.forEach(contact => {
        const chatItem = createChatItem(contact);
        chatList.appendChild(chatItem);
    });
}

function createChatItem(contact) {
    const chatItem = document.createElement('div');
    chatItem.className = `chat-item ${contact.unreadCount > 0 ? 'unread' : ''}`;
    chatItem.dataset.contactId = contact.id;
    
    chatItem.innerHTML = `
        <div class="chat-avatar">
            <img src="${contact.avatar}" alt="${contact.name}">
            <div class="status-indicator ${contact.status}"></div>
        </div>
        <div class="chat-info">
            <div class="chat-header-info">
                <div class="chat-name">${contact.name}</div>
                <div class="chat-time">${contact.lastMessageTime}</div>
            </div>
            <div class="chat-preview">
                <div class="last-message">${contact.lastMessage}</div>
                <div class="chat-badges">
                    ${contact.unreadCount > 0 ? `<div class="unread-count">${contact.unreadCount}</div>` : ''}
                    <div class="message-status delivered">
                        <i class="fas fa-check-double"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    chatItem.addEventListener('click', () => openChat(contact));
    
    return chatItem;
}

function openChat(contact) {
    currentChat = contact;
    
    // Update active chat in sidebar
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-contact-id="${contact.id}"]`).classList.add('active');
    
    // Show chat interface
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('chat-interface').classList.remove('hidden');
    
    // Update chat header
    document.getElementById('chat-avatar').src = contact.avatar;
    document.getElementById('contact-name').textContent = contact.name;
    document.getElementById('contact-last-seen').textContent = contact.lastSeen;
    document.getElementById('contact-status').className = `status-indicator ${contact.status}`;
    
    // Load messages
    loadMessages(contact.id);
    
    // Mark as read
    if (contact.unreadCount > 0) {
        contact.unreadCount = 0;
        renderChatList();
    }
}

function loadMessages(contactId) {
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';
    
    const contactMessages = messages[contactId] || [];
    
    contactMessages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesList.appendChild(messageElement);
    });
    
    // Scroll to bottom
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;
    messageDiv.dataset.messageId = message.id;
    
    const time = formatTime(message.timestamp);
    const statusIcon = getStatusIcon(message.status);
    
    messageDiv.innerHTML = `
        <div class="message-content">${message.content}</div>
        <div class="message-footer">
            <span class="message-time">${time}</span>
            ${message.sent ? `<span class="message-status ${message.status}">${statusIcon}</span>` : ''}
        </div>
    `;
    
    return messageDiv;
}

function formatTime(timestamp) {
    const now = new Date();
    const messageTime = new Date(timestamp);
    
    if (now.toDateString() === messageTime.toDateString()) {
        return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
        return messageTime.toLocaleDateString();
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'sent':
            return '<i class="fas fa-check"></i>';
        case 'delivered':
            return '<i class="fas fa-check-double"></i>';
        case 'read':
            return '<i class="fas fa-check-double"></i>';
        default:
            return '';
    }
}

function handleMessageKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const content = messageInput.value.trim();
    
    if (!content || !currentChat) return;
    
    const message = {
        id: Date.now(),
        content: content,
        timestamp: new Date(),
        sent: true,
        status: 'sent'
    };
    
    // Add to messages
    if (!messages[currentChat.id]) {
        messages[currentChat.id] = [];
    }
    messages[currentChat.id].push(message);
    
    // Update UI
    const messageElement = createMessageElement(message);
    document.getElementById('messages-list').appendChild(messageElement);
    
    // Clear input
    messageInput.value = '';
    
    // Scroll to bottom
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update chat list
    currentChat.lastMessage = content;
    currentChat.lastMessageTime = formatTime(new Date());
    renderChatList();
    
    // Simulate message status updates
    setTimeout(() => {
        message.status = 'delivered';
        updateMessageStatus(message.id, 'delivered');
    }, 1000);
    
    setTimeout(() => {
        message.status = 'read';
        updateMessageStatus(message.id, 'read');
    }, 3000);
    
    // Simulate auto-reply for demo
    if (currentChat.id === 1) {
        setTimeout(() => {
            simulateIncomingMessage();
        }, 2000);
    }
}

function updateMessageStatus(messageId, status) {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    if (messageElement) {
        const statusElement = messageElement.querySelector('.message-status');
        if (statusElement) {
            statusElement.className = `message-status ${status}`;
            statusElement.innerHTML = getStatusIcon(status);
        }
    }
}

function simulateIncomingMessage() {
    if (!currentChat) return;
    
    const responses = [
        "That sounds really interesting!",
        "I'd love to hear more about it.",
        "When do you think it will be ready?",
        "Can I test it out?",
        "That's amazing work!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const message = {
        id: Date.now(),
        content: randomResponse,
        timestamp: new Date(),
        sent: false,
        status: 'read'
    };
    
    messages[currentChat.id].push(message);
    
    const messageElement = createMessageElement(message);
    document.getElementById('messages-list').appendChild(messageElement);
    
    // Scroll to bottom
    const messagesContainer = document.getElementById('messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update chat list
    currentChat.lastMessage = randomResponse;
    currentChat.lastMessageTime = formatTime(new Date());
    renderChatList();
    
    // Show notification
    showNotification(`New message from ${currentChat.name}`);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-name').textContent.toLowerCase();
        const message = item.querySelector('.last-message').textContent.toLowerCase();
        
        if (name.includes(query) || message.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Filter chats
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const contactId = parseInt(item.dataset.contactId);
        const contact = contacts.find(c => c.id === contactId);
        
        let show = true;
        
        switch (filter) {
            case 'unread':
                show = contact.unreadCount > 0;
                break;
            case 'groups':
                show = contact.isGroup;
                break;
            case 'archived':
                show = false; // No archived chats in demo
                break;
            default:
                show = true;
        }
        
        item.style.display = show ? 'flex' : 'none';
    });
}

function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        // In a real app, you would send typing indicator to other users
        setTimeout(() => {
            isTyping = false;
        }, 3000);
    }
}

function toggleEmojiModal() {
    const modal = document.getElementById('emoji-modal');
    modal.classList.toggle('hidden');
}

function closeEmojiModal() {
    document.getElementById('emoji-modal').classList.add('hidden');
}

function generateEmojiGrid() {
    const emojiGrid = document.getElementById('emoji-grid');
    
    emojis.forEach(emoji => {
        const emojiButton = document.createElement('button');
        emojiButton.className = 'emoji-item';
        emojiButton.textContent = emoji;
        emojiButton.addEventListener('click', () => insertEmoji(emoji));
        emojiGrid.appendChild(emojiButton);
    });
}

function insertEmoji(emoji) {
    const messageInput = document.getElementById('message-input');
    const cursorPos = messageInput.selectionStart;
    const textBefore = messageInput.value.substring(0, cursorPos);
    const textAfter = messageInput.value.substring(cursorPos);
    
    messageInput.value = textBefore + emoji + textAfter;
    messageInput.focus();
    messageInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    
    closeEmojiModal();
}

function handleVoiceMessage() {
    showNotification('Voice messages coming soon!');
}

function handleRightClick(e) {
    const messageElement = e.target.closest('.message');
    if (messageElement) {
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, messageElement);
    }
}

function showContextMenu(x, y, messageElement) {
    const contextMenu = document.getElementById('context-menu');
    contextMenu.classList.remove('hidden');
    contextMenu.style.left = x + 'px';
    contextMenu.style.top = y + 'px';
    
    // Add event listeners for menu items
    const menuItems = contextMenu.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.onclick = () => {
            handleContextMenuAction(item.dataset.action, messageElement);
            hideContextMenu();
        };
    });
}

function hideContextMenu() {
    document.getElementById('context-menu').classList.add('hidden');
}

function handleContextMenuAction(action, messageElement) {
    const messageContent = messageElement.querySelector('.message-content').textContent;
    
    switch (action) {
        case 'reply':
            showNotification('Reply feature coming soon!');
            break;
        case 'forward':
            showNotification('Forward feature coming soon!');
            break;
        case 'copy':
            navigator.clipboard.writeText(messageContent);
            showNotification('Message copied to clipboard');
            break;
        case 'delete':
            messageElement.remove();
            showNotification('Message deleted');
            break;
    }
}

function showNotification(text) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = text;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Simulate online status updates
setInterval(() => {
    contacts.forEach(contact => {
        if (Math.random() < 0.1) { // 10% chance to change status
            const statuses = ['online', 'away', 'offline'];
            const currentIndex = statuses.indexOf(contact.status);
            contact.status = statuses[(currentIndex + 1) % statuses.length];
            
            // Update last seen
            if (contact.status === 'offline') {
                contact.lastSeen = 'last seen just now';
            } else if (contact.status === 'away') {
                contact.lastSeen = 'last seen 5 minutes ago';
            } else {
                contact.lastSeen = 'online';
            }
        }
    });
    
    // Update UI if needed
    if (currentChat) {
        const updatedContact = contacts.find(c => c.id === currentChat.id);
        if (updatedContact) {
            document.getElementById('contact-last-seen').textContent = updatedContact.lastSeen;
            document.getElementById('contact-status').className = `status-indicator ${updatedContact.status}`;
        }
    }
    
    renderChatList();
}, 10000); // Update every 10 seconds

// Add some CSS animations and effects
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to messages
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
        messagesContainer.style.scrollBehavior = 'smooth';
    }
    
    // Add focus effects to input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('focus', function() {
            this.parentElement.style.boxShadow = '0 0 0 2px var(--primary-color)';
        });
        
        messageInput.addEventListener('blur', function() {
            this.parentElement.style.boxShadow = 'none';
        });
    }
});