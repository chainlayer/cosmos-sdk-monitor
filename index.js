const myvalidator = "##VALIDATOR##"
const WebSocket = require('ws')
var SysLogger = require('ain2');
var console = new SysLogger({tag: 'cosmos-sdk-monitor', facility: 'local0'});


const ws = new WebSocket('ws://127.0.0.1:26657/websocket')
let height = 0
let failedblocks = 0
let successfullblocks = 0

ws.on('open', function open() {
  ws.send('{     "jsonrpc": "2.0",     "method": "subscribe",     "id": "0",     "params": {         "query": "tm.event=\'NewBlock\'"     } }')
});

ws.on('message', function incoming(data) {
  try {
    result = JSON.parse(data)
    found = false
    expectedheight = parseInt(height) + 1
    if (result.result.data.value.block.header.height == expectedheight) {
      console.info("Received block was next block in line. Expected:", expectedheight, "Got:", result.result.data.value.block.header.height)
    } else {
      console.error("Received block wasn't next block in line. Expected:", expectedheight, "Got:", result.result.data.value.block.header.height)
    }
    height = result.result.data.value.block.header.height
    precommits = result.result.data.value.block.last_commit.precommits
    for (index = 0; index < precommits.length; ++index) {
      if (precommits[index] !== null && precommits[index].validator_address === myvalidator) {
        found = true
        break
      }
    }
    if (!found) {
      console.error("Block", height, "Not validated by", myvalidator)
      failedblocks++
      successfullblocks = 0
      console.error("Number of consequtive failed blocks", failedblocks)
    } else {
      console.info("Block", height, "Validated by", myvalidator) 
      if (failedblocks > 0) {
        failedblocks = 0
        console.info("Number of consequtive failed blocks", failedblocks)
      }
      successfullblocks++
      console.info("Number of consequtive successfull blocks", successfullblocks)
    }
  } catch (error) {
    console.warn("Unknown error occured:", error)
    console.debug("Raw Data:", data)
  }
});

