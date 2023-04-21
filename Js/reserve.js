const express = require('express');
const router = express.Router();

function reserveRouter(reserveCollection, productCollection) {
    // reserve item endpoint
    router.post('/reserve', async (req, res) => {
        const { ItemID, UserID, ItemAmt } = req.body;

        // Check if item exists, then checks if there are enough items to reserve, 
        // then reserves the item, subtracting the amount reserved from the total amount of items
        try {
            const item = await productCollection.findOne({ ItemID });

            if (item) {
                if (item.Amt >= ItemAmt) {
                    const result = await reserveCollection.insertOne({ ItemID, UserID, ItemAmt });

                    if (result.insertedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemID }, { $set: { Amt: item.Amt - ItemAmt } });

                        if (result2.modifiedCount === 1) {
                            res.status(201).json({ message: 'Item reserved' });
                        } else {
                            res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                } else {
                    res.status(409).json({ 
                        message: 'Not enough items to reserve, there are only ' + item.Amt + ' items left'
                    });
                }
            } else {
                res.status(404).json({ message: 'Item not found' });
            }
        }
        catch (err) {
            console.error(`Error while reserving item when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // edit reserve item endpoint
    router.put('/reserveedit', async (req, res) => {
        const { ItemID, UserID, ItemAmt } = req.body;

        // Check the current amount of this item reserved by this user,
        // then depending on whether the new item amount is greater or less than the current amount,
        // either add or subtract the difference from the total amount of items
        try {
            const reservation = await reserveCollection.findOne({ ItemID, UserID });

            if (reservation) {
                // If we are deleting the reservation
                if (ItemAmt === 0) {
                    const result = await reserveCollection.deleteOne({ ItemID, UserID });

                    if (result.deletedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemID }, { $set: { Amt: item.Amt + reservation.ItemAmt } });

                        if (result2.modifiedCount === 1) {
                            res.status(200).json({ message: 'Item reservation removed. ' + reservation.ItemAmt + ' items returned to stock' });
                        } else {
                            res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                }
                // If we are adding to the amount reserved
                else if (ItemAmt > reservation.ItemAmt) {
                    const item = await productCollection.findOne({ ItemID });

                    if (item) {
                        if (item.Amt >= ItemAmt - reservation.ItemAmt) {
                            const result = await reserveCollection.updateOne({ ItemID, UserID }, { $set: { ItemAmt } });

                            if (result.modifiedCount === 1) {
                                const result2 = await productCollection.updateOne({ ItemID }, { $set: { Amt: item.Amt - (ItemAmt - reservation.ItemAmt) } });

                                if (result2.modifiedCount === 1) {
                                    res.status(200).json({ message: 'Item reservation updated. ' + (ItemAmt - reservation.ItemAmt) + ' items reserved' });
                                } else {
                                    res.status(500).json({ message: 'Internal server error' });
                                }
                            } else {
                                res.status(500).json({ message: 'Internal server error' });
                            }
                        } else {
                            res.status(409).json({ 
                                message: 'Not enough items to reserve, there are only ' + item.Amt + ' items left'
                            });
                        }
                    } else {
                        res.status(404).json({ message: 'Item not found' });
                    }
                }
                // If we are subtracting from the amount reserved but not removing the reservation
                else if (ItemAmt < reservation.ItemAmt) {
                    const result = await reserveCollection.updateOne({ ItemID, UserID }, { $set: { ItemAmt } });

                    if (result.modifiedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemID }, { $set: { Amt: item.Amt + (reservation.ItemAmt - ItemAmt) } });

                        if (result2.modifiedCount === 1) {
                            res.status(200).json({ message: 'Item reservation updated. ' + (reservation.ItemAmt - ItemAmt) + ' items returned to stock' });
                        } else {
                            res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                }
            } else {
                res.status(404).json({ message: 'Item reservation not found' });
            }
        }
        catch (err) {
            console.error(`Error while editing item reservation when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Search for all reservations for a specific user 
    // (proper request would be /reserve/10, for example)
    router.get('/reserve/:UserID', async (req, res) => {
        const { UserID } = req.params;

        try {
            const result = await reserveCollection.find({ UserID }).toArray();

            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: 'No reservations found for this user' });
            }
        }
        catch (err) {
            console.error(`Error while searching for reservations when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    return router;
}

module.exports = reserveRouter;