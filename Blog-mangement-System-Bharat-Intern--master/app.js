require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Blog = require("./models/blog");

// Securely connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log(err.message));

// Set view engine and middleware
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => res.redirect('/add-blog'));
app.get("/show-blogs", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render('Show_blogs', { allBlogs });
});

app.get('/add-blog', (req, res) => res.render("add_item"));
app.post('/add-blog', async (req, res) => {
    const { fname, lname, email, title, image1, image2, image3, image4, content } = req.body;
    await Blog.create({
        name: fname + " " + lname,
        email,
        photo: [image1, image2, image3, image4],
        text: content,
        title
    });
    res.redirect("/show-blogs");
});

app.get("/read-blog/:id", async (req, res) => {
    const item = await Blog.findById(req.params.id);
    res.render('read_blogs', { item });
});

app.post("/delete-blog/:id", async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/show-blogs");
});

// Start server
app.listen(port, () => console.log(`Server is running at port ${port}`));