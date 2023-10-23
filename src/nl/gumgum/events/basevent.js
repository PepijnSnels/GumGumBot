const { Events } = require('discord.js');
const pickuplines = [
    "Ik weet dat je het druk hebt, maar voeg me alsjeblieft toe aan je lijst met dingen die je nog moet doen.",
    "Ben jij Google? Want jij bent precies wat ik zoek.",
    "Ben je toevallig Australisch? Want je voldoet aan al mijn koalaficaties.",
    "Mijn vrienden hebben met me gewed dat ik de knapste man in de bar niet kon versieren. Wil je hun geld gebruiken om nog meer drankjes te kopen?",
    "Ben jij een toetje? Je ziet er heerlijk uit.",
    "Ik ben een slak, maar ben mijn huisje verloren. Mag ik bij jou komen slapen?",
    "Geloof jij in liefde op het eerste gezicht of zal ik nog een keertje langslopen?",
    "Is het nou zo warm hier, of ben jij zo heet?",
    "Zullen we een pizza gaan halen en daarna neuken, of hou je niet zo van pizza.",
    "Zullen we een condoom delen, jij van binnen en ik van buiten?",
    "Mag ik bij jou slapen, of ben je nog niet moe?",
    "Ik hoop dat je EHBO kent, want je bent echt adembenemend.",
    "Als jij bij McDonald's op het menu mocht, dan zou ik je McBeauty noemen…",
    "Ik houd eigenlijk helemaal niet van regen, maar voor een spetter zoals jij maak ik graag een uitzondering.",
    "Ik ben een telefoonboek aan het schrijven, mag ik je nummer?",
    "Als jou linkerbeen nou Kerstmis was en je rechterbeen was Pasen, mag ik dan tussen de vakanties door wat tijd bij je doorbrengen?",
    "Men zegt dat kussen de taal van de liefde is. Zin in een kleine conversatie?",
    "Ben je toevallig een goede huisman? Het wordt namelijk tijd dat er weer eens gezogen wordt bij mij.",
    "Gelukkig heb ik een zwemdiploma, want ik verdrink in jouw ogen.",
    "Je stinkt. Zullen we samen douchen?",
    "Heb je je belastingaangifte al gedaan? Ik ben namelijk ook aftrekbaar.",
    "Heb je een pleister voor me? Mijn knie ligt open omdat ik net voor je viel.",
    "Mag ik een foto van je hebben? Dan weet Sinterklaas wat ik wil dit jaar.",
    "Ik ben Tarzan, wil je aan mijn liaan slingeren?",
    "Kom je hier vaker?",
    "Zou ik wat in je mond mogen fluisteren?",
    "Er zit een vlek op je shirt. Misschien moet je hem uittrekken.",
    "Wil je mijn hart teruggeven? Want die heb je gestolen.",
    "Ik ben mijn telefoonnummer kwijt, mag ik die van jou?",
]


module.exports = {
	name: Events.MessageCreate,
	async execute(message) {

        if(message.author.bot || message.guild.id != 469489825343340545 || message.author.id !=357222893551353856) return

        message.channel.send(`Hey <@357222893551353856>, ${pickuplines[getRandomInt(pickuplines.length)]}`)
	},
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }