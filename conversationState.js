// conversationState.js

let conversationStates = {};

function getConversationState(userId) {
    return conversationStates[userId] || { stage: 'start' };
}

function setConversationState(userId, state) {
    conversationStates[userId] = state;
}

module.exports = { getConversationState, setConversationState };
