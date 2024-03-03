const dotenv = require('dotenv');
const { Bot, GrammyError, HttpError } = require('grammy');

dotenv.config();


const bot = new Bot(process.env.KEY);

const hiCommands = ['hi', 'Hi', 'Hello', 'hello', 'Hello!', 'hello!'];

bot.api.setMyCommands([
    {
        command: 'start', description: 'starting the bot'
    },
    {
        command: 'help', description: 'get help to using the bot'
    },
    {
        command: 'imagination', description: 'go to space of thoughts'
    }
])

// messages

bot.on('message:voice', async (ctx) => {
    await ctx.reply("It's cool yhet you're talking to me, but voice calls are not appropriate here :(");
    await ctx.react('🥱');
})



// commands

bot.command('imagination', async (ctx) => {
    await ctx.reply('Go into imagination space: <a href="http://localhost:3000"> Imagination </a>', {
        parse_mode: 'HTML'
    });
    await ctx.react('❤‍🔥');
})

bot.command(hiCommands, async (ctx) => {
    await ctx.reply('hi!');
})
// start checking

bot.command('start', async (ctx) => {
    await ctx.reply(`Hello,   <b>${ctx.from.first_name}!</b>`, {
        parse_mode: 'HTML'
    });
    await ctx.react('⚡');
})

bot.on('msg', async (ctx) => {
    await ctx.reply(`<b>${ctx.from.first_name}</b>,  You shouldn't just send messages like that!`, {
        reply_parameters: {message_id: ctx.msg.message_id},
        parse_mode: 'HTML'
    });
    await ctx.react('😐');
})



bot.catch(e => {
    const ctx = e.ctx;

    console.log(ctx.update.update_id);

    const error = e.error;

    if (error instanceof GrammyError) {
        console.error('Error of request: ' , error.description);
    } else if (error instanceof HttpError) {
        console.error('Error in network: ', error);
    } else {
        console.error('Unknown error: ', error);
    }
})


bot.start();