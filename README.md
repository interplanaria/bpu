# BPU

> Bitcoin Processing Unit

Transform Bitcoin Transactions into Virtual Procedure Call Units.

![bpu](./bpu.png)


# Features

1. Turns a Bitcoin transaction inputs and outputs into a structured format called "tape"
2. Chunk the push data sequence into "cells" 
3. Transform each push data through a custom transform function

# Schema

BPU is a fork of [TXO](https://github.com/interplanaria/txo), but with a little different structure, and with customization features.

At a high level, BPU is a library that creates a nested structure of **tapes** and **cells** from a Bitcoin transaction with the following rule:

1. `i`: positional index for whichever item it's attached to. applies to both `tape` and `cell`.
2. `ii`: global positional index. only applies to `cell`. For example, a cell can have a local index `i` of 0, but global index `ii` of 3.
3. `b`: base64 representation of a push data.
4. `s`: UTF8 representation of a push data.
5. `op`: a Bitcoin opcode number. only applies to push data items which are opcodes. (not buffer type push data)
6. `ops`: a Bitcoin opcode string. only applies to push data items which are opcodes. (not buffer type push data)

BPU also lets you generate your own custom serialization format. One example is **BOB (Bitcoin OP_RETURN Bytecode)**. 

> You can learn more about BOB here: https://medium.com/@_unwriter/hello-bob-94701d278afb
>
> Also see how this format can be stored in a DB: https://bob.planaria.network/

Here's an example BPU parsed object, more specifically a BOB serialization format:


```
{
  "tx": {
    "h": "7e5011d81d01c67e81ab9a50ab3077bb62b340d1b50592931e4b52afa7198e65"
  },
  "in": [
    {
      "i": 0,
      "tape": [
        {
          "cell": [
            {
              "b": "MEQCIAwf5m6RfA1UICSFTlG2h4NEyfFui7qtxgria2EL1iVJAiA23uD0THoqzh9ONMMoxRMlJqqI8YU0dacNhqCkMaPY0kE=",
              "s": "0D\u0002 \f\u001f�n�|\rT $�NQ���D��n����\n�ka\u000b�%I\u0002 6���Lz*�\u001fN4�(�\u0013%&���4u�\r���1���A",
              "ii": 0,
              "i": 0
            },
            {
              "b": "AvLkgpq1RgHcLPYH7Q9uxCZnRgT0TDQwP2OEYmHZuWWb",
              "s": "\u0002�䂚�F\u0001�,�\u0007�\u000fn�&gF\u0004�L40?c�baٹe�",
              "ii": 1,
              "i": 1
            }
          ],
          "i": 0
        }
      ],
      "e": {
        "h": "9c4e6f32d9b49d439c7413ecb14662cc4853f9fb7f66b99965d8eb2610c0653d",
        "i": 1,
        "a": "17SnqQYGNZuD4zpu8eemt26TrdbvoJC5ie"
      }
    }
  ],
  "out": [
    {
      "i": 0,
      "tape": [
        {
          "cell": [
            {
              "op": 106,
              "ops": "OP_RETURN",
              "ii": 0,
              "i": 0
            }
          ],
          "i": 0
        },
        {
          "cell": [
            {
              "b": "MTlIeGlnVjRReUJ2M3RIcFFWY1VFUXlxMXB6WlZkb0F1dA==",
              "s": "19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut",
              "ii": 1,
              "i": 0
            },
            {
              "b": "SEFIQUhBSEE=",
              "s": "HAHAHAHA",
              "ii": 2,
              "i": 1
            },
            {
              "b": "dGV4dC9wbGFpbg==",
              "s": "text/plain",
              "ii": 3,
              "i": 2
            },
            {
              "b": "dGV4dA==",
              "s": "text",
              "ii": 4,
              "i": 3
            },
            {
              "b": "dHdldGNoX3R3dGV4dF8xNTY1MTMxNDIzNTU2LnR4dA==",
              "s": "twetch_twtext_1565131423556.txt",
              "ii": 5,
              "i": 4
            }
          ],
          "i": 1
        },
        {
          "cell": [
            {
              "b": "fA==",
              "s": "|",
              "ii": 6,
              "i": 0
            }
          ],
          "i": 2
        },
        {
          "cell": [
            {
              "b": "MVB1UWE3SzYyTWlLQ3Rzc1NMS3kxa2g1NldXVTdNdFVSNQ==",
              "s": "1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5",
              "ii": 7,
              "i": 0
            },
            {
              "b": "U0VU",
              "s": "SET",
              "ii": 8,
              "i": 1
            },
            {
              "b": "dHdkYXRhX2pzb24=",
              "s": "twdata_json",
              "ii": 9,
              "i": 2
            },
            {
              "b": "bnVsbA==",
              "s": "null",
              "ii": 10,
              "i": 3
            },
            {
              "b": "dXJs",
              "s": "url",
              "ii": 11,
              "i": 4
            },
            {
              "b": "bnVsbA==",
              "s": "null",
              "ii": 12,
              "i": 5
            },
            {
              "b": "Y29tbWVudA==",
              "s": "comment",
              "ii": 13,
              "i": 6
            },
            {
              "b": "bnVsbA==",
              "s": "null",
              "ii": 14,
              "i": 7
            },
            {
              "b": "bWJfdXNlcg==",
              "s": "mb_user",
              "ii": 15,
              "i": 8
            },
            {
              "b": "MzY2Nw==",
              "s": "3667",
              "ii": 16,
              "i": 9
            },
            {
              "b": "cmVwbHk=",
              "s": "reply",
              "ii": 17,
              "i": 10
            },
            {
              "b": "ODg0OTc3MDA4ZjdkMGE2Y2U1YjM5NzZkNTA4MzJjMGJiOGQ3ZTU5MjRiMWZkZTYwMGQ0YjE3NDFjZTVkYTBmOQ==",
              "s": "884977008f7d0a6ce5b3976d50832c0bb8d7e5924b1fde600d4b1741ce5da0f9",
              "ii": 18,
              "i": 11
            },
            {
              "b": "dHlwZQ==",
              "s": "type",
              "ii": 19,
              "i": 12
            },
            {
              "b": "cmVwbHk=",
              "s": "reply",
              "ii": 20,
              "i": 13
            },
            {
              "b": "dGltZXN0YW1w",
              "s": "timestamp",
              "ii": 21,
              "i": 14
            },
            {
              "b": "Mzk5NjU4OTEwMTMwMDc=",
              "s": "39965891013007",
              "ii": 22,
              "i": 15
            },
            {
              "b": "YXBw",
              "s": "app",
              "ii": 23,
              "i": 16
            },
            {
              "b": "dHdldGNo",
              "s": "twetch",
              "ii": 24,
              "i": 17
            }
          ],
          "i": 3
        },
        {
          "cell": [
            {
              "b": "fA==",
              "s": "|",
              "ii": 25,
              "i": 0
            }
          ],
          "i": 4
        },
        {
          "cell": [
            {
              "b": "MTVQY2lIRzIyU05MUUpYTW9TVWFXVmk3V1NxYzdoQ2Z2YQ==",
              "s": "15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva",
              "ii": 26,
              "i": 0
            },
            {
              "b": "QklUQ09JTl9FQ0RTQQ==",
              "s": "BITCOIN_ECDSA",
              "ii": 27,
              "i": 1
            },
            {
              "b": "MUFLSFZpWWdCR2JteGk4cWlKa052b0hOZUR1OW0zTWZQRQ==",
              "s": "1AKHViYgBGbmxi8qiJkNvoHNeDu9m3MfPE",
              "ii": 28,
              "i": 2
            },
            {
              "b": "IyNjb21wdXRlZF9zaWcjIw==",
              "s": "##computed_sig##",
              "ii": 29,
              "i": 3
            }
          ],
          "i": 5
        }
      ],
      "e": {
        "v": 0,
        "i": 0,
        "a": "false"
      }
    },
    {
      "i": 1,
      "tape": [
        {
          "cell": [
            {
              "op": 118,
              "ops": "OP_DUP",
              "ii": 0,
              "i": 0
            },
            {
              "op": 169,
              "ops": "OP_HASH160",
              "ii": 1,
              "i": 1
            },
            {
              "b": "CUcuns23XoX3EFhf0EVmDIPPqXk=",
              "s": "\tG.�ͷ^��\u0010X_�Ef\f�ϩy",
              "ii": 2,
              "i": 2
            },
            {
              "op": 136,
              "ops": "OP_EQUALVERIFY",
              "ii": 3,
              "i": 3
            },
            {
              "op": 172,
              "ops": "OP_CHECKSIG",
              "ii": 4,
              "i": 4
            }
          ],
          "i": 0
        }
      ],
      "e": {
        "v": 6900,
        "i": 1,
        "a": "1r4MYgWbmzz7g2HdEqLDusTQ4ZwrtEVCY"
      }
    },
    {
      "i": 2,
      "tape": [
        {
          "cell": [
            {
              "op": 118,
              "ops": "OP_DUP",
              "ii": 0,
              "i": 0
            },
            {
              "op": 169,
              "ops": "OP_HASH160",
              "ii": 1,
              "i": 1
            },
            {
              "b": "QRtHnMuB1770Vq3uNkvofZDiKyM=",
              "s": "A\u001bG�ˁ׾�V��6K�}��+#",
              "ii": 2,
              "i": 2
            },
            {
              "op": 136,
              "ops": "OP_EQUALVERIFY",
              "ii": 3,
              "i": 3
            },
            {
              "op": 172,
              "ops": "OP_CHECKSIG",
              "ii": 4,
              "i": 4
            }
          ],
          "i": 0
        }
      ],
      "e": {
        "v": 6900,
        "i": 2,
        "a": "16wFbu6pRa2sqDrnha6N56HVN91VppofyF"
      }
    },
    {
      "i": 3,
      "tape": [
        {
          "cell": [
            {
              "op": 118,
              "ops": "OP_DUP",
              "ii": 0,
              "i": 0
            },
            {
              "op": 169,
              "ops": "OP_HASH160",
              "ii": 1,
              "i": 1
            },
            {
              "b": "QRtHnMuB1770Vq3uNkvofZDiKyM=",
              "s": "A\u001bG�ˁ׾�V��6K�}��+#",
              "ii": 2,
              "i": 2
            },
            {
              "op": 136,
              "ops": "OP_EQUALVERIFY",
              "ii": 3,
              "i": 3
            },
            {
              "op": 172,
              "ops": "OP_CHECKSIG",
              "ii": 4,
              "i": 4
            }
          ],
          "i": 0
        }
      ],
      "e": {
        "v": 43793,
        "i": 3,
        "a": "16wFbu6pRa2sqDrnha6N56HVN91VppofyF"
      }
    }
  ]
}
```


# Install

```
npm install --save bpu
```

# Usage

## 1. Parse from raw transaction

```
const BPU = require('bpu');
// 'rawtx' is a raw transaction string
(async function() {
  let result = await BPU.parse({
    tx: { r: rawtx }
  })
})();
```

## 2. Parse from transaction id

In case you have access to JSON-RPC, you can parse directly from txid.


The first step is to update the `.env` file

```
BITCOIN_USERNAME=[Bitcoin Node Username]
BITCOIN_PASSWORD=[Bitcoin Node Password]
BITCOIN_IP=[Bitcoin Node IP]
BITCOIN_PORT=[Bitcoin Node Port]
```

Then you can use it like this:

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid }
  })
})();
```


## 3. Split

### a. Split with "s"

Split with "|" (in UTF8)

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" }
    }]
  })
})();
```

