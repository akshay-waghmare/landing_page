/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

interface LeadData {
  company_name: string;
  contact_email: string;
  phone_number: string;
  website?: string;
  notes?: string;
  created_at: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Set CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Content-Type': 'application/json',
    };

    try {
      // Handle POST request for form submission
      if (request.method === 'POST') {
        const data: LeadData = await request.json();
        
        // Validate required fields
        if (!data.company_name || !data.contact_email || !data.phone_number) {
          return new Response(
            JSON.stringify({
              status: 'error',
              message: 'Missing required fields',
            }),
            {
              status: 400,
              headers: corsHeaders,
            }
          );
        }

        // Add timestamp
        const timestamp = new Date().toISOString();

        // Insert data into D1
        const { success, error } = await insertLead(env.DB, {
          ...data,
          created_at: timestamp,
        });

        if (!success) {
          throw new Error(error || 'Failed to save lead');
        }

        return new Response(
          JSON.stringify({
            status: 'success',
            message: 'Thank you for your submission! Your information has been received.',
            id: timestamp,
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      // Handle GET request for testing
      if (request.method === 'GET') {
        return new Response(
          JSON.stringify({
            status: 'success',
            message: 'API is working correctly',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: corsHeaders,
          }
        );
      }

      // Handle unsupported methods
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Method not allowed',
        }),
        {
          status: 405,
          headers: corsHeaders,
        }
      );
    } catch (error) {
      console.error('Error processing request:', error);
      return new Response(
        JSON.stringify({
          status: 'error',
          message: 'Internal server error',
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }
  },
};

async function insertLead(db: D1Database, data: LeadData) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        website TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    const stmt = await db.prepare(`
      INSERT INTO leads (company_name, contact_email, phone_number, website, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      data.company_name,
      data.contact_email,
      data.phone_number,
      data.website || '',
      data.notes || '',
      data.created_at
    );

    await stmt.run();
    return { success: true };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 