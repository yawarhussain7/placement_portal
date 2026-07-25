import mongoose from 'mongoose'
import ApplicationModel from '../Model/portal/application.model.js'
import PlacementModel from '../Model/portal/placement.model.js'
import StudentModel from '../Model/portal/auth.model.js'

const sampleApplications = [
  {
    role: 'Frontend Developer Internship',
    company: 'Northbridge Digital',
    status: 'draft',
    notes: 'Prepare portfolio examples and a short intro.',
  },
  {
    role: 'Junior QA Analyst',
    company: 'BrightLabs Studio',
    status: 'draft',
    notes: 'Waiting for transcript verification.',
  },
  {
    role: 'UI/UX Design Assistant',
    company: 'Crafton Systems',
    status: 'draft',
    notes: 'Initial application submitted.',
  },
]

const seedApplications = async () => {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/placement_portal'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Get or create a test student
    let student = await StudentModel.findOne({ email: 'alex.morgan@example.com' })
    if (!student) {
      student = await StudentModel.create({
        email: 'alex.morgan@example.com',
        fullName: 'Alex Morgan',
        username: 'alexmorgan',
        phone: '+61412345678',
        password: 'hashedpassword123'
      })
      console.log('✅ Created test student:', student.email)
    }

    // Get or create sample placements and applications
    for (const appData of sampleApplications) {
      // Find or create placement
      let placement = await PlacementModel.findOne({ 
        'personal.fullName': appData.company 
      })
      
      if (!placement) {
        placement = await PlacementModel.create({
          personal: {
            fullName: appData.company,
            email: `contact@${appData.company.toLowerCase().replace(/\s/g, '')}.com`,
            phoneNumber: '+61212345678',
            phoneCountry: '+61',
            dob: new Date('1995-01-01'),
            gender: 'Prefer not to say',
            address: '123 Business Street',
            suburb: 'Sydney',
            state: 'NSW',
            postcode: '2000',
            isCitizen: 'Yes'
          },
          course: {
            course: appData.role,
            institution: 'University of Technology',
            courseCode: 'CS101',
            studyStatus: 'Final Year',
            completionDate: new Date('2026-12-01'),
            studyMode: 'full-time',
            placementReason: 'mandatory'
          },
          preference: {
            industry: 'Technology',
            role: appData.role,
            location: 'Sydney',
            relocate: 'no',
            availability: 'Immediate',
            workingHours: 'Full-time',
            placementType: 'on-site'
          },
          userId: student._id,
          status: 'approved'
        })
        console.log(`✅ Created placement: ${placement.personal.fullName}`)
      }
      
      // Create application
      const existingApp = await ApplicationModel.findOne({
        userId: student._id,
        placementId: placement._id
      })

      if (!existingApp) {
        const application = await ApplicationModel.create({
          userId: student._id,
          placementId: placement._id,
          status: appData.status,
          coverLetter: appData.notes,
          submittedAt: appData.status !== 'draft' ? new Date() : undefined,
          reviewedAt: ['under_review', 'interview_scheduled'].includes(appData.status) ? new Date() : undefined
        })
        console.log(`✅ Created application: ${appData.role} at ${appData.company} (Status: ${appData.status})`)
      } else {
        console.log(`⏭️  Application already exists: ${appData.role} at ${appData.company}`)
      }
    }

    console.log('\n🎉 Sample applications seeded successfully!')
    console.log('📊 Summary:')
    const totalApps = await ApplicationModel.countDocuments()
    console.log(`   Total applications in database: ${totalApps}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding applications:', error)
    process.exit(1)
  }
}

seedApplications()