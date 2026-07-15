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
    const { name, location, program, scale, timeline, contact, message } = body;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.warn('[EMAIL WARNING] RESEND_API_KEY is not defined in environment variables. Email dispatch is running in MOCK mode.');
      console.log(`[CONTENT] Name: ${name}, Location: ${location}, Program: ${program}, Scale: ${scale}, Timeline: ${timeline}, Contact: ${contact}, Message: ${message}`);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'RESEND_API_KEY 환경변수가 설정되지 않았습니다. 실전송을 위해서는 Vercel 대시보드에 RESEND_API_KEY를 추가해야 합니다.' 
      }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Call Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'MMO Inquiry <inquiry@mmoarchitects.com>',
        to: ['official@mmoarchitects.com'],
        subject: `[MMO 건축문의] ${name}님 - ${program}`,
        html: `
          <h2>새로운 건축/디자인 문의가 접수되었습니다.</h2>
          <p><strong>이름:</strong> ${name}</p>
          <p><strong>위치/대지:</strong> ${location}</p>
          <p><strong>용도/프로그램:</strong> ${program}</p>
          <p><strong>규모/예산:</strong> ${scale}</p>
          <p><strong>희망 완공/입주 시기:</strong> ${timeline}</p>
          <p><strong>연락처:</strong> ${contact}</p>
          <br/>
          <p><strong>문의 내용:</strong></p>
          <div style="padding: 15px; border-left: 4px solid #1a1a1a; background-color: #f9f9f9; white-space: pre-wrap;">${message}</div>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[EMAIL ERROR] Resend API error response:', data);
      return new Response(JSON.stringify({ error: data.message || 'Resend API dispatch failed' }), {
        status: response.status,
        headers: { 'content-type': 'application/json' },
      });
    }

    console.log('[EMAIL DISPATCH] Forwarded successfully via Resend API:', data.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: '문의 신청서가 성공적으로 송신되었습니다. official@mmoarchitects.com으로 메일 포워딩이 완료되었습니다.' 
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    console.error('[EMAIL EXCEPTION] Failed to dispatch email:', error);
    return new Response(JSON.stringify({ error: 'Internal server error processing email inquiry: ' + error.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
