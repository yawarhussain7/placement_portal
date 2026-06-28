import { PersonalDetails, CourseDetails_Schema, PlacementDoc_Schema, PlacementPreference_Schema } from '../../model/newPlacement/PlacementSchema.modle.js'

export const submitPlacementApplication = async (userId, personalData, courseData, preferenceData, files) => {
    // Save personal details
    const personal = await PersonalDetails.findOneAndUpdate(
        { _id: userId },
        {
            fullName: personalData.fullName,
            email: personalData.email,
            phoneNumber: personalData.phoneNumber,
            dob: personalData.dob,
            gender: personalData.gender,
            address: personalData.address,
            suburb: personalData.suburb,
            state: personalData.state,
            postcode: personalData.postcode,
            isCitizen: personalData.isCitizen
        },
        { upsert: true, new: true }
    )

    // Save course details
    const course = await CourseDetails_Schema.findOneAndUpdate(
        { _id: userId },
        {
            course: courseData.course,
            rtoInstitution: courseData.institution,
            courseCode: courseData.courseCode,
            studyStatus: courseData.studyStatus,
            expectedCompletionDate: courseData.completionDate,
            modeOfStudy: courseData.studyMode,
            placementType: courseData.placementReason
        },
        { upsert: true, new: true }
    )

    // Save placement preferences
    const preference = await PlacementPreference_Schema.findOneAndUpdate(
        { _id: userId },
        {
            industry: preferenceData.industry,
            role: preferenceData.role || '',
            location: preferenceData.location,
            relocate: preferenceData.relocate || 'yes',
            availability: preferenceData.availability,
            workingHours: preferenceData.workingHours || '',
            notes: preferenceData.notes || '',
            availableDays: Array.isArray(preferenceData.days) ? preferenceData.days : [],
            placementType: preferenceData.placementType || 'on-site'
        },
        { upsert: true, new: true }
    )

    // Save document paths if files were uploaded
    let documents = null
    if (files && Object.keys(files).length > 0) {
        const docPaths = {}
        const docFields = ['resume', 'photoId', 'studentId', 'transcript', 'certificates', 'additional']
        docFields.forEach(field => {
            if (files[field] && files[field][0]) {
                docPaths[field] = files[field][0].path
            }
        })
        documents = await PlacementDoc_Schema.findOneAndUpdate(
            { _id: userId },
            docPaths,
            { upsert: true, new: true }
        )
    }

    return {
        personal,
        course,
        preference,
        documents
    }
}