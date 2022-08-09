const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        name: String,
        //   author: authorSchema
        author: {
            type: authorSchema,
            required: true,
        },
        authors: {
            type: [authorSchema],
            required: true,
        },
    })
);

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors,
    });

    const result = await course.save();
    console.log(result);
}

async function createCourse(name, author) {
    const course = new Course({
        name,
        author,
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

async function updateAuthor(courseId) {
    const course = await Course.findById(courseId);
    course.author.name = "rua1hc John";
    await course.save();

    //OR
    const course = await Course.updateOne(
        { _id: courseId },
        {
            $set: {
                "author.name": "rua1hc Smith",
            },
            $unset: {
                author: "",
                // "author.name": "",
            },
        }
    );
}

async function addAuthor(courseId, author) {
    const course = await Course.findById(courseId);
    course.authors.push(author);
    await course.save();
}

async function removeAuthor(courseId, authorId) {
    const course = await Course.findById(courseId);

    const author = course.authors.id(authorId);
    author.remove();
    course.save();
}

// createCourse("Node Course", new Author({ name: "Mosh" }));
// updateAuthor("xx..xx");

// createCourse("Node Course", [
//     new Author({ name: "Mosh" }),
//     new Author({ name: "rua1hc" }),
// ]);
addAuthor("xx..xx", new Author({ name: "rua2hc" }));
removeAuthor("xx..xx", "xx..xx");
