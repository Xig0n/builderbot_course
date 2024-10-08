import { addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import { flowInformacion } from './flowInformacion'

const flowBienvenida = addKeyword<Provider, Database>(EVENTS.WELCOME)
    .addAnswer(`🙌 Bienvenido a mi *Chatbot*`)
    .addAnswer(
        [
            'A continuacion te voy a enviar al flow de informacion',
            '👉 *info* para continuar ',
        ].join('\n'),
        { delay: 800, capture: true },
        async (ctx, { fallBack, gotoFlow }) => {
            

            if (!ctx.body.toLocaleLowerCase().includes('info')) {
                return fallBack('Debes escribir *info*')
            }
            console.log('Nos vamos al flow de informacion')
            // return endFlow('Gracias por tu tiempo')
            return gotoFlow(flowInformacion)
        }
)

export { flowBienvenida }