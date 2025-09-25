const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// In-memory seats data
const seats = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: 'available', // 'available', 'locked', 'booked'
  lockInfo: null // { userId, timeout }
}));

// Lock a seat
function lockSeat(seat, userId) {
  if (seat.status === 'booked') {
    return { success: false, message: 'Seat already booked' };
  }
  if (seat.status === 'locked') {
    return { success: false, message: 'Seat already locked' };
  }

  seat.status = 'locked';
  seat.lockInfo = {
    userId,
    timeout: setTimeout(() => {
      seat.status = 'available';
      seat.lockInfo = null;
      console.log(`Seat ${seat.id} lock expired`);
    }, 60 * 1000) // 1 minute lock
  };

  return { success: true, message: `Seat ${seat.id} locked for user ${userId}` };
}

// Confirm booking
function confirmSeat(seat, userId) {
  if (seat.status === 'available') {
    return { success: false, message: 'Seat is not locked' };
  }
  if (seat.status === 'locked' && seat.lockInfo.userId !== userId) {
    return { success: false, message: 'Seat is locked by another user' };
  }

  clearTimeout(seat.lockInfo.timeout); // clear auto-unlock
  seat.status = 'booked';
  seat.lockInfo = null;

  return { success: true, message: `Seat ${seat.id} successfully booked by user ${userId}` };
}

// Get all seats
app.get('/seats', (req, res) => {
  res.json(seats.map(s => ({ id: s.id, status: s.status })));
});

// Lock seat
app.post('/lock', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ success: false, message: 'Seat not found' });

  const result = lockSeat(seat, userId);
  res.json(result);
});

// Confirm seat
app.post('/confirm', (req, res) => {
  const { seatId, userId } = req.body;
  const seat = seats.find(s => s.id === seatId);
  if (!seat) return res.status(404).json({ success: false, message: 'Seat not found' });

  const result = confirmSeat(seat, userId);
  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
