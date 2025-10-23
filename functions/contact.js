// Cloudflare Pages Function for handling contact form submissions
export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          } 
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }

    // Prepare email content
    const emailContent = {
      to: env.CONTACT_EMAIL || 'your-email@example.com',
      from: env.FROM_EMAIL || 'noreply@yourdomain.com',
      subject: `Contact Form: ${subject || 'New Message'}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}
      `,
      html: `
<h3>New Contact Form Submission</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Subject:</strong> ${subject || 'No subject'}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email using Cloudflare Email Workers (if configured)
    // Or integrate with your preferred email service
    if (env.RESEND_API_KEY) {
      // Using Resend API
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: emailContent.from,
          to: [emailContent.to],
          subject: emailContent.subject,
          html: emailContent.html,
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }
    } else if (env.SENDGRID_API_KEY) {
      // Using SendGrid API
      const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailContent.to }],
            subject: emailContent.subject
          }],
          from: { email: emailContent.from },
          content: [{
            type: 'text/html',
            value: emailContent.html
          }]
        }),
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send email');
      }
    } else {
      // Log the message (for development/testing)
      console.log('Contact form submission:', emailContent);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you soon.' 
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}