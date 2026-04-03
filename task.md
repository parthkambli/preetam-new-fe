Enquiry to Admission Integration Docs
1. Objective

Admission module mein 2 approaches support karna:

Direct Admission

Admin manually form fill karega

Current system jaisa hi work karega

Enquiry module se koi relation nahi

Admission From Enquiry

Admin Enquiry select karega dropdown se

Matching fields auto fill ho jayenge

Admission save hone ke baad Enquiry status = Admitted

2. Enquiry Status Flow

Final enquiry status list:

New
Follow Up
Converted
Admitted

Explanation:

Status	Meaning
New	New enquiry received
Follow Up	Student counselling running
Converted	Interested / ready
Admitted	Admission completed

Important Rule:

Dropdown mein "Admitted" status wali enquiry nahi aani chahiye
3. Enquiry Unique ID

Duplicate enquiry dropdown problem avoid karne ke liye:

Backend se Unique enquiryId generate karna hoga.

Example:

ENQ-0001
ENQ-0002
ENQ-0003
Enquiry Schema Example
const enquirySchema = new mongoose.Schema({
  enquiryId: {
    type: String,
    unique: true
  },

  name: String,
  phone: String,
  email: String,

  courseInterested: String,

  status: {
    type: String,
    enum: ["New", "Follow Up", "Converted", "Admitted"],
    default: "New"
  },

  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  }

}, { timestamps: true });
4. Admission Schema Update

Admission schema mein optional enquiry reference add karna hoga

const admissionSchema = new mongoose.Schema({

  studentName: String,
  phone: String,
  email: String,
  course: String,

  enquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Enquiry",
    default: null
  },

  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization"
  }

}, { timestamps: true });

Important:

enquiryId optional rahega

Isse direct admission bhi possible rahega.

5. Enquiry Dropdown API

Frontend dropdown ke liye API.

GET Enquiries for Admission
GET /api/enquiries/admission-list
Query Conditions
status != "Admitted"
orgId = currentAdminOrgId
Example Response
[
  {
    "_id": "65f2a123",
    "enquiryId": "ENQ-0004",
    "name": "Rahul Sharma",
    "phone": "9876543210",
    "courseInterested": "Web Development",
    "status": "Follow Up"
  }
]
6. Enquiry Dropdown UI (React)

Use React Select

Install:

npm install react-select

Example:

import Select from "react-select";

<Select
  options={enquiryOptions}
  onChange={handleEnquirySelect}
  placeholder="Select Enquiry"
/>

Dropdown option format:

{
  value: enquiry._id,
  label: `${enquiry.enquiryId} - ${enquiry.name} (${enquiry.status})`
}

Example UI:

ENQ-0004 - Rahul Sharma (Follow Up)
ENQ-0005 - Amit Patel (New)
ENQ-0006 - Priya Shah (Converted)
7. Auto Fill Logic

Jab admin enquiry select kare:

handleEnquirySelect()

API call:

GET /api/enquiries/:id

Response:

{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@gmail.com",
  "courseInterested": "Web Development"
}

Auto fill fields:

studentName
phone
email
course

React Example:

setFormData({
  studentName: enquiry.name,
  phone: enquiry.phone,
  email: enquiry.email,
  course: enquiry.courseInterested
});
8. Create Admission API Logic

Endpoint:

POST /api/admissions

Payload:

Case 1 — Enquiry Selected
{
  "studentName": "Rahul Sharma",
  "phone": "9876543210",
  "course": "Web Development",
  "enquiryId": "65f2a123"
}

Backend Logic:

const admission = await Admission.create(req.body);

if(req.body.enquiryId){

  await Enquiry.findByIdAndUpdate(
    req.body.enquiryId,
    { status: "Admitted" }
  );

}
Case 2 — Direct Admission

Payload:

{
  "studentName": "Amit Shah",
  "phone": "9999999999",
  "course": "React"
}

Logic:

Admission create
NO enquiry status update

Current system jaisa hi work karega.

9. Enquiry Table Update

Enquiry table mein enquiryId column show karna

Example:

Enquiry ID	Name	Phone	Course	Status
ENQ-0001	Rahul	9876543210	Web Dev	Follow Up
ENQ-0002	Amit	9999999999	React	New

Benefit:

Admin easily identify enquiry
10. Organization Handling

System mein 2 organizations hai.

Important rule:

All APIs must filter by:

orgId

Example:

GET /enquiries/admission-list?orgId=adminOrgId

Condition:

status != "Admitted"
AND
orgId = currentAdminOrg

Isse dono org ka data separate rahega.

11. Final Flow
Case 1: Direct Admission
Admin → Admission Form Fill
→ Submit
→ Admission Created
→ Enquiry untouched
Case 2: Admission From Enquiry
Admin → Select Enquiry (React Select)

↓
Fields Auto Fill

↓
Submit Admission

↓
Admission Created

↓
Backend Update

Enquiry Status → Admitted
12. Duplicate Prevention

Dropdown mein duplicate enquiry avoid karne ke rules:

Unique enquiryId

status != Admitted

orgId filter

Result:

Only latest status enquiry visible
13. UI Example

Admission Form Top Section:

Select Enquiry (Optional)

[ React Select Dropdown ]

OR

Fill Admission Manually