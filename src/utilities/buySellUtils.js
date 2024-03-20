import { updateBalance } from '../api/updateBalance';

export const handleBuy = async ({ userId, userBalance, buyQuantity, selectedStockSymbol, currentPrice, setUserBalance, handleBuyDialogClose }) => {
  const totalCost = buyQuantity * currentPrice;

  if (Number(userBalance) < totalCost) {
    alert('Insufficient balance');
    handleBuyDialogClose();
    return;
  }

  const balanceData = {
    user: {
      id: userId,
    },
    current_Balance: Number(userBalance) - Number(totalCost),
  };

  try {
    const data = await updateBalance(balanceData);
    if (data) {
      setUserBalance(Number(userBalance) - Number(totalCost));
    } else {
      console.error('Failed to update user balance');
    }
  } catch (error) {
    console.error('Error updating user balance:', error);
  }

  alert(`Your current balance is ${Number(userBalance) - Number(totalCost)}. You have bought ${buyQuantity} stocks of ${selectedStockSymbol} at a price of ${currentPrice} INR each for a total cost of ${totalCost} INR.`);
  handleBuyDialogClose();
  window.location.reload();
};

export const handleSell = async ({ userId, userBalance, sellQuantity, selectedStockSymbol, currentPrice, setUserBalance, handleSellDialogClose }) => {
    const totalCost = sellQuantity * currentPrice;

    const balanceData = {
        user: {
            id: userId,
        },
        current_Balance: Number(userBalance) + Number(totalCost),
    };

    try {
        const data = await updateBalance(balanceData);
        if (data) {
            setUserBalance(Number(userBalance) + Number(totalCost));
        } else {
            console.error('Failed to update user balance');
        }
    } catch (error) {
        console.error('Error updating user balance:', error);
    }

    alert(`Your current balance is ${Number(userBalance) + Number(totalCost)}. You have sold ${sellQuantity} stocks of ${selectedStockSymbol} at a price of ${currentPrice} INR each for a total cost of ${totalCost} INR.`);
    handleSellDialogClose();
    window.location.reload();
};