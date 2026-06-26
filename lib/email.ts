import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const serviceId = "service_036p77h";
const publicKey = "o1vJgnVoz5Yw8jKrH";

/* =========================
   GENERATE ORDER ROWS
========================= */
export const generateOrderRows = (cartItems: any[]) => {
  return cartItems.map((item, index) => `
    <tr style="background:${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
      <td align="center" style="padding:12px;border-bottom:1px solid #e2e8f0;">
        ${index + 1}
      </td>

      <td style="padding:12px;border-bottom:1px solid #e2e8f0;">
        <strong>${item.name}</strong>
      </td>

      <td align="center" style="padding:12px;border-bottom:1px solid #e2e8f0;">
        ${item.quantity}
      </td>

      <td align="right" style="padding:12px;border-bottom:1px solid #e2e8f0;">
        ₹${item.price.toLocaleString("en-IN")}
      </td>
    </tr>
  `).join("");
};

/* =========================
   CUSTOMER EMAIL
========================= */
export const sendCustomerEmail = async (
  formData: FormData,
  cart: any[],
  cartTotal: number
) => {
  const templateParams = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    customer_address: formData.address,

    // IMPORTANT
    order_rows: generateOrderRows(cart),

    total_price: `₹${cartTotal.toLocaleString("en-IN")}`,

    order_notes: formData.notes?.trim()
      ? formData.notes
      : "No additional notes",
  };

  const templateId = "template_xf1iqgj";

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log("Customer email sent ✅");
    return response;
  } catch (error) {
    console.error("Customer Email Error ❌", error);
    throw error;
  }
};

/* =========================
   SHOP EMAIL
========================= */
export const sendShopEmail = async (
  formData: FormData,
  cart: any[],
  cartTotal: number
) => {
  const templateParams = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    customer_address: formData.address,

    // IMPORTANT
    order_rows: generateOrderRows(cart),

    total_price: `₹${cartTotal.toLocaleString("en-IN")}`,

    order_notes: formData.notes?.trim()
      ? formData.notes
      : "No additional notes",

    shop_email: "electromart.cbe@gmail.com",
  };

  const templateId = "template_1p14e02";

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log("Shop email sent ✅");
    return response;
  } catch (error) {
    console.error("Shop Email Error ❌", error);
    throw error;
  }
};

/* =========================
   CONTACT EMAIL
========================= */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (
  formData: ContactFormData,
  templateId: string = "template_contact"
) => {
  const templateParams = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    customer_address: `Subject: ${formData.subject}`,

    // Compatibility formatting for shop templates
    order_rows: `<p style="font-size:14px;line-height:1.6;color:#1e293b;">${formData.message.replace(/\n/g, "<br/>")}</p>`,
    total_price: "Contact Query",
    order_notes: formData.message,

    // General fields for dedicated contact templates
    from_name: formData.name,
    from_email: formData.email,
    from_phone: formData.phone,
    subject: formData.subject,
    message: formData.message,

    shop_email: "electromart.cbe@gmail.com",
  };

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log("Contact email sent ✅");
    return response;
  } catch (error) {
    console.error("Contact Email Error ❌", error);
    throw error;
  }
};