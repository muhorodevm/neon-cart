import { PrismaClient } from "@prisma/client";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import bwipjs from "bwip-js"; // For barcode generation

const prisma = new PrismaClient();

export async function generateReceipt(orderId: string): Promise<string> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { include: { profile: true } },
        items: { include: { product: true } },
        address: true,
        payments: true,
      },
    });

    if (!order) throw new Error("Order not found");

    const payment = order.payments[0];

    const receiptData = {
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      customer: {
        name: `${order.user.profile?.firstName || ""} ${
          order.user.profile?.lastName || ""
        }`,
        email: order.user.email,
        phone: order.user.profile?.phone || "N/A",
        address: order.address
          ? `${order.address.street}, ${order.address.city}, ${order.address.postalCode}, ${order.address.country}`
          : "No address provided",
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: payment?.paymentMethod || "M-Pesa",
      paymentCode: payment?.transactionId || "",
    };

    const receiptsDir = path.join(__dirname, "..", "..", "receipts");
    if (!fs.existsSync(receiptsDir))
      fs.mkdirSync(receiptsDir, { recursive: true });

    const filename = `${order.orderNumber}.pdf`;
    const filePath = path.join(receiptsDir, filename);

    // Generate barcode for the order number
    const barcodePath = path.join(
      receiptsDir,
      `${order.orderNumber}_barcode.png`
    );
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: "code128",
      text: order.orderNumber,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
    fs.writeFileSync(barcodePath, barcodeBuffer);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // LOGO
    const logoPath = path.join(__dirname, "..", "..", "public", "favicon.ico");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 40, { width: 80 });
    }

    // HEADER TEXT
    doc.fontSize(20).text("NDULA SUPERMARKET", 0, 50, { align: "center" });
    doc.fontSize(12).text("Order Receipt", { align: "center" });
    doc.moveDown(2);

    // DASHED LINE
    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(3, { space: 3 }).stroke();
    doc.undash().moveDown();

    // ORDER DETAILS
    doc.fontSize(12);
    doc.text(`Order Number: ${receiptData.orderNumber}`);
    doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`);
    doc.text(`Payment Method: ${receiptData.paymentMethod}`);
    if (receiptData.paymentCode)
      doc.text(`Payment Code: ${receiptData.paymentCode}`);
    doc.moveDown();

    // BARCODE
    if (fs.existsSync(barcodePath)) {
      doc.image(barcodePath, { fit: [150, 50], align: "center" }); // fixed align type
    }

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(3, { space: 3 }).stroke();
    doc.undash().moveDown();

    // CUSTOMER DETAILS
    doc.fontSize(14).text("Customer Information", { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${receiptData.customer.name}`);
    doc.text(`Email: ${receiptData.customer.email}`);
    doc.text(`Phone: ${receiptData.customer.phone}`);
    doc.text(`Address: ${receiptData.customer.address}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(3, { space: 3 }).stroke();
    doc.undash().moveDown();

    // ITEMS
    doc.fontSize(14).text("Items Purchased", { underline: true });
    doc.moveDown(0.5);

    doc.font("Courier-Bold").fontSize(12);
    doc.text(
      "Item".padEnd(25) + "Qty".padEnd(10) + "Price".padEnd(10) + "Total"
    );
    doc.font("Courier").moveDown(0.3);

    receiptData.items.forEach((it) => {
      const line = `${it.name.padEnd(25)}${String(it.quantity).padEnd(
        10
      )}KSh ${it.price
        .toLocaleString()
        .padEnd(10)}KSh ${it.total.toLocaleString()}`;
      doc.text(line);
    });

    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(3, { space: 3 }).stroke();
    doc.undash().moveDown();

    // TOTALS
    doc.fontSize(12);
    doc.text(`Subtotal: KSh ${receiptData.subtotal.toLocaleString()}`, {
      align: "right",
    });
    doc.text(`Tax: KSh ${receiptData.tax.toLocaleString()}`, {
      align: "right",
    });
    doc.text(`Shipping: KSh ${receiptData.shipping.toLocaleString()}`, {
      align: "right",
    });
    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .text(`TOTAL: KSh ${receiptData.total.toLocaleString()}`, {
        align: "right",
      });

    doc.moveDown(1.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).dash(3, { space: 3 }).stroke();
    doc.undash().moveDown();

    // FOOTER
    doc.fontSize(10).fillColor("gray");
    doc.text("Thank you for shopping with NDULA Supermarket!", {
      align: "center",
    });
    doc.text("For support, contact us at support@ndula.com", {
      align: "center",
    });

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", () => resolve());
      stream.on("error", (err) => reject(err));
    });

    fs.unlinkSync(barcodePath);

    return filePath;
  } catch (error) {
    console.error("Generate receipt error:", error);
    throw error;
  }
}
