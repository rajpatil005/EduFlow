import { useState } from "react";

import Card from "../../components/Card/Card";
import Select from "../../components/Select/Select";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

import {
  academicYears,
  classes,
  examinations,
  subjects,
  calculationPatterns,
  defaultComponents,
  students,
} from "../../data/dummyData";

import "./MarksEntry.css";

function MarksEntry() {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedPattern, setSelectedPattern] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const [components, setComponents] = useState(defaultComponents);
  const [studentMarks, setStudentMarks] = useState(students);

  function handleComponentChange(id, field, value) {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          [field]: value,
        };
      }

      return component;
    });

    setComponents(updatedComponents);
  }

  function handleIncludeChange(id) {
    const updatedComponents = components.map((component) => {
      if (component.id === id) {
        return {
          ...component,
          included: !component.included,
        };
      }

      return component;
    });

    setComponents(updatedComponents);
  }

  function handleDeleteComponent(id) {
    const updatedComponents = components.filter(
      (component) => component.id !== id,
    );

    setComponents(updatedComponents);
  }

  function handleAddComponent() {
    const newComponent = {
      id: Date.now(),
      name: "New Component",
      key: `component_${Date.now()}`,
      maxMarks: 100,
      weightage: 0,
      included: true,
    };

    setComponents([...components, newComponent]);

    const updatedStudents = studentMarks.map((student) => ({
      ...student,
      [newComponent.key]: 0,
    }));

    setStudentMarks(updatedStudents);
  }

  function handleMarksChange(studentId, componentKey, value) {
    const updatedStudents = studentMarks.map((student) => {
      if (student.id === studentId) {
        return {
          ...student,
          [componentKey]: value,
        };
      }

      return student;
    });

    setStudentMarks(updatedStudents);
  }

  function calculateStudentResult(student) {
    let total = 0;

    includedComponents.forEach((component) => {
      const marks = Number(student[component.key] || 0);
      const max = Number(component.maxMarks || 0);
      const weightage = Number(component.weightage || 0);

      if (max > 0) {
        const weightedMarks = (marks / max) * weightage;

        total += weightedMarks;
      }
    });

    return Number(total.toFixed(2));
  }

  const includedComponents = components.filter(
    (component) => component.included,
  );

  const totalWeightage = components
    .filter((component) => component.included)
    .reduce((total, component) => total + Number(component.weightage || 0), 0);

  return (
    <div className="marks-entry">
      {/* Page Header */}

      <div className="page-header">
        <div>
          <h1>Marks Entry</h1>

          <p>Configure examination components and enter student marks.</p>
        </div>
      </div>

      {/* Examination Configuration */}

      <Card>
        <div className="section-heading">
          <div>
            <h2>Examination Configuration</h2>
            <p>Select the academic and examination details.</p>
          </div>
        </div>

        <div className="configuration-grid">
          <div>
            <label>Academic Year</label>

            <Select
              options={academicYears}
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            />
          </div>

          <div>
            <label>Class / Semester</label>

            <Select
              options={classes}
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
            />
          </div>

          <div>
            <label>Examination</label>

            <Select
              options={examinations}
              value={selectedExam}
              onChange={(event) => setSelectedExam(event.target.value)}
            />
          </div>

          <div>
            <label>Subject</label>

            <Select
              options={subjects}
              value={selectedSubject}
              onChange={(event) => setSelectedSubject(event.target.value)}
            />
          </div>

          <div>
            <label>Maximum Marks</label>

            <Input
              type="number"
              placeholder="Enter maximum marks"
              value={maxMarks}
              onChange={(event) => setMaxMarks(event.target.value)}
            />
          </div>

          <div>
            <label>Calculation Pattern</label>

            <Select
              options={calculationPatterns}
              value={selectedPattern}
              onChange={(event) => setSelectedPattern(event.target.value)}
            />
          </div>
        </div>

        <Button>Load Marks</Button>
      </Card>

      {/* Calculation Components */}

      <Card>
        <div className="components-topbar">
          <div>
            <h2>Calculation Components</h2>

            <p>Define the components used to calculate the final result.</p>
          </div>

          <Button onClick={handleAddComponent}>+ Add Component</Button>
        </div>

        <div className="weightage-status">
          <span>Included weightage</span>

          <strong>{totalWeightage}%</strong>

          <span
            className={
              totalWeightage === 100 ? "weightage-valid" : "weightage-warning"
            }
          >
            {totalWeightage === 100 ? "Ready" : "Should total 100%"}
          </span>
        </div>

        <div className="component-list">
          {components.map((component) => (
            <div className="component-item" key={component.id}>
              <div className="component-main">
                <div className="component-toggle">
                  <input
                    type="checkbox"
                    checked={component.included}
                    onChange={() => handleIncludeChange(component.id)}
                  />
                </div>

                <div className="component-details">
                  <span className="component-label">Component Name</span>

                  <input
                    className="component-input component-name-input"
                    type="text"
                    value={component.name}
                    onChange={(event) =>
                      handleComponentChange(
                        component.id,
                        "name",
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="component-field">
                <span>Max Marks</span>

                <input
                  className="component-input"
                  type="number"
                  min="1"
                  value={component.maxMarks}
                  onChange={(event) =>
                    handleComponentChange(
                      component.id,
                      "maxMarks",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className="component-field">
                <span>Weightage</span>

                <div className="weightage-input">
                  <input
                    className="component-input"
                    type="number"
                    min="0"
                    max="100"
                    value={component.weightage}
                    onChange={(event) =>
                      handleComponentChange(
                        component.id,
                        "weightage",
                        event.target.value,
                      )
                    }
                  />

                  <span>%</span>
                </div>
              </div>

              <button
                className="delete-component"
                onClick={() => handleDeleteComponent(component.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Student Marks */}

      <section className="marks-section">
        <div className="marks-section-header">
          <div>
            <span className="section-eyebrow">MARKS MANAGEMENT</span>

            <h2>{selectedSubject || "Student Marks"}</h2>

            <p>Enter marks directly in the table below.</p>
          </div>

          <div className="marks-summary">
            <div>
              <span>Students</span>
              <strong>{studentMarks.length}</strong>
            </div>

            <div>
              <span>Components</span>
              <strong>{includedComponents.length}</strong>
            </div>
          </div>
        </div>

        <div className="marks-table-wrapper">
          <table className="marks-table">
            <thead>
              <tr>
                <th className="roll-column">Roll No.</th>

                <th className="student-column">Student</th>

                {includedComponents.map((component) => (
                  <th key={component.id}>
                    <div className="table-component-name">{component.name}</div>

                    <div className="table-component-max">
                      Out of {component.maxMarks}
                    </div>
                  </th>
                ))}
                <th className="result-column">Result</th>
              </tr>
            </thead>

            <tbody>
              {studentMarks.map((student) => (
                <tr key={student.id}>
                  <td className="roll-number">{student.rollNo}</td>

                  <td className="student-name">{student.name}</td>

                  {includedComponents.map((component) => (
                    <td key={component.id}>
                      <input
                        className="marks-input"
                        type="number"
                        min="0"
                        max={component.maxMarks}
                        value={student[component.key] ?? 0}
                        onChange={(event) =>
                          handleMarksChange(
                            student.id,
                            component.key,
                            event.target.value,
                          )
                        }
                      />
                    </td>
                  ))}
                  <td className="result-cell">
                    {calculateStudentResult(student)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default MarksEntry;
