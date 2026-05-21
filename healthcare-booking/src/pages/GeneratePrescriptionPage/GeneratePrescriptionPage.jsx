import React, { useState, useRef, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicationIcon from '@mui/icons-material/Medication';
import NoteIcon from '@mui/icons-material/Note';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './GeneratePrescriptionPage.scss';

const medicineSuggestions = [
  'Paracetamol 500mg', 'Amoxicillin 250mg', 'Ibuprofen 400mg', 'Cetirizine 10mg',
  'Omeprazole 20mg', 'Metformin 500mg', 'Amlodipine 5mg', 'Atorvastatin 10mg',
];

export default function GeneratePrescriptionPage() {
  const [medicineList, setMedicineList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prescriptionGenerated, setPrescriptionGenerated] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const prescriptionRef = useRef(null);
  const canvasRef = useRef(null);

  const storedBooking = JSON.parse(localStorage.getItem('lastBooking') || 'null');
  const patientInfo = storedBooking ? {
    name: storedBooking.patientName || 'N/A',
    appointmentId: `APT-${storedBooking.id}`,
    doctor: storedBooking.doctorName || 'N/A',
    consultationDate: storedBooking.appointmentDate || 'N/A',
    symptoms: storedBooking.symptoms || 'Not specified',
    diagnosis: 'Pending evaluation',
    allergies: 'None reported',
    previousHistory: 'No prior records',
    consultationNotes: 'Patient consultation in progress.',
  } : {
    name: 'No Booking Found',
    appointmentId: 'N/A',
    doctor: 'N/A',
    consultationDate: 'N/A',
    symptoms: 'N/A',
    diagnosis: 'N/A',
    allergies: 'N/A',
    previousHistory: 'N/A',
    consultationNotes: 'Please book an appointment first.',
  };

  const formik = useFormik({
    initialValues: {
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      foodInstructions: '',
      additionalNotes: '',
      labTestRecommendation: '',
      followUpDate: '',
    },
    validationSchema: Yup.object({
      medicineName: Yup.string().required('Medicine Name is required'),
      dosage: Yup.string().required('Dosage is required'),
      frequency: Yup.string().required('Frequency is required'),
      duration: Yup.string().required('Duration is required'),
    }),
    onSubmit: (values) => {
      const newMedicine = {
        id: Date.now(),
        ...values,
        timing: values.frequency,
        quantity: values.duration,
        instructions: values.foodInstructions,
      };
      setMedicineList([...medicineList, newMedicine]);
      formik.resetForm();
    },
  });

  const handleSaveDraft = () => {
    localStorage.setItem('prescription_draft', JSON.stringify({
      medicineList,
      patientInfo,
      savedAt: new Date().toISOString(),
    }));
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const handleGeneratePrescription = () => {
    if (medicineList.length > 0) {
      setPrescriptionGenerated(true);
      localStorage.removeItem('prescription_draft');
      setTimeout(() => setPrescriptionGenerated(false), 3000);
    }
  };

  const handleRemoveMedicine = (id) => {
    setMedicineList(medicineList.filter(med => med.id !== id));
  };

  const handleDownloadPdf = async () => {
    if (!prescriptionRef.current || medicineList.length === 0) return;
    setPdfLoading(true);
    try {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`prescription-${patientInfo.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  const startDrawing = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || 0) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData(null);
  };

  return (
    <div className="prescription-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Generate Prescription</h1>
            <p>Create and manage patient prescriptions</p>
          </div>
          <div className="prescription-progress">
            <div className="progress-step completed">
              <div className="step-number">1</div>
              <span className="step-label">Appointment</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step active">
              <div className="step-number">2</div>
              <span className="step-label">Prescription</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="step-number">3</div>
              <span className="step-label">Billing</span>
            </div>
          </div>
        </div>
      </div>

      {prescriptionGenerated && (
        <div className="success-popup">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <h3>Prescription Generated Successfully!</h3>
          <p>Prescription has been shared with patient.</p>
        </div>
      )}

      <div className="prescription-info-header">
        <div className="prescription-info-item">
          <PersonIcon className="info-icon" />
          <span className="info-label">Patient</span>
          <span className="info-value">{patientInfo.name}</span>
        </div>
        <div className="prescription-info-divider"></div>
        <div className="prescription-info-item">
          <EventNoteIcon className="info-icon" />
          <span className="info-label">Appointment ID</span>
          <span className="info-value">{patientInfo.appointmentId}</span>
        </div>
        <div className="prescription-info-divider"></div>
        <div className="prescription-info-item">
          <PersonIcon className="info-icon" />
          <span className="info-label">Doctor</span>
          <span className="info-value">{patientInfo.doctor}</span>
        </div>
        <div className="prescription-info-divider"></div>
        <div className="prescription-info-item">
          <EventNoteIcon className="info-icon" />
          <span className="info-label">Date</span>
          <span className="info-value">{patientInfo.consultationDate}</span>
        </div>
        <div className="prescription-info-divider"></div>
        <div className="prescription-info-item">
          <span className={`status-dot ${medicineList.length > 0 ? 'generated' : 'pending'}`}></span>
          <span className="info-label">Status</span>
          <span className={`info-value status-${medicineList.length > 0 ? 'generated' : 'pending'}`}>
            {medicineList.length > 0 ? 'Generated' : 'Pending'}
          </span>
        </div>
      </div>

      <div className="prescription-layout">
        <div className="left-panel">
          <div className="pdf-prescription-content" ref={prescriptionRef}>
          <div className="appointment-card">
            <div className="card-header">
              <div className="doctor-avatar">
                <PersonIcon />
              </div>
              <div className="appointment-info">
                <h3>{patientInfo.name}</h3>
                <span className="appointment-id">{patientInfo.appointmentId}</span>
              </div>
              <span className={`status-badge ${medicineList.length > 0 ? 'generated' : 'pending'}`}>
                {medicineList.length > 0 ? 'Generated' : 'Pending'}
              </span>
            </div>
            <div className="appointment-details">
              <div className="detail-item">
                <MedicalServicesIcon />
                <div>
                  <span className="label">Doctor</span>
                  <span className="value">{patientInfo.doctor}</span>
                </div>
              </div>
              <div className="detail-item">
                <EventNoteIcon />
                <div>
                  <span className="label">Date</span>
                  <span className="value">{patientInfo.consultationDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="consultation-card">
            <h2>Patient Consultation Details</h2>
            <div className="consultation-content">
              <div className="consultation-item">
                <VaccinesIcon />
                <div>
                  <span className="label">Symptoms</span>
                  <span className="value">{patientInfo.symptoms}</span>
                </div>
              </div>
              <div className="consultation-item">
                <MedicalServicesIcon />
                <div>
                  <span className="label">Diagnosis</span>
                  <span className="value">{patientInfo.diagnosis}</span>
                </div>
              </div>
              <div className="consultation-item">
                <EventNoteIcon />
                <div>
                  <span className="label">Allergies</span>
                  <span className="value">{patientInfo.allergies}</span>
                </div>
              </div>
            </div>
            <div className="notes-section">
              <h3>
                <NoteIcon /> Consultation Notes
              </h3>
              <p>{patientInfo.consultationNotes}</p>
            </div>
            <div className="notes-section previous-history">
              <h3>
                <PersonIcon /> Previous Medical History
              </h3>
              <p>{patientInfo.previousHistory}</p>
            </div>
          </div>

          <div className="medicine-list-card">
            <h2>
              <MedicationIcon /> Medicine List
            </h2>
            {medicineList.length === 0 ? (
              <div className="empty-state">
                <ReceiptIcon />
                <p>No medicines added yet.</p>
              </div>
            ) : (
              <div className="medicine-table-wrapper">
                <table className="medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineList.map((med) => (
                      <tr key={med.id}>
                        <td>{med.medicineName}</td>
                        <td>{med.dosage}</td>
                        <td>{med.timing}</td>
                        <td>{med.quantity}</td>
                        <td>{med.instructions || '-'}</td>
                        <td>
                          <button className="btn-remove" onClick={() => handleRemoveMedicine(med.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {signatureData && (
            <div className="signature-display">
              <p className="signature-label">Doctor's Signature</p>
              <img src={signatureData} alt="Doctor's signature" className="signature-image" />
            </div>
          )}
          </div>
        </div>

        <div className="right-panel">
          <div className="prescription-form-card">
            <h2>
              <MedicationIcon /> Add Medicine
            </h2>
            <p className="form-subtitle">Fill in the medicine details below</p>
            <form onSubmit={formik.handleSubmit} className="prescription-form">
              <div className="form-group">
                <label>
                  Medicine Name <span className="required">*</span>
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="medicineName"
                    value={formik.values.medicineName}
                    onChange={(e) => {
                      formik.handleChange(e);
                      setShowSuggestions(true);
                    }}
                    onBlur={() => {
                      formik.handleBlur(e);
                      setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    className={formik.touched.medicineName && formik.errors.medicineName ? 'error' : ''}
                  />
                  {showSuggestions && (
                    <div className="suggestions-list">
                      {medicineSuggestions
                        .filter(med => med.toLowerCase().includes(formik.values.medicineName.toLowerCase()))
                        .map((med, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            onMouseDown={() => {
                              formik.setFieldValue('medicineName', med);
                              setShowSuggestions(false);
                            }}
                          >
                            {med}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {formik.touched.medicineName && formik.errors.medicineName && (
                  <span className="error-text">{formik.errors.medicineName}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Dosage <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    value={formik.values.dosage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., 500mg"
                    className={formik.touched.dosage && formik.errors.dosage ? 'error' : ''}
                  />
                  {formik.touched.dosage && formik.errors.dosage && (
                    <span className="error-text">{formik.errors.dosage}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>
                    Frequency <span className="required">*</span>
                  </label>
                  <select
                    name="frequency"
                    value={formik.values.frequency}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.frequency && formik.errors.frequency ? 'error' : ''}
                  >
                    <option value="">Select</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="As needed">As needed</option>
                  </select>
                  {formik.touched.frequency && formik.errors.frequency && (
                    <span className="error-text">{formik.errors.frequency}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    Duration <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formik.values.duration}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., 5 days"
                    className={formik.touched.duration && formik.errors.duration ? 'error' : ''}
                  />
                  {formik.touched.duration && formik.errors.duration && (
                    <span className="error-text">{formik.errors.duration}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>Food Instructions</label>
                  <select
                    name="foodInstructions"
                    value={formik.values.foodInstructions}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select</option>
                    <option value="Before food">Before food</option>
                    <option value="After food">After food</option>
                    <option value="With food">With food</option>
                    <option value="Empty stomach">Empty stomach</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="additionalNotes"
                  value={formik.values.additionalNotes}
                  onChange={formik.handleChange}
                  placeholder="Any special instructions..."
                  rows={2}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Lab Test Recommendation</label>
                  <input
                    type="text"
                    name="labTestRecommendation"
                    value={formik.values.labTestRecommendation}
                    onChange={formik.handleChange}
                    placeholder="e.g., CBC, X-Ray"
                  />
                </div>

                <div className="form-group">
                  <label>Follow-Up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formik.values.followUpDate}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-add-medicine">
                <MedicationIcon /> Add Medicine
              </button>
            </form>

            <div className="signature-section">
              <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg> Digital Signature</h3>
              <div className="signature-pad">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={120}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!signatureData && (
                  <span className="signature-placeholder">Sign here...</span>
                )}
              </div>
              {signatureData && (
                <button type="button" className="btn-clear-signature" onClick={clearSignature}>
                  Clear Signature
                </button>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleGeneratePrescription} disabled={medicineList.length === 0}>
                <CheckCircleIcon /> Generate Prescription
              </button>
              <button className="btn-draft" onClick={handleSaveDraft}>
                <NoteIcon /> Save Draft
              </button>
              <button className="btn-pharmacy">
                <LocalPharmacyIcon /> Send to Pharmacy
              </button>
              <button className="btn-secondary" onClick={handleDownloadPdf} disabled={pdfLoading || medicineList.length === 0}>
                <PrintIcon /> {pdfLoading ? 'Generating PDF...' : 'Print / Download PDF'}
              </button>
              <button className="btn-danger">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}