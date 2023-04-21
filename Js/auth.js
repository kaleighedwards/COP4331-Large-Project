const express = require('express');
const router = express.Router();

function authRouter(userCollection, reserveCollection, productCollection) {
    // signup endpoint
    router.post('/signup', async (req, res) => {
        const { Username, Password, PermLvl } = req.body;

        try {
            const user = await userCollection.findOne({ Username });

            if (user) {
                res.status(409).json({ message: 'Username already exists' });
            } else {
                const result = await userCollection.insertOne({ Username, Password, PermLvl });
                
                if( result.insertedCount === 1 ) {
                    res.status(201).json({ message: 'User created with permission level ' + PermLvl });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        } catch (err) {
            console.error(`Error while signing up when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // login endpoint
    router.post('/signin', async (req, res) => {
        const { Username, Password } = req.body;
    
        try {
            const user = await userCollection.findOne({ Username, Password });
    
            if (user) {
                res.status(200).json({ 
                    id: user.UserID,
                    message: 'Login successful',
                    PermLvl: user.PermLvl
                });
            } else {
                const userExists = await userCollection.findOne({ Username });
    
                if (userExists) {
                    res.status(401).json({ message: 'Incorrect password' });
                } else {
                    res.status(401).json({ message: 'Incorrect username' });
                }
            }
        } catch (err) {
            console.error(`Error while logging in when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Edit user endpoint
    router.put('/useredit', async (req, res) => {
        const { UserID, Username, Password, PermLvl } = req.body;
    
        // Check if user exists, then update the user
        try {
            const user = await userCollection.findOne({ UserID });

            if (user) {
                // Check what is being updated 
                // DEAR FRONT END:
                // If you are not changing any of these fields, then dont pass them in the request body
                // Or pass some form of null value, like an empty string, Null, or 0
                if (Boolean(Username)) {
                    // Check if username already exists, if not, update the username
                    const user2 = await userCollection.findOne({ Username });

                    if (user2) {
                        res.status(409).json({ message: 'New username already exists' });
                    }
                    else {
                        const result = await userCollection.updateOne({ UserID }, { $set: { Username } });

                        if (result.modifiedCount === 1) {
                            res.status(200).json({ message: 'Username updated from ' + user.Username + ' to ' + Username + ' successfully' });
                        } else {
                            res.status(500).json({ message: 'Internal server error' });
                        }
                    }
                }

                if (Password) {
                    const result = await userCollection.updateOne({ UserID }, { $set: { Password } });

                    if (result.modifiedCount === 1) {
                        res.status(200).json({ message: 'Password updated successfully' });
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                }

                if (PermLvl) {
                    const result = await userCollection.updateOne({ UserID }, { $set: { PermLvl } });

                    if (result.modifiedCount === 1) {
                        // If Perm level is decreased, say the user has been elevated
                        if (PermLvl < user.PermLvl) {
                            res.status(200).json({ message: 'User has been elevated to permission level ' + PermLvl });
                        } else {
                            res.status(200).json({ message: 'User has been demoted to permission level ' + PermLvl });
                        }
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                }
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (err) {
            console.error(`Error while editing user when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Delete user endpoint
    // Has to check and properly delete all the user's reserves as well, adding back to the stock
    router.delete('/userdelete', async (req, res) => {
        const { UserID } = req.body;

        try {
            const user = await userCollection.findOne({ UserID });

            if (user) {
                // Delete all the user's reserves and adds back to the stock
                const reserves = await reserveCollection.find({ UserID }).toArray();

                for (let i = 0; i < reserves.length; i++) {
                    const result = await reserveCollection.deleteOne({ ItemID: reserves[i].ItemID });

                    if (result.deletedCount === 1) {
                        const result2 = await productCollection.updateOne({ ItemID: reserves[i].ItemID }, { $inc: { Amt: reserves[i].ItemAmt } });

                        if (result2.modifiedCount !== 1) {
                            res.status(500).json({ message: 'Internal server error' });
                        }
                    } else {
                        res.status(500).json({ message: 'Internal server error' });
                    }
                }
                    
                // Delete the user
                const result3 = await userCollection.deleteOne({ UserID });

                if (result2.deletedCount === 1) {
                    res.status(200).json({ message: 'User deleted successfully' });
                } else {
                    res.status(500).json({ message: 'Internal server error' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (err) {
            console.error(`Error while deleting user when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
}

module.exports = authRouter;