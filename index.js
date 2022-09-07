//Fetch
const fetch = require("node-fetch")
// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Ready!');
    client.user.setActivity("cRYPTO pRICE", {
        type: 'PLAYING'
    });
});


const getIdBySymbol = async function (symbol) {
    const api = "https://api.coingecko.com/api/v3/search?query="
    const a = fetch(api + symbol, {
        headers: {
            'accept': 'application/json'
        }
    })
    try {
        let data = await a
        const getId = await data.json()
        return getId.coins[0].id
    } catch (err) {
        console.log(err)
    }
}
const getPriceById = async function (symbol, getId) {
    const id = await getId(symbol)
    const apiPrice = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
    const a = fetch(apiPrice, {
        headers: {
            'accept': 'application/json'
        }
    })
    try {
        let data = await a
        const getPrice = await data.json();
        const detailData = 'getPrice.' + id
        return eval(detailData)
    } catch (err) {
        console.log(err)
    }

}


client.on('messageCreate', async (message) => {
    if (message.author.bot) {
        return;
    } else if (message.content.toLowerCase().includes('$')) {
        let token = message.content.toLowerCase().split('$')[1]
        getPriceById(token, getIdBySymbol)
            .then((data) => {
                const { usd, usd_24h_change } = data
                message.reply(`$${usd} (${Math.round(usd_24h_change)}%) \n`)
                message.react('✅')
            });
    }
});

// Login to Discord with your client's token
client.login(token);
