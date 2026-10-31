import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Brightloop database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.workflowExecutionNode.deleteMany();
  await prisma.workflowExecution.deleteMany();
  await prisma.workflowVersion.deleteMany();
  await prisma.workflow.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Brightloop Technologies",
      slug: "brightloop-tech",
      currency: "USD",
    },
  });

  // 2. Create Passwords & Users
  const passwordHash = await bcrypt.hash("Password123!", 12);
  
  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Alex Vance (Admin)",
      email: "admin@brightloop.io",
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    },
  });
  await prisma.membership.create({
    data: {
      userId: adminUser.id,
      organizationId: org.id,
      role: "ADMIN",
    },
  });

  // Staff User
  const staffUser = await prisma.user.create({
    data: {
      name: "Sarah Jenkins (Staff)",
      email: "staff@brightloop.io",
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    },
  });
  await prisma.membership.create({
    data: {
      userId: staffUser.id,
      organizationId: org.id,
      role: "STAFF",
    },
  });

  // Customer User (Acme Corp Client)
  const customerUser = await prisma.user.create({
    data: {
      name: "David Miller (Customer)",
      email: "customer@acme.com",
      passwordHash,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    },
  });
  await prisma.membership.create({
    data: {
      userId: customerUser.id,
      organizationId: org.id,
      role: "CUSTOMER",
    },
  });

  // 3. Create Products & Plans
  const saasProduct = await prisma.product.create({
    data: {
      organizationId: org.id,
      name: "Brightloop Revenue Suite",
      description: "Complete subscription management, metrics, and automation builder",
    },
  });

  const planStarter = await prisma.plan.create({
    data: {
      organizationId: org.id,
      productId: saasProduct.id,
      name: "Starter",
      description: "For early stage startups managing up to $10k MRR",
      price: 29.0,
      interval: "MONTHLY",
      trialDays: 14,
      features: JSON.stringify(["Up to 50 customers", "Basic analytics", "2 Automations", "Email support"]),
    },
  });

  const planPro = await prisma.plan.create({
    data: {
      organizationId: org.id,
      productId: saasProduct.id,
      name: "Growth Pro",
      description: "For fast growing businesses scaling revenue operations",
      price: 99.0,
      interval: "MONTHLY",
      trialDays: 14,
      features: JSON.stringify(["Unlimited customers", "Advanced cohort analytics", "10 Automations", "Slack alerts", "Priority support"]),
    },
  });

  const planEnterprise = await prisma.plan.create({
    data: {
      organizationId: org.id,
      productId: saasProduct.id,
      name: "Enterprise Scale",
      description: "For high-volume SaaS with custom requirements and SLA",
      price: 299.0,
      interval: "MONTHLY",
      trialDays: 30,
      features: JSON.stringify(["Unlimited everything", "Custom AI workflows", "Dedicated TAM", "Custom integrations", "99.99% uptime SLA"]),
    },
  });

  const planEnterpriseAnnual = await prisma.plan.create({
    data: {
      organizationId: org.id,
      productId: saasProduct.id,
      name: "Enterprise Annual",
      description: "Enterprise tier billed annually with a 2-month discount",
      price: 2990.0,
      interval: "YEARLY",
      trialDays: 30,
      features: JSON.stringify(["All Enterprise features", "Dedicated Account Manager", "Annual audit report"]),
    },
  });

  // 4. Create Customers
  const customerData = [
    { name: "Acme Corporation", email: "customer@acme.com", company: "Acme Corp", churnRisk: "LOW", status: "ACTIVE" },
    { name: "TechFlow Labs", email: "finance@techflow.io", company: "TechFlow", churnRisk: "LOW", status: "ACTIVE" },
    { name: "Supabase Inc", email: "ops@supabase.io", company: "Supabase", churnRisk: "LOW", status: "ACTIVE" },
    { name: "Linear Systems", email: "accounts@linear.app", company: "Linear", churnRisk: "MEDIUM", status: "ACTIVE" },
    { name: "Retool Apps", email: "pay@retool.com", company: "Retool", churnRisk: "HIGH", status: "ACTIVE" },
    { name: "Vercel Cloud", email: "procurement@vercel.com", company: "Vercel", churnRisk: "LOW", status: "ACTIVE" },
    { name: "Raycast Tools", email: "billing@raycast.com", company: "Raycast", churnRisk: "LOW", status: "ACTIVE" },
    { name: "Scale AI", email: "finance@scale.ai", company: "Scale AI", churnRisk: "HIGH", status: "ACTIVE" },
  ];

  const createdCustomers = [];
  for (const c of customerData) {
    const cust = await prisma.customer.create({
      data: {
        organizationId: org.id,
        name: c.name,
        email: c.email,
        company: c.company,
        churnRisk: c.churnRisk,
        status: c.status,
      },
    });
    createdCustomers.push(cust);
  }

  // 5. Create Subscriptions & Invoices
  const now = new Date();
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);

  // Acme -> Enterprise Annual
  const sub1 = await prisma.subscription.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[0].id,
      planId: planEnterpriseAnnual.id,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: oneYearLater,
    },
  });

  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[0].id,
      subscriptionId: sub1.id,
      number: "INV-2026-001",
      subtotal: 2990.0,
      tax: 239.2,
      discount: 0.0,
      total: 3229.2,
      status: "PAID",
      dueDate: now,
      paidAt: now,
    },
  });

  // Acme second open invoice
  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[0].id,
      subscriptionId: sub1.id,
      number: "INV-2026-005",
      subtotal: 299.0,
      tax: 23.92,
      discount: 0.0,
      total: 322.92,
      status: "OPEN",
      dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      notes: "Monthly enterprise add-on: 5 Dedicated seats",
    },
  });

  // TechFlow -> Enterprise Monthly
  const sub2 = await prisma.subscription.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[1].id,
      planId: planEnterprise.id,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
    },
  });

  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[1].id,
      subscriptionId: sub2.id,
      number: "INV-2026-002",
      subtotal: 299.0,
      tax: 23.92,
      discount: 0.0,
      total: 322.92,
      status: "PAID",
      dueDate: now,
      paidAt: now,
    },
  });

  // Supabase -> Pro Monthly
  const sub3 = await prisma.subscription.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[2].id,
      planId: planPro.id,
      status: "ACTIVE",
      currentPeriodStart: now,
      currentPeriodEnd: oneMonthLater,
    },
  });

  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[2].id,
      subscriptionId: sub3.id,
      number: "INV-2026-003",
      subtotal: 99.0,
      tax: 7.92,
      discount: 0.0,
      total: 106.92,
      status: "PAID",
      dueDate: now,
      paidAt: now,
    },
  });

  // Retool -> Enterprise (PAST DUE)
  const subRetool = await prisma.subscription.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[4].id,
      planId: planEnterprise.id,
      status: "PAST_DUE",
      currentPeriodStart: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: createdCustomers[4].id,
      subscriptionId: subRetool.id,
      number: "INV-2026-004",
      subtotal: 299.0,
      tax: 23.92,
      discount: 0.0,
      total: 322.92,
      status: "PAST_DUE",
      dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      notes: "Payment retried 2 times and failed (insufficient funds)",
    },
  });

  // 6. Create Pre-built Workflows
  const dunningNodes = [
    {
      id: "node-trigger",
      type: "triggerNode",
      position: { x: 250, y: 50 },
      data: {
        label: "Invoice Overdue",
        category: "trigger",
        event: "invoice.overdue",
        description: "Fires when invoice passes due date by 3+ days",
      },
    },
    {
      id: "node-cond-1",
      type: "conditionNode",
      position: { x: 250, y: 180 },
      data: {
        label: "Check Invoice Amount",
        category: "condition",
        field: "amount",
        operator: ">",
        value: 100,
        description: "Evaluate if invoice is > $100",
      },
    },
    {
      id: "node-act-discount",
      type: "actionNode",
      position: { x: 100, y: 320 },
      data: {
        label: "Apply 15% Retention Coupon",
        category: "action",
        actionType: "apply_discount",
        percent: 15,
        description: "Apply temporary 15% coupon for 1 billing cycle",
      },
    },
    {
      id: "node-act-slack",
      type: "actionNode",
      position: { x: 400, y: 320 },
      data: {
        label: "Alert RevOps Slack",
        category: "action",
        actionType: "slack_notify",
        channel: "#billing-alerts",
        description: "Post high-priority alert to #billing-alerts",
      },
    },
    {
      id: "node-act-email",
      type: "actionNode",
      position: { x: 250, y: 460 },
      data: {
        label: "Send Dunning Recovery Email",
        category: "action",
        actionType: "send_email",
        template: "dunning_courtesy_recovery",
        description: "Send friendly update payment method email",
      },
    },
  ];

  const dunningEdges = [
    { id: "e-trig-cond", source: "node-trigger", target: "node-cond-1" },
    { id: "e-cond-disc", source: "node-cond-1", target: "node-act-discount", label: "True" },
    { id: "e-cond-slack", source: "node-cond-1", target: "node-act-slack", label: "True" },
    { id: "e-disc-email", source: "node-act-discount", target: "node-act-email" },
    { id: "e-slack-email", source: "node-act-slack", target: "node-act-email" },
  ];

  const dunningWorkflow = await prisma.workflow.create({
    data: {
      organizationId: org.id,
      name: "Smart Dunning: High-Value Invoice Recovery",
      description: "Automatically recovers unpaid enterprise subscriptions with discount incentives and internal Slack escalation",
      triggerEvent: "invoice.overdue",
      active: true,
      versions: {
        create: {
          version: 1,
          nodesJson: JSON.stringify(dunningNodes),
          edgesJson: JSON.stringify(dunningEdges),
        },
      },
    },
  });

  const exec1 = await prisma.workflowExecution.create({
    data: {
      workflowId: dunningWorkflow.id,
      status: "SUCCESS",
      triggerEvent: "invoice.overdue",
      payloadJson: JSON.stringify({
        invoiceNumber: "INV-2026-004",
        customer: "Retool Apps",
        amount: 322.92,
      }),
      completedAt: new Date(),
    },
  });

  await prisma.workflowExecutionNode.createMany({
    data: [
      { executionId: exec1.id, nodeId: "node-trigger", nodeType: "trigger", status: "SUCCESS", outputJson: JSON.stringify({ detected: true }) },
      { executionId: exec1.id, nodeId: "node-cond-1", nodeType: "condition", status: "SUCCESS", outputJson: JSON.stringify({ passed: true, amount: 322.92 }) },
      { executionId: exec1.id, nodeId: "node-act-discount", nodeType: "action", status: "SUCCESS", outputJson: JSON.stringify({ coupon: "RECOVER15" }) },
      { executionId: exec1.id, nodeId: "node-act-slack", nodeType: "action", status: "SUCCESS", outputJson: JSON.stringify({ messageSent: true }) },
      { executionId: exec1.id, nodeId: "node-act-email", nodeType: "action", status: "SUCCESS", outputJson: JSON.stringify({ delivered: true, recipient: "pay@retool.com" }) },
    ],
  });

  console.log("Database seeded successfully!");
  console.log("Admin: admin@brightloop.io / Password123!");
  console.log("Staff: staff@brightloop.io / Password123!");
  console.log("Customer: customer@acme.com / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
