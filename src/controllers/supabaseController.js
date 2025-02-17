const supabaseService = require("../services/supabaseService");
const openaiService = require("../services/openaiService");

const signup = async (req, res) => {
    const { first_name, last_name, email, password, phone_number } = req.body;

    try {
        const { token, expiresIn } = await supabaseService.signupUser(
            first_name,
            last_name,
            email,
            password,
            phone_number,
        );
        res.status(201).json({ token, expiresIn });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            if (error.message === "Email already exists") {
                res.status(409).json({ message: "Email already in use" });
            }  else {
                console.error(error);
                res.status(500).json({ message: "An unexpected error occurred" });
            }
        } else {
            console.error(error);
            res.status(500).json({ message: "An unexpected error occurred" });
        }
    }
}; 

const getSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await supabaseService.getSubscription(userId);

        if (result.message) {
            return res.status(404).json({ message: result.message });
        }

        res.json(result);
    } catch (error) {
        console.error("Get subscription error:", error);
        res
            .status(500)
            .json({ message: "An error occurred while fetching the subscription" });
    }
};

const createSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id, email, plan, end_date, start_date, provider, billing_period } = req.body;

        const result = await supabaseService.createSubscription(userId, id, email, plan, end_date, start_date, provider, billing_period);

        if (!result.success) {
            return res.status(400).json({ message: result.error });
        }

        res.status(201).json(result.data);
    } catch (error) {
        console.error("Create subscription error:", error);
        res.status(500).json({ message: "An error occurred while creating the subscription" });
    }
};

const updateSubscription = async (req, res) => {
    try {
        const userId = req.user.userId;
        const subscriptionId = req.params.id;
        const { plan, end_date, start_date, provider, billing_period } = req.body;

        const subscription = await supabaseService.updateSubscription(
            subscriptionId,
            userId,
            plan,
            end_date,
            start_date,
            provider,
            billing_period
        );
        res.json(subscription);
    } catch (error) {
        if (error.message === "Subscription not found") {
            res.status(404).json({ message: error.message });
        } else {
            console.error("Update subscription error:", error);
            res
                .status(500)
                .json({ message: "An error occurred while updating the subscription" });
        }
    }
};

const deleteSubscription = async (req, res) => {

    try {
        console.log("cancel #########");
        const { id } = req.params;
        const userId = req.user.userId;

        const result = await supabaseService.deleteSubscription(id, userId);

        if (result.error) {
            return res.status(result.status).json({ error: result.error });
        }

        res.status(200).json({ message: result.message });
    } catch (error) {
        console.error("Error in deleteSubscription controller:", error);
        if (error.message === "Subscription not found") {
            res.status(404).json({ message: "Subscription not found" });
        } else {
            res
                .status(500)
                .json({ message: "An error occurred while deleting the subscription" });
        }
    }
};

const getCats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await supabaseService.getCats(userId);

        if (result.message) {
            return res.status(404).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("Get cats error:", error);
        res
            .status(500)
            .json({ message: "An error occurred while fetching the cats" });
    }
};
 

const signupWithOTP = async (req, res) => {
    try {
        const { email, first_name, last_name, phone_number } = req.body;
        const result = await supabaseService.signupWithOTP(email, first_name, last_name, phone_number);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        res.status(200).json({
            message: 'OTP sent successfully',
            email: email,
            token: result.token
        });
    } catch (error) {
        console.error('Signup OTP error:', error);
        res.status(500).json({ message: 'An error occurred during OTP signup' });
    }
};

// Update the module.exports to include these new functions:
module.exports = {
    signup,
    signin,
    getSubscription,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    getCats,
    createCat,
    updateCat,
    deleteCat,
    getConversations,
    postChatMessage,
    deleteConversation,
    createConversation,
    updateConversation,
    getAllConversations,
    getConversationByConversationId,
    requestPasswordReset,
    resetPassword,
    signinWithOTP,
    verifyOTP,
    signupWithOTP,
    getCatById
};
