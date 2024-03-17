import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  TextField
} from '@mui/material';

const Watchlist = () => {
  const { userId } = useParams();
  const [watchlist, setWatchlist] = useState([]);
  const [symbol, setSymbol] = useState('');

  const fetchWatchlist = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/watchlist/get?userId=${userId}`);
      setWatchlist(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }, [userId]);

  useEffect(() => {
    fetchWatchlist();
    const intervalId = setInterval(fetchWatchlist, 150000);
    return () => clearInterval(intervalId);
  }, [fetchWatchlist]);

  const removeFromWatchlist = async (itemId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to remove this item from the watchlist?');

      if (!confirmed) {
        return;
      }

      await axios.delete(`http://localhost:5000/api/watchlist/remove?itemId=${itemId}`);
      alert('Item removed from watchlist!');
      fetchWatchlist();
    } catch (error) {
      console.error('Error removing item from watchlist:', error);
    }
  };

  const stockPurchase = async (itemId) => {
    
  };

  const handleAddToWatchlist = async () => {
    try {
      await axios.post(`http://localhost:5000/api/watchlist/add`, {
        userId,
        symbol,
      });
      alert('Stock added to watchlist!');
      setSymbol('');
      fetchWatchlist();
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
    }
  };

  return (
    <div>
      <TopNavBar />
      <Box mt={8} display="flex" justifyContent="center">
        <Typography variant="h4">User's Watchlist</Typography>
      </Box>
      <Box mt={8} display="flex" justifyContent="flex-end" position="absolute" top={0} right={0} p={2}>
        <TextField
          label="Enter Symbol"
          variant="outlined"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddToWatchlist} sx={{ ml: 2 }}>
          Add to Watchlist
        </Button>
      </Box>
      <Box mt={10} display="flex" justifyContent="center">
        {watchlist.length > 0 ? (
          <TableContainer component={Paper} sx={{ width: '80%' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Company Details</TableCell>
                  <TableCell>Current Price</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Removing option</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {watchlist.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.companyDetails.Name}{' '}
                        <Typography component="span" variant="subtitle2" fontWeight="bold" color="textSecondary">
                          ({item.companyDetails.Symbol})
                        </Typography>
                      </Typography>
                    </TableCell>
                    <TableCell>${item.companyDetails.Current_Price}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => stockPurchase(item._id)}>
                        Buy/Sell
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" color="error" onClick={() => removeFromWatchlist(item._id)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p>No items in the watchlist.</p>
        )}
      </Box>
    </div>
  );
};

export default Watchlist;