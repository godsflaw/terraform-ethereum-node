const { stuckWhileSyncingCertainBlock,
    notifyManagerInitiatedRestartToSlack,
    stuckWhileSyncingPeriodicSnapshot,
    timeLog,
    getMachineCurrentTime,
    getLatestBlockTimestamp,
    stuckWhileSyncingSnapshot,
    restartEthereum,
    getLastEthereumLogs, } = require('./ethereum-lib');

//const commandAsString = `curl -s --data '{"method":"eth_syncing","params":[],"id":1,"jsonrpc":"2.0"}' -H "Content-Type: application/json" -X POST http://localhost:8545`;

var shouldRestart = false;

const latestBlockTimestamp = getLatestBlockTimestamp();
const currentMachineTimestamp = getMachineCurrentTime();
const timeDrift = Math.abs(currentMachineTimestamp - latestBlockTimestamp);

if (timeDrift > 5 * 60) {
    const message = `The drift in seconds between latest block and our host is: ${timeDrift} which is more than 5 minutes - restarting parity!`;
    timeLog(message);
    notifyManagerInitiatedRestartToSlack(message);
    shouldRestart = true;
}

//var resultAsString;

// // Check if ethereum is synced
// try {
//     const result = execSync(commandAsString, {
//         timeout: 10 * 1000
//     });
//     resultAsString = result.toString();
// } catch (err) {
//     // If we can't reach the Ethereum node to figure out it's sync status
//     // Or if we encountered any other kind of error, restart the node.
//     shouldRestart = true;
// }

// const o = JSON.parse(resultAsString);

// if (o.result === false) { // This means ethereum is synced with the network
// } else {
//     if (o.result.highestBlock === '0x0') { // Downloading snapshot
//         // If Ethereum is stuck syncing the latest snapshot - restart it
//         if (stuckWhileSyncingSnapshot(getLastEthereumLogs(500))) {
//             shouldRestart = true;
//         }
//     } else {
//         const resultStuckOnSpecificBlock = stuckWhileSyncingCertainBlock(getLastEthereumLogs(500));
//         const resultStuckOnPeriodicSnapshot = stuckWhileSyncingPeriodicSnapshot(getLastEthereumLogs(500));

//         if (resultStuckOnSpecificBlock.ok) {
//             shouldRestart = true;
//             timeLog(resultStuckOnSpecificBlock.message);
//             notifyManagerInitiatedRestartToSlack(resultStuckOnSpecificBlock.message);
//         } else if (resultStuckOnPeriodicSnapshot.ok) {
//             shouldRestart = true;
//             timeLog(resultStuckOnPeriodicSnapshot.message);
//             notifyManagerInitiatedRestartToSlack(resultStuckOnPeriodicSnapshot.message);
//         }
//     }
// }

if (shouldRestart) {
    timeLog('Manager is restarting Ethereum...');
    timeLog(restartEthereum().toString());
}

process.exit(0);

