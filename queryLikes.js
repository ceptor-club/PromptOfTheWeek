const { MongoClient } = require("mongodb");
require('dotenv').config();

const url = secrets.db_conn;
const client = new MongoClient(url);

const dbName = secrets.db_name;
const colName = secrets.db_collection;

async function getOwnerIdWithMostLikes() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const col = db.collection(colName);
  
        // Aggregate the likes for each NFT
        const aggregationResult = await col.aggregate([
            {
                $match: {
                    likes: { $exists: true } // filter documents where likes field exists
                }
            },
            {
                $project: {
                    ownerId: 1,
                    tokenId: 1,
                    contractAddress: 1,
                    likesCount: { $size: "$likes" } // count the number of elements in the likes array
                }
            },
            {
                $sort: { likesCount: -1 } // sort in descending order of likes
            }
        ]).toArray();

        console.log(aggregationResult);
        console.log(aggregationResult[0].ownerId);

        // The source code MUST return a Buffer or the request will return an error message
        // Use one of the following functions to convert to a Buffer representing the response bytes that are returned to the client smart contract:
        // - Functions.encodeUint256
        // - Functions.encodeInt256
        // - Functions.encodeString
        // Or return a custom Buffer for a custom byte encoding
        return Functions.encodeString(aggregationResult[0].ownerId);

    } catch (err) {
        console.error(err.stack);
    } finally {
        await client.close();
    }
}

getOwnerIdWithMostLikes();
