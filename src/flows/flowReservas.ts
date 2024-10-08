import { addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { join } from 'path'

import { flowBienvenida } from './flowBienvenida'

const flowReservas = addKeyword<Provider, Database>(utils.setEvent('REGISTER_FLOW'))
    .addAnswer('Envio de un audio', {media: 'https://cdn.pixabay.com/audio/2024/01/31/audio_0dab58b02b.mp3'})
    .addAnswer(`Cual es tu nombre?`, {capture:true}, async (ctx, { fallBack, gotoFlow, state, globalState, endFlow, provider, database, flowDynamic, blacklist }) => { 
        console.log(state.get('action'))
        

        // Metodo para actualizar el estado
        await state.update({ name: ctx.body })
        await globalState.update({ name: ctx.body })
        
        // Check if user is in blacklist
        // if (!blacklist.checkIf(ctx.from)) {
        //     await flowDynamic('No estas en la lista negra')
        // }
        
        // // Get previous message
        // console.log(await database.getPrevByNumber(ctx.from))
        // // Send audio to user
        
        // await provider.vendor.sendMessage(ctx.key.remoteJid, {audio: {url: 'https://cdn.pixabay.com/audio/2024/01/02/audio_2e76a96686.mp3'}, mimetype: 'audio/mpeg', ptt: true})
        // // Send message to user
        // await flowDynamic(`Gracias ${ctx.body}, por tu informacion!`, {delay: 5000})
        // // Add user to blacklist
        // blacklist.add(ctx.from)
        // // Cambiar de flujo a flowBienvenida
        // return endFlow('Gracias por tu tiempo')
        // return gotoFlow(flowBienvenida)
        // Terminar el flujo y enviar un mensaje
    })
    .addAnswer('Cual es tu edad?', { capture: true }, async (ctx, { state }) => {
        await state.update({ age: ctx.body })
        
    })
    .addAction(async (_, { flowDynamic, state }) => {
        // Crear el objeto URL
        const url = new URL('https://webhook.site/f7713214-ffa3-4e2b-ba68-13fdf9ad2631');
        // Agregar los parámetros de consulta (query parameters)
        url.searchParams.append('name', state.get('name'));
        url.searchParams.append('age', state.get('age'));
    
        // Realizar la petición GET
        await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    
        // Enviar la respuesta al usuario
        await flowDynamic(`¡Gracias ${state.get('name')} por tu información! ¡Te he registrado con éxito!`);
    })
    .addAnswer(`Send image from Local`, { media: join(process.cwd(), 'assets', 'pedro.jpg') })
    .addAnswer(`Send file from URL`, {
        media: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    })

export { flowReservas }