const { con } = require('./Connection');

const getLastActionAndDataStructure = async (userDetails, callback) => {    
    const AccountID = userDetails.AccountID

    const query =
    `SELECT ds.*, ar.*
    FROM (
        SELECT ds.DSBatch as DSBatch_CLSC, ds.DSID as DSID_CLSC, ds.DSName as DSName_CLSC, ds.*
        FROM accounts a
        JOIN datastructures ds ON a.AccountID = ds.AccountID
        WHERE a.AccountID = ? 
          AND ds.DSBatch = a.LastUsedDSBatch
    ) ds
    LEFT JOIN (
        SELECT *
        FROM actionresults ar_inner
        WHERE ar_inner.ActionNumber = (
            SELECT MAX(ActionNumber)
            FROM actionresults
            WHERE DSID = ar_inner.DSID
        )
    ) ar ON ds.DSID = ar.DSID;`

    const values = [AccountID]

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const initializeDS = ({accountID, batch, treeliststr, linkedliststr, dynamicarraystr, frequencyCapacity}, callback) => {
    const values = [
        accountID, batch, frequencyCapacity,
        accountID, batch, frequencyCapacity,
        accountID, batch, 
        accountID, batch, frequencyCapacity]

        console.log(values)

    const query = 
    "INSERT INTO `datastructures` (`DSID`, `AccountID`, `DSBatch`, `DSName`, `Threaded`, `Frequency`, `Capacity`, `Type`, `UserAddedPivot`, `DateCreated`) \
    VALUES (NULL, ?, ?, 'Frequency List V2 T', '1', ?, NULL, 'CUSTOM LIST', '0', current_timestamp()), \
    (NULL, ?, ?, 'Frequency List V1 T', '1', ?, NULL, 'CUSTOM LIST', '0', current_timestamp()), \
    (NULL, ?, ?, 'Doubly Linked List', '0', NULL, NULL, 'TRADITIONAL LIST', '0', current_timestamp()), \
    (NULL, ?, ?, 'Dynamic Array T', '1', NULL, ?, 'TRADITIONAL ARRAY', '0', current_timestamp());"

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const updateJSONData = ({DSID, JSONData}, callback) => {
    const values = [JSONData, DSID]

    const query = 
    `UPDATE datastructures SET JSONData = ? WHERE DSID = ?`

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const getHighestBatch = (AccountID, callback) => {
    // this function is for getting the highest batch of an account

    const query = 
    `SELECT MAX(DSBatch) as DSBatch
    FROM datastructures
    WHERE AccountID = ?`

    const values = [AccountID]

    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const deleteDSFromBatch = (data, AccountID, callback) => {
    const DSBatch = data.batch   

    const query = 
    `DELETE FROM datastructures
    WHERE AccountID = ? AND DSBatch = ?;`

    const values = [AccountID, DSBatch]
    
    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

module.exports = { getLastActionAndDataStructure, initializeDS, updateJSONData, getHighestBatch, deleteDSFromBatch };