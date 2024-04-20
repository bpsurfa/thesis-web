const { con } = require('./Connection');
const { initializeDS } = require('./DataStructuresQueries')
const bcrypt = require('bcrypt');

const checkExistingAccount = async (userData, callback) => {
    const query = `SELECT * FROM accounts WHERE Email = ? AND Origin = ?`;

    try {
        // Execute the query to retrieve the account information
        const results = await new Promise((resolve, reject) => {
            con.query(query, [userData.Email, userData.Origin], (err, results) => {
                if (err) {
                    reject(err); // Reject the promise if an error occurs
                } else {
                    resolve(results); // Resolve the promise with the query results
                }
            });
        });

        // If no matching account found, return empty results
        if (results.length === 0) {
            callback(null, []);
            return;
        }

        // Compare the hashed password from the database with the input password
        const match = await bcrypt.compare(userData.Password, results[0].Password);

        // Pass the results back to the callback
        if (match) {
            callback(null, results);
        } else {
            callback(null, []);
        }
    } catch (error) {
        console.error('Error executing query:', error);
        callback(error, null); // Pass the error to the callback
    }
}

const checkExistingEmail = (userData, callback) => {
    const query = 
    `SELECT * 
    FROM accounts 
    WHERE Email = ? AND Origin = ?`
    
    con.query(query, [userData.Email, userData.Origin], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const createAccount = async (userData, callback) => {
    try{
        // Hash the password
        const saltRounds = 10;
        
        const hashedPassword = userData.Password ? await bcrypt.hash(userData.Password, saltRounds) : null;
        
        const query = "INSERT INTO `accounts` (`Email`, `Password`, `isVerified`, `ExpirationDate`, `Firstname`, `Lastname`, `Origin`, `Role`, `AccountStatus`) VALUES (?, ?, '1', current_timestamp(), ?, ?, ?, ?, ?);"
        const values = [userData.Email, hashedPassword, userData.Firstname, userData.Lastname, userData.Origin, userData.Role, userData.AccountStatus]
    
        let accountID

        const resultsAwait = await new Promise((resolve, reject) => {
            con.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error creating account:', err);
                    callback(err, null);
                    reject(err);
                } else {
                    accountID = results.insertId
                    console.log("Account Created!")
                    resolve(results);
                }
            });
        });
        
        const batch = 1
        initializeDS({accountID, batch, treeliststr: userData.treeliststr, linkedliststr: userData.linkedliststr, dynamicarraystr: userData.dynamicarraystr, frequencyCapacity: 100}, (err, results) => {
            if (err) {
                console.error('Error initializing data structure:', err);
                callback(err, null);
            }else{
                console.log("Datastructures initialized!");
                callback(null, resultsAwait);
            }     
        });
    } catch (err) {
        console.log("error from create account queries", err)
    }
}

const updateLastUsedDSBatch = (data, callback) => {
    const query = 
    `UPDATE accounts SET LastUsedDSBatch = ? WHERE AccountID = ?`

    const values = [data.batch, data.accountID]
    
    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const updateUserDetails = async (data, callback) => {
    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.Password, saltRounds);

        const query = `
        UPDATE accounts
        SET Email = ?, Password = ?, Firstname = ?, Lastname = ?
        WHERE AccountID = ?;`;

        const values = [data.Email, hashedPassword, data.Firstname, data.Lastname, data.AccountID];

        // Execute the query to update the user details
        con.query(query, values, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        callback(error, null);
    }
}

const getAllAccounts = (callback) => {
    const query = `SELECT * FROM accounts`

    //const values = []

    con.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const disableAccount = (data, callback) => {
    const query = `
    UPDATE accounts
    SET AccountStatus = "Disabled"
    WHERE AccountID = ?;`

    const values = [data.AccountID]

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const enableAccount = (data, callback) => {
    const query = `
    UPDATE accounts
    SET AccountStatus = "Operational"
    WHERE AccountID = ?;`

    const values = [data.AccountID]

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


module.exports = { checkExistingAccount, checkExistingEmail, createAccount, updateLastUsedDSBatch, updateUserDetails, getAllAccounts, disableAccount, enableAccount};