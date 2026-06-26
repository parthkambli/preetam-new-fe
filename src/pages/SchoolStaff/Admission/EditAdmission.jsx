import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

const numericPhone = (val) => val.replace(/\D/g, '').slice(0, 10);

export default function EditAdmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [enquiryOptions, setEnquiryOptions] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [selectedResponsibleStaff, setSelectedResponsibleStaff] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [healthFiles, setHealthFiles] = useState([]);
  const [existingPhoto, setExistingPhoto] = useState('');
  const [existingReports, setExistingReports] = useState([]);

  const [rawTimetable, setRawTimetable] = useState(null);
  const [rawServices, setRawServices] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '', age: '', gender: 'Male', dob: '', aadhaar: '',
    mobile: '', fullAddress: '', photo: null,
    physicalDisability: 'No', mainIllness: '', bloodGroup: '',
    doctorName: '', doctorVillage: '', doctorMobile: '',
    seriousDisease: 'No', regularMedication: 'No', healthDetails: '',
    medicalReports: null, enquiryId: null,
    education: '', educationPlace: '', yearsOfService: '', servicePlace: '',
    occupationType: 'Government', wakeUpTime: '', breakfastTime: '',
    lunchTime: '', dinnerTime: '', behaviour: 'Calm',
    hobbies: ['', '', ''], games: ['', '', ''],
    primaryContactName: '', primaryRelation: '', primaryPhone: '',
    secondaryContactName: '', secondaryRelation: '', secondaryPhone: '',
    villageCity: '',
    loginMobile: '', password: '', role: 'Participant',
    registrationDate: '', admissionId: '', assignedCaregiver: '',
    feePlan: 'monthly', instituteType: 'School',
    messFacility: 'No', residency: 'No',
    feeTypeId: '', feeAmount: 0, discount: 0, totalFee: 0,
    paidAmount: 0, remainingAmount: 0, startDate: '', endDate: '',
    responsibleStaffId: '', paymentStatus: 'Pending',
    paymentMode: 'Cash', paymentDate: '', nextDueDate: '',
    feeRemarks: '',
  });

  const [timetableRows, setTimetableRows] = useState([
    { period: null, monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null },
  ]);
  const [periods, setPeriods] = useState([]);
  const [activities, setActivities] = useState([]);
  const [services, setServices] = useState([]);
  const [feeTypes, setFeeTypes] = useState([]);
  const [selectedFeeType, setSelectedFeeType] = useState(null);

  const [serviceRows, setServiceRows] = useState([{ service: null, startDate: '', endDate: '', days: '' }]);
  const [serviceAvailability, setServiceAvailability] = useState({});
  const avlFetchIdRef = useRef(0);

  // ── Load initial selected staff for edit mode ──
  useEffect(() => {
    const loadInitial = async () => {
      if (formData.assignedCaregiver) {
        try {
          const res = await api.fitnessStaff.getById(formData.assignedCaregiver);
          const s = res.data?.data || res.data;
          if (s) setSelectedCaregiver({ value: s._id, label: s.fullName, data: s });
        } catch {}
      }
      if (formData.responsibleStaffId) {
        try {
          const res = await api.fitnessStaff.getById(formData.responsibleStaffId);
          const s = res.data?.data || res.data;
          if (s) setSelectedResponsibleStaff({ value: s._id, label: `${s.fullName} (${s.role})`, data: s });
        } catch {}
      }
    };
    if (formData.assignedCaregiver || formData.responsibleStaffId) loadInitial();
  }, [formData.assignedCaregiver, formData.responsibleStaffId]);

  const handleFeeTypeChange = (option) => {
    setSelectedFeeType(option);
    setFormData((prev) => ({ ...prev, feeTypeId: option?.value || '' }));
    updateFeeAmount(option?.data, formData.feePlan);
  };

  const DAY_LABELS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const fetchPeriods = async () => {
    try {
      const res = await api.periods.getAll();
      setPeriods(
        (res.data.data || []).map((p) => ({
          value: p._id,
          label: `${p.name} (${p.startTime} - ${p.endTime})`,
          capacity: p.capacity,
          dayCounts: p.dayCounts || {},
          activityDayCounts: p.activityDayCounts || {},
        }))
      );
    } catch (err) { console.error(err); }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.activities.getAll();
      setActivities(
        (res.data.data || []).map((a) => ({ value: a._id, label: a.name }))
      );
    } catch (err) { console.error(err); }
  };

  const fetchServices = async () => {
    try {
      const res = await api.schoolStaffPanel.getServices();
      setServices(
        (res.data.data || [])
          .filter((s) => s.isActive)
          .map((s) => ({
            value: s._id,
            label: s.serviceName,
            oneDayFee: s.oneDayFee,
            capacity: s.capacity,
            bookedCount: s.bookedCount,
            availableSeats: s.availableSeats,
          }))
      );
    } catch (err) { console.error("Failed to fetch services", err); }
  };

  const fetchFeeTypes = async () => {
    try {
      const res = await api.schoolStaffPanel.getFeeTypes();
      const options = (res.data || []).map((fee) => ({
        value: fee._id,
        label: fee.description,
        data: fee,
      }));
      setFeeTypes(options);
    } catch (err) { console.error("Failed to fetch fee types", err); }
  };

  const handleFeePlanChange = (e) => {
    const plan = e.target.value;
    setFormData((prev) => ({ ...prev, feePlan: plan }));
    updateFeeAmount(selectedFeeType?.data, plan);
  };

  const updateFeeAmount = (feeType, plan) => {
    if (!feeType || !plan) return;
    const amount = feeType[plan] || 0;
    setFormData((prev) => ({ ...prev, feeAmount: amount }));
  };

  const validateTimetable = () => {
    for (let i = 0; i < timetableRows.length; i++) {
      if (!timetableRows[i].period) {
        alert(`Please select period for row ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const selectedPeriods = timetableRows.map((r) => r.period?.value).filter(Boolean);

  const addRow = () =>
    setTimetableRows((prev) => [...prev, { period: null, monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null }]);

  const removeRow = (i) => setTimetableRows((prev) => prev.filter((_, idx) => idx !== i));

  const updateRow = (i, field, value) => {
    const updated = [...timetableRows];
    updated[i][field] = value;
    setTimetableRows(updated);
  };

  const clearTimetable = () =>
    setTimetableRows((prev) =>
      prev.map((r) => ({ ...r, monday: null, tuesday: null, wednesday: null, thursday: null, friday: null, saturday: null, sunday: null }))
    );

  const copyMondayToAll = () =>
    setTimetableRows((prev) =>
      prev.map((r) => ({ ...r, tuesday: r.monday, wednesday: r.monday, thursday: r.monday, friday: r.monday, saturday: r.monday, sunday: r.monday }))
    );

  const addServiceRow = () => setServiceRows((prev) => [...prev, { service: null, startDate: '', endDate: '', days: '' }]);
  const removeServiceRow = (i) => setServiceRows((prev) => prev.filter((_, idx) => idx !== i));
  const updateServiceRow = (i, field, value) => {
    const updated = [...serviceRows];
    updated[i][field] = value;
    if (field === 'startDate' || field === 'days') {
      const days = field === 'days' ? Number(value) : (Number(updated[i].days) || 0);
      const startDate = field === 'startDate' ? value : updated[i].startDate;
      if (startDate && days > 0) {
        const ed = new Date(startDate);
        ed.setDate(ed.getDate() + days);
        updated[i].endDate = ed.toISOString().slice(0, 10);
      } else {
        updated[i].endDate = '';
      }
    }
    setServiceRows(updated);
  };

  useEffect(() => {
    const id = ++avlFetchIdRef.current;
    const validIndices = [];
    serviceRows.forEach((row, index) => {
      const serviceId = row.service?.value;
      const startDate = row.startDate;
      const endDate = row.endDate;
      if (serviceId && startDate && endDate) {
        validIndices.push(index);
        api.serviceBookings.getAvailableSeats(serviceId, { startDate, endDate })
          .then(res => {
            if (avlFetchIdRef.current !== id) return;
            setServiceAvailability(prev => ({ ...prev, [index]: res.data }));
          })
          .catch(() => {});
      }
    });
    setServiceAvailability(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => {
        if (!validIndices.includes(Number(k))) delete next[Number(k)];
      });
      return next;
    });
  }, [serviceRows]);

  // ── Fee summary (client-side preview) ──
  const admissionFeeTotal = Math.max(0, (Number(formData.feeAmount) || 0) - (Number(formData.discount) || 0));
  const servicesTotal = serviceRows.reduce((sum, row) => {
    return sum + (row.service?.oneDayFee || 0) * (Number(row.days) || 0);
  }, 0);
  const grandTotal = admissionFeeTotal + servicesTotal;

  useEffect(() => {
    const remaining = Math.max(0, grandTotal - (Number(formData.paidAmount) || 0));
    const status = (remaining <= 0 && Number(formData.paidAmount) > 0) ? 'Paid' : 'Pending';
    setFormData((prev) => ({
      ...prev,
      totalFee: grandTotal,
      remainingAmount: remaining,
      paymentStatus: status,
    }));
  }, [grandTotal, formData.paidAmount]);

  useEffect(() => {
    if (formData.startDate && formData.feePlan) {
      const d = new Date(formData.startDate);
      const planMap = { daily: 1, weekly: 7, monthly: 1, quarterly: 3, halfYearly: 6, annual: 12 };
      const unit = planMap[formData.feePlan];
      if (unit) {
        if (formData.feePlan === 'daily' || formData.feePlan === 'weekly') {
          d.setDate(d.getDate() + unit);
        } else {
          d.setMonth(d.getMonth() + unit);
        }
        const endStr = d.toISOString().slice(0, 10);
        setFormData((prev) => ({ ...prev, endDate: endStr }));
      }
    }
  }, [formData.startDate, formData.feePlan]);

  // ── Load enquiries ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingEnquiries(true);
        const res = await api.schoolEnquiry.getForAdmission();
        setEnquiryOptions(
          res.data.map((e) => ({
            value: e._id,
            label: `${e.enquiryId || 'N/A'} - ${e.name} (${e.status})`,
            data: e,
          }))
        );
      } catch (err) { console.error(err); }
      finally { setLoadingEnquiries(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const loadAdmission = async () => {
      try {
        const res = await api.schoolStaffPanel.getAdmissionById(id);
        const data = res.data;
        const fmt = (d) => d ? new Date(d).toISOString().slice(0, 10) : '';

        setFormData((prev) => ({
          ...prev,
          ...data,
          dob: fmt(data.dob),
          registrationDate: fmt(data.registrationDate),
          paymentDate: fmt(data.paymentDate),
          nextDueDate: fmt(data.nextDueDate),
          startDate: data.startDate ? fmt(data.startDate) : '',
          endDate: data.endDate ? fmt(data.endDate) : '',
          hobbies: Array.isArray(data.hobbies) && data.hobbies.length ? data.hobbies : ['', '', ''],
          games: Array.isArray(data.games) && data.games.length ? data.games : ['', '', ''],
        }));
        setExistingPhoto(data.photo || '');
        setExistingReports(Array.isArray(data.medicalReports) ? data.medicalReports : []);
        setRawTimetable(data.timetable || []);
        setRawServices(data.services || []);
      } catch (err) {
        setFetchError('Failed to load admission details.');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    loadAdmission();
    fetchPeriods();
    fetchActivities();
    fetchServices();
    fetchFeeTypes();
  }, [id]);

  // ── Sync timetable ──
  useEffect(() => {
    if (!rawTimetable || !rawTimetable.length || !periods.length || !activities.length) return;
    setTimetableRows(rawTimetable.map((row) => ({
      period: periods.find((p) => p.value === (row.periodId || row.period)) || null,
      monday: activities.find((a) => a.value === (row.mondayActivityId || row.monday)) || null,
      tuesday: activities.find((a) => a.value === (row.tuesdayActivityId || row.tuesday)) || null,
      wednesday: activities.find((a) => a.value === (row.wednesdayActivityId || row.wednesday)) || null,
      thursday: activities.find((a) => a.value === (row.thursdayActivityId || row.thursday)) || null,
      friday: activities.find((a) => a.value === (row.fridayActivityId || row.friday)) || null,
      saturday: activities.find((a) => a.value === (row.saturdayActivityId || row.saturday)) || null,
      sunday: activities.find((a) => a.value === (row.sundayActivityId || row.sunday)) || null,
    })));
  }, [rawTimetable, periods, activities]);

  // ── Sync services ──
  useEffect(() => {
    if (!rawServices || !rawServices.length || !services.length) return;
    setServiceRows(rawServices.map((s) => ({
      service: services.find((svc) => svc.value === (s.serviceId || s.service)) || null,
      startDate: s.startDate ? s.startDate.slice(0, 10) : '',
      endDate: s.endDate ? s.endDate.slice(0, 10) : '',
      days: s.days?.toString() || '',
    })));
  }, [rawServices, services]);

  // ── Sync fee type ──
  useEffect(() => {
    if (feeTypes.length && formData.feeTypeId) {
      const match = feeTypes.find((ft) => ft.value === formData.feeTypeId);
      if (match) setSelectedFeeType(match);
    }
  }, [feeTypes, formData.feeTypeId]);

  // ── Sync selected enquiry ──
  useEffect(() => {
    if (enquiryOptions.length && formData.enquiryId) {
      const match = enquiryOptions.find((e) => e.value === formData.enquiryId);
      if (match) setSelectedEnquiry(match);
    }
  }, [enquiryOptions, formData.enquiryId]);

  // ── Handlers ──
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      if (name === 'medicalReports') {
        setHealthFiles((prev) => [...prev, ...files]);
        return;
      }
      if (name === 'photo') {
        setPhotoFile(files[0] || null);
        return;
      }
    }
    if (name.startsWith('hobby') || name.startsWith('game')) {
      const index = parseInt(name.slice(-1)) - 1;
      const key = name.startsWith('hobby') ? 'hobbies' : 'games';
      const arr = [...formData[key]];
      arr[index] = value;
      setFormData((prev) => ({ ...prev, [key]: arr }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: numericPhone(e.target.value) }));

  const handleEnquirySelect = (option) => {
    setSelectedEnquiry(option);
    if (option) {
      const e = option.data;
      setFormData((prev) => ({ ...prev, enquiryId: e._id, fullName: e.name || '', mobile: e.contact || '', age: e.age || '', gender: e.gender || 'Male' }));
    } else {
      setFormData((prev) => ({ ...prev, enquiryId: null }));
    }
  };

  const SYSTEM_FIELDS = ['_id', 'organizationId', '__v', 'createdAt', 'updatedAt', 'status', 'paymentHistory', 'photo', 'medicalReports'];

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (SYSTEM_FIELDS.includes(key)) return;
        if (key === 'enquiryId' && !formData[key]) return;
        if (key === 'timetable' || key === 'services') return;
        const val = formData[key];
        if (Array.isArray(val)) {
          fd.append(key, JSON.stringify(val.filter((v) => v?.trim())));
        } else if (val !== null && val !== '') {
          fd.append(key, val);
        }
      });
      if (photoFile) fd.append('photo', photoFile);
      healthFiles.forEach((f) => fd.append('healthRecord', f));

      if (formData.dob) fd.set('dob', new Date(formData.dob).toISOString());
      if (formData.registrationDate) fd.set('registrationDate', new Date(formData.registrationDate).toISOString());
      if (formData.paymentDate) fd.set('paymentDate', new Date(formData.paymentDate).toISOString());
      if (formData.nextDueDate) fd.set('nextDueDate', new Date(formData.nextDueDate).toISOString());

      fd.append('timetable', JSON.stringify(timetableRows.map(row => ({
        periodId: row.period?.value || null,
        mondayActivityId: row.monday?.value || null,
        tuesdayActivityId: row.tuesday?.value || null,
        wednesdayActivityId: row.wednesday?.value || null,
        thursdayActivityId: row.thursday?.value || null,
        fridayActivityId: row.friday?.value || null,
        saturdayActivityId: row.saturday?.value || null,
        sundayActivityId: row.sunday?.value || null,
      }))));
      fd.append('services', JSON.stringify(serviceRows.filter(s => s.service).map(row => {
        const days = Number(row.days) || 0;
        const perDayFee = row.service?.oneDayFee || 0;
        let endDate = null;
        if (row.startDate && days > 0) {
          const ed = new Date(row.startDate);
          ed.setDate(ed.getDate() + days);
          endDate = ed.toISOString().slice(0, 10);
        }
        return {
          serviceId: row.service?.value,
          startDate: row.startDate || null,
          endDate,
          days,
          perDayFee,
          totalFee: perDayFee * days,
        };
      })));

      await api.schoolStaffPanel.updateAdmission(id, fd);
      toast.success('Admission updated successfully!');
      navigate('/school-staff/admission');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffOptions = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', page: 1, limit: 10 });
      const list = res.data?.data?.staff || [];
      return list.map((s) => ({
        value: s._id,
        label: `${s.fullName} (${s.role})`,
        data: s,
      }));
    } catch { return []; }
  };

  const loadCaregiverOptions = async (inputValue) => {
    try {
      const res = await api.fitnessStaff.getAll({ search: inputValue || '', status: 'Active', role: 'caregiver', page: 1, limit: 10 });
      const list = res.data?.data?.staff || [];
      return list.map((s) => ({
        value: s._id,
        label: s.fullName,
        data: s,
      }));
    } catch { return []; }
  };

  const nextStep = () => setStep((p) => Math.min(p + 1, 5));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#000359] focus:ring-1 focus:ring-[#000359]/20';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="text-center text-gray-500 py-12">Loading admission details...</div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {fetchError}
        </div>
        <button onClick={() => navigate('/school-staff/admission')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Back to Admissions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Edit Admission – {formData.admissionId}</h1>
        <button onClick={() => navigate('/school-staff/admission')} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
          Back to Admissions
        </button>
      </div>

      {/* Progress */}
      <div className="flex border-b">
        {['Personal & Health', 'Education & Routine', 'Emergency Contact', 'Set Timetable', 'Admission Details'].map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setStep(i + 1)}
            className={`flex-1 text-center py-3 text-sm font-medium border-b-2 transition-colors ${
              step === i + 1
                ? 'border-[#000359] text-[#000359]'
                : step > i + 1
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-1.5 ${
              step > i + 1 ? 'bg-green-100 text-green-700' : step === i + 1 ? 'bg-[#000359] text-white' : 'bg-gray-100 text-gray-500'
            }`}>{i + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-10">

        {/* ── STEP 1: Personal & Health ── */}
        {step === 1 && (
          <>
            {/*<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-base font-semibold text-gray-800 mb-3">Select Enquiry (Optional)</h2>
              <div className="max-w-md">
                <label className={labelCls}>Choose an existing enquiry to auto-fill details</label>
                <Select options={enquiryOptions} onChange={handleEnquirySelect} value={selectedEnquiry} placeholder="Search and select enquiry..." isClearable isLoading={loadingEnquiries} classNamePrefix="react-select" />
              </div>
              <p className="text-sm text-gray-500 mt-2">OR fill the admission form manually below</p>
            </div>*/}

            <h2 className="text-xl font-semibold border-b pb-2">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={labelCls}>Full Name</label><input name="fullName" value={formData.fullName} onChange={handleChange} className={inputCls} required /></div>
              <div><label className={labelCls}>Age</label><input type="number" name="age" min={1} max={120} value={formData.age} onChange={handleChange} className={inputCls} required /></div>
              <div><label className={labelCls}>Gender</label><select name="gender" value={formData.gender} onChange={handleChange} className={inputCls}><option>Male</option><option>Female</option><option>Other</option></select></div>
              <div><label className={labelCls}>Date of Birth</label><input type="date" name="dob" value={formData.dob} max={new Date().toISOString().split('T')[0]} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Aadhaar Number</label><input name="aadhaar" value={formData.aadhaar} onChange={(e) => setFormData((p) => ({ ...p, aadhaar: e.target.value.replace(/\D/g, '').slice(0, 12) }))} inputMode="numeric" maxLength={12} placeholder="12-digit number" className={inputCls} /></div>
              <div><label className={labelCls}>Mobile Number</label><input type="tel" inputMode="numeric" name="mobile" value={formData.mobile} onChange={(e) => setFormData((p) => ({ ...p, mobile: numericPhone(e.target.value) }))} maxLength={10} placeholder="10-digit number" className={inputCls} required /></div>
            </div>
            <div><label className={labelCls}>Full Address</label><textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows={3} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Upload Photo</label>
              <input type="file" name="photo" onChange={handleChange} accept="image/*" className={inputCls} />
              {existingPhoto && !photoFile && (
                <p className="text-xs text-gray-500 mt-1">Current: {existingPhoto.split('/').pop()}</p>
              )}
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Health Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={labelCls}>Physical Disability</label><select name="physicalDisability" value={formData.physicalDisability} onChange={handleChange} className={inputCls}><option>No</option><option>Yes</option></select></div>
              <div><label className={labelCls}>Main Illness</label><input name="mainIllness" value={formData.mainIllness} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Blood Group</label><select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputCls}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
              <div><label className={labelCls}>Doctor Name</label><input name="doctorName" value={formData.doctorName} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Doctor Village</label><input name="doctorVillage" value={formData.doctorVillage} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Doctor Mobile</label><input type="tel" inputMode="numeric" name="doctorMobile" value={formData.doctorMobile} onChange={handlePhoneChange('doctorMobile')} maxLength={10} placeholder="10-digit number" className={inputCls} /></div>
              <div><label className={labelCls}>Serious Disease</label><select name="seriousDisease" value={formData.seriousDisease} onChange={handleChange} className={inputCls}><option>No</option><option>Yes</option></select></div>
              <div><label className={labelCls}>Regular Medication</label><select name="regularMedication" value={formData.regularMedication} onChange={handleChange} className={inputCls}><option>No</option><option>Yes</option></select></div>
              <div><label className={labelCls}>Health Details</label><input name="healthDetails" value={formData.healthDetails} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>Upload Medical Reports</label>
              <input type="file" name="medicalReports" onChange={handleChange} multiple className={inputCls} />
              {existingReports.length > 0 && healthFiles.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">{existingReports.length} file(s) currently attached</p>
              )}
              {healthFiles.length > 0 && (
                <p className="text-xs text-blue-500 mt-1">{healthFiles.length} new file(s) selected</p>
              )}
            </div>
          </>
        )}

        {/* ── STEP 2: Education & Routine ── */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Education & Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={labelCls}>Education</label><input name="education" value={formData.education} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Education Place</label><input name="educationPlace" value={formData.educationPlace} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Years of Service</label><input name="yearsOfService" value={formData.yearsOfService} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Service Place</label><input name="servicePlace" value={formData.servicePlace} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Occupation Type</label><select name="occupationType" value={formData.occupationType} onChange={handleChange} className={inputCls}><option>Government</option><option>Private</option><option>Retired</option><option>Self Employed</option></select></div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Daily Routine</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div><label className={labelCls}>Wake-up Time</label><input type="time" name="wakeUpTime" value={formData.wakeUpTime} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Breakfast Time</label><input type="time" name="breakfastTime" value={formData.breakfastTime} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Lunch Time</label><input type="time" name="lunchTime" value={formData.lunchTime} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Dinner Time</label><input type="time" name="dinnerTime" value={formData.dinnerTime} onChange={handleChange} className={inputCls} /></div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Behaviour / Nature</h2>
            <div className="flex gap-8">
              {['Calm', 'Angry', 'Moderate', 'Strict'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm"><input type="radio" name="behaviour" value={opt} checked={formData.behaviour === opt} onChange={handleChange} /> {opt}</label>
              ))}
            </div>

            <h2 className="text-xl font-semibold border-b pb-2 mt-10">Hobbies & Games</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (<div key={i}><label className={labelCls}>Hobby {i}</label><input name={`hobby${i}`} value={formData.hobbies[i - 1]} onChange={handleChange} className={inputCls} /></div>))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              {[1, 2, 3].map((i) => (<div key={i}><label className={labelCls}>Game {i}</label><input name={`game${i}`} value={formData.games[i - 1]} onChange={handleChange} className={inputCls} /></div>))}
            </div>
          </>
        )}

        {/* ── STEP 3: Emergency Contact ── */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Emergency Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><label className={labelCls}>Primary Contact Name</label><input name="primaryContactName" value={formData.primaryContactName} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Primary Relation</label><input name="primaryRelation" value={formData.primaryRelation} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Primary Phone</label><input type="tel" inputMode="numeric" name="primaryPhone" value={formData.primaryPhone} onChange={handlePhoneChange('primaryPhone')} maxLength={10} placeholder="10-digit number" className={inputCls} /></div>
              <div><label className={labelCls}>Secondary Contact Name</label><input name="secondaryContactName" value={formData.secondaryContactName} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Secondary Relation</label><input name="secondaryRelation" value={formData.secondaryRelation} onChange={handleChange} className={inputCls} /></div>
              <div><label className={labelCls}>Secondary Phone</label><input type="tel" inputMode="numeric" name="secondaryPhone" value={formData.secondaryPhone} onChange={handlePhoneChange('secondaryPhone')} maxLength={10} placeholder="10-digit number" className={inputCls} /></div>
              <div><label className={labelCls}>Village / City</label><input name="villageCity" value={formData.villageCity} onChange={handleChange} className={inputCls} /></div>
            </div>
          </>
        )}

        {/* ── STEP 4: Timetable ── */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-semibold border-b pb-2">Member Timetable</h2>

            <div className="flex flex-wrap gap-3 mt-4">
              <button type="button" onClick={copyMondayToAll} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Copy Monday to All Days</button>
              <button type="button" onClick={clearTimetable} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Clear Timetable</button>
            </div>

            <div className="mt-6 overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[1100px] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#000359] text-white">
                    <th className="p-3 text-left font-medium">Period</th>
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((d) => (
                      <th key={d} className="p-3 font-medium">{d}</th>
                    ))}
                    <th className="p-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {timetableRows.map((row, index) => {
                    const availablePeriods = periods.filter(
                      (p) =>
                        !selectedPeriods.includes(p.value) ||
                        p.value === row.period?.value
                    );
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="p-2 min-w-[220px]">
                          <Select
                            value={row.period}
                            options={availablePeriods}
                            placeholder="Select Period"
                            menuPosition="fixed"
                            onChange={(v) => updateRow(index, "period", v)}
                            classNamePrefix="react-select"
                          />
                          {row.period && row.period.activityDayCounts && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {DAY_LABELS.map(day => {
                                const activityId = row[day]?.value || row[day]?._id;
                                if (!activityId) return null;
                                const key = `${activityId}_${day}`;
                                const booked = row.period.activityDayCounts[key] || 0;
                                const cap = row.period.capacity || 0;
                                const full = cap > 0 && booked >= cap;
                                return (
                                  <span key={day} className={`text-[10px] px-1 py-0.5 rounded ${full ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {day.slice(0, 3)} {booked}/{cap}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map((day) => (
                          <td key={day} className="p-2 min-w-[160px]">
                            <Select
                              options={activities}
                              value={row[day]}
                              placeholder="Activity"
                              menuPosition="fixed"
                              onChange={(v) => updateRow(index, day, v)}
                              isClearable
                              classNamePrefix="react-select"
                            />
                          </td>
                        ))}
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => removeRow(index)} disabled={timetableRows.length === 1} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-40 text-xs">Remove</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button type="button" onClick={addRow} disabled={timetableRows.length >= periods.length} className="mt-4 px-4 py-2 bg-[#000359] text-white rounded-lg text-sm disabled:opacity-50">
              + Add Period Row
            </button>

            <div className="flex justify-between mt-10 pt-6 border-t">
              <button type="button" onClick={prevStep} className="px-8 py-3 border border-gray-300 rounded-lg text-sm">Back</button>
              <button
                type="button"
                onClick={() => { if (validateTimetable()) nextStep(); }}
                className="px-10 py-3 bg-[#000359] text-white rounded-lg text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* ── STEP 5: Admission Details ── */}
        {step === 5 && (
          <>
            {/* ── LOGIN CREDENTIALS ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">Login Credentials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelCls}>Mobile Number (Login ID)</label>
                  <input type="tel" inputMode="numeric" name="loginMobile" value={formData.loginMobile} onChange={(e) => setFormData((p) => ({ ...p, loginMobile: numericPhone(e.target.value) }))} maxLength={10} placeholder="10-digit number" className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Password (Auto-generated)</label>
                  <input name="password" value={formData.password} onChange={handleChange} className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Role</label>
                  <input name="role" value={formData.role} readOnly className={`${inputCls} bg-gray-50`} />
                </div>
              </div>
            </div>

            {/* ── ADMISSION & SYSTEM DETAILS ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">Admission Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className={labelCls}>Registration Date</label>
                  <input type="date" name="registrationDate" value={formData.registrationDate} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Admission ID (Auto)</label>
                  <input name="admissionId" value={formData.admissionId} onChange={handleChange} className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Assigned Caregiver / Staff</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadCaregiverOptions}
                    placeholder="Select Caregiver"
                    value={selectedCaregiver}
                    onChange={(selected) => {
                      setSelectedCaregiver(selected);
                      setFormData((prev) => ({ ...prev, assignedCaregiver: selected?.value || "" }));
                    }}
                    isClearable
                    classNamePrefix="react-select"
                  />
                </div>

                <div>
                  <label className={labelCls}>Institute Type</label>
                  <select name="instituteType" value={formData.instituteType} onChange={handleChange} className={inputCls}>
                    <option>School</option><option>Residency</option><option>DayCare</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Residency</label>
                  <select name="residency" value={formData.residency} onChange={handleChange} className={inputCls}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Mess Facility</label>
                  <select name="messFacility" value={formData.messFacility} onChange={handleChange} className={inputCls}>
                    <option>No</option><option>Yes</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── FEE SETUP ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">Fee Setup</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelCls}>Fee Type</label>
                  <Select
                    placeholder="Select Fee Type"
                    options={feeTypes}
                    value={selectedFeeType}
                    onChange={handleFeeTypeChange}
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className={labelCls}>Fee Plan</label>
                  <select name="feePlan" value={formData.feePlan} onChange={handleFeePlanChange} className={inputCls}>
                    <option value="annual">Yearly</option>
                    <option value="halfYearly">Half Yearly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Fee Amount</label>
                  <input value={formData.feeAmount} readOnly className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Discount</label>
                  <input type="number" name="discount" value={formData.discount} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* ── SERVICES TABLE ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-4">Additional Services</h2>
              <p className="text-sm text-gray-500 mb-4">Assign optional services. Each row total is added to the grand total.</p>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[800px] text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#000359] text-white">
                      <th className="px-4 py-3 text-left font-medium">Service</th>
                      <th className="px-4 py-3 text-left font-medium">Start Date</th>
                      <th className="px-4 py-3 text-left font-medium">End Date</th>
                      <th className="px-4 py-3 text-left font-medium">No. of Days</th>
                      <th className="px-4 py-3 text-left font-medium">Per Day (₹)</th>
                      <th className="px-4 py-3 text-left font-medium">Total (₹)</th>
                      <th className="px-4 py-3 text-center font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {serviceRows.map((row, index) => {
                      const perDay = row.service?.oneDayFee || 0;
                      const days = Number(row.days) || 0;
                      const total = perDay * days;
                      let rowEndDate = row.endDate;
                      if (row.startDate && days > 0 && !row.endDate) {
                        const ed = new Date(row.startDate);
                        ed.setDate(ed.getDate() + days);
                        rowEndDate = ed.toISOString().slice(0, 10);
                      }
                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-3 py-2 min-w-[220px]">
                            <Select
                              value={row.service}
                              options={services}
                              placeholder="Select Service"
                              menuPosition="fixed"
                              onChange={(v) => updateServiceRow(index, 'service', v)}
                              classNamePrefix="react-select"
                            />
                            {row.service && serviceAvailability[index] && (
                              <div className="mt-1.5 text-xs">
                                <span className={`px-2 py-0.5 rounded ${
                                  serviceAvailability[index].availableSeats > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {serviceAvailability[index].bookedCount}/{serviceAvailability[index].capacity} booked on these dates · {serviceAvailability[index].availableSeats} available
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            <input type="date" value={row.startDate} onChange={(e) => updateServiceRow(index, 'startDate', e.target.value)} className={inputCls} />
                          </td>
                          <td className="px-3 py-2">
                            <input value={rowEndDate || ''} readOnly className={`${inputCls} bg-gray-50`} />
                          </td>
                          <td className="px-3 py-2">
                            <input type="number" min="1" value={row.days} onChange={(e) => updateServiceRow(index, 'days', e.target.value)} placeholder="Days" className={inputCls} />
                          </td>
                          <td className="px-3 py-2 text-gray-600">
                            {perDay > 0 ? `₹${perDay}` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-3 py-2 font-semibold text-gray-800">
                            {total > 0 ? `₹${total.toLocaleString()}` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button type="button" onClick={() => removeServiceRow(index)} disabled={serviceRows.length === 1} className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-40 text-xs">
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={addServiceRow} className="mt-4 px-4 py-2 bg-[#000359] text-white rounded-lg text-sm hover:opacity-90">
                + Add Service
              </button>
            </div>

            {/* ── GRAND TOTAL DISPLAY ── */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Grand Total (Admission Fee + Services)</span>
                <span className="text-[#000359] text-lg">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* ── PAYMENT INFO ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">Payment</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelCls}>Amount Paid</label>
                  <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Remaining Amount</label>
                  <input value={formData.remainingAmount} readOnly className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Payment Status</label>
                  <input value={formData.paymentStatus} readOnly className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Next Due Date</label>
                  <input type="date" name="nextDueDate" value={formData.nextDueDate} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Payment Mode</label>
                  <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className={inputCls}>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Date</label>
                  <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className={inputCls} />
                </div>
              </div>
            </div>

            {/* ── SCHEDULE ── */}
            <div>
              <h2 className="text-xl font-semibold border-b pb-2 mb-6">Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className={labelCls}>Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>End Date (Auto)</label>
                  <input value={formData.endDate} readOnly className={`${inputCls} bg-gray-50`} />
                </div>
                <div>
                  <label className={labelCls}>Responsible Staff</label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadStaffOptions}
                    placeholder="Search Staff..."
                    value={selectedResponsibleStaff}
                    onChange={(selected) => {
                      setSelectedResponsibleStaff(selected);
                      setFormData((prev) => ({ ...prev, responsibleStaffId: selected?.value || "" }));
                    }}
                    classNamePrefix="react-select"
                    isClearable
                  />
                </div>
                <div>
                  <label className={labelCls}>Fee Remarks</label>
                  <textarea name="feeRemarks" value={formData.feeRemarks} onChange={handleChange} rows={2} className={inputCls} />
                </div>
              </div>
            </div>

            {/* ── ACTIONS ── */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex gap-3">
                <button type="button" className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">Print</button>
                <button type="button" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Share</button>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={prevStep} disabled={loading} className="px-8 py-3 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">Back</button>
                <button type="submit" disabled={loading} className="px-10 py-3 bg-[#000359] text-white rounded-lg text-sm hover:opacity-90 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── NAVIGATION (steps 1–3) ── */}
        {step < 4 && (
          <div className="flex justify-between pt-8 border-t">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="px-10 py-3 border border-gray-300 rounded-lg text-sm">Back</button>
            )}
            <button type="button" onClick={nextStep} className="px-12 py-3 bg-[#000359] text-white rounded-lg text-sm ml-auto">Next</button>
          </div>
        )}
      </form>
    </div>
  );
}
