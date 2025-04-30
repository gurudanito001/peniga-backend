import axios, { AxiosResponse, AxiosError } from 'axios';







export const generateVirtualAccount = ({ email, amount, contractId }: { email: string, amount: number, contractId: string }) => {
  const generateVirtualAccountUrl = "https://api.flutterwave.com/v3/virtual-account-numbers";


  return new Promise((resolve, reject) => {
    const details = {
      "email": email,
      "amount": amount,
      "tx_ref": contractId,
      "is_permanent": false,
      "narration": "Peniga Escrow Account"
    };
    axios.post(generateVirtualAccountUrl, details, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Required for backend API calls
        "Content-Type": "application/json",
        "X-Public-Key": process.env.FLW_PUBLIC_KEY // Optional, if Flutterwave allows for added verification
      }
    })
      .then((response: { data: object }) => {
        console.log("Virtual account created:", response.data);
        resolve({ message: "Temporary account generated successfully", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });
  })
}


export const getTransferFee = ({ amount, currency = "NGN", type = "bank" }: { amount: number, currency?: string, type?: string }) => {

  const getTransferFeeUrl = `https://api.flutterwave.com/v3/transfers/fee?amount=${amount}&currency=${currency}&type=${type}`;


  return new Promise((resolve, reject) => {
    axios.get(getTransferFeeUrl, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    })
      .then((response: { data: object }) => {
        console.log("Transfer fee generated:", response.data);
        resolve({ message: "Transfer fee generated successfully", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });

  })
}


export const transferToBankAccount = ({ accountBank, accountNumber, amount, narration = "Payment from sales on Peniga", reference }: { accountBank: string, accountNumber: string, amount: number, narration?: string, reference: string }) => {
  const transferToBank = 'https://api.flutterwave.com/v3/transfers';


  return new Promise((resolve, reject) => {
    const transferData = {
      account_bank: accountBank,
      account_number: accountNumber,
      amount: amount,
      currency: "NGN",
      narration,
      reference: reference,
      debit_currency: "NGN",
    };
    console.log("Payload", transferData);
    axios.post(transferToBank, transferData, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Required for backend API calls
        "Content-Type": "application/json",
        "X-Public-Key": process.env.FLW_PUBLIC_KEY // Optional, if Flutterwave allows for added verification
      }
    })
      .then((response: { data: object }) => {
        console.log("Transfer Successful", response.data);
        resolve({ message: "Transfer Successful", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });
  })
}


interface Bank {
  id: number;
  code: string;
  name: string;
}

interface GetBanksResponse {
  status: string;
  message: string;
  data: Bank[];
}

export async function getBanks(){
  const url = `https://api.flutterwave.com/v3/banks/NG`;

  return new Promise((resolve, reject) => {
    
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Required for backend API calls
        "Content-Type": "application/json",
        "X-Public-Key": process.env.FLW_PUBLIC_KEY // Optional, if Flutterwave allows for added verification
      }
    })
      .then((response: { data: object }) => {
        console.log("Fetch Banks Successful", response.data);
        resolve({ message: "Fetch Banks Successful", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });
  })
}


export async function checkTransferStatus(transferId: string){
  const url = `https://api.flutterwave.com/v3/transfers/${transferId}`;

  return new Promise((resolve, reject) => {
    
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Required for backend API calls
        "Content-Type": "application/json",
        "X-Public-Key": process.env.FLW_PUBLIC_KEY // Optional, if Flutterwave allows for added verification
      }
    })
      .then((response: { data: object }) => {
        console.log("Fetch transfer status Successful", response.data);
        resolve({ message: "Fetch transfer status Successful", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });
  })
}


interface ResolveAccountResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

export async function validateAccountNumber({accountNumber, bankCode}: {accountNumber: string, bankCode: string}){
  const url = 'https://api.flutterwave.com/v3/accounts/resolve';

  return new Promise((resolve, reject) => {
    const validateAccountData = {
      account_number: accountNumber,
      account_bank: bankCode,
    }
    axios.post(url, validateAccountData,{
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, // Required for backend API calls
        "Content-Type": "application/json",
        "X-Public-Key": process.env.FLW_PUBLIC_KEY // Optional, if Flutterwave allows for added verification
      }
    })
      .then((response: AxiosResponse<ResolveAccountResponse>) => {
        console.log("Validate account successful", response.data);
        resolve({ message: "Validate account successful", payload: response.data });
      })
      .catch((error: any) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error("Error response:", error.response.data);
          reject(error.response.data)
        } else if (error.request) {
          // No response received
          console.error("No response received:", error.request);
          reject(error.request)
        } else {
          // Other errors
          console.error("Error setting up request:", error.message);
          reject(error.message)
        }
      });
  })
}