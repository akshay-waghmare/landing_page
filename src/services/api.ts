export interface LeadData {
  company_name: string;
  website?: string;
  contact_email: string;
  phone_number: string;
  notes: string;
}

export interface LeadResponse {
  lead_id: number;
  message: string;
}

interface ApiResponse {
  status: string;
  message: string;
  id: string;
}

// Get the API base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || 'https://landing-page-api.your-worker.workers.dev';

// Development mode detection
const IS_DEV = process.env.NODE_ENV === 'development';
// Check if we should use mock API
const USE_MOCK_API = process.env.REACT_APP_MOCK_API === 'true';

export const submitLead = async (data: LeadData): Promise<LeadResponse> => {
  try {
    console.log('Starting form submission...', { data });
    console.log('Environment:', {
      isDev: IS_DEV,
      mockAPI: USE_MOCK_API,
      apiURL: API_URL
    });

    // Only use mock response if explicitly enabled
    if (USE_MOCK_API === true) {
      console.log('Mock API is enabled, returning mock response');
      return getMockResponse(data);
    }

    console.log('Sending request to API...', {
      url: API_URL,
      data: data
    });

    // Send data to API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('Received response:', {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText
    });

    if (!response.ok) {
      const errorData = await response.json() as { message?: string };
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json() as ApiResponse;
    console.log('Parsed API Response:', jsonResponse);
    
    return {
      lead_id: Date.parse(jsonResponse.id),
      message: jsonResponse.message
    };
  } catch (error) {
    console.error('API Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Only use mock response if explicitly enabled and there's a connection error
    if (USE_MOCK_API === true && error instanceof Error && 
        (error.message.includes('ERR_CONNECTION_REFUSED') || 
         error.message.includes('Failed to fetch'))) {
      console.warn('API server unreachable, using fallback response');
      return getMockResponse(data);
    }
    
    throw new Error(error instanceof Error ? error.message : 'Failed to submit lead - please try again');
  }
};

// Generate a mock response for development when API is unavailable
function getMockResponse(data: LeadData): LeadResponse {
  return {
    lead_id: Math.floor(Math.random() * 10000) + 1,
    message: `Thank you for your submission! Your information has been received. (Mock response for ${data.contact_email})`
  };
}

export default { submitLead };
