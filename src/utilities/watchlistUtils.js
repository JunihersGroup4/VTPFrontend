import { addToWatchlist } from "../api/watchlist";

export const handleAddToWatchlist = async (symbol) => {
  try {
    const response = await addToWatchlist(symbol);
    alert(response.message);
  } catch (error) {
    console.error("Error adding stock to watchlist:", error);
  }
};
