import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
  const [patientData, setPatientData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = api.getToken();
      if (!token) {
        // Not authenticated, redirect to login
        navigate('/login');
        return;
      }

      try {
        const data = await api.get('/patient/data');
        setPatientData(data || []);
      } catch (err) {
        console.error('Failed to fetch patient data', err);
      }

      try {
        const rec = await api.get('/patient/recommendations');
        setRecommendations(rec.recommendations || []);
      } catch (err) {
        console.error('Failed to fetch recommendations', err);
      }
    };
    fetchData();
  }, [navigate]);

  // Form state for adding patient data
  const [form, setForm] = useState({ glucoseLevel: '', weight: '', height: '', systolic: '', diastolic: '', diet: '', exercise: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const onFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    try {
      const payload = {
        glucoseLevel: Number(form.glucoseLevel) || 0,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        bloodPressure: form.systolic || form.diastolic ? { systolic: Number(form.systolic) || undefined, diastolic: Number(form.diastolic) || undefined } : undefined,
        diet: form.diet || undefined,
        exercise: form.exercise || undefined
      };
      await api.post('/patient/data', payload);
      setFormSuccess('Data added successfully');
      // Refresh lists
      const data = await api.get('/patient/data');
      setPatientData(data || []);
      const rec = await api.get('/patient/recommendations');
      setRecommendations(rec.recommendations || []);
      // clear form
      setForm({ glucoseLevel: '', weight: '', height: '', systolic: '', diastolic: '', diet: '', exercise: '' });
    } catch (err) {
      console.error('Failed to add patient data', err);
      setFormError(err.msg || err.error || 'Failed to add data');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card p-3">
            <h5>Add Patient Data</h5>
            {formError && <div className="alert alert-danger">{formError}</div>}
            {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
            <form onSubmit={onFormSubmit} className="row">
              <div className="col-12 col-sm-6 col-md-3 mb-2">
                <input className="form-control" name="glucoseLevel" placeholder="Glucose" value={form.glucoseLevel} onChange={onFormChange} required />
              </div>
              <div className="col-6 col-sm-3 col-md-2 mb-2">
                <input className="form-control" name="weight" placeholder="Weight (kg)" value={form.weight} onChange={onFormChange} />
              </div>
              <div className="col-6 col-sm-3 col-md-2 mb-2">
                <input className="form-control" name="height" placeholder="Height (cm)" value={form.height} onChange={onFormChange} />
              </div>
              <div className="col-6 col-sm-3 col-md-1 mb-2">
                <input className="form-control" name="systolic" placeholder="SYS" value={form.systolic} onChange={onFormChange} />
              </div>
              <div className="col-6 col-sm-3 col-md-1 mb-2">
                <input className="form-control" name="diastolic" placeholder="DIA" value={form.diastolic} onChange={onFormChange} />
              </div>
              <div className="col-12 col-sm-6 col-md-2 mb-2">
                <input className="form-control" name="diet" placeholder="Diet" value={form.diet} onChange={onFormChange} />
              </div>
              <div className="col-12 col-sm-6 col-md-1 mb-2">
                <button className="btn btn-primary w-100" type="submit">Add</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Your Data</h4>
          {patientData.length === 0 ? (
            <p>No data yet. Add your first measurement from the app.</p>
          ) : (
            <div className="list-group">
              {patientData.map((d) => (
                <div key={d._id} className="list-group-item">
                  <div><strong>Date:</strong> {new Date(d.date).toLocaleString()}</div>
                  <div><strong>Glucose:</strong> {d.glucoseLevel}</div>
                  {d.weight && <div><strong>Weight:</strong> {d.weight} kg</div>}
                  {d.height && <div><strong>Height:</strong> {d.height} cm</div>}
                  {d.bloodPressure && <div><strong>BP:</strong> {d.bloodPressure.systolic}/{d.bloodPressure.diastolic}</div>}
                  {d.diet && <div><strong>Diet:</strong> {d.diet}</div>}
                  {d.exercise && <div><strong>Exercise:</strong> {d.exercise}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-md-6">
          <h4>Recommendations</h4>
          <ul>
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;