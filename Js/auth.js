require('express');
require('mongodb');

exports.authRouter = function (app, userCollection, reserveCollection, productCollection) {
    // signup endpoint
    app.post('/api/signup', async (req, res, next) => {
        const { Username, Password, PermLvl } = req.body;

        if ( !Username || !Password ) {
            res.status(400).json({ message: 'Username and password are required' });
        } else {
            try {
                const user = await userCollection.findOne({ Username });
    
                if (user) {
                    res.status(409).json({ message: 'Username already exists' });
                } else {
                    const result = await userCollection.insertOne({ Username, Password, PermLvl });
                    res.status(201).json({ 
                        message: `User created with permission level ${PermLvl>1?'Customer':'Employee'} and _id: ${result.insertedId}`,
                        UserID: result.insertedId
                    });
                }
            } catch (e) {
                var error = `Error while signing up when connecting to database: ${e.toString()}`;
                res.status(500).json({ 
                    message: 'Internal server error',
                    error: error
                });
            }
        }      
    });

    // login endpoint
    app.post('/api/signin', async (req, res, next) => {
        const { Username, Password } = req.body;
    
        try {
            const user = await userCollection.findOne({ Username, Password });
    
            if (user) {
                res.status(200).json({ 
                    UserID: user._id,
                    message: 'Login successful',
                    PermLvl: user.PermLvl === 2 ? 'Customer' : "Employee"
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

    /*
    // Edit user endpoint
    app.put('/api/useredit', async (req, res, next) => {
        const { _id, Username, Password, PermLvl } = req.body;
        let err = false;
        // Check if user exists, then update the user
        try {
            const user = await userCollection.findOne({ _id });

            if (user) {
                let messages = [
                    usermessage = "No changes made to username",
                    passmessage = "No changes made to password",
                    permmessage = "No changes made to permission level"
                ]
                // Check what is being updated 
                // DEAR FRONT END:
                // If you are not changing any of these fields, then dont pass them in the request body
                // Or pass some form of null value, like an empty string, Null, or 0
                if (Boolean(Username)) {
                    // Check if username already exists, if not, update the username
                    const user2 = await userCollection.findOne({ Username });

                    if (user2) {
                        err = true;
                        messages.usermessage = 'New username already exists';
                    }
                    else {
                        const result = await userCollection.updateOne({ _id }, { $set: { Username } });

                        if (result.modifiedCount === 1) {
                            messages.usermessage = 'Username updated from ' + user.Username + ' to ' + Username + ' successfully';
                        } else {
                            err = true;
                            messages.usermessage = 'Internal server error';
                        }
                    }
                }

                if (Password) {
                    const result = await userCollection.updateOne({ _id }, { $set: { Password } });

                    if (result.modifiedCount === 1) {
                        messages.passmessage = 'Password updated successfully';
                    } else {
                        err = true;
                        messages.passmessage = 'Internal server error';
                    }
                }

                if (PermLvl) {
                    const result = await userCollection.updateOne({ _id }, { $set: { PermLvl } });

                    if (result.modifiedCount === 1) {
                        // If Perm level is decreased, say the user has been elevated
                        if (PermLvl < user.PermLvl) {
                            messages.permmessage = 'User has been elevated to permission level ' + PermLvl;
                        } else {
                            messages.permmessage = 'User has been demoted to permission level ' + PermLvl;
                        }
                    } else {
                        err = true;
                        messages.permmessage = 'Internal server error';
                    }
                }

                if (err) {
                    res.status(500).json(messages);
                }
                else {
                    res.status(200).json(messages);
                }
            }
            else {
                res.status(404).json({ message: '_id not found' });
            }
        }
        catch (err) {
            console.error(`Error while editing user when connecting to database: ${err.stack}`);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // Delete user endpoint
    // Has to check and properly delete all the user's reserves as well, adding back to the stock
    app.delete('/api/userdelete', async (req, res) => {
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
    */
}
