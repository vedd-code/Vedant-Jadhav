const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const SUBJECTS = {
  python: 'You are a Python programming tutor. Only answer questions related to Python programming. Explain clearly with examples.',
  maths: 'You are a Mathematics tutor for college students. Only answer maths related questions. Show step-by-step solutions.',
  networks: 'You are a Computer Networks tutor. Only answer questions about networking concepts, protocols, and architecture.',
  dbms: 'You are a Database Management Systems tutor. Only answer DBMS related questions including SQL, normalization, transactions.',
  os: 'You are an Operating Systems tutor. Only answer questions about OS concepts like processes, memory management, scheduling.',
  general: 'You are a helpful academic tutor for college students. Answer study-related questions clearly and in detail.',
};

// Create new chat session
router.post('/session', authMiddleware, async (req, res) => {
  const { subject, title } = req.body;
  if (!subject) return res.status(400).json({ message: 'Subject required' });
  try {
    const [rows] = await db.query(
      'INSERT INTO chat_sessions (user_id, subject, title) VALUES (?, ?, ?) RETURNING id',
      [req.userId, subject, title || `${subject} session`]
    );
    res.json({ sessionId: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sessions for user
router.get('/sessions', authMiddleware, async (req, res) => {
  try {
    const [sessions] = await db.query(
      'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a session
router.get('/session/:sessionId/messages', authMiddleware, async (req, res) => {
  try {
    // Ensure the session belongs to the requesting user
    const [sessions] = await db.query(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.sessionId, req.userId]
    );
    if (sessions.length === 0)
      return res.status(404).json({ message: 'Session not found' });

    const [messages] = await db.query(
      'SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC',
      [req.params.sessionId]
    );
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message + get AI reply
router.post('/session/:sessionId/message', authMiddleware, async (req, res) => {
  const { message, isQuizMode } = req.body;
  const { sessionId } = req.params;

  if (!message) return res.status(400).json({ message: 'Message required' });

  try {
    // Get session to find subject
    const [sessions] = await db.query(
      'SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, req.userId]
    );
    if (sessions.length === 0)
      return res.status(404).json({ message: 'Session not found' });

    const subject = sessions[0].subject;
    const systemPrompt = SUBJECTS[subject] || SUBJECTS.general;

    // Save user message
    await db.query(
      'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
      [sessionId, 'user', message]
    );

    // Get previous messages for context (last 10)
    const [prevMessages] = await db.query(
      'SELECT role, content FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT 10',
      [sessionId]
    );

    const userMessage = isQuizMode
      ? `Generate 3 multiple choice questions (MCQs) with 4 options each and correct answers about this topic: ${message}`
      : message;

    // Call OpenRouter API
    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'StudyBot',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          ...prevMessages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await openRouterRes.json();
    const aiReply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Save AI reply
    await db.query(
      'INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)',
      [sessionId, 'assistant', aiReply]
    );

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a session
router.delete('/session/:sessionId', authMiddleware, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM chat_sessions WHERE id = ? AND user_id = ?',
      [req.params.sessionId, req.userId]
    );
    res.json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
