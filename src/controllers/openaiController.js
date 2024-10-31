// src/controllers/openaiController.js
const openaiService = require('../services/openaiService');
const supabaseService = require('../services/supabaseService');

exports.chat = async (req, res) => {
    try {
        const { catId, messages } = req.body;
        const userId = req.user.userId;

        // change each message to ONLY have a role and content
        const messagesWithRoleAndContent = messages.map(message => ({
            role: message.role,
            content: message.content
        }));

        const catDetails = await supabaseService.getCatDetails(userId, catId);
        const response = await openaiService.sendMessagesToOpenAI(catDetails, messagesWithRoleAndContent);

        res.status(200).json({ message: response });
    } catch (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ message: 'Cat not found' });
        }
        console.error('Error in chat controller:', error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }
};
