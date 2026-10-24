import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "All fields (name, email, message) are required." },
        { status: 400 }
      );
    }

    // Forward to FormSubmit to deliver to darshanghatge@gmail.com
    const origin = request.headers.get("origin") || request.headers.get("referer") || "http://localhost:3000";

    const formSubmitRes = await fetch("https://formsubmit.co/ajax/darshanghatge@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": origin,
        "Referer": origin,
      },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New Portfolio Message from ${name}`,
        _replyto: email,
        _captcha: "false",
      }),
    });

    const data = await formSubmitRes.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error sending contact email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to dispatch message to email server." },
      { status: 500 }
    );
  }
}
