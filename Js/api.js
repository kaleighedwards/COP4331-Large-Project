require('express');
require('mongodb');

exports.setApp = function ( app, client ) 
{
    const db = client.connection.useDb("QuestElectronics");
    const userCollection = db.collection("User");
    const reserveCollection = db.collection("Reserve");
    const productCollection = db.collection("Product");

    // for funsies
    app.get('/api', (req, res) => {
        res.send('Hello World!');
    });
    
    const auth = require('./auth');
    auth.authRouter(app, userCollection, reserveCollection, productCollection);
    const reserve = require('./reserve')
    reserve.reserveRouter(app, reserveCollection, productCollection);
    const product = require('./product')
    product.productRouter(app, productCollection, userCollection);
}
