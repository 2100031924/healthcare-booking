import React, { useState, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import './BillingPaymentPage.scss';

export default function BillingPaymentPage() {
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [showReceipt, setShowReceipt] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
  });
  const [cardErrors, setCardErrors] = useState({});
  const invoiceRef = useRef(null);

  const [billingData, setBillingData] = useState({
    consultationCharges: 500,
    medicineCharges: 350,
    labTestCharges: 200,
    additionalCharges: 50,
    discountAmount: 100,
    taxRate: 0.05,
  });

  const subtotal = billingData.consultationCharges + billingData.medicineCharges + billingData.labTestCharges + billingData.additionalCharges;
  const discount = billingData.discountAmount;
  const tax = Math.round((subtotal - discount) * billingData.taxRate);
  const finalAmount = subtotal - discount + tax;

  const storedBooking = JSON.parse(localStorage.getItem('lastBooking') || 'null');
  const invoiceDetails = {
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    appointmentId: storedBooking ? `APT-${storedBooking.id}` : 'APT-2026-001',
    doctorName: storedBooking?.doctorName || 'Dr. Priya Patel',
    doctorSpecialty: storedBooking?.department || 'General Physician',
    billingDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    patientName: storedBooking?.patientName || 'Rahul Sharma',
    patientPhone: storedBooking?.contactNumber || '+91 9876543210',
    patientEmail: storedBooking?.email || 'rahul.sharma@email.com',
    transactionId: 'TXN-2026-XYZ123',
    paymentMode: 'Cash',
  };

  const validateCardForm = () => {
    const errs = {};
    if (formik.values.paymentMethod === 'card') {
      if (!cardForm.cardNumber.replace(/\s/g, '')) errs.cardNumber = 'Card number is required';
      else if (!/^\d{16}$/.test(cardForm.cardNumber.replace(/\s/g, ''))) errs.cardNumber = 'Enter a valid 16-digit card number';
      if (!cardForm.cardExpiry) errs.cardExpiry = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(cardForm.cardExpiry)) errs.cardExpiry = 'Use MM/YY format';
      if (!cardForm.cardCvv) errs.cardCvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(cardForm.cardCvv)) errs.cardCvv = 'Enter a valid CVV';
      if (!cardForm.cardName.trim()) errs.cardName = 'Name on card is required';
    }
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCardInput = (field, value) => {
    let formatted = value;
    if (field === 'cardNumber') {
      formatted = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (field === 'cardExpiry') {
      formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
    } else if (field === 'cardCvv') {
      formatted = value.replace(/\D/g, '').substring(0, 4);
    }
    setCardForm(prev => ({ ...prev, [field]: formatted }));
    if (cardErrors[field]) setCardErrors(prev => ({ ...prev, [field]: '' }));
  };

  const formik = useFormik({
    initialValues: {
      paymentMethod: '',
      amountPaid: finalAmount.toString(),
      discountCoupon: '',
      insuranceProvider: '',
      remarks: '',
    },
    validationSchema: Yup.object({
      paymentMethod: Yup.string().required('Payment Method is required'),
      amountPaid: Yup.number().required('Amount is required').min(1, 'Invalid amount'),
    }),
    onSubmit: (values) => {
      setPaymentError('');
      if (values.paymentMethod === 'card' && !validateCardForm()) return;
      setProcessingPayment(true);
      setTimeout(() => {
        setProcessingPayment(false);
        if (values.paymentMethod === 'card' && cardForm.cardNumber.replace(/\s/g, '') === '0000000000000000') {
          setPaymentError('Payment declined. Please try a different card.');
          return;
        }
        setPaymentStatus('paid');
        setShowReceipt(true);
        setTimeout(() => setShowReceipt(false), 3000);
      }, 2500);
    },
  });

  const handleGenerateInvoice = () => {
    setInvoiceGenerated(true);
    setTimeout(() => setInvoiceGenerated(false), 3000);
  };

  const handleCancelPayment = () => {
    setPaymentCancelled(true);
    setPaymentStatus('pending');
    setProcessingPayment(false);
    setPaymentError('');
    setCardForm({ cardNumber: '', cardExpiry: '', cardCvv: '', cardName: '' });
    setCardErrors({});
    formik.resetForm();
    setTimeout(() => setPaymentCancelled(false), 3000);
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: '💵' },
    { id: 'card', label: 'Card', icon: <CreditCardIcon /> },
    { id: 'upi', label: 'UPI', icon: '📱' },
    { id: 'netbanking', label: 'Net Banking', icon: <AccountBalanceIcon /> },
    { id: 'insurance', label: 'Insurance', icon: <SecurityIcon /> },
  ];

  const handlePrint = () => {
    const printContent = invoiceRef.current;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoiceDetails.invoiceNumber}</title>
          <link rel="stylesheet" href="/print.css">
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    handlePrint();
  };

  const getPaymentMethodLabel = (id) => {
    const method = paymentMethods.find(m => m.id === id);
    return method ? method.label : 'Not selected';
  };

  return (
    <div className="billing-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <div className="page-icon">
              <LocalHospitalIcon />
            </div>
            <div className="page-title">
              <h1>Billing & Payment</h1>
              <p>Manage invoices and process payments</p>
            </div>
          </div>
          <div className="billing-progress">
            <div className="progress-step completed">
              <div className="step-number">1</div>
              <span className="step-label">Appointment</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step completed">
              <div className="step-number">2</div>
              <span className="step-label">Prescription</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step active">
              <div className="step-number">3</div>
              <span className="step-label">Billing</span>
            </div>
          </div>
        </div>
      </div>

      {showReceipt && (
        <div className="success-popup">
          <div className="success-icon">
            <CheckCircleIcon />
          </div>
          <h3>Payment Successful!</h3>
          <p>Receipt has been generated and shared.</p>
        </div>
      )}

      {invoiceGenerated && (
        <div className="success-popup invoice-popup">
          <div className="success-icon">
            <ReceiptIcon />
          </div>
          <h3>Invoice Generated!</h3>
          <p>Invoice #{invoiceDetails.invoiceNumber} has been created.</p>
        </div>
      )}

      {paymentCancelled && (
        <div className="success-popup cancel-popup">
          <div className="success-icon cancel-icon">
            <CancelIcon />
          </div>
          <h3>Payment Cancelled</h3>
          <p>Payment has been cancelled successfully.</p>
        </div>
      )}

      <div className="billing-layout">
        <div className="billing-main">
          <div className="patient-info-card">
            <div className="patient-header">
              <div className="patient-avatar">
                <PersonIcon />
              </div>
              <div className="patient-details">
                <h3>{invoiceDetails.patientName}</h3>
                <span className="patient-id">{invoiceDetails.invoiceNumber}</span>
              </div>
              <span className={`status-badge ${paymentStatus}`}>
                {paymentStatus === 'paid' ? 'Paid' : paymentStatus === 'failed' ? 'Failed' : paymentStatus === 'refunded' ? 'Refunded' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="billing-details-section">
            <div className="billing-summary">
              <div className="section-header">
                <ReceiptIcon />
                <h2>Billing Summary</h2>
              </div>
              
              <div className="billing-table">
                <div className="billing-row">
                  <span className="billing-label">Consultation Charges</span>
                  <span className="billing-value">₹{billingData.consultationCharges}</span>
                </div>
                <div className="billing-row">
                  <span className="billing-label">Medicine Charges</span>
                  <span className="billing-value">₹{billingData.medicineCharges}</span>
                </div>
                <div className="billing-row">
                  <span className="billing-label">Lab Test Charges</span>
                  <span className="billing-value">₹{billingData.labTestCharges}</span>
                </div>
                <div className="billing-row">
                  <span className="billing-label">Additional Charges</span>
                  <span className="billing-value">₹{billingData.additionalCharges}</span>
                </div>
                <div className="billing-row subtotal">
                  <span className="billing-label">Subtotal</span>
                  <span className="billing-value">₹{subtotal}</span>
                </div>
                <div className="billing-row discount">
                  <span className="billing-label">Discount Applied</span>
                  <span className="billing-value">-₹{discount}</span>
                </div>
                <div className="billing-row">
                  <span className="billing-label">Tax (GST 5%)</span>
                  <span className="billing-value">₹{tax}</span>
                </div>
                <div className="billing-row total-row">
                  <span className="billing-label">Total Payable</span>
                  <span className="billing-value total-amount">₹{finalAmount}</span>
                </div>
              </div>
            </div>

            <div className="invoice-details">
              <div className="section-header">
                <ReceiptIcon />
                <h2>Invoice Details</h2>
              </div>
              
              <div className="details-grid">
                <div className="detail-card">
                  <span className="detail-label">Invoice Number</span>
                  <span className="detail-value">{invoiceDetails.invoiceNumber}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Appointment ID</span>
                  <span className="detail-value">{invoiceDetails.appointmentId}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Doctor Name</span>
                  <span className="detail-value">{invoiceDetails.doctorName}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Billing Date</span>
                  <span className="detail-value">{invoiceDetails.billingDate}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">{getPaymentMethodLabel(formik.values.paymentMethod)}</span>
                </div>
                <div className="detail-card">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{paymentStatus === 'paid' ? invoiceDetails.transactionId : 'Pending'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="billing-sidebar">
          <div className="payment-form-card">
            <div className="card-header">
              <PaymentIcon />
              <h2>Make Payment</h2>
            </div>
            <p className="form-subtitle">Select your payment method</p>
            
            <form onSubmit={formik.handleSubmit} className="payment-form">
              <div className="form-group">
                <label>Payment Method</label>
                <div className="payment-methods">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      className={`method-option ${formik.values.paymentMethod === method.id ? 'selected' : ''}`}
                      onClick={() => formik.setFieldValue('paymentMethod', method.id)}
                    >
                      <span className="method-icon">
                        {typeof method.icon === 'string' ? method.icon : method.icon}
                      </span>
                      <span className="method-label">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="amount-display">
                  <AttachMoneyIcon />
                  <span className="amount-value">₹{finalAmount}</span>
                </div>
              </div>

              <div className="form-group">
                <label>Discount Coupon (Optional)</label>
                <input
                  type="text"
                  name="discountCoupon"
                  value={formik.values.discountCoupon}
                  onChange={formik.handleChange}
                  placeholder="Enter coupon code"
                />
              </div>

              {formik.values.paymentMethod === 'insurance' && (
                <div className="form-group">
                  <label>Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    value={formik.values.insuranceProvider}
                    onChange={formik.handleChange}
                    placeholder="Enter provider name"
                  />
                </div>
              )}

              {formik.values.paymentMethod === 'card' && (
                <div className="card-form-section">
                  <h3><CreditCardIcon /> Card Details</h3>
                  <div className="card-preview">
                    <div className="card-chip"></div>
                    <div className="card-number-display">{cardForm.cardNumber || '•••• •••• •••• ••••'}</div>
                    <div className="card-footer-row">
                      <div className="card-holder-display">
                        <span className="card-label">Card Holder</span>
                        <span className="card-value">{cardForm.cardName || 'Your Name'}</span>
                      </div>
                      <div className="card-expiry-display">
                        <span className="card-label">Expires</span>
                        <span className="card-value">{cardForm.cardExpiry || 'MM/YY'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-form-grid">
                    <div className="form-group full-width">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={cardForm.cardNumber}
                        onChange={(e) => handleCardInput('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={cardErrors.cardNumber ? 'error' : ''}
                      />
                      {cardErrors.cardNumber && <span className="error-text">{cardErrors.cardNumber}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          value={cardForm.cardExpiry}
                          onChange={(e) => handleCardInput('cardExpiry', e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={cardErrors.cardExpiry ? 'error' : ''}
                        />
                        {cardErrors.cardExpiry && <span className="error-text">{cardErrors.cardExpiry}</span>}
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <div className="cvv-input-wrap">
                          <input
                            type="password"
                            value={cardForm.cardCvv}
                            onChange={(e) => handleCardInput('cardCvv', e.target.value)}
                            placeholder="•••"
                            maxLength={4}
                            className={cardErrors.cardCvv ? 'error' : ''}
                          />
                          <SecurityIcon className="cvv-icon" />
                        </div>
                        {cardErrors.cardCvv && <span className="error-text">{cardErrors.cardCvv}</span>}
                      </div>
                    </div>
                    <div className="form-group full-width">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        value={cardForm.cardName}
                        onChange={(e) => handleCardInput('cardName', e.target.value)}
                        placeholder="John Doe"
                        className={cardErrors.cardName ? 'error' : ''}
                      />
                      {cardErrors.cardName && <span className="error-text">{cardErrors.cardName}</span>}
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  rows={2}
                  placeholder="Any additional notes..."
                />
              </div>

              {paymentError && (
                <div className="payment-error">
                  <CancelIcon className="error-icon" />
                  <span>{paymentError}</span>
                </div>
              )}

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={processingPayment}>
                  {processingPayment ? (
                    <><span className="processing-spinner"></span> Processing...</>
                  ) : (
                    <><CheckCircleIcon /> Confirm Payment</>
                  )}
                </button>
                <button type="button" className="btn-generate" onClick={handleGenerateInvoice}>
                  <ReceiptIcon /> Generate Invoice
                </button>
                <div className="secondary-actions">
                  <button type="button" className="btn-secondary" onClick={handleDownload}>
                    <DownloadIcon /> Download
                  </button>
                  <button type="button" className="btn-secondary" onClick={handlePrint}>
                    <PrintIcon /> Print
                  </button>
                </div>
                <button type="button" className="btn-cancel-payment" onClick={handleCancelPayment}>
                  Cancel Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Invoice Template for Print/Download */}
      <div ref={invoiceRef} className="invoice-template">
        <div className="invoice-container">
          <div className="invoice-header">
            <div className="company-info">
              <h1>CareConnect</h1>
              <p>Telemedicine Portal</p>
              <p className="company-address">
                123 Healthcare Street, Medical City<br />
                Phone: +91 9876543210 | Email: info@careconnect.com
              </p>
            </div>
            <div className="invoice-info">
              <h2>INVOICE</h2>
              <p><strong>#{invoiceDetails.invoiceNumber}</strong></p>
              <p>Date: {invoiceDetails.billingDate}</p>
              {paymentStatus === 'paid' && <p className="paid-status">PAID</p>}
            </div>
          </div>

          <div className="invoice-meta">
            <div className="meta-section">
              <h3>Patient Information</h3>
              <p><strong>{invoiceDetails.patientName}</strong></p>
              <p>Phone: {invoiceDetails.patientPhone}</p>
              <p>Email: {invoiceDetails.patientEmail}</p>
            </div>
            <div className="meta-section">
              <h3>Appointment Details</h3>
              <p><strong>{invoiceDetails.appointmentId}</strong></p>
              <p>Doctor: {invoiceDetails.doctorName}</p>
              <p>Specialty: {invoiceDetails.doctorSpecialty}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Consultation Charges</td>
                <td className="text-right">₹{billingData.consultationCharges}</td>
              </tr>
              <tr>
                <td>Medicine Charges</td>
                <td className="text-right">₹{billingData.medicineCharges}</td>
              </tr>
              <tr>
                <td>Lab Test Charges</td>
                <td className="text-right">₹{billingData.labTestCharges}</td>
              </tr>
              <tr>
                <td>Additional Charges</td>
                <td className="text-right">₹{billingData.additionalCharges}</td>
              </tr>
            </tbody>
          </table>

          <div className="totals">
            <table className="totals-table">
              <tr>
                <td>Subtotal</td>
                <td className="text-right">₹{subtotal}</td>
              </tr>
              <tr className="discount">
                <td>Discount Applied</td>
                <td className="text-right">-₹{discount}</td>
              </tr>
              <tr>
                <td>Tax (GST 5%)</td>
                <td className="text-right">₹{tax}</td>
              </tr>
              <tr className="total">
                <td><strong>Total Amount</strong></td>
                <td className="text-right"><strong>₹{finalAmount}</strong></td>
              </tr>
            </table>
          </div>

          {paymentStatus === 'paid' && (
            <div className="payment-info">
              <h3>Payment Details</h3>
              <p><strong>Transaction ID:</strong> {invoiceDetails.transactionId}</p>
              <p><strong>Payment Mode:</strong> {getPaymentMethodLabel(formik.values.paymentMethod)}</p>
              <p><strong>Paid On:</strong> {invoiceDetails.billingDate}</p>
            </div>
          )}

          <div className="footer">
            <p>Thank you for choosing CareConnect Telemedicine Portal</p>
            <p className="footer-note">For any queries, please contact us at support@careconnect.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}