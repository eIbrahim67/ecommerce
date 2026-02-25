import axios from 'axios';
import { products, categories, dealProducts } from './src/data/products.ts';

const API_BASE_URL = "https://nestmart.runasp.net/api/v1";

async function seed() {
    let token = "";
    try {
        const res = await axios.post(`${API_BASE_URL}/auth/register`, {
            firstName: "System",
            lastName: "Admin",
            email: "admin@nestmart.com",
            password: "Password123!"
        });
        token = res.data.data?.token || res.data.token || "";
        console.log("Registered Admin user.");
    } catch (e: any) {
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
                email: "admin@nestmart.com",
                password: "Password123!"
            });
            token = res.data.data?.token || res.data.token || "";
            console.log("Logged in as Admin user.");
        } catch (err: any) {
            console.error("Auth failed", err?.response?.data || err.message);
        }
    }

    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    const categoryMap = new Map<string, number>();

    console.log("Fetching existing categories...");
    try {
        const res = await api.get('/categories');
        const cats = res.data.data || res.data || [];
        for (const cat of cats) {
            categoryMap.set(cat.name, cat.id);
        }
    } catch (e) { }

    console.log("Seeding Categories...");
    for (const cat of categories) {
        if (categoryMap.has(cat.name)) {
            console.log(`Category ${cat.name} already exists.`);
            continue;
        }
        try {
            const res = await api.post('/categories', { name: cat.name, icon: cat.icon });
            console.log(`Created category ${cat.name}`);
            categoryMap.set(cat.name, res.data.data?.id || res.data?.id);
        } catch (e: any) {
            console.error(`Failed to create category ${cat.name}`, e?.response?.data || e.message);
        }
    }

    // Refetch categories to ensure we have all IDs
    try {
        const res = await api.get('/categories');
        const cats = res.data.data || res.data || [];
        for (const cat of cats) {
            categoryMap.set(cat.name, cat.id);
        }
    } catch (e) { }

    console.log("Seeding Products...");
    const allProducts = [...products, ...dealProducts];
    for (const prod of allProducts) {
        try {
            let categoryId = categoryMap.get(prod.category);
            if (!categoryId) {
                const catKeys = Array.from(categoryMap.keys());
                categoryId = categoryMap.has(catKeys[0]) ? categoryMap.get(catKeys[0]) : 1;
            }

            const payload = {
                name: prod.name,
                brand: prod.brand,
                categoryId: categoryId,
                basePrice: prod.oldPrice || prod.price,
                oldPrice: prod.oldPrice || prod.price,
                currentPrice: prod.price,
                discountPercentage: prod.discountPercent || 0,
                imageUrls: [prod.image],
                isNew: prod.badge === 'new',
                isSale: prod.badge === 'sale' || prod.badge === 'hot' || prod.badge === 'discount',
                description: prod.description || "High quality organic product.",
                stockQuantity: 100,
                sku: "SKU-" + prod.id,
                tags: [prod.category],
                variants: []
            };

            const res = await api.post('/products', payload);
            console.log(`Created product ${prod.name}`);
        } catch (e: any) {
            console.error(`Failed to create product ${prod.name}`, e?.response?.data || e.message);
        }
    }
}

seed();
