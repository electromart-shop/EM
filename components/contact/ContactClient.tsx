"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { sendContactEmail } from "@/lib/email";

// ─── Validation Helpers ───────────────────────────────────────────────────────

function validateEmail(email: string): string {
  if (!email.trim()) return "Email address is required.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email.trim())) return "Please enter a valid email address (e.g. you@example.com).";
  return "";
}

function validatePhone(phone: string): string {
  if (!phone.trim()) return "Mobile number is required.";
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return "Mobile number must be exactly 10 digits.";
  if (!/^[6-9]/.test(digits)) return "Please enter a valid Indian mobile number.";
  return "";
}

function validateName(name: string): string {
  if (!name.trim()) return "Full name is required.";
  if (name.trim().length < 2) return "Name must be at least 2 characters.";
  return "";
}

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "phone":
        return validatePhone(value);
      case "subject":
        return !value.trim() ? "Subject is required." : value.trim().length < 3 ? "Subject must be at least 3 characters." : "";
      case "message":
        return !value.trim() ? "Message is required." : value.trim().length < 10 ? "Message must be at least 10 characters." : "";
      default:
        return "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate all fields
    const fields = ["name", "email", "phone", "subject", "message"] as const;
    const newTouched: Record<string, boolean> = {};
    const newErrors: FormErrors = {};

    fields.forEach((field) => {
      newTouched[field] = true;
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setTouched((prev) => ({ ...prev, ...newTouched }));
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorEl = document.querySelector("[data-field-error]");
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Primary attempt using dedicated template
      await sendContactEmail(formData, "template_contact");
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTouched({});
    } catch (error) {
      console.warn("Failed sending with template_contact, trying fallback template_1p14e02...", error);
      try {
        // Fallback: try shop template (which we know exists and is valid)
        await sendContactEmail(formData, "template_1p14e02");
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        setTouched({});
      } catch (fallbackError) {
        console.error("All email attempts failed:", fallbackError);
        setSubmitError("There was an error sending your message. Please try again or message us directly on WhatsApp.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Hero */}
      <section className="relative bg-brand-black text-white py-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-brand-orange/20 blur-[100px] opacity-40"></div>
          <div className="absolute -bottom-1/2 -left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[80px] opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Contact <span className="text-brand-orange">Us</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg">
            Have questions about components, custom orders, or bulk purchases? Reach out to us. We are here to support your engineering journey.
          </p>
          <div className="w-20 h-1 bg-brand-orange mx-auto rounded-full mt-6"></div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left: Contact Info cards */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              {/* Address Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Our Location</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Gandhipuram, Coimbatore,<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Call / WhatsApp</h3>
                  <a
                    href="tel:+916381601900"
                    className="text-gray-600 hover:text-brand-orange text-sm font-semibold transition-colors block"
                  >
                    +91 63816 01900
                  </a>
                  <p className="text-gray-400 text-xs mt-1">Available for student queries</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                  <a
                    href="mailto:electromart.cbe@gmail.com"
                    className="text-gray-600 hover:text-brand-orange text-sm font-semibold transition-colors block break-all"
                  >
                    electromart.cbe@gmail.com
                  </a>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 hover:border-brand-orange/30 transition-all duration-300">
                <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-600 text-sm font-medium">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-400 text-xs mt-0.5">Closed on Sundays & Public Holidays</p>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl pointer-events-none"></div>
                
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-6">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Sent Successfully!</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Thank you for contacting ELECTROMART. We have received your query and our team will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-brand-orange hover:bg-[#ff943d] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h2>
                    <p className="text-gray-500 text-sm mb-8">
                      Fill out the form below and we will get back to you within 24 hours.
                    </p>

                    {submitError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                        <AlertTriangle className="shrink-0 mt-0.5 text-red-500" size={18} />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all ${
                            errors.name && touched.name ? "border-red-400 bg-red-50/50" : "border-gray-300"
                          }`}
                          placeholder="Your name"
                        />
                        {errors.name && touched.name && (
                          <p data-field-error className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle size={13} /> {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email and Phone Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all ${
                              errors.email && touched.email ? "border-red-400 bg-red-50/50" : "border-gray-300"
                            }`}
                            placeholder="you@example.com"
                          />
                          {errors.email && touched.email && (
                            <p data-field-error className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle size={13} /> {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                            Phone Number <span className="text-red-500">*</span>
                            <span className="text-gray-400 font-normal text-xs ml-1">(10 digits)</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            autoComplete="tel"
                            maxLength={10}
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all ${
                              errors.phone && touched.phone ? "border-red-400 bg-red-50/50" : "border-gray-300"
                            }`}
                            placeholder="9876543210"
                            inputMode="numeric"
                          />
                          <div className="flex justify-between mt-1">
                            {errors.phone && touched.phone ? (
                              <p data-field-error className="text-xs text-red-600 flex items-center gap-1">
                                <AlertCircle size={13} /> {errors.phone}
                              </p>
                            ) : (
                              <span />
                            )}
                            <span className={`text-xs ${formData.phone.replace(/\D/g, "").length === 10 ? "text-green-600 font-semibold" : "text-gray-400"}`}>
                              {formData.phone.replace(/\D/g, "").length}/10
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all ${
                            errors.subject && touched.subject ? "border-red-400 bg-red-50/50" : "border-gray-300"
                          }`}
                          placeholder="How can we help you?"
                        />
                        {errors.subject && touched.subject && (
                          <p data-field-error className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle size={13} /> {errors.subject}
                          </p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          value={formData.message}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all resize-none ${
                            errors.message && touched.message ? "border-red-400 bg-red-50/50" : "border-gray-300"
                          }`}
                          placeholder="Write your message details here..."
                        />
                        {errors.message && touched.message && (
                          <p data-field-error className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                            <AlertCircle size={13} /> {errors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-brand-orange hover:bg-[#ff943d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange disabled:opacity-75 transition-all mt-6 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 px-4 pt-2 pb-4">Our Business Location</h2>
            <div className="w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden relative border border-gray-100">
              <iframe
                title="Google Map location of Electromart at Gandhipuram, Coimbatore"
                src="https://maps.google.com/maps?q=Gandhipuram,%20Coimbatore,%20Tamil%20Nadu,%20India&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
