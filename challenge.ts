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
    updateResource: string[] // resource can be queue, REST
}
class UpdateOfShipment implements ShipmentUpdateListenerInterface {
    updateResource: string[]

    constructor (updateResource: string[]) {
        this.updateResource = [];
    }

    async receiveUpdate (id: string, shipmentData: any): Promise<any> {
        const updateAlreadyExists = this.updateResource.includes(id)

        if (updateAlreadyExists) {
            return console.log(`update with id of ${id} already exists`)
        }
        this.updateResource.push(id)

        return this.processUpdate(this.updateResource, id, shipmentData)
    }

    async processUpdate(resource: string[], id: string, shipmentData: string): Promise<any> {
        try {
            const request = new ShipmentSearchIndex()
            const update = await request.updateShipment(id, shipmentData)
            this.checkIdempotency(this.updateResource, id)

            return console.log(`shipment updated successfully`, { id, ...update, shipmentData })
        } catch (e) {
            throw console.error(`failed to update`, e.stack)
        }
    }

    checkIdempotency(resource: string[], id: string) {
        resource.filter(idn => idn !== id)

        return this.updateResource
    }
}

async function handler() {
    const request = new UpdateOfShipment([])

    try {
        await request.receiveUpdate('124', ["meow"])
    } catch (e) {
        console.error(e)
    }

}

//  TODO tests