require('dotenv').config()
const bsv = require('bsv')
const RpcClient = require('bitcoind-rpc');
const fromHash = function(o, config) {
  if (!config) {
    config = {
      protocol: 'http',
      user: process.env.BITCOIN_USERNAME ? process.env.BITCOIN_USERNAME : 'root',
      pass: process.env.BITCOIN_PASSWORD ? process.env.BITCOIN_PASSWORD : 'bitcoin',
      host: process.env.BITCOIN_IP ? process.env.BITCOIN_IP : '127.0.0.1',
      port: process.env.BITCOIN_PORT ? process.env.BITCOIN_PORT : '8332',
    }
  }
  const rpc = new RpcClient(config)
  return new Promise(function(resolve, reject) {
    rpc.getRawTransaction(o.tx.h, async function(err, transaction) {
      if (err) {
        reject(err);
      } else {
        o.tx.r = transaction.result;
        let result = await fromTx(o)
        resolve(result)
      }
    })
  })
}
const fromTx = function(o) {
  let transaction = o.tx.r;
  return new Promise(function(resolve, reject) {
    let gene = new bsv.Transaction(transaction);
    let inputs = gene.inputs ? collect(o, "in", gene.inputs) : []
    let outputs = gene.outputs ? collect(o, "out", gene.outputs) : []
    resolve({ tx: { h: gene.hash }, in: inputs, out: outputs, lock: gene.nLockTime })
  })
}
const collect = function(o, type, xputs) {
  let xputsres = [];
  if (!o.transform) o.transform = function(r) { return r; }
  xputs.forEach(function(xput, xput_index) {
    if (xput.script) {
      let xputres = { i: xput_index, tape: [] }
      let tape_i = 0;
      let cell_i = 0;
      let cell = [];
      xput.script.chunks.forEach(function(c, chunk_index) {
        let chunk = c;
        if (c.buf) {
          let b = c.buf.toString('base64')
          let s = c.buf.toString('utf8')
          let splitter = false;
          let isSplitter = false;
          if (o.split && Array.isArray(o.split)) {
            o.split.forEach(function(setting) {
              if ((setting.token && setting.token.s && setting.token.s === s) ||
                (setting.token && setting.token.b && setting.token.b === b)) {
                splitter = setting.include; 
                isSplitter = true;
              }
            })
          }
          if (isSplitter) {
            if (splitter === 'l') {
              let item = o.transform({ b: c.buf.toString('base64'), s: c.buf.toString('utf8'), ii: chunk_index, i: cell_i++ }, c)
              cell.push(item)
              xputres.tape.push({ cell: cell, i: tape_i++ })
              cell = [];
              cell_i = 0;
            } else if (splitter === 'r') {
              xputres.tape.push({ cell: cell, i: tape_i++ })
              let item = o.transform({ b: c.buf.toString('base64'), s: c.buf.toString('utf8'), ii: chunk_index, i: cell_i++ }, c)
              cell = [item];
              cell_i = 1;
            } else if (splitter === 'c') {
              xputres.tape.push({ cell: cell, i: tape_i++ })
              let item = o.transform({ b: c.buf.toString('base64'), s: c.buf.toString('utf8'), ii: chunk_index, i: 0 }, c)
              xputres.tape.push({ cell: [item], i: tape_i++ })
              cell = [];
              cell_i = 0;
            } else {
              xputres.tape.push({ cell: cell, i: tape_i++ })
              cell = [];
              cell_i = 0;
            }
          } else {
            let item = o.transform({ b: c.buf.toString('base64'), s: c.buf.toString('utf8'), ii: chunk_index, i: cell_i++ }, c)
            cell.push(item)
          }
        } else {
          if (typeof c.opcodenum !== 'undefined') {
            let op = c.opcodenum;
            let ops = bsv.Opcode(op).toString()
            let splitter = false;
            let isSplitter = false;
            if (o.split && Array.isArray(o.split)) {
              o.split.forEach(function(setting) {
                if ((setting.token && setting.token.op && setting.token.op === op) ||
                    (setting.token && setting.token.ops && setting.token.ops === ops)) {
                  splitter = setting.include; 
                  isSplitter = true;
                }
              })
            }
            if (isSplitter) {
              if (splitter === 'l') {
                let item = o.transform({ op: op, ops: ops, ii: chunk_index, i: cell_i++ }, c)
                cell.push(item)
                xputres.tape.push({ cell: cell, i: tape_i++ })
                cell = [];
                cell_i = 0;
              } else if (splitter === 'r') {
                xputres.tape.push({ cell: cell, i: tape_i++ })
                let item = o.transform({ op: op, ops: ops, ii: chunk_index, i: cell_i++ }, c)
                cell = [item];
                cell_i = 1;
              } else if (splitter === 'c') {
                xputres.tape.push({ cell: cell, i: tape_i++ })
                let item = o.transform({ op: op, ops: ops, ii: chunk_index, i: cell_i++ }, c)
                xputres.tape.push({ cell: [item], i: tape_i++ })
                cell = [];
                cell_i = 0;
              } else {
                xputres.tape.push({ cell: cell, i: tape_i++ })
                cell = [];
                cell_i = 0;
              }
            } else {
              let item = o.transform({ op: op, ops: ops, ii: chunk_index, i: cell_i++ }, c)
              cell.push(item)
            }
          } else {
            cell.push(o.transform({ op: c, ii: chunk_index, i: cell_i++ }, c))
          }
        }
      })
      if (cell.length > 0) xputres.tape.push({ cell: cell, i: tape_i++ });
      if (type === 'in') {
        let sender = { h: xput.prevTxId.toString('hex'), i: xput.outputIndex }
        let address = xput.script.toAddress(bsv.Networks.livenet).toString()
        if (address && address.length > 0) { sender.a = address; }
        xputres.e = sender;
        xputres.seq = xput.sequenceNumber;
      } else if (type === 'out') {
        let receiver = { v: xput.satoshis, i: xput_index }
        let address = xput.script.toAddress(bsv.Networks.livenet).toString()
        if (address && address.length > 0) { receiver.a = address; }
        xputres.e = receiver;
      }
      xputsres.push(xputres)
    }
  })
  return xputsres;
}
const parse = function(o, config) {
  if (o.tx) {
    if (o.tx.h) {
      return fromHash(o, config)
    } else if (o.tx.r) {
      return fromTx(o)
    }
  }
}
if (require.main === module) {
  if (process.argv.length >= 3) {
    let hash = process.argv[2];
    fromHash(hash).then(function(result) {
      console.log(result)
    })
  }
}
module.exports = {
  parse: parse,
  fromHash: fromHash,
  fromTx: fromTx
}
