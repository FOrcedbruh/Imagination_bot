const dotenv = require('dotenv');
const { Bot, GrammyError, HttpError, Keyboard } = require('grammy');
const axios = require('axios');

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

bot.hears('Confirm action', async (ctx) => {
    await ctx.reply('If you want to create account enter your registration data: \n\n Enter your username using in tour message: "username: " \n\n  Enter your email using in tour message: "email: " \n\n Enter your password using in tour message: "password: " ', {
        reply_parameters: { message_id: ctx.message.message_id}
    });
    await ctx.react('👌');

})



let username, password, email;


bot.hears(/username: /, async (ctx) => {
    username = ctx.message.text.slice(10);
    await ctx.reply(`Username <b>${username}</b> successfully entered`, {
        parse_mode: 'HTML'
    });
});

bot.hears(/email: /, async (ctx) => {
    email = ctx.message.text.slice(7);
    await ctx.reply(`Email <b>${email}</b> successfully entered`, {
        parse_mode: 'HTML'
    });
});

bot.hears(/password: /, async (ctx) => {
    password = ctx.message.text.slice(10);
    await ctx.reply(`Password <b>${password}</b> successfull6y entered`, {
        parse_mode: 'HTML'
    });
});

bot.hears('Send entered reg data', async (ctx) => {
    if (username && password && email) {
        const src = 'http://localhost:8080/auth/registration';
        await axios.post(src, {
            username, 
            password,
            email
        }).then(res => console.log(res.data));
        await ctx.reply('Account successfully created');
        await ctx.react('❤‍🔥');
    } else if (!(username && password && email)) {
        await ctx.reply('Enter registration data')
    }
})

// commands


bot.command('create_account', async (ctx) => {
    const accountManagement = new Keyboard().text('Confirm action').row().text('Send entered reg data').row().resized().oneTime();
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