const { con } = require('./Connection');

//functions for queries
const insertActionResults = (actionResults, callback) => {
	console.log(actionResults.ActionSet)
    let ar = actionResults
    let JSONResults = actionResults.JSONResults
    let ActionDate = actionResults.ActionDate
    let ActionSet = actionResults.ActionSet
    let AccountID = actionResults.AccountID
    let JSONData = actionResults.JSONData
    
    const values = [ActionSet, AccountID, ar.dsbatch, ar.dsid, ar.dsname, ar.actiontype, ar.actioninput, ar.actioncount, ar.inputparameters, ar.speedms, ar.speednotation, ar.size, ar.sizepointers, 
    ar.pointersAdded, ar.sizeAdded, ar.space, ar.spacenotation, ar.spaceAdded, ar.threads, JSONResults, JSONData, ActionDate]

    const query = `
        INSERT INTO actionresults (ActionNumber, ActionSet, AccountID, DSBatch, DSID, DSName, ActionType, StartingIndex, EndIndex_Count, Direction, 
        SpeedMS, SpeedNotation, Size, SizePointers, PointersAdded, SizeAdded, SpaceOccupied, SpaceNotation, SpaceAdded, ThreadsUsed, JSONResults, JSONData, ActionDate) 
        VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`    
    
    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const updateCapacity = (actionResults, callback) => {
    const capacity = actionResults.capacity
    const dsid = actionResults.dsid

    const values = [capacity, dsid]

    const query = `UPDATE datastructures SET Capacity = ? WHERE dsid = ?`
    
    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

const getHistoryTableData = (AccountID, callback) => {
    // const query = 
    // `SELECT 
    // ROW_NUMBER() OVER (ORDER BY datastructures.DSBatch DESC, actionresults.ActionSet DESC) AS RowNumber,
    // datastructures.*, 
    // actionresults.*
    // FROM 
    //     datastructures
    // LEFT JOIN 
    //     actionresults ON actionresults.DSID = datastructures.DSID
    // WHERE 
    //     datastructures.AccountID = ?
    // GROUP BY 
    //     datastructures.DSBatch, 
    //     actionresults.ActionDate
    // ORDER BY 
    //     datastructures.DSBatch DESC, 
    //     actionresults.ActionSet DESC;`

    const query = `
    SELECT 
    ROW_NUMBER() OVER (ORDER BY d.DSBatch DESC, a.ActionSet DESC) AS RowNumber,
    d.*,
    a.*
    FROM 
        datastructures d
    LEFT JOIN 
        (
            SELECT 
                *,
                ROW_NUMBER() OVER (PARTITION BY DSBatch, ActionSet ORDER BY ActionNumber) AS rn
            FROM 
                actionresults
        ) a ON a.DSID = d.DSID
    WHERE 
        d.AccountID = ?
        AND (a.rn = 1 OR a.rn IS NULL)
    ORDER BY 
        d.DSBatch DESC, 
        a.ActionSet DESC;`
    
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


const deleteASFromBatchSet = (data, AccountID, callback) => {
    const DSBatch = data.batch   
    const ActionSet = data.actionnumber

    const query = 
    `DELETE FROM actionresults
    WHERE AccountID = ? AND DSBatch = ? AND ActionSet > ?;`

    const values = [AccountID, DSBatch, ActionSet]
    
    con.query(query, values, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


module.exports = { insertActionResults, updateCapacity, getHistoryTableData, deleteASFromBatchSet };