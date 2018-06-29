const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async function() {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' });

  // inbox.setProvider(provider);
});

describe("Inbox", function() {
  it("deploys a contract", function() {
    assert.ok(inbox.options.address);
  });

  it("has a default message", async function() {
    const message = await inbox.methods.message().call();
    // console.log('message:', await inbox.methods.message())
    assert.equal(message, 'Hi there!');
  });

  it("can change the message", async function() {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
