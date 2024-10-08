import { createBot } from '@builderbot/bot'
// Import flows
import { adapterFlow } from './flows'

// Import provider
import { adapterProvider } from './provider'

// Import database
import { adapterDB } from './database'

const PORT = process.env.PORT ?? 3008
const BUSINESS_NUMBER: string | undefined = process.env.BUSINESS_NUMBER;


const main = async () => {
    
    const { handleCtx, httpServer, provider, stateHandler } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )


    
    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    
    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    provider.server.get(
        '/v1/getAuthCode',
        handleCtx(async (bot, req , res) => {

            const authCode = provider.vendor.authState.creds.pairingCode
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ authStatus: authCode }))
        })
    )
    
    provider.server.get(
        '/v1/getAuthStatus',
        handleCtx(async (bot, req , res) => {
            const authCode = provider.vendor.authState.creds.registered
            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ code: authCode }))
        })
    )


    // provider.on('message', async (ctx: any) => {
    //     // CHECK IF THE MESSAGE IS AN ORDER
    //     if (ctx.message && ctx.message.orderMessage) {
    //         const order = ctx.message.orderMessage;
    //         if (order.itemCount <= 4) {
    //             const orderDetails = await provider.getOrderDetails(order.orderId, order.token);
    //             let servicesOrdered: string[] = [];
    //             let durationOrder = 0;
    //             let hasMultipleQuantity = false;
                
    //             for (const product of orderDetails.products) {
    //                 if (product.quantity > 1) {
    //                     hasMultipleQuantity = true;
    //                     break;
    //                 } else {
    //                     servicesOrdered.push(product.name.split('/')[0]);
    //                     durationOrder += parseInt(product.name.split('/')[1].match(/\d+/)?.[0] ?? '0');
    //                 }
    //             }
            
    //             if (hasMultipleQuantity) {
    //                 await provider.sendMessage(ctx.from, '⚠️ No puedes reservar el mismo servicio varias veces 🔂', {}).catch(console.error);
    //             } else {
    //                 provider.dispatchInside({ body: 'BOOKING_FLOW', name: ctx.name, from: ctx.from });
    //                 await stateHandler.updateState({ from: ctx.from })({ 
    //                     precio: orderDetails.price.total / 1000, 
    //                     productos: servicesOrdered.join('+ '), 
    //                     duracion: durationOrder 
    //                 });
    //             }
    //         } else {
    //             await provider.sendMessage(ctx.from, '⚠️ Máximo 4 servicios por reserva 🔂', {});
            
    //             if (BUSINESS_NUMBER) {
                    
    //                 await provider.vendor.sendMessage(`${ctx.from}@s.whatsapp.net`, {
    //                     product: {
    //                         productImage: {
    //                             url: 'https://botberry.es/wp-content/uploads/2024/08/degradado.png',
    //                         },
    //                         productId: '8639383036091339',
    //                         title: 'Corte Degradado',
    //                         description: 'Nuestro servicio más solicitado 👆',
    //                     },
    //                     businessOwnerJid: `${BUSINESS_NUMBER}@s.whatsapp.net`
    //                 });
    //             }
    //         }
    //     }
    // });

    httpServer(+PORT)

}

main()
