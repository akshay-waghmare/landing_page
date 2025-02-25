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

// You can change this to your actual API endpoint when available
const API_BASE_URL = 'https://victoryline.live/leads-api';

// Development mode detection
const IS_DEV = process.env.NODE_ENV === 'development';

export const submitLead = async (data: LeadData): Promise<LeadResponse> => {
  try {
    console.log('Submitting lead data:', data);

    // In development, if mock mode is enabled, return a fake success response
    if (IS_DEV && process.env.REACT_APP_MOCK_API === 'true') {
      console.log('Using mock API response in development mode');
      return getMockResponse(data);
    }

    // Send JSON data directly to match backend expectations
    const response = await fetch(`${API_BASE_URL}/add-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin,
      },
      body: JSON.stringify(data),
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText || 'Unknown error'}`);
    }

    const jsonResponse = await response.json();
    console.log('API Response:', jsonResponse);
    
    return {
      lead_id: jsonResponse.lead_id,
      message: jsonResponse.message
    };
  } catch (error) {
    console.error('API Error Details:', error);
    
    // If we have a connection refusal error in development mode, use mock response
    if (IS_DEV && error instanceof Error && 
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
