var BPU = require('../index');
const raws = require('./raw.json')
const assert = require('assert');
const largeraw = raws[0];
const raw = raws[1];
describe("BPU", function() {
  describe("transform", function() {
    it("larger than 512 bytes => ls", async function() {
      let result = await BPU.parse({
        tx: { r: largeraw },
        split: [{
          token: { s: "|" }
        }],
        transform: function(o, c) {
          if (c.buf && c.buf.byteLength > 512) {
            o["ls"] = o.s;
            o["lb"] = o.b;
            delete o.s;
            delete o.b;
          }
          return o;
        },
      })
      let tape = result.out[0].tape[0]
      console.log(JSON.stringify(tape, function(k,v) {
        if (v.length > 512) {
          return v.slice(0, 512);
        }
        return v;
      }, 2))
      let keys = Object.keys(tape.cell[2])
      console.log(keys)
      assert.deepEqual(["ii", "i", "ls", "lb"], keys)
    })
  })
  describe("split", function() {
    it("no split", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
      })
      assert.equal(result.out.length, 4)
      result.out.forEach(function(out) {
        assert.equal(out.tape.length, 1)
      })
    })
    it("split and exclude", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { s: "|" }
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 3)
      assert.equal(tape[0].cell.length, 6)
      assert.equal(tape[1].cell.length, 18)
      assert.equal(tape[2].cell.length, 4)
      let pipeExists = false;
      tape.forEach(function(t) {
        t.cell.forEach(function(c) {
          if (c.s === "|") {
            pipeExists = true;
          }
        })
      })
      assert.equal(pipeExists, false);
    })
    it("split and include left", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { s: "|" },
          include: "l"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 3)
      assert.equal(tape[0].cell.length, 7)
      assert.equal(tape[1].cell.length, 19)
      assert.equal(tape[2].cell.length, 4)
      assert.equal(tape[0].cell[tape[0].cell.length-1].s, "|")
      assert.equal(tape[1].cell[tape[1].cell.length-1].s, "|")
      assert.notEqual(tape[2].cell[tape[2].cell.length-1].s, "|")
    })
    it("split and include right", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { s: "|" },
          include: "r"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 3)
      assert.equal(tape[0].cell.length, 6)
      assert.equal(tape[1].cell.length, 19)
      assert.equal(tape[2].cell.length, 5)
      assert.notEqual(tape[0].cell[0].s, "|")
      assert.equal(tape[1].cell[0].s, "|")
      assert.equal(tape[2].cell[0].s, "|")
    })
    it("split and include center", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { s: "|" },
          include: "c"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 5)
      assert.equal(tape[0].cell.length, 6)
      assert.equal(tape[1].cell.length, 1)
      assert.equal(tape[2].cell.length, 18)
      assert.equal(tape[3].cell.length, 1)
      assert.equal(tape[4].cell.length, 4)
      assert.equal(tape[1].cell[0].s, "|")
      assert.equal(tape[3].cell[0].s, "|")
    })
    it("split with op", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { op: 106 },
          include: "l"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 2)
      assert.equal(tape[0].cell.length, 1)
      assert.equal(tape[1].cell.length, 29)
      assert.equal(tape[0].cell[0].op, 106)
      assert.equal(tape[0].cell.length, 1)
    })
    it("split with ops", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { ops: "OP_RETURN" },
          include: "l"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      assert.equal(tape.length, 2)
      assert.equal(tape[0].cell.length, 1)
      assert.equal(tape[1].cell.length, 29)
      assert.equal(tape[0].cell[0].op, 106)
      assert.equal(tape[0].cell.length, 1)
    })
    it("split multiple tokens", async function() {
      let result = await BPU.parse({
        tx: { r: raw },
        split: [{
          token: { s: "|" },
          include: "c"
        }, {
          token: { op: 106 },
          include: "l"
        }]
      })
      assert.equal(result.out.length, 4)
      let tape = result.out[0].tape;
      console.log(JSON.stringify(tape, null, 2))
      console.log(JSON.stringify(result, null, 2))
      assert.equal(tape.length, 6)
      assert.equal(tape[0].cell.length, 1)
      assert.equal(tape[1].cell.length, 5)
      assert.equal(tape[2].cell.length, 1)
      assert.equal(tape[3].cell.length, 18)
      assert.equal(tape[4].cell.length, 1)
      assert.equal(tape[5].cell.length, 4)
      assert.equal(tape[0].cell[0].op, 106)
      assert.equal(tape[0].cell.length, 1)
      assert.equal(tape[2].cell[0].s, "|")
      assert.equal(tape[2].cell.length, 1)
      assert.equal(tape[4].cell[0].s, "|")
      assert.equal(tape[4].cell.length, 1)
    })
  })
})
