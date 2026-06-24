"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Save, Search, ImageIcon, Check, X, AlertCircle,
  Loader2, RefreshCw, Package, ShieldAlert, Tag, DollarSign, FileText, Layers
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FetchedImage {
  url: string;
  selected: boolean;
}

type FormData = {
  name: string;
  category: string;
  price: string;
  description: string;
};

type FormErrors = {
  name?: string;
  category?: string;
  price?: string;
};

// ─── Validation ───────────────────────────────────────────────────────────────
function validateForm(data: FormData): FormErrors {
  const errs: FormErrors = {};
  if (!data.name.trim()) errs.name = "Product name is required.";
  if (!data.category.trim()) errs.category = "Category is required.";
  const p = parseFloat(data.price);
  if (!data.price || isNaN(p) || p <= 0) errs.price = "Enter a valid price greater than 0.";
  return errs;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);

  useEffect(() => {
    const host = window.location.hostname;
    setIsLocalhost(host === "localhost" || host === "127.0.0.1" || host === "::1");
  }, []);

  if (isLocalhost === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-orange" size={40} />
      </div>
    );
  }

  if (!isLocalhost) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShieldAlert size={64} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-white mb-3">Access Restricted</h1>
          <p className="text-gray-400 mb-8">
            The Admin Panel is only accessible from <span className="text-brand-orange font-semibold">localhost</span> during local development. It is not available on the public site.
          </p>
          <a href="/" className="inline-flex items-center px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:bg-[#ff943d] transition-colors">
            ← Back to Site
          </a>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
}

