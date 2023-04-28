require('express');
require('mongodb');

exports.productRouter = function (app, productCollection, userCollection) {
    // add to stock endpoint
    app.post('/api/addstock', async (req, res, next) => {
        const { Username, Name, Amt } = req.body;

        try {
            //check if user PermLvl is admin (PermLvl < 2)
            const user = await userCollection.findOne({ Username });

            if (user) {
                if (user.PermLvl === 1) {
                    //check if product exists
                    const item = await productCollection.findOne({ Name });

                    if (item) {
                        //update product
                        const result = await productCollection.updateOne({ Name }, { $inc: { Amt } });
    
                        res.status(201).json({ message: Amt + ' stock has been added to ' + item.Name + ' successfully' });
                    } else {
                        res.status(404).json({ message: 'Item not found' });
                    }
                } else {
                    res.status(403).json({ message: 'This ID does not have permission to add to stock' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (err) {
            console.error(`Error while adding to stock when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // search product endpoint by name and or category
    app.get('/api/search', async (req, res, next) => {
        const { Name, Cat } = req.query;

        let query = {};
        if (Name) {
            query.Name = { $regex: `.*${Name}.*`, $options: 'i' };
        }
        if (Cat) {
            query.Cat = { $regex: `.*${Cat}.*`, $options: 'i' };
        }

        try {
            const result = await productCollection.find(query).toArray();

            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(404).json({ message: 'No items found' });
            }
        }
        catch (err) {
            console.error(`Error while searching for items when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // search product endpoint by serial number
    app.get('/api/searchspecific/:SN', async (req, res, next) => {
        const { SN } = req.params;

        try {
            const result = await productCollection.findOne({ SN });

            if (result) {
                res.status(200).json(result);
            }
            else {
                res.status(404).json({ message: 'Serial Number not found' });
            }
        }
        catch (err) {
            console.error(`Error while searching for items when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // add products endpoint
    app.post('/api/addproduct', async (req, res, next) => {
        const { Name, Cat, Amt, Loc, Price, SN } = req.body;

        const product = await productCollection.findOne({ Name });
        
        if (product) {
            res.status(409).json({ message: 'Item already exists' });
        }
        else {
            try {
                const result = await productCollection.insertOne({ Name, Cat, Amt, Loc, Price, SN });

                res.status(200).json({ message: `Item: ${Name} added successfully` });
            }
            catch (err) {
                console.error(`Error while adding item when connecting to database: ${err.stack}`);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    });
}
