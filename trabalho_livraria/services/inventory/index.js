const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const products = require('./products.json');

const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// implementa os métodos do InventoryService
server.addService(inventoryProto.InventoryService.service, {
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products,
        });
    },
    SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },
    RemoveProduct: (payload, callback) => {
        let product = products.find((product) => product.id == payload.request.id)
        if(product.quantity > 0){
            product.quantity--;
        }
        callback(
            null,
            product
            
        );
    },
    AddProduct: (payload, callback) => {
        let product = products.find((product) => product.id == payload.request.id)
        if(product.quantity < 10){
            product.quantity++;
        }
        callback(
            null,
            product
            
        );
    },
    
});

server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start();
});
