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

// TODO abstract this away. Not currently abstracting due to not able to modify above code.
// Implementation needed
interface ShipmentUpdateListenerInterface {
    receiveUpdate(id: string, shipmentData: any): any
}
class UpdateOfShipment implements ShipmentUpdateListenerInterface {
    updatesInProcessQueue: string[]
    updatesToStoreQueue: string[]
    searchIndex: any

    constructor () {
        this.updatesInProcessQueue = []
        this.searchIndex = new ShipmentSearchIndex()
        this.updatesToStoreQueue = []
    }

    async receiveUpdate (id: string, shipmentData: any): Promise<any> {
        const updateAlreadyExists = this.updatesInProcessQueue.includes(id)

        if (updateAlreadyExists) {
            const firstInstanceOfId = this.updatesInProcessQueue[id].shift()

            this.storeUpdateQueue(firstInstanceOfId, shipmentData)
            console.log(`update with id of ${id} already exists`)
        }
        this.updatesInProcessQueue.push(id)

        return this.storeUpdateQueue(id, shipmentData)
    }

    async storeUpdateQueue(id: string, shipmentData: any) {
        try {
            const update = await this.searchIndex.updateShipment(id, shipmentData)

            return console.log(`shipment updated successfully`, { id, ...update, shipmentData })
        } catch (e) {
            throw console.error(`failed to update`, e.stack)
        }
    }
}

async function handler() {
    try {
        await searchIndex.receiveUpdate('124', ["meow"])
    } catch (e) {
        console.error(e)
    }
}

//  TODO tests