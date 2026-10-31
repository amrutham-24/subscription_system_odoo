import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (invoice.status === "PAID") {
      return NextResponse.json({ message: "Invoice is already paid" });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const inv = await tx.invoice.update({
        where: { id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      await tx.payment.create({
        data: {
          organizationId: invoice.organizationId,
          invoiceId: invoice.id,
          amount: invoice.total,
          status: "SUCCESS",
          method: "CREDIT_CARD",
          transactionRef: `tx_${Math.random().toString(36).substring(2, 10)}`,
        },
      });

      // If the associated subscription was PAST_DUE, restore it to ACTIVE
      if (invoice.subscriptionId) {
        await tx.subscription.update({
          where: { id: invoice.subscriptionId },
          data: { status: "ACTIVE" },
        });
      }

      return inv;
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error("Pay invoice error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
