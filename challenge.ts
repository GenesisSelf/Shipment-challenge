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
export class UpdateOfShipment implements ShipmentUpdateListenerInterface {
    updatesInProcessQueue: string[]
    updatesOfShipmentQueue: string[]
    searchIndex: any

    constructor () {
        this.updatesInProcessQueue = []
        this.searchIndex = new ShipmentSearchIndex()
        this.updatesOfShipmentQueue = []
    }

    async receiveUpdate (id: string, shipmentData: any): Promise<any> {
        const updateAlreadyExists = this.updatesInProcessQueue.includes(id)

        if (updateAlreadyExists) {
            this.updatesInProcessQueue.find(id => {
                this.storeUpdateQueue(id, shipmentData)
            })

            return console.log(`update with id of ${id} already exists`)
        }
        this.updatesInProcessQueue.push(id)

        return this.storeUpdateQueue(id, shipmentData)
    }

    async storeUpdateQueue(id: string, shipmentData: any) {
        try {
            const update = await this.searchIndex.updateShipment(id, shipmentData)
            this.updatesInProcessQueue.shift()

            return console.log(`shipment updated successfully`, { id, ...update, shipmentData })
        } catch (e) {
            throw console.error(`failed to update`, e.stack)
        }
    }
}
