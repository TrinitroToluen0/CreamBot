import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { config } from './config';
import { Events } from 'whatsapp-web.js';

const client = new Client({
    authStrategy: new LocalAuth()
});

const lastMessageFromContact = new Map<string, number>();
const lastBotReply = new Map<string, number>();

function isStoreOpen(): boolean {
    const nowString = new Date().toLocaleString("en-US", { timeZone: config.timeZone });
    const now = new Date(nowString);
    const dayIndex = now.getDay(); // 0 = Sunday
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const todayName = days[dayIndex];

    const todaySchedule = config.schedule[todayName];

    if (!todaySchedule) return false;

    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

    return currentTimeStr >= todaySchedule.start && currentTimeStr <= todaySchedule.end;
}

client.on(Events.QR_RECEIVED, (qr: string) => {
    qrcode.generate(qr, { small: true });
});

client.on(Events.READY, () => {
    console.log('Bot inicializado correctamente!');
});

client.on(Events.AUTHENTICATION_FAILURE, msg => {
    console.error('Error de autenticación:', msg);
});

client.on(Events.DISCONNECTED, (reason: string) => {
    console.log('Sesión cerrada:', reason);
});

client.on(Events.MESSAGE_CREATE, (msg: Message) => {
    if (msg.fromMe) return;

    const contact = msg.from;
    const now = Date.now();

    const isFirstTime = !lastBotReply.has(contact);
    const isInactivityMet = now - (lastMessageFromContact.get(contact) || 0) > config.cooldown * 1000;
    const isAbsoluteCooldownMet = now - (lastBotReply.get(contact) || 0) > config.absoluteCooldown * 1000;

    if (isFirstTime || isInactivityMet || isAbsoluteCooldownMet) {
        const replyMessage = isStoreOpen() ? config.messages.backSoon : config.messages.closed;
        msg.reply(replyMessage);
        lastBotReply.set(contact, now);
    }

    lastMessageFromContact.set(contact, now);
});

client.initialize();
