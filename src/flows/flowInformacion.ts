
import { addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

import { flowReservas } from './flowReservas'

const flowInformacion = addKeyword<Provider, Database>(EVENTS.ACTION)
    .addAnswer(
    ['En Builderbot.app vas a tener toda la documentacion\n', '📄 https://builderbot.app/docs \n', 'Quieres continuar y reservar? *si*'],
    { capture: true },
    async (ctx, { gotoFlow, flowDynamic, state }) => {
        if (ctx.body.toLocaleLowerCase().includes('si')) {
            await state.update({ action: 'reservar' })
            console.log('Nos vamos al flow de reservas')
            return gotoFlow(flowReservas)
        
        }

        await flowDynamic('Gracias!')
        return
    }
)

export { flowInformacion }