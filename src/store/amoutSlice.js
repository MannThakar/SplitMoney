
import { createSlice } from "@reduxjs/toolkit";


const intialState = [];


const AmountSlice = createSlice({
    name: "amount",
    initialState: intialState,
    reducers: {
        addAmount: (state, action) => {
            state.push(action.payload);
        },
        removeAmount: (state, action) => {
            return state.filter((amount) => amount.id !== action.payload);
        },
        updateAmount: (state, action) => {
            const { id, description, amount, date } = action.payload;
            const existingAmount = state.find((amount) => amount.id === id);
            if (existingAmount) {
                existingAmount.description = description;
                existingAmount.amount = amount;
                existingAmount.date = date;
            }
        }
    }
});

export const { addAmount, removeAmount, updateAmount } = AmountSlice.actions;

export default AmountSlice.reducer;