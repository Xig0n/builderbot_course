import { createProvider} from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


const BUSINESS_NUMBER: string | undefined = process.env.BUSINESS_NUMBER;

const adapterProvider = createProvider(Provider, {
    experimentalStore: true,        // Significantly reduces resource consumption
    timeRelease: 10800000,          // Cleans up data every 3 hours (in milliseconds)
    groupsIgnore: true,             // Ignorar mensajes de grupos
    readStatus: false,              // No leer el estado de los mensajes
    usePairingCode: true,           // Usar código de emparejamiento
    phoneNumber: BUSINESS_NUMBER,   // Número de teléfono de la empresa
})

export { adapterProvider }