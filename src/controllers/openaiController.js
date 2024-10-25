// src/controllers/openaiController.js
const openaiService = require('../services/openaiService');
const supabaseService = require('../services/supabaseService');

exports.chat = async (req, res) => {
    try {
        const { catId, messages } = req.body;
        const userId = req.user.userId;

        const catDetails = await supabaseService.getCatDetails(userId, catId);
        const response = await openaiService.sendMessagesToOpenAI(catDetails, messages);

        res.status(200).json({ message: response });
    } catch (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ error: 'Cat not found' });
        }
        console.error('Error in chat controller:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};