// ─── Admin Panel (only rendered on localhost) ─────────────────────────────────
function AdminPanel() {
  const [form, setForm] = useState<FormData>({
    name: "", category: "", price: "", description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Image fetching state
  const [imageQuery, setImageQuery] = useState("");
  const [fetchedImages, setFetchedImages] = useState<FetchedImage[]>([]);
  const [imageFetchStatus, setImageFetchStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [imageFetchError, setImageFetchError] = useState("");

  // Submit state
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedImages = fetchedImages.filter((i) => i.selected).map((i) => i.url);

  // Auto-update imageQuery from product name
  useEffect(() => {
    if (form.name.trim()) {
      setImageQuery(form.name.trim() + " electronic component");
    }
  }, [form.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validateForm({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: errs[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validateForm(form);
    setErrors((prev) => ({ ...prev, [name]: errs[name as keyof FormErrors] }));
  };

  // Fetch images from DuckDuckGo via internal API
  const fetchImages = useCallback(async () => {
    if (!imageQuery.trim()) return;
    setImageFetchStatus("loading");
    setImageFetchError("");
    setFetchedImages([]);
    try {
      const res = await fetch(`/api/images?q=${encodeURIComponent(imageQuery)}`);
      const data = await res.json();
      const imgs: FetchedImage[] = (data.images || [])
        .filter((url: string) => url && url.startsWith("http"))
        .map((url: string, i: number) => ({ url, selected: i < 2 })); // auto-select first 2
      setFetchedImages(imgs);
      setImageFetchStatus("done");
    } catch {
      setImageFetchError("Failed to fetch images. Check your network or try again.");
      setImageFetchStatus("error");
    }
  }, [imageQuery]);

  const toggleImage = (url: string) => {
    setFetchedImages((prev) =>
      prev.map((img) => {
        if (img.url !== url) return img;
        if (img.selected) return { ...img, selected: false };
        if (selectedImages.length >= 4) return img; // max 4
        return { ...img, selected: true };
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = { name: true, category: true, price: true };
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitStatus("loading");
    setSubmitMessage("");
    try {
      const res = await fetch("/api/admin/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: parseFloat(form.price), images: selectedImages }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");
      setSubmitStatus("success");
      setSubmitMessage(`✅ Product "${data.product.name}" added successfully!`);
      // Reset form
      setForm({ name: "", category: "", price: "", description: "" });
      setFetchedImages([]);
      setImageQuery("");
      setTouched({});
      setErrors({});
    } catch (err: any) {
      setSubmitStatus("error");
      setSubmitMessage(`❌ Error: ${err.message}`);
    }
  };

  const CATEGORIES = [
    "Microcontrollers", "Sensors", "Modules", "Resistors", "Capacitors",
    "Transistors", "ICs", "Displays", "Motors", "Power", "Wires & Cables",
    "Tools", "Kits", "Other"
  ];

  const FieldError = ({ field }: { field: keyof FormErrors }) =>
    errors[field] && touched[field] ? (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle size={11} /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-black text-white py-6 px-4 md:px-8 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center">
            <Package size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">ELECTROMART Admin</h1>
            <p className="text-gray-400 text-sm">Local Development Panel · Add New Products</p>
          </div>
          <span className="ml-auto bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
            🔒 Localhost Only
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Status Banner */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-xl font-medium text-sm flex items-center gap-3 ${submitStatus === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {submitStatus === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            {submitMessage}
            <button onClick={() => setSubmitMessage("")} className="ml-auto text-gray-500 hover:text-gray-700"><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Product Details */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={20} className="text-brand-orange" /> Product Details
                </h2>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Arduino Uno R3"
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-orange transition-all ${errors.name && touched.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-orange"}`}
                  />
                  <FieldError field="name" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Layers size={14} className="inline mr-1" />Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-orange transition-all bg-white ${errors.category && touched.category ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-orange"}`}
                  >
                    <option value="">-- Select a category --</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <FieldError field="category" />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <DollarSign size={14} className="inline mr-1" />Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 299"
                    min="0"
                    step="0.01"
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-brand-orange transition-all ${errors.price && touched.price ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-orange"}`}
                  />
                  <FieldError field="price" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Brief product description..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white font-bold text-base rounded-xl hover:bg-[#ff943d] disabled:opacity-60 transition-all shadow-lg shadow-brand-orange/30"
              >
                {submitStatus === "loading" ? (
                  <><Loader2 size={20} className="animate-spin" /> Adding Product...</>
                ) : (
                  <><Plus size={20} /> Add Product to Catalog</>
                )}
              </button>
            </div>

            {/* Right Column: Image Fetcher */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon size={20} className="text-brand-orange" /> Image Fetcher
                <span className="ml-auto text-xs text-gray-400 font-normal">Powered by DuckDuckGo</span>
              </h2>

              {/* Query Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageQuery}
                  onChange={(e) => setImageQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); fetchImages(); } }}
                  placeholder="Search term (auto-filled from name)"
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={fetchImages}
                  disabled={imageFetchStatus === "loading" || !imageQuery.trim()}
                  className="px-4 py-2.5 bg-brand-black text-white rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
                >
                  {imageFetchStatus === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  Fetch
                </button>
              </div>

              {imageFetchError && (
                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                  <AlertCircle size={13} /> {imageFetchError}
                </p>
              )}

              {/* Selected count */}
              {fetchedImages.length > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    Click to select up to <strong>4 images</strong>. First 2 are auto-selected.
                  </p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedImages.length > 0 ? "bg-brand-orange/10 text-brand-orange" : "bg-gray-100 text-gray-500"}`}>
                    {selectedImages.length}/4 selected
                  </span>
                </div>
              )}

              {/* Image Grid */}
              {imageFetchStatus === "loading" && (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <Loader2 size={32} className="animate-spin mr-3" /> Fetching images…
                </div>
              )}

              {imageFetchStatus === "done" && fetchedImages.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <ImageIcon size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No images found. Try a different search term.</p>
                </div>
              )}

              {fetchedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {fetchedImages.map((img, idx) => {
                    const isAutoSelected = idx < 2 && img.selected;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleImage(img.url)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${img.selected
                          ? isAutoSelected
                            ? "border-green-500 ring-2 ring-green-200 scale-[0.97]"
                            : "border-brand-orange ring-2 ring-brand-orange/20 scale-[0.97]"
                          : "border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={`Option ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover bg-gray-100"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                        {img.selected && (
                          <div className={`absolute inset-0 flex items-end justify-end p-1 ${isAutoSelected ? "bg-green-500/20" : "bg-brand-orange/20"}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isAutoSelected ? "bg-green-500" : "bg-brand-orange"}`}>
                              <Check size={11} className="text-white" strokeWidth={3} />
                            </div>
                          </div>
                        )}
                        {idx < 2 && !img.selected && (
                          <div className="absolute top-1 left-1">
                            <span className="bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">AUTO</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {imageFetchStatus === "idle" && fetchedImages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <ImageIcon size={40} className="mb-3 opacity-40" />
                  <p className="text-sm font-medium">Enter a product name and click <strong>Fetch</strong></p>
                  <p className="text-xs text-gray-400 mt-1">Images are fetched from DuckDuckGo image search</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
