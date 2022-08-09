const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost/playground")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.log("Error: ", error));

//***** CREATE
const courseScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        match: /a-z/i,
    },
    category: {
        type: String,
        required: true,
        enum: ["web", "mobile", "network"],
        lowercase: true,
        // uppercase: true,
        trim: true,
    },
    author: String,
    tags: {
        type: Array,
        // validate: {
        //     validator: function (v) {
        //         return v && v.length > 0;
        //     },
        //     message: "A course should have at least 1 tag.",
        // },
        validate: {
            isAsync: true,
            validator: function (v, callback) {
                setTimeout(() => {
                    const result = v && v.length > 0;
                    callback(result);
                }, 3000);
                // return v && v.length > 0;
            },
            message: "A course should have at least 1 tag.",
        },
    },
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished;
        },
        min: 5,
        max: 200,
        get: (v) => Math.floor(v),
        set: (v) => Math.floor(v),
    },
});
const Course = mongoose.model("Course", courseScheme);

async function createCourse() {
    const course = new Course({
        name: "Angular 4",
        author: "rua1hc",
        tags: ["angular", "frontend"],
        isPublished: false,
    });

    try {
        // course.validate()
        const result = await course.save();
        console.log(result);
    } catch (ex) {
        for (const error in ex.errors) {
            // console.log(errors[error]);
            console.log(ex.errors[error].message);
        }
        // console.log(ex.message);
    }
}

//***** QUERY
async function getCourse() {
    const pageNumer = 2;
    const pageSize = 10;

    const courses = await Course.find({ author: "rua1hc" })

        //comparision query
        .find({ price: { $gte: 10, $lte: 20 } })
        .find({ price: { $in: [10, 20, 30] } })

        //logical
        .find()
        .or([{ author: "rua1hc" }, { isPublished: true }])
        .and([{ author: "rua1hc" }, { isPublished: true }])

        .find({ author: /^rua/ })
        .find({ author: /1hc$/ })
        .find({ author: /.*rua.*/ })

        .limit(10)
        .sort({ name: -1 })
        .select({ name: 1, tags: 1 })
        //counting total queried items
        .count()

        //pagination
        .skip((pageNumer - 1) * pageSize)
        .limit(pageSize);

    console.log(courses);
}

async function getCourse_Ex1() {
    const courses = await Course.find({ isPublished: true, tags: "backend" })
        .sort({ name: 1 })
        .select({ name: 1, author: 1 });
    console.log(course);
}

async function getCourse_Ex2a() {
    const courses = await Course.find({
        isPublished: true,
        tags: { $in: ["frontend", "backend"] },
    })
        .sort({ price: -1 })
        .select({ name: 1, author: 1 });
    console.log(course);
}

async function getCourse_Ex2b() {
    const courses = await Course.find({ isPublished: true })
        .or([{ tags: "frontend" }, { tags: "backend" }])
        .sort({ price: -1 })
        .select({ name: 1, author: 1 });
    console.log(course);
}

async function getCourse_Ex3() {
    const courses = await Course.find({ isPublished: true })
        .or([{ price: { $gte: 15 } }, { title: /.*by.*/i }])
        .sort({ price: -1 })
        .select({ name: 1, author: 1 });
    console.log(course);
}

//***** UPDATE DB
async function updateCourseByID(id) {
    const course = await Course.findById(id);
    if (!course) return;

    course.author = "New-author";
    course.set({
        isPublished: true,
    });

    const result = await course.save();
    console.log(result);
}

async function updateCourseDirect(id) {
    const result = await Course.updateOne(
        { _id: id },
        {
            $set: {
                author: "rua2hc",
            },
        }
    );
    console.log(result);

    //OR
    const course = await Course.findByIdAndUpdate(
        id,
        {
            $set: {
                author: "rua3hc",
            },
        },
        { new: true }
    );
    console.log(course);
}

//***** REMOVE
async function removeCourse(id) {
    const result = await Course.deleteOne({ _id: id });
    console.log(result);

    //OR
    const course = await Course.findByIdAndRemove(id);
    console.log(course);
}

// createCourse();
// getCourse();
// updateCourseByID("62ebece6e9f865a611343a17");
// updateCourseDirect("62ebece6e9f865a611343a17");
// removeCourse("62ebece6e9f865a611343a17");
