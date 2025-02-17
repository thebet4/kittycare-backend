const getUserInfo = async (accessToken) => {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + accessToken);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred");
  }
}

module.exports = {
  getUserInfo
};
