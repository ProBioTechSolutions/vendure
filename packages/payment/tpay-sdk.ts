const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
import 'dotenv/config';


class paymentInterface{
  constructor(){};

  private getAccessToken = async () => {
      const tokenUrl = process.env.TPAY_API_PREFIX+"/oauth/auth";
      const clientId = process.env.TPAY_API_CLIENTID; // ID klienta
      const clientSecret = process.env.TPAY_API_SECRET; // Tajny klucz klienta
    
      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
      try {
        console.log('Pobieranie tokena OAuth 2.0...');
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
          }
        });
        console.log('Token dostępu uzyskany:', response.data);
        return response.data.access_token;
      } catch (error) {
          console.error('Nie udało się uzyskać tokena dostępu:', error.message);
          if (error.response) {
            console.error('Status odpowiedzi:', error.response.status);
            console.error('Dane odpowiedzi:', error.response.data);
          }
          throw new Error('Nie udało się uzyskać tokena dostępu');
      }
    };

    // Funkcja do tworzenia płatności przy użyciu uzyskanego tokena Bearer
  public createPayment = async (amount: number, description: string, crc: string, email: string, name: string, returnUrl: string) => {
    const token = await this.getAccessToken();

    const payload = 
    {
      "amount": amount/100,
      "description": description,
      "hiddenDescription": crc,
      "lang": "pl",
      "payer": {
        "email": email,
        "name": name,
      },
      "callbacks": {
        "payerUrls": {
          "success": "https://test.tpay.com/payment_success",
          "error": "https://test.tpay.com/payment_error"
        },
        "notification": {
          "email": email
        }
      }
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    try {
      console.log('Próba połączenia z Tpay z payload:', payload);
      const response = await axios.post(process.env.TPAY_API_PREFIX+'/transactions', payload, { headers });
      console.log('Połączenie udane. Odpowiedź:', response.data);
      return response.data;
    } catch (error) {
      console.error('Połączenie nieudane:', error.message);
      if (error.response) {
        console.error('Status odpowiedzi:', error.response.status);
        console.error('Dane odpowiedzi:', error.response.data);
      }
      throw new Error('Nie udało się stworzyć płatności. Spróbuj ponownie później.');
    }
  };
}

export const sdk = new paymentInterface();