### b. Split with "b"

Split with "fA==" in base64

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { b: "fA==" }
    }]
  })
})();
```

### c. Split with "op"

Split with OP_RETURN (`{op: 106}`)

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { op: 106 }
    }]
  })
})();
```

### d. Split with "ops"

Split with OP_RETURN (`{ops: "OP_RETURN"}`)

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { ops: "OP_RETURN" }
    }]
  })
})();
```

Split with OP_CODESEPARATOR (`{ops: "OP_CODESEPARATOR"}`)

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { ops: "OP_CODESEPARATOR" }
    }]
  })
})();
```

### e. Split and Discard

By default, "split" discards the delimiter from the result.

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" }
    }]
  })
})();
```

### f. Split and include the delimiter to the left

With `"include": "l"`, you can merge the delimiter to the left side of the split arrays:

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" },
      include: "l"
    }]
  })
})();
```

### g. Split and include the delimiter to the right

With `"include": "r"`, you can merge the delimiter to the right side of the split arrays:

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" },
      include: "r"
    }]
  })
})();
```

### h. Split and create a new cell in the center

With `"include": "c"`, you can create a new standalone cell which contains the delimiter

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" },
      include: "c"
    }]
  })
})();
```

### i. Split with multiple tokens

You can split based on multiple delimiters. For example [BOB](https://bob.planaria.network) chunks scripts based on `OP_RETURN` and `|`.

````
const BPU = require('bpu');
(async function() {
  let result = await BPU.parse({
    tx: { r: raw },
    split: [{
      token: { s: "|" }
    }, {
      token: { ops: "OP_RETURN" },
      include: "l"
    }]
  })
})();
````

## 4. transform

Transform each input/output script object:

```
const BPU = require('bpu');
// 'txid' is a transaction id
(async function() {
  let result = await BPU.parse({
    tx: { h: txid },
    split: [{
      token: { s: "|" }
    }],
    transform: function(o, c) {
      // if the buffer is larger than 512 bytes,
      // replace the key with "l" prepended attribute
      if (c.buf && c.buf.byteLength > 512) {
        o["ls"] = o.s;
        o["lb"] = o.b;
        delete o.s;
        delete o.b;
      }
      return o;
    },
  })
})
```
