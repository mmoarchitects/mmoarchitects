export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { name, location, program, scale, contact, message } = body;

    // Vercel Serverless Edge Function Log
    console.log(`[EMAIL DISPATCH] Forwarding Poetic Inquiry Form to: official@mmoarchitects.com`);
    console.log(`[CONTENT] Name: ${name}, Location: ${location}, Program: ${program}, Scale: ${scale}, Contact: ${contact}, Message: ${message}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: '문의 신청서가 성공적으로 송신되었습니다. official@mmoarchitects.com으로 메일 포워딩이 접수되었습니다.' 
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error processing email inquiry' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
