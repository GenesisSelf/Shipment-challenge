async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

async function randomDelay() {
    const randomTime = Math.round(Math.random() * 1000)
    return sleep(randomTime)
}

class ShipmentSearchIndex {
    async updateShipment(id: string, shipmentData: any) {
        const startTime = new Date()
        await randomDelay()
        const endTime = new Date()
        console.log(`update ${id}@${
            startTime.toISOString()
            } finished@${
            endTime.toISOString()
            }`
        )

        return { startTime, endTime }
    }
}

// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any): any
}

interface Shipment {
    id: string
    data: any
}

class UpdateOfShipment implements ShipmentUpdateListenerInterface {
    updatesInProcessQueue: Shipment[]
    searchIndex: any

    constructor () {
        this.updatesInProcessQueue = []
        this.searchIndex = new ShipmentSearchIndex()
        this.startShipmentProcessor()
    }

    async receiveUpdate (id: string, shipmentData: any): Promise<any> {
        this.updatesInProcessQueue.push({ id, data: shipmentData })
    }
    
    async startShipmentProcessor() {
        while (true) {
            const shipment = this.updatesInProcessQueue.shift()
            if (!shipment) {
                await sleep(200)
                continue
            }
            const { id, data } = shipment
            await this.searchIndex.updateShipment(id, data)
        }
    }
}