const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/cathAsyncErrorsMiddleware");
const db = require("../config/database");
const { createUser, createEntries } = require("../utils/helpers");

// Create a new event
exports.createEvent = catchAsyncErrors(async (req, res, next) => {
    const { title, description, start_date, end_date, location } = req.body;

    const result = await db.promise().query(
        'INSERT INTO events (title, description, start_date, end_date, location) VALUES (?, ?, ?, ?, ?)',
        [title, description, start_date, end_date, location]
    );

    res.status(201).json({
        success: true,
        event_id: result.insertId,
    });
});

// Get all events
exports.getAllEvents = catchAsyncErrors(async (req, res, next) => {
    const [events] = await db.promise().query('SELECT * FROM events ORDER BY start_date');

    res.status(200).json({
        success: true,
        events,
    });
});

// Get a single event by ID
exports.getEventById = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const [event] = await db.promise().query('SELECT * FROM events WHERE event_id = ?', [id]);

    if (event.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        });
    }

    res.status(200).json({
        success: true,
        event: event[0],
    });
});

// Update an event
exports.updateEvent = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, start_date, end_date, location } = req.body;

    const result = await db.promise().query(
        'UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?, location = ? WHERE event_id = ?',
        [title, description, start_date, end_date, location, id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Event updated successfully',
    });
});

// Delete an event
exports.deleteEvent = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;

    const result = await db.promise().query('DELETE FROM events WHERE event_id = ?', [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({
            success: false,
            message: 'Event not found',
        });
    }

    res.status(200).json({
        success: true,
        message: 'Event deleted successfully',
    });
});
