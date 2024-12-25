import axios from "axios";






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
