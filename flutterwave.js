let forge = require("node-forge");
let axios = require('axios')


class Flutterwave {

  constructor(secretKey, publicKey, encryptKey) {
    this.secretKey = secretKey
    this.publicKey = publicKey
    this.encryptKey = encryptKey
  }

  encrypt(text) {
    let key = this.encryptKey
    let cipher = forge.cipher.createCipher(
      "3DES-ECB",
      forge.util.createBuffer(key)
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    let encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
  }

  async transferToBank(data){
    try {
      let {
        account_bank,
        account_number,
        amount,
        currency = "NGN",
        beneficiary_name
      } = data

      let transferData = {
        account_bank,
        account_number,
        amount,
        currency,
        beneficiary_name
      }

      const endpoint = 'https://api.flutterwave.com/v3/transfers'

      let response = await axios.post(endpoint, transferData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }

  }

  async chargeCard (data){
    try {
      let {
        amount,
        currency = "NGN",
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        email,
        tx_ref,
        pin
      } = data

      let chargeData = {
        amount,
        currency,
        card_number,
        cvv,
        expiry_month,
        expiry_year,
        email,
        tx_ref,
        authorization: {
          mode: 'pin',
          pin
        }
      }
      let encryptData = {
        client: this.encrypt(JSON.stringify(chargeData))
      }
      const endpoint = 'https://api.flutterwave.com/v3/charges?type=card'

      let response = await axios.post(endpoint, encryptData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }
  }

  async validateCharge (data){
    try {
      let {
        otp,
        flw_ref
      } = data;

      let validateData = {
        otp,
        flw_ref
      }

      const endpoint = 'https://api.flutterwave.com/v3/validate-charge'
      let response = await axios.post(endpoint, validateData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }
  }

  async payWithBankTransfer (data){
    try {
      let {
        amount,
        email,
        currency,
        tx_ref
      } = data

      let chargeData = {
        amount,
        email,
        currency,
        tx_ref
      }

      const endpoint = 'https://api.flutterwave.com/v3/charges?type=bank_transfer'
      let response = await axios.post(endpoint, chargeData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }
  }

  async payWithBankWithdrawal (data) {
    try {
      let {
        account_bank,
        account_number,
        amount,
        email,
        tx_ref,
        currency
      } = data;
      let chargeData = {
        account_bank,
        account_number,
        amount,
        email,
        tx_ref,
        currency
      }
      const endpoint = 'https://api.flutterwave.com/v3/charges?type=debit_ng_account'
      let response = await axios.post(endpoint, chargeData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }
  }

  async verifyAccountNumber (data) {
    try {
      let {
        accountNumber,
        bankCode
      } = data
      let toBeSentData = {
        account_number: accountNumber,
        account_bank: bankCode
      }
      let endpoint = 'https://api.flutterwave.com/v3/accounts/resolve'
      let response = await axios.post(endpoint, toBeSentData, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      })
      return {
        success: true,
        ...response.data
      }
    }
    catch (err){
      return {
        success: false,
        ...err.response.data
      }
    }
  }

}

module.exports = Flutterwave
