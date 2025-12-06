"use server";

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

type PlanSummaryPayload = {
  track: string;
  goal: string;
  hoursPerWeek: number;
  mode: "voice" | "chat";
  reminders: { daily: boolean; weekly: boolean };
  generatedAt: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "CareerWise Plans <plans@careerwise.ai>";

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY." },
      { status: 500 },
    );
  }

  try {
    const { email, plan }: { email?: string; plan?: PlanSummaryPayload } =
      await request.json();

    if (!email || !plan) {
      return NextResponse.json(
        { error: "Email and plan are required." },
        { status: 400 },
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }

    const pdfBuffer = await createPlanPdf(plan);

    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: email,
      subject: "Your CareerWise 14-day Plan",
      text: createPlanTextBody(plan),
      html: createPlanHtmlBody(plan),
      attachments: [
        {
          filename: "careerwise-plan.pdf",
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[send-plan] Failed to email plan", error);
    return NextResponse.json(
      { error: "Failed to email plan." },
      { status: 500 },
    );
  }
}

function createPlanTextBody(plan: PlanSummaryPayload) {
  return [
    "Your plan is attached as a PDF.",
    `Track: ${plan.track}`,
    `Goal: ${plan.goal || "Goal will be finalised inside CareerWise."}`,
    `Weekly commitment: ${plan.hoursPerWeek} hrs (${plan.mode} mentor)`,
    `Reminders: ${
      plan.reminders.daily || plan.reminders.weekly
        ? [
            plan.reminders.daily ? "Daily nudges" : null,
            plan.reminders.weekly ? "Weekly summary" : null,
          ]
            .filter(Boolean)
            .join(", ")
        : "None selected"
    }`,
    "",
    "Log in anytime to keep momentum going: https://careerwise.app/login",
  ].join("\n");
}

function createPlanHtmlBody(plan: PlanSummaryPayload) {
  const reminderBadges =
    plan.reminders.daily || plan.reminders.weekly
      ? [
          plan.reminders.daily ? "Daily nudges" : null,
          plan.reminders.weekly ? "Weekly summary" : null,
        ]
          .filter(Boolean)
          .join(", ")
      : "None selected";

  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #0f172a;">
      <h2>Your CareerWise plan is ready.</h2>
      <p>Here's a quick summary—full PDF is attached.</p>
      <ul>
        <li><strong>Track:</strong> ${plan.track}</li>
        <li><strong>Goal:</strong> ${
          plan.goal || "Goal will be finalised inside CareerWise."
        }</li>
        <li><strong>Weekly Commitment:</strong> ${plan.hoursPerWeek} hrs · ${
          plan.mode === "voice" ? "Voice" : "Chat"
        } mentor</li>
        <li><strong>Nudges:</strong> ${reminderBadges}</li>
      </ul>
      <p>
        Continue in the app to unlock your voice mentor and accountability feed:
        <a href="https://careerwise.app/login">Login to CareerWise</a>
      </p>
    </div>
  `;
}

async function createPlanPdf(plan: PlanSummaryPayload) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // Letter
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const { height } = page.getSize();

  let cursorY = height - 60;

  const drawText = (
    text: string,
    options?: { fontSize?: number; color?: { r: number; g: number; b: number }; bold?: boolean },
  ) => {
    const fontSize = options?.fontSize ?? 12;
    const textFont = options?.bold ? titleFont : font;
    const color = options?.color ?? { r: 15 / 255, g: 23 / 255, b: 42 / 255 };
    page.drawText(text, {
      x: 50,
      y: cursorY,
      size: fontSize,
      font: textFont,
      color: rgb(color.r, color.g, color.b),
    });
    cursorY -= fontSize + 8;
  };

  drawText("CareerWise · 14-day Sprint Overview", {
    fontSize: 20,
    bold: true,
    color: { r: 31 / 255, g: 60 / 255, b: 136 / 255 },
  });
  drawText(`Generated: ${new Date(plan.generatedAt).toLocaleString()}`, {
    fontSize: 12,
    color: { r: 71 / 255, g: 85 / 255, b: 105 / 255 },
  });
  cursorY -= 10;

  const sections: Array<{ label: string; value: string }> = [
    { label: "Focus Track", value: plan.track },
    {
      label: "Goal",
      value: plan.goal || "Goal will be finalised inside CareerWise.",
    },
    {
      label: "Weekly Commitment",
      value: `${plan.hoursPerWeek} hours · ${
        plan.mode === "voice" ? "Voice mentor" : "Chat mentor"
      }`,
    },
    {
      label: "Nudges",
      value:
        plan.reminders.daily || plan.reminders.weekly
          ? [
              plan.reminders.daily ? "• Daily reminders" : null,
              plan.reminders.weekly ? "• Weekly summary" : null,
            ]
              .filter(Boolean)
              .join("\n")
          : "No nudges selected yet.",
    },
  ];

  sections.forEach((section) => {
    drawText(section.label, {
      fontSize: 14,
      bold: true,
      color: { r: 31 / 255, g: 60 / 255, b: 136 / 255 },
    });
    drawText(section.value, {
      fontSize: 12,
      color: { r: 15 / 255, g: 23 / 255, b: 42 / 255 },
    });
    cursorY -= 8;
  });

  cursorY -= 10;
  drawText(
    "Login to CareerWise to start Day 1 tasks and unlock accountability nudges.",
    {
      fontSize: 12,
      color: { r: 71 / 255, g: 85 / 255, b: 105 / 255 },
    },
  );
  drawText("careerwise.app/login", {
    fontSize: 12,
    color: { r: 0 / 255, g: 191 / 255, b: 166 / 255 },
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
