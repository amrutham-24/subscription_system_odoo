import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validatePasswordStrength } from "@/lib/password";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password, organizationName, role = "ADMIN" } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const orgName = organizationName?.trim() || `${name}'s Organization`;
    const slug = `${orgName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

    const userRole = role === "CUSTOMER" ? "CUSTOMER" : "ADMIN";

    const result = await prisma.$transaction(async (tx) => {
      // Find main organization or create new one
      let organization = await tx.organization.findFirst();
      if (!organization || userRole === "ADMIN") {
        organization = await tx.organization.create({
          data: {
            name: orgName,
            slug,
          },
        });
      }

      const user = await tx.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: userRole,
        },
      });

      // If customer, also create a Customer record so they can have subscriptions & invoices
      if (userRole === "CUSTOMER") {
        const cust = await tx.customer.create({
          data: {
            organizationId: organization.id,
            name,
            email: normalizedEmail,
            company: orgName,
            status: "ACTIVE",
            churnRisk: "LOW",
          },
        });

        // Attach starter subscription
        const starterPlan = await tx.plan.findFirst();
        if (starterPlan) {
          const now = new Date();
          const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          await tx.subscription.create({
            data: {
              organizationId: organization.id,
              customerId: cust.id,
              planId: starterPlan.id,
              status: "ACTIVE",
              currentPeriodStart: now,
              currentPeriodEnd: oneMonthLater,
            },
          });
        }
      } else {
        // Also create sample Starter plan for the new admin organization
        const product = await tx.product.create({
          data: {
            organizationId: organization.id,
            name: "Standard Tier",
          },
        });

        await tx.plan.create({
          data: {
            organizationId: organization.id,
            productId: product.id,
            name: "Starter",
            price: 29.0,
            interval: "MONTHLY",
          },
        });
      }

      return { user, organization, role: userRole };
    });

    await createSession(result.user.id);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          role: result.role,
          organization: result.organization,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
