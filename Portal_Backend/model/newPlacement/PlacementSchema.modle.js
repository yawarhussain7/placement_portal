import mongoose from "mongoose";

const PersonalDetailSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please enter your full name'],
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
        ],
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: String,
        required: [true, 'Date of birth is required'],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other", "Prefer not to say"]
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    suburb: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    postcode: {
        type: String,
        required: true,
        trim: true,
        match: [/^[0-9]{3,10}$/, "Invalid postcode"],
    },
    isCitizen: {
        type: String,
        required: true,
        enum: ["Yes", "No"],
    },
}, {
    timestamps: true
});

const CourseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    rtoInstitution: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    courseCode: {
        type: String,
        default: null,
        trim: true,
        maxlength: 20
    },
    studyStatus: {
        type: String,
        required: true,
    },
    expectedCompletionDate: {
        type: Date,
        required: true
    },
    modeOfStudy: {
        type: String,
        required: true,
        enum: ["full-time", "part-time", "online"]
    },
    placementType: {
        type: String,
        required: true,
        enum: ["mandatory", "voluntary"]
    }
}, {
    timestamps: true
});

const placementPreferenceSchema = new mongoose.Schema({
    industry: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: "",
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    relocate: {
        type: String,
        enum: ["yes", "no"],
        default: "yes"
    },
    availability: {
        type: String,
        required: true,
        trim: true
    },
    workingHours: {
        type: String,
        default: "",
        trim: true
    },
    notes: {
        type: String,
        default: "",
        trim: true
    },
    availableDays: {
        type: [String],
        default: [],
        validate: {
            validator: function (days) {
                const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                return days.every((d) => validDays.includes(d));
            },
            message: "Invalid day selected"
        },
    },
    placementType: {
        type: String,
        enum: ["on-site", "hybrid", "remote"],
        required: true
    }
}, {
    timestamps: true
});

const documentSchema = new mongoose.Schema({
    resume: { type: String },
    photoId: { type: String },
    studentId: { type: String },
    transcript: { type: String },
    certificates: { type: String },
    additional: { type: String }
}, {
    timestamps: true
});

const PersonalDetails = mongoose.model("PersonalDetails", PersonalDetailSchema)
const CourseDetails_Schema = mongoose.model('Course_Details', CourseSchema)
const PlacementDoc_Schema = mongoose.model('placement-Documents', documentSchema)
const PlacementPreference_Schema = mongoose.model("Placement_Preference", placementPreferenceSchema)

export {
    PersonalDetails,
    CourseDetails_Schema,
    PlacementDoc_Schema,
    PlacementPreference_Schema,
}