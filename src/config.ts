export interface DaySchedule {
    start: string; // Formato "HH:MM" (24 horas)
    end: string;   // Formato "HH:MM" (24 horas)
}

export interface Config {
    messages: {
        backSoon: string;
        closed: string;
    };
    cooldown: number; // Time to wait before replying again (in seconds).
    absoluteCooldown: number; // Max time without replying, even if active (in seconds).
    schedule: {
        monday: DaySchedule | null;
        tuesday: DaySchedule | null;
        wednesday: DaySchedule | null;
        thursday: DaySchedule | null;
        friday: DaySchedule | null;
        saturday: DaySchedule | null;
        sunday: DaySchedule | null;
    };
}

const defaultSchedule: DaySchedule = { start: "10:00", end: "20:30" };

export const config: Config = {

    messages: {
        backSoon: "🍓✨ ¡Hola! Gracias por escribir a *Cream* \n\nHemos *recibido tu mensaje* y en breve te estaremos respondiendo 😊\n\nSi deseas hacer un pedido, puedes adelantarnos la siguiente información para atender te más rápido 🚀:\n\n📝 *Pedido:*\n📍 *Dirección:*\n💳 *Método de pago:*\n👤 *Nombre de quien recibe:*\n📞 *Teléfono de contacto:*\n\n¡Gracias por tu paciencia! 💖",
        closed: "🌙🍓 ¡Hola! Gracias por escribir a *Cream* \n\nEn este momento nos encontramos *cerrados* 😴\n\n🕒 *Horario de atención:*\nTodos los días de 10:00 AM a 8:30 PM\n\nPero no te preocupes 😊, puedes dejarnos tu *pedido* con todos los datos y lo estaremos despachando *tan pronto abramos*."

    },
    cooldown: 900,
    absoluteCooldown: 3600,
    schedule: {
        monday: defaultSchedule,
        tuesday: defaultSchedule,
        wednesday: defaultSchedule,
        thursday: defaultSchedule,
        friday: defaultSchedule,
        saturday: defaultSchedule,
        sunday: defaultSchedule
        // Si quieres cerrar un día entero, puedes poner:
        // monday: null
    }

};
