const express = require('express');
const router = express.Router();

function productRouter(productCollection, userCollection) {
    // add to stock endpoint
    router.post('/addstock', async (req, res) => {
        const { UserID, ItemID, Amt } = req.body;

        try {
            //check if user PermLvl is admin (PermLvl < 2)
            const user = await userCollection.findOne({ UserID });

            if (user.PermLvl < 2) {
                //check if product exists
                const item = await productCollection.findOne({ ItemID });

                if (item) {
                    //update product
                    const result = await productCollection.updateOne({ ItemID }, { $inc: { Amt } });

                    if (result.modifiedCount === 1) {
                        res.status(201).json({ message: Amt + ' stock has been added to ' + item.Name + ' successfully' });
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                } else {
                    res.status(404).json({ message: 'Item not found' });
                }
            } else {
                res.status(403).json({ message: 'This ID does not have permission to add to stock' });
            }
        }
        catch (err) {
            console.error(`Error while adding to stock when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // search product endpoint by name and or category
    router.get('/search', async (req, res) => {
        const { Name, Cat } = req.query;

        const query = {};
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
    router.get('/searchspecific/:SN', async (req, res) => {
        const { SN } = req.params;

        try {
            const result = await productCollection.findOne({ SN })

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

    return router;
}

module.exports = productRouter;