import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { usePayment } from "@/hooks/usePayment";

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

const Checkout = () => {
    const { items, cartTotal } = useCart();
    const navigate = useNavigate();
    const { checkout: placeOrder, loading: isCheckingOut } = useOrders();
    const { initiatePayment, loading: isCreatingPayment } = usePayment();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            // Step 1: Create the order
            const orderId = await placeOrder(data);
            if (!orderId) {
                return;
            }

            toast.success("Order created! Preparing payment...");

            // Step 2: Create payment session
            const payment = await initiatePayment();
            if (!payment) {
                toast.error("Failed to initialize payment. Please try again.");
                return;
            }

            // Step 3: Navigate to payment processing page (intermediate page)
            navigate("/payment-processing", {
                state: {
                    paymentUrl: payment.iframeUrl,
                    orderId: payment.orderId
                }
            });
            
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to process checkout. Please try again.");
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">Checkout not available.</h2>
                    <p className="text-text-body mb-6">Your cart is empty. Please add items before checking out.</p>
                    <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        Return to Shop
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1 container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>Secure Checkout</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form */}
                    <div className="flex-1">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                                <ShieldCheck className="text-primary w-5 h-5" /> Shipping Information
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">First Name <span className="text-red-500">*</span></label>
                                        <input {...register("firstName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.firstName ? "border-red-500" : "border-border"}`} />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Last Name <span className="text-red-500">*</span></label>
                                        <input {...register("lastName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.lastName ? "border-red-500" : "border-border"}`} />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email Address <span className="text-red-500">*</span></label>
                                        <input type="email" {...register("email")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-border"}`} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Phone Number <span className="text-red-500">*</span></label>
                                        <input type="tel" {...register("phone")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.phone ? "border-red-500" : "border-border"}`} />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Street Address <span className="text-red-500">*</span></label>
                                    <input {...register("address")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.address ? "border-red-500" : "border-border"}`} placeholder="House number and street name" />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Town / City <span className="text-red-500">*</span></label>
                                        <input {...register("city")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.city ? "border-red-500" : "border-border"}`} />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Zip Code <span className="text-red-500">*</span></label>
                                        <input {...register("zipCode")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.zipCode ? "border-red-500" : "border-border"}`} />
                                        {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="bg-card border-2 border-primary/20 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4 border-b border-border pb-4 w-full">Order Details</h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded bg-surface-light border border-border shrink-0 overflow-hidden relative">
                                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{item.productName}</p>
                                            {item.variantName && <p className="text-xs text-text-body">{item.variantName}</p>}
                                        </div>
                                        <div className="text-sm font-semibold shrink-0">${item.totalPrice.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 border-t border-border pt-4">
                                <div className="flex justify-between text-text-body">
                                    <span>Subtotal</span>
                                    <span className="font-semibold text-heading">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-body">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-heading text-green-600">Free</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting || isCheckingOut || isCreatingPayment}
                                className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSubmitting || isCheckingOut || isCreatingPayment ? "Processing..." : "Proceed to Payment"} <ArrowRight className="w-4 h-4" />
                            </button>
                            
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Secure payment powered by Paymob</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Checkout;
