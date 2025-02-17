const googleOAuthService = require('../services/googleOAuthService');
const supabaseService = require('../services/supabaseService');
const supabaseDT = require('../services/supabaseConnection');

const googleSignIn =  async (req, res) => {	
    const { accessToken } = req.body;

    try {
        // request to google to get user info
        const userInfo = await googleOAuthService.getUserInfo(accessToken);
        
        // check if the response is successful
        if (userInfo.status !== 200) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }
        
        // parse the response
        const userData = userInfo.data = await userInfo.json();
        
        const { email, given_name, family_name } = userData;

        // use the email to sign in or sign up the user
        let { data, error } = await supabaseDT.signInWithOTP(email, {
            shouldCreateUser: true,
            data: {
              first_name: given_name,
              last_name: family_name,
              phone_number: null
            }
          });

        return res.status(200).json({
            data: {
                ...data,
                email, // return the email to the client
            },
            error: error
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An unexpected error occurred", error: error.message});
    }

}

module.exports = {
    googleSignIn
};
