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

const Checkout = () => {
    const { items, cartTotal } = useCart();
    const navigate = useNavigate();
    const { checkout: placeOrder, loading: isCheckingOut } = useOrders();
    const { initiatePayment, loading: isCreatingPayment } = usePayment();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
    const { t, currentLanguage } = useLanguage();

    // Calculate total with COD fee if applicable
    const codFee = paymentMethod === "CashOnDelivery" ? COD_FEE : 0;
    const finalTotal = cartTotal + codFee;

    // Create schema with translated messages
    const checkoutSchema = z.object({
        firstName: z.string().min(2, t('checkout:validation.firstNameRequired')),
        lastName: z.string().min(2, t('checkout:validation.lastNameRequired')),
        email: z.string().email(t('checkout:validation.emailRequired')),
        phone: z.string().min(10, t('checkout:validation.phoneRequired')),
        address: z.string().min(5, t('checkout:validation.addressRequired')),
        city: z.string().min(2, t('checkout:validation.cityRequired')),
        zipCode: z.string().min(4, t('checkout:validation.zipCodeRequired')),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            // Step 1: Create the order with payment method
            const orderId = await placeOrder({
                ...data,
                paymentMethod: paymentMethod
            });
            if (!orderId) {
                return;
            }

            toast.success(t('checkout:messages.orderCreated'));

            // Step 2: Handle payment based on selected method
            if (paymentMethod === "CashOnDelivery") {
                // Cash on Delivery - redirect directly to confirmation
                toast.success(t('checkout:messages.codSuccess'));
                navigate(`/order/${orderId}/confirmation`);
            } else {
                // Card Payment - create payment session and redirect to Paymob
                toast.success(t('checkout:messages.preparingPayment'));

                const payment = await initiatePayment();
                if (!payment) {
                    toast.error(t('checkout:messages.paymentFailed'));
                    return;
                }

                // Navigate to payment processing page (intermediate page)
                navigate("/payment-processing", {
                    state: {
                        paymentUrl: payment.iframeUrl,
                        orderId: payment.orderId
                    }
                });
            }

        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || t('checkout:messages.checkoutFailed'));
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">{t('checkout:emptyCart.title')}</h2>
                    <p className="text-text-body mb-6">{t('checkout:emptyCart.message')}</p>
                    <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        {t('checkout:emptyCart.returnToShop')}
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
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>{t('checkout:title')}</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form */}
                    <div className="flex-1">
                        {/* Payment Method Selection */}
                        <div className="bg-card border border-border rounded-xl p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 border-b border-border pb-4">
                                {t('checkout:paymentMethod.title')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Card Payment Option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("Card")}
                                    className={`relative flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                                        paymentMethod === "Card"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === "Card" ? "border-primary" : "border-gray-300"
                                    }`}>
                                        {paymentMethod === "Card" && (
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left rtl:text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">{t('checkout:paymentMethod.card.title')}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{t('checkout:paymentMethod.card.description')}</p>
                                    </div>
                                    {paymentMethod === "Card" && (
                                        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                </button>

                                {/* Cash on Delivery Option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("CashOnDelivery")}
                                    className={`relative flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                                        paymentMethod === "CashOnDelivery"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === "CashOnDelivery" ? "border-primary" : "border-gray-300"
                                    }`}>
                                        {paymentMethod === "CashOnDelivery" && (
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left rtl:text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Banknote className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold">{t('checkout:paymentMethod.cod.title')}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{t('checkout:paymentMethod.cod.description')}</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Shipping Information Form */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                                <ShieldCheck className="text-primary w-5 h-5" /> {t('checkout:shippingInfo.title')}
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.firstName')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("firstName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.firstName ? "border-red-500" : "border-border"}`} />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.lastName')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("lastName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.lastName ? "border-red-500" : "border-border"}`} />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.email')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input type="email" {...register("email")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-border"}`} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.phone')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input type="tel" {...register("phone")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.phone ? "border-red-500" : "border-border"}`} />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.address')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                    <input {...register("address")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.address ? "border-red-500" : "border-border"}`} placeholder={t('checkout:shippingInfo.addressPlaceholder')} />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.city')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("city")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.city ? "border-red-500" : "border-border"}`} />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.zipCode')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
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
                            <h3 className="text-xl font-bold mb-4 border-b border-border pb-4 w-full">{t('checkout:orderDetails.title')}</h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded bg-surface-light border border-border shrink-0 overflow-hidden relative">
                                            <img src={item.imageUrl} alt={getLocalizedText(item.productName, item.productNameAr, currentLanguage)} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{getLocalizedText(item.productName, item.productNameAr, currentLanguage)}</p>
                                            {item.variantName && <p className="text-xs text-text-body">{item.variantName}</p>}
                                        </div>
                                        <div className="text-sm font-semibold shrink-0">{formatCurrency(item.totalPrice, currentLanguage)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 border-t border-border pt-4">
                                <div className="flex justify-between text-text-body">
                                    <span>{t('checkout:orderDetails.subtotal')}</span>
                                    <span className="font-semibold text-heading">{formatCurrency(cartTotal, currentLanguage)}</span>
                                </div>
                                <div className="flex justify-between text-text-body">
                                    <span>{t('checkout:orderDetails.shipping')}</span>
                                    <span className="font-semibold text-heading text-green-600">{t('checkout:orderDetails.shippingFree')}</span>
                                </div>
                                {paymentMethod === "CashOnDelivery" && (
                                    <div className="flex justify-between text-text-body">
                                        <span>{t('checkout:orderDetails.codFee')}</span>
                                        <span className="font-semibold text-heading">{formatCurrency(COD_FEE, currentLanguage)}</span>
                                    </div>
                                )}
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                    <span>{t('checkout:orderDetails.total')}</span>
                                    <span className="text-primary">{formatCurrency(finalTotal, currentLanguage)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting || isCheckingOut || isCreatingPayment}
                                className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSubmitting || isCheckingOut || isCreatingPayment
                                    ? t('checkout:buttons.processing')
                                    : paymentMethod === "CashOnDelivery"
                                        ? t('checkout:buttons.placeOrder')
                                        : t('checkout:buttons.proceedToPayment')
                                }
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span>
                                    {paymentMethod === "CashOnDelivery"
                                        ? t('checkout:security.codCheckout')
                                        : t('checkout:security.paymobCheckout')
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type PaymentMethod = "Card" | "CashOnDelivery"; // Updated to match backend

const COD_FEE = 10; // Cash on Delivery fee in EGP

const Checkout = () => {
    const { items, cartTotal } = useCart();
    const navigate = useNavigate();
    const { checkout: placeOrder, loading: isCheckingOut } = useOrders();
    const { initiatePayment, loading: isCreatingPayment } = usePayment();
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Card");
    const { t, currentLanguage } = useLanguage();

    // Calculate total with COD fee if applicable
    const codFee = paymentMethod === "CashOnDelivery" ? COD_FEE : 0;
    const finalTotal = cartTotal + codFee;

    // Create schema with translated messages
    const checkoutSchema = z.object({
        firstName: z.string().min(2, t('checkout:validation.firstNameRequired')),
        lastName: z.string().min(2, t('checkout:validation.lastNameRequired')),
        email: z.string().email(t('checkout:validation.emailRequired')),
        phone: z.string().min(10, t('checkout:validation.phoneRequired')),
        address: z.string().min(5, t('checkout:validation.addressRequired')),
        city: z.string().min(2, t('checkout:validation.cityRequired')),
        zipCode: z.string().min(4, t('checkout:validation.zipCodeRequired')),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            // Step 1: Create the order with payment method
            const orderId = await placeOrder({
                ...data,
                paymentMethod: paymentMethod
            });
            if (!orderId) {
                return;
            }

            toast.success(t('checkout:messages.orderCreated'));

            // Step 2: Handle payment based on selected method
            if (paymentMethod === "CashOnDelivery") {
                // Cash on Delivery - redirect directly to confirmation
                toast.success(t('checkout:messages.codSuccess'));
                navigate(`/order/${orderId}/confirmation`);
            } else {
                // Card Payment - create payment session and redirect to Paymob
                toast.success(t('checkout:messages.preparingPayment'));
                
                const payment = await initiatePayment();
                if (!payment) {
                    toast.error(t('checkout:messages.paymentFailed'));
                    return;
                }

                // Navigate to payment processing page (intermediate page)
                navigate("/payment-processing", {
                    state: {
                        paymentUrl: payment.iframeUrl,
                        orderId: payment.orderId
                    }
                });
            }
            
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || t('checkout:messages.checkoutFailed'));
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container mx-auto py-16 flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4">{t('checkout:emptyCart.title')}</h2>
                    <p className="text-text-body mb-6">{t('checkout:emptyCart.message')}</p>
                    <Link to="/shop" className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        {t('checkout:emptyCart.returnToShop')}
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
                <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: "'Quicksand', sans-serif" }}>{t('checkout:title')}</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Form */}
                    <div className="flex-1">
                        {/* Payment Method Selection */}
                        <div className="bg-card border border-border rounded-xl p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 border-b border-border pb-4">
                                {t('checkout:paymentMethod.title')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Card Payment Option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("Card")}
                                    className={`relative flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                                        paymentMethod === "Card"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === "Card" ? "border-primary" : "border-gray-300"
                                    }`}>
                                        {paymentMethod === "Card" && (
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left rtl:text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <span className="font-semibold">{t('checkout:paymentMethod.card.title')}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{t('checkout:paymentMethod.card.description')}</p>
                                    </div>
                                    {paymentMethod === "Card" && (
                                        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                    )}
                                </button>

                                {/* Cash on Delivery Option */}
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethod("CashOnDelivery")}
                                    className={`relative flex items-center gap-4 p-4 border-2 rounded-lg transition-all ${
                                        paymentMethod === "CashOnDelivery"
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        paymentMethod === "CashOnDelivery" ? "border-primary" : "border-gray-300"
                                    }`}>
                                        {paymentMethod === "CashOnDelivery" && (
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left rtl:text-right">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Banknote className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold">{t('checkout:paymentMethod.cod.title')}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{t('checkout:paymentMethod.cod.description')}</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Shipping Information Form */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4">
                                <ShieldCheck className="text-primary w-5 h-5" /> {t('checkout:shippingInfo.title')}
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.firstName')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("firstName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.firstName ? "border-red-500" : "border-border"}`} />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.lastName')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("lastName")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.lastName ? "border-red-500" : "border-border"}`} />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.email')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input type="email" {...register("email")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.email ? "border-red-500" : "border-border"}`} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.phone')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input type="tel" {...register("phone")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.phone ? "border-red-500" : "border-border"}`} />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.address')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                    <input {...register("address")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.address ? "border-red-500" : "border-border"}`} placeholder={t('checkout:shippingInfo.addressPlaceholder')} />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.city')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
                                        <input {...register("city")} className={`w-full border rounded-lg px-4 py-2.5 outline-none focus:border-primary ${errors.city ? "border-red-500" : "border-border"}`} />
                                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('checkout:shippingInfo.zipCode')} <span className="text-red-500">{t('checkout:shippingInfo.required')}</span></label>
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
                            <h3 className="text-xl font-bold mb-4 border-b border-border pb-4 w-full">{t('checkout:orderDetails.title')}</h3>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded bg-surface-light border border-border shrink-0 overflow-hidden relative">
                                            <img src={item.imageUrl} alt={getLocalizedText(item.productName, item.productNameAr, currentLanguage)} className="w-full h-full object-cover" />
                                            <span className="absolute -top-1 -right-1 rtl:-right-auto rtl:-left-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{getLocalizedText(item.productName, item.productNameAr, currentLanguage)}</p>
                                            {item.variantName && <p className="text-xs text-text-body">{item.variantName}</p>}
                                        </div>
                                        <div className="text-sm font-semibold shrink-0">{formatCurrency(item.totalPrice, currentLanguage)}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 border-t border-border pt-4">
                                <div className="flex justify-between text-text-body">
                                    <span>{t('checkout:orderDetails.subtotal')}</span>
                                    <span className="font-semibold text-heading">{formatCurrency(cartTotal, currentLanguage)}</span>
                                </div>
                                <div className="flex justify-between text-text-body">
                                    <span>{t('checkout:orderDetails.shipping')}</span>
                                    <span className="font-semibold text-heading text-green-600">{t('checkout:orderDetails.shippingFree')}</span>
                                </div>
                                {paymentMethod === "CashOnDelivery" && (
                                    <div className="flex justify-between text-text-body">
                                        <span>{t('checkout:orderDetails.codFee')}</span>
                                        <span className="font-semibold text-heading">{formatCurrency(COD_FEE, currentLanguage)}</span>
                                    </div>
                                )}
                                <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                    <span>{t('checkout:orderDetails.total')}</span>
                                    <span className="text-primary">{formatCurrency(finalTotal, currentLanguage)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting || isCheckingOut || isCreatingPayment}
                                className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {isSubmitting || isCheckingOut || isCreatingPayment 
                                    ? t('checkout:buttons.processing')
                                    : paymentMethod === "CashOnDelivery" 
                                        ? t('checkout:buttons.placeOrder')
                                        : t('checkout:buttons.proceedToPayment')
                                } 
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            
                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <ShieldCheck className="w-4 h-4" />
                                <span>
                                    {paymentMethod === "CashOnDelivery" 
                                        ? t('checkout:security.codCheckout')
                                        : t('checkout:security.paymobCheckout')
                                    }
                                </span>
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
