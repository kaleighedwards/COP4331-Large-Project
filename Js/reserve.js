require('express');
require('mongodb');

exports.reserveRouter = function (app, reserveCollection, productCollection) {
    // reserve item endpoint
    app.post('/api/reserve', async (req, res, next) => {
        const { ItemName, Username, ItemAmt } = req.body;

        // Check if item exists, then checks if there are enough items to reserve, 
        // then reserves the item, subtracting the amount reserved from the total amount of items
        try {
            const item = await productCollection.findOne({ Name: ItemName });

            if (item) {
                if (item.Amt >= ItemAmt) {
                    const result = await reserveCollection.findOne({ Username, ItemName });

                    if (result) {
                        const result2 = await reserveCollection.updateOne({ Username, ItemName }, { $inc: { ItemAmt } });
                    }
                    else {
                        const result2 = await reserveCollection.insertOne({ Username, ItemName, ItemAmt });
                    }

                    const updatedAmt = item.Amt - ItemAmt;
                    const result3 = await productCollection.updateOne({ Name: ItemName }, { $set: { Amt: updatedAmt } });
                    res.status(201).json({ message: `${ItemName} has been reserved. ${updatedAmt} left in stock` });
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
            res.status(500).json({ 
                message: 'Internal server error',
                error: err.stack 
            });
        }
    });

    
    // edit reserve item endpoint
    app.put('/api/reserveedit', async (req, res, next) => {
        const { ItemName, Username, ItemAmt } = req.body;

        // Check the current amount of this item reserved by this user,
        // then depending on whether the new item amount is greater or less than the current amount,
        // either add or subtract the difference from the total amount of items
        try {
            const reservation = await reserveCollection.findOne({ ItemName, Username });

            if (reservation) {
                // If we are deleting the reservation
                if (ItemAmt === 0) {
                    const result = await reserveCollection.deleteOne({ ItemName, Username });

                    if (result.deletedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemName }, { $set: { Amt: item.Amt + reservation.ItemAmt } });

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
                    const item = await productCollection.findOne({ ItemName });

                    if (item) {
                        if (item.Amt >= ItemAmt - reservation.ItemAmt) {
                            const result = await reserveCollection.updateOne({ ItemName, Username }, { $set: { ItemAmt } });

                            if (result.modifiedCount === 1) {
                                const result2 = await productCollection.updateOne({ ItemName }, { $set: { Amt: item.Amt - (ItemAmt - reservation.ItemAmt) } });

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
                    const result = await reserveCollection.updateOne({ ItemName, Username }, { $set: { ItemAmt } });

                    if (result.modifiedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemName }, { $set: { Amt: item.Amt + (reservation.ItemAmt - ItemAmt) } });

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
    app.get('/api/reserve/:Username', async (req, res, next) => {
        const { Username } = req.params;

        try {
            const result = await reserveCollection.find({ Username }).toArray();

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

    /*
    // "Checkout" Delete all reserves for a specific user
    app.delete('/api/reserve/:Username', async (req, res, next) => {
        const { Username } = req.params;

        try {
            const result = await reserveCollection.find({ Username }).toArray();
            
            if (result.length > 0) {
                let totalPrice = 0;
                for (let i = 0; i < result.length; i++) {
                    let item = await productCollection.findOne({ Name: result[i].Isername });
                    totalPrice += item.Price * result[i].ItemAmt;
                }
                const deleteResult = await reserveCollection.deleteMany({ Username });

                res.status(200).json({ 
                    message: `${deleteResult.deletedCount} item(s) have been purchased.`,
                    totalPrice: `$${totalPrice}`
                });
            } else {
                res.status(404).json({ message: 'No reservations found for this user' });
            }
        }
        catch (err) {
            console.error(`Error while deleting reservations when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    */
}
