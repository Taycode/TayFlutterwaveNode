let Flutterwave = require('./flutterwave')
require('dotenv').config()

// Initialize the flutterwave class
let flutterwave = new Flutterwave(
  process.env.flutterwave_secret_key,
  process.env.flutterwave_public_key,
  process.env.flutterwave_encryption_key
)

// For making Transfers to bank
const payToBankFunction = async () => {
  let data = {
    account_bank: '044',
    account_number: '0690000031',
    amount: 1000,
    currency: 'NGN',
    beneficiary_name: 'Forest Green'
  }
  let response = await flutterwave.transferToBank(data)
  console.log(response)
}

// For charging Cards
const chargeCardFunction = async () => {
  let data = {
    amount: 1000,
    currency: 'NGN',
    card_number: '5531886652142950',
    cvv: '564',
    expiry_month: '09',
    expiry_year: '32',
    email: 'hi@tay.com',
    tx_ref: 'testMe',
    pin: '3310'
  }
  let response = await flutterwave.chargeCard(data)
  console.log(response)
}

// This is for validating Bank or Card charges
const validateChargeFunction = async () => {
  let data = {
    otp: '12345',
    flw_ref: 'FLW-MOCK-049a789dc6a675e3d16c0d348245c1cc'
  }
  let response = await flutterwave.validateCharge(data)
  console.log(response)
}

// Pay by transferring from your bank to a unique bank account
const payWithBankTransferFunction = async () => {
  let data = {
    amount: 1000,
    email: 'hi@tay.com',
    currency: 'NGN',
    tx_ref: 'testMe'
  }
  let response = await flutterwave.payWithBankTransfer(data)
  console.log(response)
}

// Charge bank account
const payWithBankWithdrawalFunction = async () => {
  let data = {
    account_bank: '044',
    account_number: '0690000031',
    amount: 1000,
    email: 'hi@tay.com',
    tx_ref: 'testMe',
    currency: 'NGN'
  }
  let response = await flutterwave.payWithBankWithdrawal(data)
  console.log(response)
}

// Verify account name of a bank account
const verifyAccountNumberFunction = async () => {
  let data = {
    accountNumber: '0690000031',
    bankCode: '044'
  }
  let response = await flutterwave.verifyAccountNumber(data)
  console.log(response)
}

