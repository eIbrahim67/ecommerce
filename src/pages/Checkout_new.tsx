import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight, CreditCard, Banknote } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { formatCurrency } from "@/i18n/formatters";
import { getLocalizedText } from "@/utils/localization";

const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City is required"),
    zipCode: z.string().min(4, "Valid zip code is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type PaymentMethod = "Card" | "CashOnDelivery";

const COD_FEE = 10; // Cash on Delivery fee in EGP

const Checkout = () => {