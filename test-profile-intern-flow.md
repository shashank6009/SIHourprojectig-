# Profile → Internship Auto-Fill Test

## Test Steps:

### 1. Fill Profile Form
- Go to: `http://localhost:3004/profile`
- Fill in these fields:
  - **First Name**: "John"
  - **Last Name**: "Doe"
  - **Email**: "john.doe@example.com"
  - **Phone**: "+91 9876543210"
  - **University**: "Delhi University"
  - **Degree**: "Bachelor's Degree"
  - **Course**: "Computer Science"
  - **Graduation Year**: "2023"
  - **CGPA**: "8.5"
  - **Skills**: "JavaScript, React, Node.js"
  - **Languages**: "English, Hindi"
  - **Preferred Location**: "New Delhi"
  - **Career Objective**: "To gain experience in software development"

### 2. Save Profile
- Click "Save Profile"
- See success message: "Profile updated successfully!"

### 3. Visit Internship Page
- Go to: `http://localhost:3004/internship`
- **Expected Result**: Form should auto-fill with:
  - **Name**: "John Doe"
  - **Email**: "john.doe@example.com"
  - **Phone**: "+91 9876543210"
  - **University**: "Delhi University"
  - **Degree**: "Bachelor's Degree"
  - **Graduation Year**: "2023"
  - **CGPA**: "8.5"
  - **Technical Skills**: "JavaScript, React, Node.js"
  - **Languages**: "English, Hindi"
  - **Preferred Location**: "New Delhi"
  - **Career Objective**: "To gain experience in software development"

### 4. Verify Auto-Fill Notification
- Should see green banner: "Profile Data Auto-filled!"
- Message: "Your profile information has been automatically filled in the form below. You can still modify any fields as needed."

### 5. Test Real-Time Updates
- Go back to profile: `http://localhost:3004/profile`
- Change **University** to "IIT Delhi"
- Change **Skills** to "Python, Machine Learning, AI"
- Save profile again
- Go back to internship: `http://localhost:3004/internship`
- **Expected**: Updated values should appear in the form

## Technical Implementation:

The auto-fill works through:
1. **ProfileStorage.getProfileForUser()** - Loads saved profile data
2. **ProfileFormUtils.getPersonalData()** - Extracts personal info
3. **ProfileFormUtils.getEducationData()** - Extracts education info
4. **ProfileFormUtils.getProfessionalData()** - Extracts professional info
5. **ProfileFormUtils.getPMISData()** - Extracts PMIS-specific info
6. **setFormData()** - Populates internship form fields

## Console Logs:
Check browser console for:
- "Profile data loaded from storage: [profile object]"
- "Form auto-filled with profile data: [form data object]"
