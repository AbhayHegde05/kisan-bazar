const PDFDocument = require("pdfkit");
const moment = require("moment");

const generateInvoice = (order, res) => {
    const doc = new PDFDocument({ margin: 50 });

    let filename = `Invoice-${order._id}.pdf`;
    filename = encodeURIComponent(filename);

    res.setHeader("Content-disposition", 'attachment; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Header
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Kisan Bazar", 50, 57)
        .fontSize(10)
        .text("Connecting Farmers & Consumers", 200, 65, { align: "right" })
        .moveDown();

    doc.text(`Invoice Number: ${order._id}`, 50, 200)
        .text(`Date: ${moment(order.createdAt).format("DD/MM/YYYY")}`, 50, 215)
        .text(`Status: ${order.status}`, 50, 230)
        .moveDown();

    // Consumer Details
    doc.text("Bill To:", 50, 250)
        .text(order.consumer.name, 50, 265)
        .text(order.consumer.email || "", 50, 280)
        .moveDown();

    // Table Header
    const tableTop = 330;
    doc.font("Helvetica-Bold");
    generateTableRow(doc, tableTop, "Item", "Unit Price", "Quantity", "Line Total");
    generateHr(doc, tableTop + 20);
    doc.font("Helvetica");

    // Items
    let i = 0;
    let position = 0;
    for (i = 0; i < order.items.length; i++) {
        const item = order.items[i];
        position = tableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.product.name,
            formatCurrency(item.price),
            item.quantity,
            formatCurrency(item.price * item.quantity)
        );
        generateHr(doc, position + 20);
    }

    // Total
    const subtotalPosition = position + 30;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Total",
        formatCurrency(order.totalAmount)
    );

    // Footer
    doc.fontSize(10).text(
        "Thank you for supporting local farmers.",
        50,
        700,
        { align: "center", width: 500 }
    );

    doc.end();
};

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(amount) {
    return "Rs. " + amount.toFixed(2);
}

module.exports = { generateInvoice };
