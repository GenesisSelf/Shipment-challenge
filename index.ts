// import { UpdateOfShipment } from './challenge'

// handler for testing purposes only with dummy data
async function handler(id: string, shipmentData: string[]) {
    const request = new UpdateOfShipment
    try {
        console.log('meow')
        await request.receiveUpdate(id, shipmentData)
    } catch (e) {
        console.error(e)
    }
}

handler('124', ["meow"])