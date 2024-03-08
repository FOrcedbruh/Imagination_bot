const dotenv = require('dotenv');
const { Bot, GrammyError, HttpError, Keyboard } = require('grammy');

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
    },
    {
        command: 'create_account', description: 'management of accounts'
    }
])

// messages

bot.on('message:voice', async (ctx) => {
    await ctx.reply("It's cool yhet you're talking to me, but voice calls are not appropriate here :(");
    await ctx.react('🥱');
})




// account management



bot.hears('Enter username', async (ctx) => {
    ctx.reply('Enter your username using in tour message: "My username: "');
});


bot.hears('Enter password', async (ctx) => {
    ctx.reply('Enter your email using in tour message: "My email: "');
});


bot.hears('Enter Email', async (ctx) => {
    ctx.reply('Enter your password using in tour message: "My password: "');
})

bot.hears(/My username: /, async (ctx) => {
    const username = ctx.message.text.slice(13);
    await ctx.reply(username);
})

bot.hears(/My email: /, async (ctx) => {
    const email = ctx.message.text.slice(10);
    ctx.reply(email);
})

// commands


bot.command('create_account', async (ctx) => {
    const accountManagement = new Keyboard().text('Enter username').row().text('Enter password').row().text('Enter Email').resized();
    await ctx.reply('Choose an action...', {
        reply_markup: accountManagement
    })
})

bot.command('imagination', async (ctx) => {
    await ctx.reply('Go into <a href="http://localhost:3000">imagination space</a>', {
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

/*bot.on('msg', async (ctx) => {
    await ctx.reply(`<b>${ctx.from.first_name}</b>,  You shouldn't just send messages like that!`, {
        reply_parameters: {message_id: ctx.msg.message_id},
        parse_mode: 'HTML'
    });
    await ctx.react('😐');
})*/



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