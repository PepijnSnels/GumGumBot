const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../../resource/config.json');

async function getAccessToken() {
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
            params: {
                client_id: config.TWITCH_CLIENT_ID,
                client_secret: config.TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials'
            }
        });
        return response.data.access_token;
    } catch (error) {
        throw error;
    }
}

async function getUserIdByLogin(login, accessToken) {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            params: { login },
            headers: {
                'Client-ID': config.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.data[0].id;
    } catch (error) {
        throw error;
    }
}

async function getSubscriptions(accessToken, userId) {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/eventsub/subscriptions', {
            headers: {
                'Client-ID': config.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return [response.data.data[0].status, response.data.data[0].condition.broadcaster_user_id]        
    } catch (error) {
        throw error;
    }
}

async function deleteSubscription(subscriptionId, accessToken) {
    try {
        await axios.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscriptionId}`, {
            headers: {
                'Client-ID': config.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            }
        });
    } catch (error) {
    }
}

async function subscribeToEventSub(streamer) {
    try {
        const accessToken = await getAccessToken();
        const userId = await getUserIdByLogin(streamer, accessToken);

        const [subStatus, subId] = await getSubscriptions(accessToken, userId);
        
        if (subStatus == "enabled") {
            return
        }else{
            await deleteSubscription(subId, accessToken);
        }

        await axios.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
            type: 'stream.online',
            version: '1',
            condition: {
                broadcaster_user_id: userId
            },
            transport: {
                method: 'webhook',
                callback: config.TWITCH_CALLBACK_URL,
                secret: config.TWITCH_SECRET
            }
        }, {
            headers: {
                'Client-ID': config.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        
    } catch (error) {
    }
}

function subscribeToAllStreamers() {
    const streamersFile = path.join(__dirname, '../../../resource/streamers.json');

    if (fs.existsSync(streamersFile)) {
        const data = JSON.parse(fs.readFileSync(streamersFile, 'utf8'));
        const streamers = data.streamers || [];

        streamers.forEach(subscribeToEventSub);
    } else {
    }
}

module.exports = { subscribeToEventSub, subscribeToAllStreamers };