const fs = require('fs')
class Contenedor{
    constructor(path){
        this.path = path
    }
    //verifica que el archivo exista sino hace que se genere antes de empezar con los demas procesos
    async verifiedArchive(){
        try {
            if (!fs.existsSync(this.path)) {
                await fs.promises.writeFile(this.path, JSON.stringify([], null,2))
            }
        }
        catch(err) {
            console.log(`${err} error in function verifiedArchive`)
        }
    }
    //lastId obtiene el id mas grande de los productos
    async lastId(){
        const products = await this.getAll()
        try{
            if(products.length===0){
                return 1
            }
            let arrayId = []
            for (const product of products) {
                arrayId.push(product.id)    
            }
            return (Math.max(...arrayId)+1)
        }
        catch(err) {
            console.log(`${err} error in function LastId`)
        }
    }
    async save(newProduct){
        const products = await this.getAll()
        newProduct.id = await this.lastId()
        products.push(newProduct)
        try{
            await fs.promises.writeFile(this.path, JSON.stringify(products, null,2))
            return newProduct.id
        }
        catch(err) {
            console.log(`${err} error in function save`)
        }
    }
    async getById(id){
        const products = await this.getAll()
        try{
            const product = products.filter(producto => producto.id === id)
            //si la posicion 0 del objeto product existe
            if(product[0]){
                return JSON.stringify(product, null,2)
            }else{
                return null
            }
        }
        catch(err) {
            console.log(`${err} error in function getById`)
        }
    }
    async getAll(){
        try{
            const products = await fs.promises.readFile(this.path, 'utf-8')
            return JSON.parse(products)
        }
        catch(err) {
            console.log(`${err} error in function getAll`)
        }
    }
    async deleteById(id){
        let i = 0
        const products = await this.getAll()
        try{
            for (const producto of products) {
                if(producto.id === id){
                    products.splice(i, 1) //elimina del objeto el array en la posicion i
                    await fs.promises.writeFile(this.path, JSON.stringify(products, null,2))
                    return id
                }
                i=i+1
            }
            return `${id} (id ingresado inexistente en el archivo, operacion abortada)`
        }
        catch(err) {
            console.log(`${err} error in function deleteById`)
        }
    }
    async deleteAll(){
        try{
            await fs.promises.writeFile(this.path, JSON.stringify([], null,2))
            return 'archivo vaciado con exito!'
        }
        catch(err) {
            console.log(`${err} error in function deleteAll`)
        }
    }
}

module.exports = Contenedor