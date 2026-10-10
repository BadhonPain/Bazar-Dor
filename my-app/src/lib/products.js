import { cacheLife } from "next/cache";

const productEndpoints = [
    "https://api.abcz.workers.dev/api/bazardor/products",
    "https://api.api-store.workers.dev/api/bazardor/products",
];

function validateProducts(products) {
    if (!Array.isArray(products)) {
        throw new TypeError("The products API response was not a list.");
    }

    return products.map((product, index) => {
        if (
            !product ||
            typeof product.slug !== "string" ||
            typeof product.nameBn !== "string" ||
            typeof product.category !== "string" ||
            typeof product.unit !== "string" ||
            typeof product.image !== "string" ||
            !Number.isFinite(product.today) ||
            !product.change ||
            !["up", "down", "flat"].includes(product.change.dir) ||
            !Number.isFinite(product.change.pct)
        ) {
            throw new TypeError(`The products API returned an invalid product at index ${index}.`);
        }

        return product;
    });
}

async function loadProducts() {
    "use cache";
    cacheLife("minutes");

    let lastError;

    for (let index = 0; index < productEndpoints.length; index += 1) {
        try {
            const response = await fetch(productEndpoints[index], {
                cache: "no-store",
                signal: AbortSignal.timeout(10000),
            });

            if (!response.ok) {
                throw new Error(`Products API returned HTTP ${response.status}.`);
            }

            const products = validateProducts(await response.json());

            if (index > 0) {
                const reason =
                    lastError instanceof Error ? lastError.message : String(lastError);
                console.warn(`Preferred products API unavailable; loaded backup data. ${reason}`);
            }

            return products;
        } catch (error) {
            lastError = error;
        }
    }

    throw new Error("Unable to load product data from either market API.", {
        cause: lastError,
    });
}

export function getProducts() {
    return loadProducts();
}
