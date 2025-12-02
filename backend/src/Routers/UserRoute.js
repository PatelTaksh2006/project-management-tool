import User from '../models/UserSchema.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import auth from '../middleware/auth.js';
const router=express.Router();

router.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        newUser.Password = await bcrypt.hash(newUser.Password, 10);
        await newUser.save();
        // created
        return res.status(201).send({ message: 'User added', userId: newUser._id });
    } catch (err) {
        // Mongoose validation error
        if (err && err.name === 'ValidationError') {
            return res.status(400).send({ error: 'ValidationError', details: err.message });
        }

        // Duplicate key error (e.g. unique email)
        // MongoServerError (newer Mongo) and legacy driver use code 11000
        if (err && (err.code === 11000 || err.codeName === 'DuplicateKey' || err.name === 'MongoServerError')) {
            const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
            return res.status(409).send({ error: 'DuplicateKey', message: `${field} already exists` });
        }

        console.error('Signup error:', err);
        return res.status(500).send({ error: 'InternalServerError' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { Email, Password } = req.body;
        const user = await User.findOne({ Email }).populate({
    path: 'tasks',
    populate: { path: 'projectId' } // populate the project inside each task
  }).populate('project');
  console.log("After login:"+user);
        if (user && await bcrypt.compare(Password, user.Password)) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            const { Password: _pwd, ...userWithoutPassword } = user._doc;
            return res.send({ user: userWithoutPassword, token });
        } else {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
    } catch (err) {
        // Unexpected DB / crypto errors
        console.error('Login error:', err);
        if (err && err.name === 'ValidationError') {
            return res.status(400).send({ error: 'ValidationError', details: err.message });
        }
        return res.status(500).send({ error: 'InternalServerError' });
    }
});

router.put('/update/:id',auth, async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        return res.send({ message: 'User updated', user });
    } catch (err) {
        console.error('Update error:', err);
        if (err && err.name === 'ValidationError') {
            return res.status(400).send({ error: 'ValidationError', details: err.message });
        }
        return res.status(500).send({ error: 'InternalServerError' });
    }
});


router.get('/me', auth,async (req, res) => {
      const user = await User.findById(req.userId).populate({
    path: 'tasks',
    populate: { path: 'projectId' } // populate the project inside each task
  }).populate('project');
    if (!user) return res.status(404).json({ message: "User not found" });
    const { Password, ...userWithoutPassword } = user._doc;
    res.send({ user: userWithoutPassword  });
});
export default router;