import { createFlow} from '@builderbot/bot'

import { flowBienvenida } from './flowBienvenida'
import { flowInformacion } from './flowInformacion'
import { flowReservas } from './flowReservas'

const adapterFlow = createFlow([flowInformacion, flowBienvenida, flowReservas])

export { adapterFlow }