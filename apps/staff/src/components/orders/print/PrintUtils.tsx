import type { OrderWithDetails } from "@/types/orders";

export const printFullOrder = (order: OrderWithDetails) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const docketContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Order Docket - ORD${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-width: 300px;
            margin: 0;
            padding: 10px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .order-info {
            margin-bottom: 15px;
          }
          .items {
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .total {
            font-weight: bold;
            font-size: 14px;
            text-align: right;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>RESTAURANT ORDER</h2>
          <p>Order #ORD${order.orderNumber}</p>
        </div>
        <div class="order-info">
          <p><strong>Table:</strong> ${order.table ? `Table ${order.table.number}` : "Pickup Order"}</p>
          <p><strong>Time:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        </div>
        <div class="items">
          <h3>Items:</h3>
          ${order.items
            .map((item) => {
              const itemPrice = item.variety
                ? item.variety.price
                : item.menuItem.price;
              const totalPrice = itemPrice * item.quantity;
              const itemName = item.variety
                ? `${item.menuItem.name} (${item.variety.name})`
                : item.menuItem.name;
              return `
              <div class="item">
                <span>${item.quantity}x ${itemName}</span>
                <span>₦${totalPrice.toLocaleString()}</span>
              </div>
            `;
            })
            .join("")}
        </div>
        <div class="total">
          TOTAL: ₦${order.totalAmount ? order.totalAmount.toLocaleString() : "0"}
        </div>
        ${
          order.specialNotes
            ? `
        <div class="notes">
          <h3>Special Notes:</h3>
          <p>${order.specialNotes}</p>
        </div>
        `
            : ""
        }
        <div class="footer">
          <p>Thank you for your order!</p>
          <p>Printed: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(docketContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};

interface Staff {
  assignedServicePoints?: Array<{
    servicePoint?: {
      name: string;
    };
  }>;
}

export const printServicePointItems = (
  order: OrderWithDetails,
  staff: Staff,
  onClose?: () => void,
) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Filter items that the operator can manage
  const manageableItems = order.items.filter((item) => item.isMyItem);
  const manageableTotal = manageableItems.reduce((total, item) => {
    const itemPrice = item.variety ? item.variety.price : item.menuItem.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const docketContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Service Point Docket - ORD${order.orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-width: 300px;
            margin: 0;
            padding: 10px;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .order-info {
            margin-bottom: 15px;
          }
          .items {
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .total {
            font-weight: bold;
            font-size: 14px;
            text-align: right;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 10px;
          }
          .service-point {
            background-color: #f0f9ff;
            padding: 5px;
            margin-bottom: 10px;
            border-radius: 3px;
            text-align: center;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>SERVICE POINT DOCKET</h2>
          <p>Order #ORD${order.orderNumber}</p>
        </div>
        <div class="service-point">
          ${staff.assignedServicePoints?.[0]?.servicePoint?.name || "Service Point"} Items
        </div>
        <div class="order-info">
          <p><strong>Table:</strong> ${order.table ? `Table ${order.table.number}` : "Pickup Order"}</p>
          <p><strong>Time:</strong> ${order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
          <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        </div>
        <div class="items">
          <h3>Your Items:</h3>
          ${manageableItems
            .map((item) => {
              const itemPrice = item.variety
                ? item.variety.price
                : item.menuItem.price;
              const totalPrice = itemPrice * item.quantity;
              const itemName = item.variety
                ? `${item.menuItem.name} (${item.variety.name})`
                : item.menuItem.name;
              return `
              <div class="item">
                <span>${item.quantity}x ${itemName}</span>
                <span>₦${totalPrice.toLocaleString()}</span>
              </div>
            `;
            })
            .join("")}
        </div>
        <div class="total">
          SUBTOTAL: ₦${manageableTotal.toLocaleString()}
        </div>
        <div class="footer">
          <p>Service Point Items Only</p>
          <p>Printed: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(docketContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();

  if (onClose) {
    onClose();
  }
};
