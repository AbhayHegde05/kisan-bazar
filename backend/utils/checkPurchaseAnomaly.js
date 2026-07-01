/**
 * Checks for purchase anomalies to detect potential hoarding or fraud.
 * @param {number} quantity - The quantity of the product being purchased.
 * @param {string} productType - The type/category of the product (e.g., "Grains", "Vegetables").
 * @returns {object} - Returns { isSafe: boolean, message: string }
 */
const checkPurchaseAnomaly = (quantity, productType) => {
    const HOARDING_LIMIT_KG = 100;

    // Convert string quantity to number just in case
    const qty = Number(quantity);

    if (isNaN(qty)) {
        return {
            isSafe: false,
            message: "Invalid quantity provided."
        };
    }

    if (qty > HOARDING_LIMIT_KG) {
        return {
            isSafe: false,
            message: `Suspicious/Hoarding Risk: Purchase quantity of ${qty} units for ${productType} exceeds the limit of ${HOARDING_LIMIT_KG} units.`
        };
    }

    return {
        isSafe: true,
        message: "Transaction is safe."
    };
};

module.exports = { checkPurchaseAnomaly };
