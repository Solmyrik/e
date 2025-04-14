const URL_AMO = `https://solmyrk.amocrm.ru/api/v4`;
const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImIzMjczYWIwOTA1NzM0NWFlZDEyNmI5MmNmMzM1NjU1YTBlOGFlYTczN2YwMmZiNDIyODRiZTZjYTJmYmIyNDIwN2I1ZDZkZjhiYjM0OTUwIn0.eyJhdWQiOiI3YTA4ZTJlNS1jNGZmLTQ2YTktOTlkYy1jOTE1NjhkNGE4ZDUiLCJqdGkiOiJiMzI3M2FiMDkwNTczNDVhZWQxMjZiOTJjZjMzNTY1NWEwZThhZWE3MzdmMDJmYjQyMjg0YmU2Y2EyZmJiMjQyMDdiNWQ2ZGY4YmIzNDk1MCIsImlhdCI6MTc0NDU2MjU2NywibmJmIjoxNzQ0NTYyNTY3LCJleHAiOjE3NDQ2NDg5NjcsInN1YiI6IjEyMzczNTAyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyMzU1Njc4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiY2ViNjk4OWQtYzRkMS00OTQ5LWE2NjItODU3Y2E3ZDc2NTE2IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.UZO0ANX1NVBVYJAEo4zV1_EDd6RHM3CKaAQAOV4M3pOFAtuMBn79sxDZGZWiRcX10CJB4b2RPdOAu3BDGSJwoKxIrymDtldkqyGl6rPSd0Y_lwxTuF4j-dcHVDTC04kjF-gXv7atur-xLYmT-oVMpuLJAleHo95wtxUOmsUkOoOVUOVMNa3SQ3Ds3-S9KIgU80XLmkXC31B3bSCn6u-fHy-mQ80mn4mrjBk6dlu-NqakWGOrR-GtDnwEML8k5E5WQbE8dlPCpXh8PV02n1gsscZs6NkyOJWPn5UpP6ndp8BLpE1MYjHUY8YjKXo1O7-y_cO5JwGcNbhLvtn0zDUaRw';
const MAX_REQUESTS_PER_SECOND = 2;

const requestQueue = [];
let requestsInLastSecond = 0;

async function processQueue() {
  while (requestQueue.length > 0) {
    if (requestsInLastSecond < MAX_REQUESTS_PER_SECOND) {
      requestsInLastSecond++;
      const { resolve, reject, url } = requestQueue.shift();

      try {
        const response = await fetch(`${URL_AMO}/${url}`, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();
        resolve({ data, error: null });
      } catch (error) {
        reject({ data: null, error });
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      requestsInLastSecond = 0;
    }
  }
}

export async function getApi({ url }) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, url });
    if (requestQueue.length === 1) {
      processQueue();
    }
  });
}

setInterval(() => {
  requestsInLastSecond = 0;
  if (requestQueue.length > 0) {
    processQueue();
  }
}, 1000);
