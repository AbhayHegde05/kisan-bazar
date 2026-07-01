import React from "react";

const CardPaymentForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="cardNumber"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          className="form-input pl-3"
          placeholder="**** **** **** ****"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="expiryDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Expiry Date
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            className="form-input pl-3"
            placeholder="MM/YY"
            required
          />
        </div>
        <div>
          <label
            htmlFor="cvc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            CVC
          </label>
          <input
            type="text"
            id="cvc"
            name="cvc"
            className="form-input pl-3"
            placeholder="***"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default CardPaymentForm;
