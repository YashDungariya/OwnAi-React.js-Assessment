// TalentDetails.jsx
import React from "react";

// List of supported currencies for talent billing
const CURRENCIES = ["USD - Dollars ($)", "INR - Rupees (₹)", "EUR - Euros (€)"];

export default function TalentDetails({
  purchase, // Current purchase order data (poType, currency, etc.)
  reqSections, // Array of sections, each representing a job / req with selected talents
  clientJobs, // List of jobs for the selected client
  errors, // Validation errors object
  addReqSection, // Function to add a new REQ section (only for Group PO)
  removeReqSection, // Function to remove a REQ section
  handleJobChange, // Function to handle selection of a job in a section
  handleTalentToggle, // Function to toggle talent selection (checkbox)
  handleTalentFieldChange, // Function to update talent fields (bill rate, duration, etc.)
}) {
  return (
    <div className="mt-4">
      {/* Header with Add Another button for Group PO */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Talent Detail</h5>
        {purchase.poType === "Group PO" && (
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={addReqSection} // Adds new REQ section
          >
            + Add Another
          </button>
        )}
      </div>

      {/* Info message if no jobs loaded for the client */}
      {clientJobs.length === 0 && (
        <div className="small-muted mb-2">
          Select a Client to load Jobs / REQs.
        </div>
      )}

      {/* Loop through each REQ section */}
      {reqSections.map((section, sIdx) => (
        <div key={section.id} className="req-section mb-3 p-2 border rounded">
          <div className="row g-2 align-items-end">
            {/* Job Title / REQ Name selection */}
            <div className="col-md-3">
              <label className="form-label">Job Title / REQ Name *</label>
              <select
                className="form-select"
                value={section.jobId}
                onChange={(e) => handleJobChange(sIdx, e.target.value)} // Update selected job for this section
                disabled={clientJobs.length === 0} // Disable if no client jobs loaded
              >
                <option value="">Select Job</option>
                {clientJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
              {/* Validation error for this section */}
              {errors[`req_${sIdx}`] && (
                <div className="text-danger small">{errors[`req_${sIdx}`]}</div>
              )}
            </div>

            {/* REQ ID / Assignment ID (read-only) */}
            <div className="col-md-3">
              <label className="form-label">REQ ID / Assignment ID</label>
              <input
                className="form-control"
                value={section.reqId || ""}
                readOnly
              />
            </div>

            {/* Remove button if multiple sections */}
            <div className="col-md-6 text-end">
              {reqSections.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeReqSection(sIdx)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Talents List */}
          <div className="mt-3">
            {section.talents && section.talents.length > 0 ? (
              section.talents.map((t) => (
                <div
                  key={t.id}
                  className="talent-row row align-items-center g-2 mb-2"
                >
                  {/* Talent selection checkbox */}
                  <div className="col-md-12 d-flex align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={!!t.selected}
                        id={`${section.id}_${t.id}`}
                        onChange={() => handleTalentToggle(sIdx, t.id)}
                      />
                      <label
                        className="form-check-label ms-2"
                        htmlFor={`${section.id}_${t.id}`}
                      >
                        {t.name}
                      </label>
                    </div>
                  </div>

                  {/* Contract Duration input */}
                  <div className="col-md-3">
                    <label className="form-label">Contract Duration</label>
                    <input
                      className="form-control"
                      placeholder="Contract Duration (months)"
                      value={t.contractDuration || ""}
                      disabled={!t.selected} // Disabled if talent not selected
                      onChange={(e) =>
                        handleTalentFieldChange(
                          sIdx,
                          t.id,
                          "contractDuration",
                          e.target.value
                        )
                      }
                    />
                    {/* Validation error */}
                    {errors[`req_${sIdx}_talent_${t.id}_contractDuration`] && (
                      <div className="text-danger small">
                        {errors[`req_${sIdx}_talent_${t.id}_contractDuration`]}
                      </div>
                    )}
                  </div>

                  {/* Bill Rate and Currency */}
                  <div className="col-md-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label">Bill Rate</label>
                        <input
                          className="form-control"
                          placeholder="Bill Rate (/hr)"
                          value={t.billRate || ""}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "billRate",
                              e.target.value
                            )
                          }
                        />
                        {errors[`req_${sIdx}_talent_${t.id}_billRate`] && (
                          <div className="text-danger small">
                            {errors[`req_${sIdx}_talent_${t.id}_billRate`]}
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-select"
                          value={t.currency || purchase.currency}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "currency",
                              e.target.value
                            )
                          }
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Standard Time Bill Rate and Currency */}
                  <div className="col-md-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label">Standard Time BR</label>
                        <input
                          className="form-control"
                          placeholder="Standard Time BR"
                          value={t.standardTimeBR || ""}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "standardTimeBR",
                              e.target.value
                            )
                          }
                        />
                        {errors[
                          `req_${sIdx}_talent_${t.id}_standardTimeBR`
                        ] && (
                          <div className="text-danger small">
                            {
                              errors[
                                `req_${sIdx}_talent_${t.id}_standardTimeBR`
                              ]
                            }
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-select"
                          value={t.currency || purchase.currency}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "currency",
                              e.target.value
                            )
                          }
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Over Time Bill Rate and Currency */}
                  <div className="col-md-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <label className="form-label">Over Time BR</label>
                        <input
                          className="form-control"
                          placeholder="Over Time BR"
                          value={t.overTimeBR || ""}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "overTimeBR",
                              e.target.value
                            )
                          }
                        />
                        {errors[`req_${sIdx}_talent_${t.id}_overTimeBR`] && (
                          <div className="text-danger small">
                            {errors[`req_${sIdx}_talent_${t.id}_overTimeBR`]}
                          </div>
                        )}
                      </div>

                      <div className="col-6">
                        <label className="form-label">Currency</label>
                        <select
                          className="form-select"
                          value={t.currency || purchase.currency}
                          disabled={!t.selected}
                          onChange={(e) =>
                            handleTalentFieldChange(
                              sIdx,
                              t.id,
                              "currency",
                              e.target.value
                            )
                          }
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Message if no talents loaded for selected job
              <div className="small-muted mt-2">
                Select a job to view talents.
              </div>
            )}
          </div>
        </div>
      ))}

      {/* General error for talents if any */}
      {errors.talents && (
        <div className="text-danger small mt-2">{errors.talents}</div>
      )}
    </div>
  );
}
