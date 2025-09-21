import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import TalentDetails from "./TalentDetails";

const MOCK_CLIENTS = [
  {
    id: "c1",
    name: "Collabera - Collabera Inc",
    jobs: [
      {
        id: "job1",
        title: "Application Development",
        reqId: "OWNAI_234",
        talents: [
          { id: "t1", name: "Monika Goyal Test" },
          { id: "t2", name: "Shaili Khatri" },
          { id: "t3", name: "Rahul Singh" },
        ],
      },
      {
        id: "job2",
        title: "Business Administrator",
        reqId: "CLK_12880",
        talents: [
          { id: "t4", name: "Amit Sharma" },
          { id: "t5", name: "Neha Patel" },
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Yuvia Solutions",
    jobs: [
      {
        id: "job3",
        title: "Frontend Developer",
        reqId: "YV_001",
        talents: [
          { id: "t6", name: "Sonal Verma" },
          { id: "t7", name: "Karan Jain" },
        ],
      },
    ],
  },
];

const CURRENCIES = ["USD - Dollars ($)", "INR - Rupees (₹)", "EUR - Euros (€)"];

const defaultPurchase = {
  clientId: "",
  poType: "",
  poNumber: "",
  receivedOn: null,
  receivedFromName: "",
  receivedFromEmail: "",
  poStartDate: null,
  poEndDate: null,
  budget: "",
  currency: "USD - Dollars ($)",
};

export default function PurchaseOrderForm() {
  const [purchase, setPurchase] = useState(defaultPurchase);
  const [reqSections, setReqSections] = useState([]);
  const [clientJobs, setClientJobs] = useState([]);
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (reqSections.length === 0) addReqSection();
  }, []);

  useEffect(() => {
    const client = MOCK_CLIENTS.find((c) => c.id === purchase.clientId);
    setClientJobs(client ? client.jobs : []);

    
    setReqSections((prev) =>
      prev.map((s) => ({ ...s, jobId: "", jobTitle: "", reqId: "", talents: [] }))
    );
  }, [purchase.clientId]);

 
  useEffect(() => {
    setReqSections((prev) =>
      prev.map((s) => ({
        ...s,
        talents: s.talents
          ? s.talents.map((t) => ({ ...t, currency: t.currency || purchase.currency }))
          : [],
      }))
    );
  }, [purchase.currency]);

  const addReqSection = () => {
    setReqSections((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), jobId: "", jobTitle: "", reqId: "", talents: [] },
    ]);
  };

  const removeReqSection = (index) => {
    setReqSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePurchaseChange = (field, value) => {
    setPurchase((prev) => ({ ...prev, [field]: value }));
  };

const handleJobChange = (sectionIndex, jobId) => {
  const job = clientJobs.find((j) => j.id === jobId);
  setReqSections((prev) => {
    const copy = [...prev];
    copy[sectionIndex] = {
      ...copy[sectionIndex],
      jobId,
      jobTitle: job ? job.title : "",
      reqId: job ? job.reqId : "",
      talents: job
        ? job.talents.map((t) => ({
            ...t,
            selected: false,
            billRate: "",
            contractDuration: "",
            standardTimeBR: "",
            overTimeBR: "",
            currency: prev[sectionIndex]?.currency || purchase.currency, // 👈 important
          }))
        : [],
    };
    return copy;
  });
};



const handleTalentToggle = (sectionIndex, talentId) => {
  setReqSections((prev) =>
    prev.map((section, idx) => {
      if (idx !== sectionIndex) return section;
      return {
        ...section,
        talents: section.talents.map((t) =>
          t.id === talentId
            ? { ...t, selected: !t.selected }
            : (purchase.poType === "Individual PO" ? { ...t, selected: false } : t)
        ),
      };
    })
  );
};


  const handleTalentFieldChange = (sectionIndex, talentId, field, value) => {
    setReqSections((prev) => {
      const copy = [...prev];
      const talent = copy[sectionIndex].talents.find((t) => t.id === talentId);
      if (talent) talent[field] = value;
      return copy;
    });
  };

  const validate = () => {
    const e = {};

    if (!purchase.clientId) e.clientId = "Client Name is required";
    if (!purchase.poType) e.poType = "Purchase Order Type is required";
    if (!purchase.poNumber || purchase.poNumber.trim() === "") e.poNumber = "PO Number is required";
    if (!purchase.receivedOn) e.receivedOn = "Received On date is required";
    if (!purchase.receivedFromName) e.receivedFromName = "Received From Name is required";
    if (!purchase.receivedFromEmail) e.receivedFromEmail = "Received From Email is required";
    else if (!/\S+@\S+\.\S+/.test(purchase.receivedFromEmail)) e.receivedFromEmail = "Enter a valid email";
    if (!purchase.poStartDate) e.poStartDate = "PO Start Date is required";
    if (!purchase.poEndDate) e.poEndDate = "PO End Date is required";
    if (purchase.poStartDate && purchase.poEndDate && purchase.poEndDate < purchase.poStartDate) e.poEndDate = "PO End Date cannot be before PO Start Date";
    if (!purchase.budget) e.budget = "Budget is required";
    else if (!/^\d+$/.test(purchase.budget)) e.budget = "Budget must be numeric";
    else if (purchase.budget.length > 5) e.budget = "Budget maximum 5 digits allowed";
    if (!purchase.currency) e.currency = "Currency is required";


    let totalSelectedTalents = 0;
    reqSections.forEach((s, idx) => {
      if (!s.jobId) {
        e[`req_${idx}`] = "Please select Job/REQ for this section";
      } else {
        if (s.talents && s.talents.length > 0) {
          s.talents.forEach((t) => {
            if (t.selected) {
              totalSelectedTalents++;

              if (!t.billRate || t.billRate.toString().trim() === "") {
                e[`req_${idx}_talent_${t.id}_billRate`] = `Bill Rate required for ${t.name}`;
              }
              if (!t.standardTimeBR || t.standardTimeBR.toString().trim() === "") {
                e[`req_${idx}_talent_${t.id}_standardTimeBR`] = `Standard Time BR required for ${t.name}`;
              }
              if (!t.overTimeBR || t.overTimeBR.toString().trim() === "") {
                e[`req_${idx}_talent_${t.id}_overTimeBR`] = `Over Time BR required for ${t.name}`;
              }
              if (!t.contractDuration || t.contractDuration.toString().trim() === "") {
                e[`req_${idx}_talent_${t.id}_contractDuration`] = `Contract Duration required for ${t.name}`;
              }
            }
          });
        }
      }
    });

    if (purchase.poType === "Individual PO") {
      if (totalSelectedTalents === 0) e.talents = "Select one talent for Individual PO";
      else if (totalSelectedTalents > 1) e.talents = "Only one talent allowed for Individual PO";
    } else if (purchase.poType === "Group PO") {
      if (totalSelectedTalents < 2) e.talents = "Select at least two talents for Group PO";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const ok = validate();
    if (!ok) {
      // scroll to top so user sees error alerts
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      purchase,
      reqSections: reqSections.map((s) => ({
        jobId: s.jobId,
        jobTitle: s.jobTitle,
        reqId: s.reqId,
        talents: (s.talents || [])
          .filter((t) => t.selected)
          .map((t) => ({
            id: t.id,
            name: t.name,
            billRate: t.billRate,
            standardTimeBR: t.standardTimeBR,
            overTimeBR: t.overTimeBR,
            contractDuration: t.contractDuration,
            currency: t.currency,
          })),
      })),
    };

    console.log("Submitted Purchase Order:", payload);
    setSubmittedData(payload);
  };

  const handleReset = () => {
    setPurchase(defaultPurchase);
    setReqSections([]);
    setErrors({});
    setSubmittedData(null);
    setTimeout(addReqSection, 10);
  };

  const getClientName = (id) => MOCK_CLIENTS.find((c) => c.id === id)?.name || "";

  if (submittedData) {
    const p = submittedData.purchase;
    return (
      <div className="container-card p-3">
        <h5>Purchase Order Details (Read-only)</h5>
        <div className="row mb-3">
          <div className="col-md-4">
            <div className="small-muted">Client Name</div>
            <div className="readonly-field">{getClientName(p.clientId)}</div>
          </div>
          <div className="col-md-4">
            <div className="small-muted">PO Type</div>
            <div className="readonly-field">{p.poType}</div>
          </div>
          <div className="col-md-4">
            <div className="small-muted">PO Number</div>
            <div className="readonly-field">{p.poNumber}</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <div className="small-muted">Received On</div>
            <div className="readonly-field">{p.receivedOn ? new Date(p.receivedOn).toLocaleDateString() : ""}</div>
          </div>
          <div className="col-md-3">
            <div className="small-muted">Received From</div>
            <div className="readonly-field">{p.receivedFromName}</div>
          </div>
          <div className="col-md-3">
            <div className="small-muted">Received Email</div>
            <div className="readonly-field">{p.receivedFromEmail}</div>
          </div>
          <div className="col-md-3">
            <div className="small-muted">Budget</div>
            <div className="readonly-field">{p.budget} {p.currency}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="small-muted">PO Period</div>
          <div className="readonly-field">{p.poStartDate ? new Date(p.poStartDate).toLocaleDateString() : ""} — {p.poEndDate ? new Date(p.poEndDate).toLocaleDateString() : ""}</div>
        </div>

        <h5>Talent Details</h5>
        {submittedData.reqSections.map((s, i) => (
          <div key={i} className="req-section mb-3">
            <div><strong>Job:</strong> {s.jobTitle} <span className="small-muted">({s.reqId})</span></div>
            <div className="mt-2">
              {s.talents.length === 0 ? (
                <div className="small-muted">No talents selected</div>
              ) : (
                s.talents.map((t) => (
                  <div key={t.id} className="mb-2">
                    <div className="readonly-field"><strong>{t.name}</strong> — Bill Rate: {t.billRate} — Std: {t.standardTimeBR} — OT: {t.overTimeBR} — Contract: {t.contractDuration} — {t.currency}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setSubmittedData(null)}>Back to Edit</button>
          <button className="btn btn-primary" onClick={() => alert("Form saved - you can show this read-only to reviewer")}>OK</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="container-card p-3">
      <h5>Purchase Order Details</h5>

      {/* Row 1 */}
      <div className="row g-3">
        <div className="col-md-3">
          <label className="form-label">Client Name *</label>
          <select className="form-select" value={purchase.clientId} onChange={(e) => handlePurchaseChange("clientId", e.target.value)}>
            <option value="">Select client</option>
            {MOCK_CLIENTS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.clientId && <div className="text-danger small">{errors.clientId}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Purchase Order Type *</label>
          <select className="form-select" value={purchase.poType} onChange={(e) => handlePurchaseChange("poType", e.target.value)}>
            <option value="">Select PO Type</option>
            <option value="Group PO">Group PO</option>
            <option value="Individual PO">Individual PO</option>
          </select>
          {errors.poType && <div className="text-danger small">{errors.poType}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Purchase Order No. *</label>
          <input className="form-control" value={purchase.poNumber} onChange={(e) => handlePurchaseChange("poNumber", e.target.value)} />
          {errors.poNumber && <div className="text-danger small">{errors.poNumber}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Received On *</label>
          <DatePicker selected={purchase.receivedOn} onChange={(d) => handlePurchaseChange("receivedOn", d)} className="form-control" dateFormat="dd/MM/yyyy" />
          {errors.receivedOn && <div className="text-danger small">{errors.receivedOn}</div>}
        </div>
      </div>

      {/* Row 2 */}
      <div className="row g-3 mt-2">
        <div className="col-md-3">
          <label className="form-label">Received From (Name) *</label>
          <input className="form-control" value={purchase.receivedFromName} onChange={(e) => handlePurchaseChange("receivedFromName", e.target.value)} />
          {errors.receivedFromName && <div className="text-danger small">{errors.receivedFromName}</div>}
        </div>

        <div className="col-md-3">
          <label className="form-label">Received From (Email) *</label>
          <input className="form-control" value={purchase.receivedFromEmail} onChange={(e) => handlePurchaseChange("receivedFromEmail", e.target.value)} />
          {errors.receivedFromEmail && <div className="text-danger small">{errors.receivedFromEmail}</div>}
        </div>

        <div className="col-md-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label">PO Start Date *</label>
              <DatePicker selected={purchase.poStartDate} onChange={(d) => handlePurchaseChange("poStartDate", d)} className="form-control" dateFormat="dd/MM/yyyy" />
              {errors.poStartDate && <div className="text-danger small">{errors.poStartDate}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">PO End Date *</label>
              <DatePicker selected={purchase.poEndDate} onChange={(d) => handlePurchaseChange("poEndDate", d)} className="form-control" dateFormat="dd/MM/yyyy" minDate={purchase.poStartDate || null} />
              {errors.poEndDate && <div className="text-danger small">{errors.poEndDate}</div>}
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="row g-2">
            <div className="col-6">
              <label className="form-label">Budget*</label>
              <input className="form-control" value={purchase.budget} onChange={(e) => handlePurchaseChange("budget", e.target.value.replace(/[^\d]/g, ""))} maxLength={5} />
              {errors.budget && <div className="text-danger small">{errors.budget}</div>}
            </div>
            <div className="col-6">
              <label className="form-label">Currency *</label>
              <select className="form-select" value={purchase.currency} onChange={(e) => handlePurchaseChange("currency", e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.currency && <div className="text-danger small">{errors.currency}</div>}
            </div>
          </div>
        </div>
      </div>

      <TalentDetails
  purchase={purchase}
  reqSections={reqSections}
  clientJobs={clientJobs}
  errors={errors}
  addReqSection={addReqSection}
  removeReqSection={removeReqSection}
  handleJobChange={handleJobChange}
  handleTalentToggle={handleTalentToggle}
  handleTalentFieldChange={handleTalentFieldChange}
/>


      <div className="d-flex justify-content-end mt-3">
        <button type="button" className="btn btn-secondary me-2" onClick={handleReset}>Reset</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  );
}
